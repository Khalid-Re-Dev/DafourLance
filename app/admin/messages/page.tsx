"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Mail, Phone, Clock, Trash2, Eye, EyeOff, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMessages, markAsRead, markAsUnread, deleteMessage, getUnreadCount } from "./actions"
import { formatDistanceToNow } from "date-fns"

interface ContactMessage {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  message: string
  isRead: boolean
  createdAt: Date
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [data, count] = await Promise.all([getMessages(), getUnreadCount()])
    setMessages(data)
    setUnreadCount(count)
  }

  async function handleMarkAsRead(msg: ContactMessage) {
    if (!msg.isRead) {
      await markAsRead(msg.id)
      await loadData()
    }
    setSelectedMessage(msg)
  }

  async function handleToggleRead(msg: ContactMessage) {
    if (msg.isRead) {
      await markAsUnread(msg.id)
    } else {
      await markAsRead(msg.id)
    }
    await loadData()
  }

  async function handleDelete(msg: ContactMessage) {
    if (confirm(`Are you sure you want to delete this message from "${msg.firstName} ${msg.lastName}"?`)) {
      await deleteMessage(msg.id)
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage(null)
      }
      await loadData()
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#6366f1]/10 rounded-xl flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-[#6366f1]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1f2b3b]">Contact Messages</h1>
          <p className="text-[#6b7280]">
            {messages.length} messages · {unreadCount} unread
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
          <div className="p-4 border-b border-[#e5e7eb]">
            <h2 className="font-semibold text-[#1f2b3b]">Inbox</h2>
          </div>
          <div className="divide-y divide-[#f3f4f6] max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-[#9ca3af]">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleMarkAsRead(msg)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-[#f9fafb] ${
                    selectedMessage?.id === msg.id ? "bg-[#fe6a52]/5 border-l-4 border-l-[#fe6a52]" : ""
                  } ${!msg.isRead ? "bg-[#f0f9ff]" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.isRead ? "bg-[#f3f4f6]" : "bg-[#fe6a52]"}`}
                    >
                      <User className={`w-5 h-5 ${msg.isRead ? "text-[#6b7280]" : "text-white"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`font-medium ${msg.isRead ? "text-[#374151]" : "text-[#1f2b3b] font-semibold"}`}
                        >
                          {msg.firstName} {msg.lastName}
                        </span>
                        {!msg.isRead && <span className="w-2 h-2 bg-[#fe6a52] rounded-full" />}
                      </div>
                      <p className="text-sm text-[#6b7280] truncate">{msg.message}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-[#9ca3af]">
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <AnimatePresence mode="wait">
          {selectedMessage ? (
            <motion.div
              key={selectedMessage.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden"
            >
              <div className="p-4 border-b border-[#e5e7eb] flex items-center justify-between">
                <h2 className="font-semibold text-[#1f2b3b]">Message Details</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="h-8 gap-1 text-[#6b7280]"
                  >
                    {selectedMessage.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {selectedMessage.isRead ? "Mark Unread" : "Mark Read"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(selectedMessage)}
                    className="h-8 gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedMessage(null)} className="h-8 p-1">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Sender Info */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#fe6a52]/10 rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-[#fe6a52]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1f2b3b]">
                      {selectedMessage.firstName} {selectedMessage.lastName}
                    </h3>
                    <p className="text-sm text-[#6b7280]">
                      {formatDistanceToNow(new Date(selectedMessage.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-[#f9fafb] rounded-xl">
                    <Mail className="w-4 h-4 text-[#6b7280]" />
                    <span className="text-sm text-[#374151]">{selectedMessage.email}</span>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-2 p-3 bg-[#f9fafb] rounded-xl">
                      <Phone className="w-4 h-4 text-[#6b7280]" />
                      <span className="text-sm text-[#374151]" dir="ltr">
                        {selectedMessage.phone}
                      </span>
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div>
                  <h4 className="text-sm font-medium text-[#6b7280] mb-2">Message</h4>
                  <div className="p-4 bg-[#f9fafb] rounded-xl">
                    <p className="text-[#374151] whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] flex items-center justify-center min-h-[400px]"
            >
              <div className="text-center text-[#9ca3af]">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a message to view details</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
