"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, MessageCircle, User, Loader2 } from "lucide-react"
import { useChat } from "@/hooks/use-api"
import { useSocket } from "@/hooks/use-socket"
import { useSession } from "next-auth/react"

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  sender: {
    id: string
    name: string
    image?: string
  }
  receiver: {
    id: string
    name: string
    image?: string
  }
}

interface Conversation {
  userId: string
  user: {
    id: string
    name: string
    image?: string
  }
  lastMessage: Message
  unreadCount: number
}

export function ChatInterface() {
  const { data: session } = useSession()
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { conversations: apiConversations, loading, error, getConversations, sendMessage } = useChat()
  const { socket, isConnected } = useSocket()

  // Initial load
  useEffect(() => {
    getConversations()
  }, [getConversations])

  // Sync API conversations to state
  useEffect(() => {
    if (apiConversations?.conversations) {
      setConversations(apiConversations.conversations)
    }
  }, [apiConversations])

  // Socket setup
  useEffect(() => {
    if (socket && session?.user?.id) {
      // Join my own room
      socket.emit("join-user-room", session.user.id)

      // Listen for incoming messages
      socket.on("new-message", (msg: Message) => {
        console.log("New message received via socket:", msg)

        // Update messages if looking at this conversation
        if (selectedConversation && (msg.senderId === selectedConversation.userId || msg.receiverId === selectedConversation.userId)) {
          setMessages(prev => [...prev, msg])
        }

        // Update conversations list (update last message, unread count)
        setConversations(prev => {
          const exists = prev.find(c => c.userId === msg.senderId || c.userId === msg.receiverId)
          if (exists) {
            return prev.map(c => {
              if (c.userId === msg.senderId || c.userId === msg.receiverId) {
                return {
                  ...c,
                  lastMessage: msg,
                  unreadCount: (msg.senderId !== session.user.id && (!selectedConversation || selectedConversation.userId !== msg.senderId))
                    ? c.unreadCount + 1
                    : c.unreadCount
                }
              }
              return c
            })
          } else {
            // New conversation starter (simplified, might need to fetch user details)
            // Ideally we re-fetch conversations, but for now:
            getConversations()
            return prev
          }
        })
      })

      return () => {
        socket.off("new-message")
      }
    }
  }, [socket, session?.user?.id, selectedConversation, getConversations])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !session?.user) return

    try {
      const messageData = {
        receiverId: selectedConversation.userId,
        content: newMessage.trim(),
      }

      // Send via API (persistence)
      const sentMsg = await sendMessage(messageData)

      // Emit via socket for immediate update (or rely on API to do it, but here we do optimistic + socket relay)
      // Note: server.ts relays 'send-message' event. 
      // Ideally, the API response confirms it's saved, and we emit so others get it.
      // Or server side API emits it.
      // Let's emit it manually for now to ensure real-time feel if server API doesn't.

      const newMsg: Message = {
        id: sentMsg?.id || Date.now().toString(),
        content: newMessage.trim(),
        senderId: session.user.id as string,
        receiverId: selectedConversation.userId,
        createdAt: new Date().toISOString(),
        sender: {
          id: session.user.id as string,
          name: session.user.name || "You",
          image: session.user.image || undefined
        },
        receiver: selectedConversation.user,
      }

      socket?.emit("send-message", newMsg)

      setNewMessage("")
      setMessages(prev => [...prev, newMsg])

      // Update conversations list
      setConversations(prev => prev.map(c => {
        if (c.userId === selectedConversation.userId) {
          return { ...c, lastMessage: newMsg }
        }
        return c
      }))

    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load conversations: {error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      {/* Conversations List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Conversations
            {isConnected && <div className="w-2 h-2 rounded-full bg-green-500 ml-auto" title="Connected" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm">Start chatting with other users</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.userId}
                  className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedConversation?.userId === conversation.userId ? "bg-gray-100" : ""
                    }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={conversation.user.image} />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">
                          {conversation.user.name}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            {selectedConversation ? (
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={selectedConversation.user.image} />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <span>{selectedConversation.user.name}</span>
              </div>
            ) : (
              "Select a conversation"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[500px] flex flex-col">
          {selectedConversation ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet</p>
                    <p className="text-sm">Start the conversation</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === session?.user?.id ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${message.senderId === session?.user?.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-gray-100"
                          }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}