'use client';

import { useEffect, useState } from 'react';
import {
  useFileUpload,
  type FileMetadata,
  type FileWithPreview,
} from 'hooks/use-file-upload';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CloudUpload,
  Download,
  FileArchiveIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  Trash2,
  TriangleAlert,
  VideoIcon,
  DownloadIcon,
  EllipsisIcon,
  SearchIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { FileUploaderDialog } from '@/components/file-manager/files/fileuploader-dialog';
import { BoltIcon, CopyPlusIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/file-manager/files/EmptyState';
import CircularText from '@/components/ui/CircularTextLoader';
import DynamicIslandDemo from '@/components/ui/DynamicIslandDemo';
import { List } from '@/components/animate-ui/icons/list';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { CloudUploadIcon } from '@/components/animate-ui/icons/cloud-upload';
import { LayoutDashboard } from '@/components/animate-ui/icons/layout-dashboard';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FileUploadItem extends FileWithPreview {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface TableUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  simulateUpload?: boolean;
  showToolBar?: boolean;
  isShowPagination?: boolean;
  pageSize?: number;
}

interface ServerFile {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  ext: string;
  url: string;
  formattedSize: string;
  createdAt: string;
}

export default function TableUpload({
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  accept = '*',
  multiple = true,
  className,
  onFilesChange,
  simulateUpload = true,
  showToolBar = true,
  isShowPagination = true,
  pageSize = 20,
}: TableUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch files from API
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['files', searchKeyword, currentPage, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        pageSize: pageSize.toString(),
        pageNumber: currentPage.toString(),
        ...(searchKeyword && { keyword: searchKeyword }),
      });

      const response = await fetch(`/api/files/all?${params}`);
      if (!response.ok) throw new Error('Failed to fetch files');
      return response.json();
    },
  });

  const [{ isDragging, errors }, { removeFile }] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,

    onFilesChange: (newFiles) => {
      // Convert to upload items when files change, preserving existing status
      const newUploadFiles = newFiles.map((file) => {
        // Check if this file already exists in uploadFiles
        const existingFile = uploadFiles.find(
          (existing) => existing.id === file.id
        );

        if (existingFile) {
          // Preserve existing file status and progress
          return {
            ...existingFile,
            ...file, // Update any changed properties from the file
          };
        } else {
          // New file - set to uploading
          return {
            ...file,
            progress: 0,
            status: 'uploading' as const,
          };
        }
      });
      setUploadFiles(newUploadFiles);
      onFilesChange?.(newFiles);
    },
  });

  // Simulate upload progress
  useEffect(() => {
    if (!simulateUpload) return;

    const interval = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.status !== 'uploading') return file;

          const increment = Math.random() * 15 + 5; // 5-20% increment
          const newProgress = Math.min(file.progress + increment, 100);

          if (newProgress >= 100) {
            // Randomly decide if upload succeeds or fails
            const shouldFail = Math.random() < 0.1; // 10% chance to fail
            return {
              ...file,
              progress: 100,
              status: shouldFail ? ('error' as const) : ('completed' as const),
              error: shouldFail
                ? 'Upload failed. Please try again.'
                : undefined,
            };
          }

          return { ...file, progress: newProgress };
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, [simulateUpload]);

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  // const handleSelectAll = () => {
  //   if (selectedFiles.length === uploadFiles.length) {
  //     setSelectedFiles([]);
  //   } else {
  //     setSelectedFiles(uploadFiles.map(file => file.id));
  //   }
  // };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleDownload = async (fileId: string, url: string) => {
    try {
      // For local files, just open in new tab
      if (url.startsWith('http')) {
        window.open(url, '_blank');
        toast.success('Download started');
      } else {
        // For server files, use the API
        const response = await fetch('/api/files/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileIds: [fileId] }),
        });

        const result = await response.json();
        if (response.ok) {
          window.open(result.downloadUrl, '_blank');
          toast.success('Download started');
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const handleBulkDownload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to download');
      return;
    }

    try {
      const response = await fetch('/api/files/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds: selectedFiles }),
      });

      const result = await response.json();
      if (response.ok) {
        window.open(result.downloadUrl, '_blank');
        toast.success('Download started');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to download files');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to delete');
      return;
    }

    if (!confirm('Are you sure you want to delete the selected files?')) {
      return;
    }

    try {
      const response = await fetch('/api/files/bulk-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds: selectedFiles }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(`Deleted ${result.deletedCount} files`);
        setSelectedFiles([]);
        refetch();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete files');
    }
  };

  const getFileIcon = (file: File | FileMetadata | ServerFile) => {
    const type =
      file instanceof File
        ? file.type
        : 'type' in file
          ? file.type
          : file.mimeType;
    if (type.startsWith('image/'))
      return <ImageIcon className="size-4 text-green-400" />;
    if (type.startsWith('video/'))
      return <VideoIcon className="size-4 text-red-500" />;
    if (type.startsWith('audio/'))
      return <HeadphonesIcon className="size-4 text-pink-500" />;
    if (type.includes('pdf'))
      return <FileTextIcon className="size-4 text-purple-500" />;
    if (type.includes('word') || type.includes('doc'))
      return <FileTextIcon className="size-4 text-blue-600" />;
    if (type.includes('excel') || type.includes('sheet'))
      return <FileSpreadsheetIcon className="size-4 text-yellow-500" />;
    if (type.includes('zip') || type.includes('rar'))
      return <FileArchiveIcon className="size-4 text-orange-500" />;
    return <FileTextIcon className="size-4" />;
  };

  const getFileTypeLabel = (file: File | FileMetadata | ServerFile) => {
    const type =
      file instanceof File
        ? file.type
        : 'type' in file
          ? file.type
          : file.mimeType;
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Audio';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('word') || type.includes('doc')) return 'Word';
    if (type.includes('excel') || type.includes('sheet')) return 'Excel';
    if (type.includes('zip') || type.includes('rar')) return 'Archive';
    if (type.includes('json')) return 'JSON';
    if (type.includes('text')) return 'Text';
    return 'File';
  };

  const files = data?.files || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularText
          text="CONFERIO*CALLS*"
          onHover="speedUp"
          spinDuration={5}
          className=""
        />
      </div>
    )
  }

  return (
    <Tabs defaultValue="Grid" className=''>
      <div className={cn('w-full space-y-4 px-2 pt-2', className)}>
        {showToolBar && (
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <form
              onSubmit={handleSearch}
              className="flex gap-2 flex-1 max-w-md"
            >
              <div className="relative">
                <Input
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="peer ps-9 pe-9 dark:border-neutral-800"
                  placeholder="Search..."
                  type="search"
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <SearchIcon size={16} />
                </div>
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Submit search"
                  type="submit"
                >
                  <ArrowRightIcon size={16} aria-hidden="true" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  Files ({uploadFiles.length + files.length})
                </h3>
              </div>
            </form>

            <div className="flex justify-center items-center gap-3">
              <ThemeToggle />
              <DynamicIslandDemo />
              <Separator orientation="vertical" className='h-6 mr-0.5 dark:!bg-[#303030]' />
              <TabsList className="border !border-[#303030] bg-transparent px-0 py-0 overflow-hidden rounded-xl">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <TabsTrigger
                          value="Grid"
                          className="group py-2 rounded-none"
                        >
                          <AnimateIcon animateOnHover>
                            <LayoutDashboard className="w-4 h-4 dark:text-white" />
                          </AnimateIcon>
                        </TabsTrigger>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="px-2 py-1 text-xs">
                      Grid View
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> 
                <Separator orientation="vertical" className="dark:!bg-[#303030]" />
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild className='!bg-transparent'>
                      <span>
                        <AnimateIcon animateOnHover>
                          <TabsTrigger
                            value="List"
                            className="py-2 h-full w-full rounded-none !bg-transparent"
                          >
                            <List animateOnView className="w-4 h-4 dark:text-white" />
                          </TabsTrigger>
                        </AnimateIcon>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="px-2 py-1 text-xs">
                      List View
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
               
              </TabsList>

              <FileUploaderDialog>
                <AnimateIcon animateOnHover><Button
                  variant="outline"
                  size="default"
                  className=" flex rounded-xl hover:bg-blue-700 bg-[#5C47CD] text-white"
                >
                  <CloudUploadIcon pathLength={1} className="mr-0.5 h-5 w-5" />
                  <p>Add New</p>
                </Button>
                </AnimateIcon>
              </FileUploaderDialog>
            </div>
          </div>
        )}

  

        <TabsContent value="Grid">
          {files.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                <EmptyState view="none" />
              </p>
            </div>
          ) : (
            <div className="grid pt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 pb-2 h-full">
              {files.map((file: ServerFile) => (
                <Card
                  key={file.id}
                  className=" rounded-2xl border-t-2 border-white border-none h-fit px-1 py-1 pt-3 dark:bg-neutral-800 shadow"
                >
                  <div className="flex justify-start items-start gap-2 px-1">
                    
                    <Avatar className="size-8">
                      <AvatarImage src={file.url} />
                      <AvatarFallback>
                        {file.originalName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col">
                      {/* <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => handleSelectFile(file.id)}
                      className="mt-1 rounded"
                    /> */}<h3
                        className="font-medium text-xs truncate"
                        title={file.originalName}
                      >
                        {file.originalName.slice(0, 20)}
                      </h3>
                      <p className="text-xs text-neutral-500">
                      Rohan • {file.formattedSize} • {file.ext.toUpperCase()}
                      </p>
                      
                      {/* <p className="text-xs text-muted-foreground">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </p> */}
                    </div>
                  </div>
                  {file.mimeType.startsWith('image/') && (
                    <div className="mt-3">
                      <img
                        src={file.url}
                        alt={file.originalName}
                        className="w-full h-48 max-h-48 object-cover rounded-xl"
                      />
                    </div>
                  )}
                  {file.mimeType.startsWith('video/') && (
                    <div className="mt-3">
                      <video
                        autoPlay={false}
                        loop
                        muted
                        src={file.url}
                        className="w-full min-h-48 h-48 object-cover rounded-xl"
                      />
                    </div>
                  )}
                  {file.mimeType.startsWith('audio/') && (
                    <div className="mt-3 border rounded-lg bg-muted/30 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
                          🎵
                        </div>
                        <div className="flex-1 min-w-0">
                          <audio
                            controls
                            src={file.url}
                            className="mt-2 w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {file.mimeType === 'application/pdf' && (
                    <div className="overflow-hidden max-h-32 w-full mt-3 rounded-lg border">
                      <iframe
                        src={file.url}
                        className="w-full max-h-48 h-48 rounded" // fixed height
                        title={file.originalName}
                      />
                    </div>
                  )}
                  {(file.mimeType === 'application/msword' ||
                    file.mimeType ===
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document') && (
                      <div className="overflow-hidden w-full mt-3 rounded-lg border h-48">
                        <iframe
                          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.url)}`}
                          className="w-full h-full rounded"
                          title={file.originalName}
                        />
                      </div>
                    )}
                  {(file.mimeType === 'application/zip' ||
                    file.mimeType === 'application/x-zip-compressed' ||
                    file.mimeType === 'application/vnd.rar' ||
                    file.mimeType === 'application/x-rar-compressed' ||
                    file.ext?.toLowerCase() === 'zip' ||
                    file.ext?.toLowerCase() === 'rar') && (
                      <div className="mt-3 border rounded-lg bg-muted/30 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center">
                            📦
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {file.originalName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {file.ext?.toUpperCase()} • {file.formattedSize}
                            </p>
                            <a
                              href={file.url}
                              download
                              className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                            >
                              Download Archive
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="List">
          {(uploadFiles.length > 0 || files.length > 0) && (
            <div className="space-y-4">
              <div className="rounded-lg border-none">
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs px-0">
                      <TableHead className="h-9 "></TableHead>
                      <TableHead className="h-9">Name</TableHead>
                      <TableHead className="h-9">Date Modified</TableHead>
                      <TableHead className="h-9">Type</TableHead>
                      <TableHead className="h-9">Size</TableHead>
                      <TableHead className="h-9 w-[100px] text-end">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files.map((file: ServerFile) => (
                      <TableRow
                        key={file.id}
                        className="relative hover:bg-transparent"
                        onMouseEnter={() => setHoveredRow(file.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <TableCell className="py-2 px-0 h-0 w-0 ">
                          <div className="flex p-0 justify-center items-center">
                            {(hoveredRow === file.id ||
                              selectedFiles.includes(file.id)) && (
                                <Input
                                  type="checkbox"
                                  checked={selectedFiles.includes(file.id)}
                                  onChange={() => handleSelectFile(file.id)}
                                  className=" h-3.5 w-3.5 group peer !bg-transparent shrink-0 rounded-md border border-input ring-offset-background focus-visible:outline-none 
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
    [[data-invalid=true]_&]:border-destructive/60 [[data-invalid=true]_&]:ring-destructive/10  dark:[[data-invalid=true]_&]:border-destructive dark:[[data-invalid=true]_&]:ring-destructive/20,
    data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground"
                                />
                              )}
                          </div>
                        </TableCell>
                        <TableCell className="">
                          <div className="flex items-center gap-1">
                            <div className="size-8 flex items-center justify-center text-muted-foreground/80">
                              {getFileIcon(file)}
                            </div>

                            <HoverCard>
                              <HoverCardTrigger className="cursor-pointer">
                                {file.originalName}
                              </HoverCardTrigger>
                              <HoverCardContent className="dark:bg-black flex justify-center items-center overflow-hidden border p-1 h-80 min-w-40 w-auto">
                                {file.mimeType.startsWith('image/') && (
                                  <img
                                    className="w-full h-full object-cover rounded-sm"
                                    src={file.url}
                                    alt=""
                                  />
                                )}
                                {file.mimeType.startsWith('video/') && (
                                  <video
                                    autoPlay
                                    loop
                                    src={file.url}
                                    className="w-full h-full object-cover rounded"
                                  />
                                )}
                                {file.mimeType.startsWith('audio/') && (
                                  <audio controls src={file.url} className="" />
                                )}
                                {file.mimeType === 'application/pdf' && (
                                  <iframe
                                    src={file.url}
                                    className=" w-full h-full object-cover "
                                    title={file.originalName}
                                  />
                                )}
                                {(file.mimeType === 'application/msword' ||
                                  file.mimeType ===
                                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document') && (
                                    <div className="overflow-hidden w-full mt-3 rounded-lg border h-[80vh]">
                                      <iframe
                                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.url)}`}
                                        className="w-full h-full rounded"
                                        title={file.originalName}
                                      />
                                    </div>
                                  )}
                                {(file.mimeType === 'application/zip' ||
                                  file.mimeType ===
                                  'application/x-zip-compressed' ||
                                  file.mimeType === 'application/vnd.rar' ||
                                  file.mimeType ===
                                  'application/x-rar-compressed' ||
                                  file.ext?.toLowerCase() === 'zip' ||
                                  file.ext?.toLowerCase() === 'rar') && (
                                    <div className="mt-3 border rounded-lg bg-muted/30 p-3">
                                      <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center">
                                          📦
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium truncate">
                                            {file.originalName}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {file.ext?.toUpperCase()} •{' '}
                                            {file.formattedSize}
                                          </p>
                                          <a
                                            href={file.url}
                                            download
                                            className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                                          >
                                            Download Archive
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                {(file.mimeType ===
                                  'application/vnd.ms-excel' ||
                                  file.mimeType ===
                                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                                  file.ext?.toLowerCase() === 'xls' ||
                                  file.ext?.toLowerCase() === 'xlsx') && (
                                    <div className="overflow-hidden w-full mt-3 rounded-lg border h-[80vh]">
                                      <iframe
                                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.url)}`}
                                        className="w-full h-full rounded"
                                        title={file.originalName}
                                      />
                                    </div>
                                  )}
                              </HoverCardContent>
                            </HoverCard>
                          </div>
                        </TableCell>
                        <TableCell className="py-2">
                          {file.createdAt
                            ? new Date(file.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="py-2">
                          <Badge variant="secondary" className="text-xs">
                            {getFileTypeLabel(file)}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 text-sm text-muted-foreground">
                          {file.formattedSize}
                        </TableCell>
                        <TableCell className="py-2 flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-transparent"
                              >
                                <EllipsisIcon
                                  className=""
                                  size={16}
                                  aria-hidden="true"
                                />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="dark:bg-neutral-950 dark:border-neutral-800">
                              <DropdownMenuItem>
                                <CopyPlusIcon
                                  size={16}
                                  className="opacity-60"
                                  aria-hidden="true"
                                />
                                Copy Link
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDownload(file.id, file.url)
                                }
                              >
                                <BoltIcon
                                  size={16}
                                  className="opacity-60"
                                  aria-hidden="true"
                                />
                                Open
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handleBulkDownload}>
                                <DownloadIcon
                                  size={16}
                                  className="opacity-60"
                                  aria-hidden="true"
                                />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handleBulkDelete}>
                                <Trash2
                                  size={16}
                                  className="opacity-60"
                                  aria-hidden="true"
                                />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Pagination */}
        {isShowPagination && pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(pagination.pageNumber - 1) * pagination.pageSize + 1} to{' '}
              {Math.min(
                pagination.pageNumber * pagination.pageSize,
                pagination.totalCount
              )}{' '}
              of {pagination.totalCount} files
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(pagination.totalPages, prev + 1)
                  )
                }
                disabled={currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Error Messages */}
        {errors.length > 0 && (
          <Alert variant="destructive" className="mt-5">
            <TriangleAlert />
            <AlertTitle>File upload error(s)</AlertTitle>
            <AlertDescription>
              {errors.map((error, index) => (
                <p key={index} className="last:mb-0">
                  {error}
                </p>
              ))}
            </AlertDescription>
          </Alert>
        )}
      </div>
      {selectedFiles.length > 0 && (
          <div className="flex items-center gap-2 py-2 px-4 fixed max-w-3xl w-full mx-auto bottom-5 bg-secondary rounded-lg">
            <span className="text-sm">
              {selectedFiles.length} file(s) selected
            </span>
            <Button size="sm" onClick={handleBulkDownload} className='!px-2 !py-2 !h-0 w-fit bg-[#121212]'>
              <Download className="h-4 w-4 mr-2 text-white" />
             <p> Download</p>
            </Button>
            <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedFiles([])}
            >
              Clear
            </Button>
          </div>
        )}

    </Tabs>
  );
}
