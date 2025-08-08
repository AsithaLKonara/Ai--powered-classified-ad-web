"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Smile, Paperclip, Phone, Video, MoreVertical, Search, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const conversations = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder-user.jpg",
      online: true,
    },
    lastMessage: "Is the iPhone still available?",
    timestamp: "2 min ago",
    unread: 2,
    adTitle: "iPhone 15 Pro Max 256GB",
  },
  {
    id: 2,
    user: {
      name: "Mike Chen",
      avatar: "/placeholder-user.jpg",
      online: false,
    },
    lastMessage: "Thanks for the quick response!",
    timestamp: "1 hour ago",
    unread: 0,
    adTitle: "MacBook Pro M3",
  },
  {
    id: 3,
    user: {
      name: "Emma Wilson",
      avatar: "/placeholder-user.jpg",
      online: true,
    },
    lastMessage: "Can we meet tomorrow?",
    timestamp: "3 hours ago",
    unread: 1,
    adTitle: "Toyota Prius 2020",
  },
]

const messages = [
  {
    id: 1,
    senderId: 2,
    content: "Hi! I'm interested in your iPhone 15 Pro Max. Is it still available?",
    timestamp: "10:30 AM",
    type: "text",
  },
  {
    id: 2,
    senderId: 1,
    content: "Yes, it's still available! It's in excellent condition.",
    timestamp: "10:32 AM",
    type: "text",
  },
  {
    id: 3,
    senderId: 2,
    content: "Great! Can you tell me more about the condition? Any scratches or issues?",
    timestamp: "10:35 AM",
    type: "text",
  },
  {
    id: 4,
    senderId: 1,
    content:
      "No scratches at all! I've been using it with a case and screen protector since day one. Battery health is at 98%.",
    timestamp: "10:37 AM",
    type: "text",
  },
  {
    id: 5,
    senderId: 2,
    content: "Sounds perfect! Would you consider LKR 420,000?",
    timestamp: "10:40 AM",
    type: "offer",
    offer: 420000,
  },
  {
    id: 6,
    senderId: 1,
    content: "I was hoping to get closer to my asking price. How about LKR 440,000?",
    timestamp: "10:42 AM",
    type: "text",
  },
]

const emojis = ["😀", "😂", "😍", "👍", "👎", "❤️", "🔥", "💯", "🎉", "👏"]

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [offerAmount, setOfferAmount] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("")
    }
  }

  const handleSendOffer = () => {
    if (offerAmount) {
      // Add offer logic here
      setOfferAmount("")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700 h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Messages</h2>
                  <Button variant="ghost" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-12rem)]">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 cursor-pointer hover:bg-gray-700/50 transition-colors border-b border-gray-700 ${
                        selectedConversation.id === conversation.id ? "bg-gray-700/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {conversation.user.online && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm truncate">{conversation.user.name}</h3>
                            <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-400 truncate mb-1">{conversation.lastMessage}</p>
                          <p className="text-xs text-green-400 truncate">{conversation.adTitle}</p>
                        </div>

                        {conversation.unread > 0 && (
                          <Badge className="bg-green-400 text-black text-xs">{conversation.unread}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800 border-gray-700 h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedConversation.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{selectedConversation.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {selectedConversation.user.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedConversation.user.name}</h3>
                      <p className="text-sm text-gray-400">{selectedConversation.adTitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <Separator className="bg-gray-700" />

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 1 ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md ${
                            message.senderId === 1 ? "bg-green-400 text-black" : "bg-gray-700 text-white"
                          } rounded-lg p-3`}
                        >
                          {message.type === "offer" ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-semibold">Price Offer</span>
                              </div>
                              <div className="text-lg font-bold">{formatPrice(message.offer!)}</div>
                              {message.senderId !== 1 && (
                                <div className="flex gap-2 mt-2">
                                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                    Accept
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                    Counter
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p>{message.content}</p>
                          )}
                          <div className={`text-xs mt-1 ${message.senderId === 1 ? "text-black/70" : "text-gray-400"}`}>
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <Smile className="w-4 h-4" />
                  </Button>

                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <DollarSign className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700">
                      <DialogHeader>
                        <DialogTitle>Make an Offer</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          type="number"
                          placeholder="Enter offer amount"
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                          className="bg-gray-700 border-gray-600"
                        />
                        <Button onClick={handleSendOffer} className="w-full bg-green-400 hover:bg-green-500 text-black">
                          Send Offer
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="bg-gray-700 border-gray-600 pr-12"
                    />
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-green-400 hover:bg-green-500 text-black"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="mt-2 p-2 bg-gray-700 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            setNewMessage(newMessage + emoji)
                            setShowEmojiPicker(false)
                          }}
                          className="text-xl hover:bg-gray-600 p-1 rounded"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
