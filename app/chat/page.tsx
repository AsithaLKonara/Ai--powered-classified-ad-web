"use client"

import { ChatInterface } from "@/components/chat/chat-interface"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        <div className="h-[calc(100vh-16rem)]">
          <ChatInterface />
        </div>
      </main>
      <Footer />
    </div>
  )
}
