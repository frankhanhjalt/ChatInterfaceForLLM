"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  PlusIcon,
  MessageSquareIcon,
  SettingsIcon,
  MenuIcon,
  XIcon,
  SearchIcon,
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon,
  SparklesIcon,
  HistoryIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Conversation {
  id: string
  title: string
  updated_at: string
}

interface SidebarProps {
  conversations: Conversation[]
  currentConversationId?: string
  onConversationSelect: (id: string) => void
  onNewChat: () => void
  onDeleteConversation?: (id: string) => void
  onDeleteAllConversations?: () => void
  onUpdateTitle?: (id: string, title: string) => void
  className?: string
}

export function Sidebar({
  conversations,
  currentConversationId,
  onConversationSelect,
  onNewChat,
  onDeleteConversation,
  onDeleteAllConversations,
  onUpdateTitle,
  className,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  const filteredConversations = conversations.filter((conv) =>
    (conv.title || "").toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEditTitle = (conversation: Conversation) => {
    setEditingId(conversation.id)
    setEditTitle(conversation.title || "")
  }

  const handleSaveTitle = () => {
    if (editingId && editTitle.trim() && onUpdateTitle) {
      onUpdateTitle(editingId, editTitle.trim())
      setEditingId(null)
      setEditTitle("")
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar/95 backdrop-blur-sm border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-72",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          {isCollapsed ? <MenuIcon className="h-5 w-5" /> : <XIcon className="h-5 w-5" />}
        </Button>

        {!isCollapsed && (
          <Button
            onClick={onNewChat}
            className="flex-1 ml-3 bg-gradient-to-r from-sidebar-primary to-sidebar-primary/80 hover:from-sidebar-primary/90 hover:to-sidebar-primary/70 text-sidebar-primary-foreground font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        )}
      </div>

      {!isCollapsed && (
        <>
          {/* Search */}
          <div className="px-4 py-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/60" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-sidebar-accent/30 border-sidebar-border/50 text-sidebar-foreground placeholder:text-sidebar-foreground/60 focus:ring-2 focus:ring-sidebar-ring/50 focus:border-sidebar-ring transition-all duration-200"
              />
            </div>
          </div>

          <Separator className="bg-sidebar-border/30 mx-4" />

          {/* Conversations List */}
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1 py-3">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-12 text-sidebar-foreground/60">
                  <div className="w-16 h-16 mx-auto mb-3 bg-sidebar-accent/20 rounded-full flex items-center justify-center">
                    <MessageSquareIcon className="h-8 w-8 opacity-50" />
                  </div>
                  <p className="text-sm font-medium mb-1">
                    {searchQuery ? "No conversations found" : "No conversations yet"}
                  </p>
                  {!searchQuery && (
                    <p className="text-xs text-sidebar-foreground/40">
                      Start your first conversation to get going
                    </p>
                  )}
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "group relative flex items-center rounded-xl transition-all duration-200",
                      currentConversationId === conversation.id && "bg-gradient-to-r from-sidebar-accent/80 to-sidebar-accent/60 shadow-sm",
                    )}
                  >
                    {editingId === conversation.id ? (
                      <div className="flex-1 p-3">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveTitle()
                            if (e.key === "Escape") handleCancelEdit()
                          }}
                          onBlur={handleSaveTitle}
                          className="h-9 text-sm bg-sidebar border-sidebar-border/50 focus:ring-2 focus:ring-sidebar-ring/50"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        className={cn(
                          "flex-1 justify-start text-left h-auto p-3 text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200 rounded-xl",
                          currentConversationId === conversation.id &&
                            "bg-gradient-to-r from-sidebar-accent/80 to-sidebar-accent/60 text-sidebar-accent-foreground shadow-sm",
                        )}
                        onClick={() => onConversationSelect(conversation.id)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-sidebar-accent/30 flex items-center justify-center mr-3 flex-shrink-0">
                          <MessageSquareIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="truncate font-medium text-sm">{conversation.title || "Untitled"}</div>
                          <div className="flex items-center gap-1 text-xs text-sidebar-foreground/60 truncate mt-0.5">
                            <HistoryIcon className="h-3 w-3" />
                            <span>{new Date(conversation.updated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </Button>
                    )}

                    {editingId !== conversation.id && (onDeleteConversation || onUpdateTitle) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200 rounded-lg"
                          >
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border shadow-lg">
                          {onUpdateTitle && (
                            <DropdownMenuItem
                              onClick={() => handleEditTitle(conversation)}
                              className="text-popover-foreground hover:bg-accent/50 transition-colors"
                            >
                              <EditIcon className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                          )}
                          {onDeleteConversation && (
                            <DropdownMenuItem
                              onClick={() => onDeleteConversation(conversation.id)}
                              className="text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <TrashIcon className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <Separator className="bg-sidebar-border/30 mx-4" />

          {/* Settings */}
          <div className="p-3 space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200 rounded-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-sidebar-accent/30 flex items-center justify-center mr-3">
                <SettingsIcon className="h-4 w-4" />
              </div>
              <span className="font-medium">Settings</span>
            </Button>
            
            {onDeleteAllConversations && conversations.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive hover:bg-destructive/10 transition-all duration-200 rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center mr-3">
                      <TrashIcon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Delete All Conversations</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete All Conversations</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your conversations and their messages.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDeleteAllConversations}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </>
      )}

      {/* Collapsed State */}
      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center py-4 space-y-4">
          <Button
            onClick={onNewChat}
            size="icon"
            className="w-10 h-10 bg-gradient-to-r from-sidebar-primary to-sidebar-primary/80 hover:from-sidebar-primary/90 hover:to-sidebar-primary/70 text-sidebar-primary-foreground shadow-sm hover:shadow-md transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5" />
          </Button>
          
          <div className="w-8 h-8 rounded-lg bg-sidebar-accent/30 flex items-center justify-center">
            <SettingsIcon className="h-4 w-4 text-sidebar-foreground/60" />
          </div>
          
          {onDeleteAllConversations && conversations.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-10 h-10 text-destructive hover:bg-destructive/10 transition-all duration-200"
                >
                  <TrashIcon className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete All Conversations</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your conversations and their messages.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDeleteAllConversations}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </div>
  )
}
