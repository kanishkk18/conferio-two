'use client';

import React, { useState, useEffect } from 'react';

import Mainsidebar from '@/components/ui/mainSideBar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/dashboardCalendar';
import { CloudSunIcon, Plus } from 'lucide-react';
import UserAvatar from '@/components/ui/comp-377';
import { Badge } from '@/components/ui/badge';
import { Sun } from 'lucide-react';
import { FamilyButtonDemo } from '@/components/ui/multiButton';
import moment from 'moment';
import DashMusic from '../music/dashMusic';
import MusicProvider from '@/components/music-components/music-provider';
import TaskEmptyState from '@/components/tasks/task-empty-state';
import { UserTask } from 'interfaces/task';
import { DashboardTaskList } from '@/components/tasks/dashboard-task-list';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import DynamicIslandDemo from '@/components/ui/DynamicIslandDemo';
import { Separator } from '@/components/ui/separator';
import {
  FloatingPanelBody,
  FloatingPanelCloseButton,
  FloatingPanelContent,
  FloatingPanelFooter,
  FloatingPanelForm,
  FloatingPanelHeader,
  FloatingPanelRoot,
  FloatingPanelSubmitButton,
  FloatingPanelTextarea,
  FloatingPanelTrigger,
} from '@/components/ui/floatingPanel';
import { Scroll } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard } from '@/components/animate-ui/icons/layout-dashboard';
import { ListIcon } from '@/components/animate-ui/icons/list';
import { useBoardsContext } from 'store/BoardListContext';
import useModal from 'hooks/useModal';
import { useRouter } from 'next/navigation';

interface TaskProps {
  task: UserTask[];
  setTask: (value: UserTask[]) => void;
}

