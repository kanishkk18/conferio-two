'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users, Mail, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Member {
  id: string
  role: string
  user: {
    id: string
    name: string
    email: string
    image?: string
  }
}

interface InviteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  members: Member[]
  onMembersUpdate: () => void
}

export default function InviteModal({ open, onOpenChange, workspaceId, members, onMembersUpdate }: InviteModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('VIEWER')
  const [loading, setLoading] = useState(false)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), role }),
      })

      if (response.ok) {
        toast.success('User invited successfully')
        setEmail('')
        setRole('VIEWER')
        onMembersUpdate()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to invite user')
      }
    } catch (error) {
      toast.error('Failed to invite user')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/members/${memberId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Member removed successfully')
        onMembersUpdate()
      } else {
        toast.error('Failed to remove member')
      }
    } catch (error) {
      toast.error('Failed to remove member')
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'OWNER': return 'bg-purple-100 text-purple-800'
      case 'ADMIN': return 'bg-blue-100 text-blue-800'
      case 'EDITOR': return 'bg-green-100 text-green-800'
      case 'COMMENTER': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Invite to Workspace
          </DialogTitle>
          <DialogDescription>
            Add team members to collaborate on this workspace
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEWER">Viewer - Can view pages</SelectItem>
                <SelectItem value="COMMENTER">Commenter - Can view and comment</SelectItem>
                <SelectItem value="EDITOR">Editor - Can edit pages</SelectItem>
                <SelectItem value="ADMIN">Admin - Can manage workspace</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <Mail className="mr-2 h-4 w-4" />
            {loading ? 'Inviting...' : 'Send Invitation'}
          </Button>
        </form>

        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Current Members ({members.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-2 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.user.image} />
                    <AvatarFallback>
                      {member.user.name?.charAt(0) || member.user.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{member.user.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{member.user.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getRoleBadgeColor(member.role)}>
                    {member.role}
                  </Badge>
                  {member.role !== 'OWNER' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}