"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Phone, Save, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import BilingualInput from "@/components/admin/bilingual-input"
import { getContactInfo, updateContactInfo } from "./actions"

const emptyForm = {
  phone: "",
  phone2: "",
  email: "",
  whatsapp: "",
  addressAr: "",
  addressEn: "",
  titleAr: "",
  titleEn: "",
  subtitleAr: "",
  subtitleEn: "",
}

export default function ContactInfoPage() {
  const [form, setForm] = useState(emptyForm)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const config = await getContactInfo()
    if (config) {
      setForm({
        phone: config.phone || "",
        phone2: config.phone2 || "",
        email: config.email || "",
        whatsapp: config.whatsapp || "",
        addressAr: config.addressAr || "",
        addressEn: config.addressEn || "",
        titleAr: config.titleAr || "",
        titleEn: config.titleEn || "",
        subtitleAr: config.subtitleAr || "",
        subtitleEn: config.subtitleEn || "",
      })
    }
  }

  async function handleSubmit() {
    setIsLoading(true)
    try {
      await updateContactInfo(form)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (error) {
      console.error("Error saving contact info:", error)
    }
    setIsLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#fe6a52]/10 rounded-xl flex items-center justify-center">
            <Phone className="w-6 h-6 text-[#fe6a52]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1f2b3b]">Contact Information</h1>
            <p className="text-[#6b7280]">Manage contact details for the Contact Us section</p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`rounded-xl gap-2 ${isSaved ? "bg-green-600 hover:bg-green-700" : "bg-[#fe6a52] hover:bg-[#e55a42]"} text-white`}
          >
            <Save className="w-5 h-5" />
            {isLoading ? "Saving..." : isSaved ? "Saved!" : "Save Changes"}
          </Button>
        </motion.div>
      </div>

      {/* Section Title */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6 space-y-6">
        <h2 className="text-lg font-semibold text-[#1f2b3b] pb-4 border-b border-[#e5e7eb]">Section Title</h2>

        <BilingualInput
          label="Section Title"
          nameAr="titleAr"
          nameEn="titleEn"
          valueAr={form.titleAr}
          valueEn={form.titleEn}
          onChangeAr={(v) => setForm({ ...form, titleAr: v })}
          onChangeEn={(v) => setForm({ ...form, titleEn: v })}
        />

        <BilingualInput
          label="Subtitle"
          nameAr="subtitleAr"
          nameEn="subtitleEn"
          valueAr={form.subtitleAr}
          valueEn={form.subtitleEn}
          onChangeAr={(v) => setForm({ ...form, subtitleAr: v })}
          onChangeEn={(v) => setForm({ ...form, subtitleEn: v })}
        />
      </div>

      {/* Contact Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6 space-y-6">
        <h2 className="text-lg font-semibold text-[#1f2b3b] pb-4 border-b border-[#e5e7eb]">Contact Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151] flex items-center gap-2">
              <Phone className="w-4 h-4" /> Primary Phone
            </Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+967 777000000"
              className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151] flex items-center gap-2">
              <Phone className="w-4 h-4" /> Secondary Phone
            </Label>
            <Input
              value={form.phone2}
              onChange={(e) => setForm({ ...form, phone2: e.target.value })}
              placeholder="+967 777000000"
              className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151] flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Address
            </Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@email.com"
              className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151] flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> WhatsApp Number
            </Label>
            <Input
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              placeholder="+967 777000000"
              className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
            />
          </div>
        </div>

        <BilingualInput
          label="Physical Address"
          nameAr="addressAr"
          nameEn="addressEn"
          valueAr={form.addressAr}
          valueEn={form.addressEn}
          onChangeAr={(v) => setForm({ ...form, addressAr: v })}
          onChangeEn={(v) => setForm({ ...form, addressEn: v })}
          multiline
        />
      </div>
    </div>
  )
}