const Dashboard = ({handleBoardSelect,}) => {
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });
  const [date, setDate] = useState<Date | undefined>(new Date());
  type ForecastDay = { day: string; temp: number };
  const [task, setTask] = useState<UserTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    selectedBoard,
    selectedTask,
    setSelectedTask,
    boards,
    isValidating,
  } = useBoardsContext();
  const taskDetailsModal = useModal();
  const [weather, setWeather] = useState<{
    temperature: string | number;
    feelsLike: string | number;
    high: string | number;
    low: string | number;
    condition: string;
    humidity: string | number;
    wind: string | number;
    precipitation: string | number;
    forecast: ForecastDay[];
  }>({
    temperature: '--',
    feelsLike: '--',
    high: '--',
    low: '--',
    condition: '--',
    humidity: '--',
    wind: '--',
    precipitation: '--',
    forecast: [],
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const { mutateBoards } = useBoardsContext();

  const boardSelectHandler = () => {
    handleBoardSelect && handleBoardSelect();
    setDialogOpen(false);
  };

  // Timer to update time
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error fetching location: ', error.message);
          alert('Unable to fetch your location. Please allow location access.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/task', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setTask(data);
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
      setIsLoading(false);
    };

    const verifyUser = async () => {
      const response = await fetch('/api/auth/services-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to verify user');
      }
    };

    fetchTasks();
    verifyUser();
  }, []);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      if (location.latitude && location.longitude) {
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=auto`
          );
          const data = await response.json();

          // Map weather codes to descriptions
          const mapWeatherCodeToDescription = (code: number): string => {
            const weatherDescriptions: { [key: number]: string } = {
              0: 'Clear sky',
              1: 'Mainly clear',
              2: 'Partly cloudy',
              3: 'Overcast',
              45: 'Fog',
              48: 'Depositing rime fog',
              51: 'Light drizzle',
              53: 'Moderate drizzle',
              55: 'Dense drizzle',
              61: 'Slight rain',
              63: 'Moderate rain',
              65: 'Heavy rain',
              71: 'Slight snow',
              73: 'Moderate snow',
              75: 'Heavy snow',
              80: 'Slight rain showers',
              81: 'Moderate rain showers',
              82: 'Violent rain showers',
              95: 'Thunderstorm',
              96: 'Thunderstorm with slight hail',
              99: 'Thunderstorm with heavy hail',
            };
            return weatherDescriptions[code] || 'Unknown condition';
          };

          // Update weather state
          setWeather({
            temperature: data.current_weather.temperature,
            feelsLike: data.current_weather.apparent_temperature,
            high: data.daily.temperature_2m_max[0],
            low: data.daily.temperature_2m_min[0],
            condition: mapWeatherCodeToDescription(
              data.current_weather.weathercode
            ),
            humidity: '--', // Not available in Open-Meteo
            wind: data.current_weather.windspeed,
            precipitation: data.current_weather.precipitation || 0,
            forecast: data.daily.temperature_2m_max.map((temp, index) => ({
              day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
                (new Date().getDay() + index) % 7
              ],
              temp,
            })),
          });
        } catch (error) {
          console.error('Failed to fetch weather data', error);
        }
      }
    };

    fetchWeather();
  }, [location]);


  const handleSubmit = (note: string) => {
    console.log('Submitted note:', note);
  };

  

  return (
    <div className="flex dark:bg-black w-full h-screen max-h-screen overflow-hidden">
      <Mainsidebar />
      <div className=" w-[100%] h-[100%] flex justify-start items-start">
        <Tabs className="flex-[0.7] bg-gray-50 dark:bg-transparent flex py-0 flex-col justify-start items-start px-0 h-screen relative"
        >
          <div className="flex mx-auto items-center pt-4 pb-3 w-[80%] justify-between">

            <AnimateIcon animateOnHover className='!px-0 !py-0'>
              <TabsList className="!px-0 !py-0">
                <TabsTrigger value="Remindar" className='rounded-r-none'><LayoutDashboard /></TabsTrigger>
                <TabsTrigger value="Notes" className='rounded-l-none'><ListIcon /></TabsTrigger>
              </TabsList>
            </AnimateIcon>
            <Button
              variant="outline"
              className="text-yellow-400 px-2 py-4 h-0 dark:text-[#2647eb] "
            >
              View all
            </Button>
          </div>

          <div className="flex flex-col w-[80%] space-y-4 mx-auto items-center">
            {isLoading ? (
              <div className="flex w-full h-full flex-col justify-center items-center gap-4">

                <div className="bg-white dark:bg-[#111111] shadow-[0px_18px_50px_-10px_rgba(0,0,0,0.2)] justify-start items-start rounded-[12px] p-5 gap-4 w-full flex">
                  <div className="h-10 w-10 p-2 flex justify-center items-center rounded-[10px] bg-yellow-400 dark:bg-[#2647eb]">
                 <Scroll/>
                  </div>

                  <div className="flex flex-col">
                    <p className="bg-black dark:bg-white w-[70px] font-bold h-[12px] mb-1 rounded-xl">
                    </p>

                    <div className="h-[12px] w-[30px] bg-gray-500/55 rounded-xl">
                    </div>

                    <div className=" h-[12px] w-[40px] my-2 font-medium bg-yellow-400 dark:bg-[#2647eb] rounded-2xl ">
                    </div>

                    <div className="h-[12px] w-[80px] bg-gray-500/55 rounded-xl">
                     
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-950 justify-between items-center rounded-[12px] p-3 gap-4 w-full flex">
                  <div className="h-10 w-10 p-2 justify-center items-center rounded-[10px] bg-yellow-400 dark:bg-[#2647eb]">
                    
                  </div>
                  <div className="justify-between text-center items-center gap-8 flex">
                    <p className="bg-black w-[70px] rounded-xl dark:bg-white h-[12px]">
                      
                    </p>
                    <p className="h-[12px] w-[50px] bg-gray-500/55 rounded-xl">
                  
                    </p>
                  </div>
                </div>

              </div>
            ) : task.length > 0 ? (
              <Remindars task={task} setTask={setTask} />
            ) : (
              <div className="flex w-full h-full justify-center items-center">
                no remindar
              </div>
            )}


            <FloatingPanelRoot className="w-full bg-transparent">
              <FloatingPanelTrigger
                title="Add Note"
                className="w-full !px-0 !py-0 min-w-full h-full bg-white border-none dark:bg-neutral-950 !rounded-[12px] justify-start items-center gap-4 flex"
              >
                <div className="bg-white dark:bg-neutral-950 justify-start items-center !rounded-[12px] p-3 gap-4 w-full flex">
                  <div className="h-10 w-10 p-2 justify-center items-center rounded-[10px] bg-yellow-400 dark:bg-[#2647eb]">
                    <Plus className="w-full h-full text-white" />
                  </div>
                  <div className="justify-center items-center gap-4 flex">
                    <p className="text-black text-center font-sans dark:text-white font-bold text-[16px]">
                      Add New
                    </p>
                  </div>
                </div>
              </FloatingPanelTrigger>
              <FloatingPanelContent className="w-86 ml-20 border-none -mt-20 dark:bg-[#0A0A0A]">
                <FloatingPanelForm onSubmit={handleSubmit}>
                  <FloatingPanelBody>
                    <FloatingPanelTextarea
                      id="note-input"
                      className="min-h-[170px]"
                    />
                  </FloatingPanelBody>
                  <FloatingPanelFooter>
                    <FloatingPanelCloseButton />
                    <FloatingPanelSubmitButton />
                  </FloatingPanelFooter>
                </FloatingPanelForm>
              </FloatingPanelContent>
            </FloatingPanelRoot>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className=" dark:bg-neutral-950 bg-white min-w-full rounded-[12px] p-3 overflow-hidden items-center min-h-[46%] h-[46%] md:max-h-[42vh] lg:max-h-[44vh] xl:max-h-[44vh] shadow-xs"
            />
          </div>
        </Tabs>

        <div className="flex-[1] overflow-y-auto flex flex-col justify-start items-start py-2 px-4 h-screen scrollbar-thin">
          {isLoading ? (
            <div className="flex w-full h-full flex-col py-12 justify-start items-center gap-4">
              <div className="flex items-center space-x-4">
              <Skeleton className="h-5 w-5 rounded-sm" />
                <div className="">
                  <Skeleton className="h-16 w-[500px]" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
              <Skeleton className="h-5 w-5 rounded-sm" />
                <div className="">
                  <Skeleton className="h-16 w-[500px]" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
              <Skeleton className="h-5 w-5 rounded-sm" />
                <div className="">
                  <Skeleton className="h-16 w-[500px]" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
              <Skeleton className="h-5 w-5 rounded-sm" />
                <div className="">
                  <Skeleton className="h-16 w-[500px]" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
              <Skeleton className="h-5 w-5 rounded-sm" />
                <div className="">
                  <Skeleton className="h-16 w-[500px]" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
              <Skeleton className="h-5 w-5 rounded-sm" />
                <div className="">
                  <Skeleton className="h-16 w-[500px]" />
                </div>
              </div>
            </div>
          ) : task.length > 0 ? (
            <DashboardTaskList task={task} setTask={setTask} />
          ) : (
            <div className="flex w-full h-full justify-center items-center">
              <TaskEmptyState />
            </div>
          )}
        </div>

        

        <div className="flex-[0.6] py-6 px-6 justify-center items-center flex flex-col h-full">
          <div className="flex px-2 py-1 justify-end gap-2 items-center w-[90%]">
            <ThemeToggle />
            <DynamicIslandDemo />
            <Separator orientation="vertical" className="h-6" />
            <UserAvatar />
          </div>

          <div className="w-[94%] px-4 flex flex-col justify-center items-center mt-2">
            <MusicProvider>
              <div className="w-full mt-1">
                <DashMusic />
              </div>
            </MusicProvider>

            <FloatingPanelRoot className="flex w-full shadow-md mt-4 justify-center items-start px-6 bg-gray-50 dark:bg-neutral-950 py-10 rounded-[14px] flex-col">
              <FloatingPanelTrigger
                title=""
                className="bg-transparent dark:bg-transparent border-none"
              >
                <div className="flex justify-end items-end text-gray-500 pb-4 -mr-8">
                  <p>{moment().format('LL')}</p>
                </div>
                <div className="flex justify-between gap-4 items-center pb-4">
                  <h1 className="lg:text-[32px] md:text-[24px] text-[16px]   font-sans font-semibold">
                    {time.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </h1>
                  <p className="bg-blue-100 text-blue-600 w-fit px-2 rounded-xl">
                    {weather.temperature}°C
                  </p>
                </div>
                <div className="text-[16px] flex text-left justify-start gap-1 items-start font-sans text-gray-700 dark:text-white font-semibold">
                  <span className="text-left flex justify-start gap-2 items-start">
                    <CloudSunIcon className="text-yellow-400 text-start" />
                  </span>
                  <div className="flex gap-3 justify-center items-center">
                    {' '}
                    <p className="font-medium">Feels like</p>
                    <span className="font-bold text-neutral-500">

                      {(weather.condition || 'Loading...').slice(0, 12)}
                    </span>
                  </div>
                </div>
              </FloatingPanelTrigger>

              <FloatingPanelContent className="-mt-32 -ml-14 px-6 min-w-2xl border">
                <FloatingPanelHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Sun className="w-8 h-8 text-yellow-400 mr-2" />
                      <h1 className="font-bold text-lg pr-4">
                        Today's Weather
                      </h1>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {weather.temperature}°C
                    </Badge>
                  </div>
                </FloatingPanelHeader>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-2xl font-bold">
                      {weather.temperature}°C
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Feels like {weather.feelsLike}°C
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{weather.condition}</p>
                    <FloatingPanelBody>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        High {weather.high}°C / Low {weather.low}°C
                      </p>
                    </FloatingPanelBody>
                  </div>
                </div>

                {/* 5-Day Forecast */}
                <div className="space-y-2">
                  <h4 className="font-medium">5-Day Forecast</h4>
                  {weather.forecast.map((day, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{day.day}</span>
                      <div className="flex items-center">
                        <Sun className="w-4 h-4 text-yellow-400 mr-2" />
                        <span>{day.temp}°C</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <FloatingPanelFooter>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last updated:{' '}
                    {time.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </FloatingPanelFooter>
              </FloatingPanelContent>
            </FloatingPanelRoot>

            <div className="flex w-full max-h-fit mt-4 shadow-md space-y-7 overflow-hidden justify-center items-start px-6 bg-gray-50 dark:bg-neutral-950 pt-4 rounded-[14px] flex-col">
              <h1 className="lg:text-[20px] md:text-[20px] text-[16px] leading-tight font-sans font-semibold">
                Unsleash <br /> the professional <br /> super power
              </h1>
              <p className="text-[14px]  font-semibold text-gray-400">
                Unlimited conversations, tasks, premium features and much more
              </p>
              <div className="flex items-end ">
                <Image
                  height={1000}
                  width={1000}
                  className="  h-28 justify-self-end -ml-3 w-auto"
                  src="https://res.cloudinary.com/kanishkkcloud18/image/upload/v1730377159/CONFERIO/ix8hjpuaaqftbagoekit.png"
                  alt=""
                />
                <FamilyButtonDemo />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


export function Remindars({ task, setTask }: TaskProps) {
  const handleItsDone = async (selectedTask: UserTask) => {
    try {
      const response = await fetch(`/api/task`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itsDone: true, id: selectedTask.id }),
      });

      if (!response.ok) {
        throw new Error('Error updating task status');
      }

      const updatedTasks = task.map((t) =>
        t.id === selectedTask.id ? { ...t, itsDone: true } : t
      );
      setTask(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="w-full overflow-y-scroll h-[32%] md:max-h-[32%] lg:max-h-[34vh] xl:max-h-[38vh] thin-scrollbar">

      {task.map((t, i) => (
        <div key={`task-${i}`} className="w-full">
          {i === 0 ? (
            /* 🔥 FIRST CARD (only once) */
            <div className="bg-white dark:bg-[#111111] shadow-md justify-start items-start rounded-[12px] p-5 gap-4 w-full flex">
              <div className="h-10 w-10 p-2 flex justify-center items-center rounded-[10px] bg-yellow-400 dark:bg-[#2647eb]">
                {t.category?.icon ? (
                  t.category.icon
                ) : (
                  <Scroll className="dark:text-white h-5 w-5" />
                )}
              </div>
              <Checkbox className='border-yellow-500 dark:border-blue-600' onClick={() => !t.itsDone && handleItsDone(t)} checked={t.itsDone}/>


              <div className="flex flex-col">
                <p className="text-black dark:text-white font-bold text-[18px]">
                  {t.title}
                </p>

                <p className="text-gray-500 font-sans text-[14px] font-semibold">
                  {moment(t.dueTime).format("DD MMM YY")}
                </p>

                <p className="dark:text-[#cfcdcd] text-[14px] px-2 my-2 font-medium bg-yellow-400 dark:bg-[#2647eba6] rounded-2xl w-fit">
                  {t.priority}
                </p>

                {t.description ? (
                  <p className="text-gray-400 font-medium text-[14px]">
                    {t.description}
                  </p>
                ) : (
                  <p className="text-[14px] font-medium text-gray-500">
                    No Description
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* ✨ ALL OTHER CARDS */
            <div className="bg-white mt-3 dark:bg-neutral-950 justify-between items-center rounded-[12px] p-3 gap-4 w-full flex">
              <div className="h-10 w-10 p-2 flex justify-center items-center rounded-[10px] bg-yellow-400 dark:bg-[#2647eb]">
                {t.category?.icon ? (
                  t.category.icon
                ) : (
                  <Scroll className="dark:text-white h-5 w-5" />
                )}
              </div>
              <Checkbox className='border-yellow-500 dark:border-blue-600' onClick={() => !t.itsDone && handleItsDone(t)} checked={t.itsDone}/>


              <div className="justify-between w-full items-center flex">
                <p className="text-black font-sans dark:text-white font-bold text-[16px]">
                  {t.title}
                </p>

                <p className="text-gray-500 font-sans text-[14px] font-semibold">
                  {moment(t.dueTime).format("DD MMM YY")}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}

    </div>
  );
}