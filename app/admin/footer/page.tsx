"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FootprintsIcon,
  Save,
  Phone,
  Mail,
  MessageCircle,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  Globe,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import BilingualInput from "@/components/admin/bilingual-input"
import { getFooterConfig, updateFooterConfig } from "./actions"

interface FooterConfig {
  id: string
  phone: string | null
  phone2: string | null
  email: string | null
  whatsapp: string | null
  addressAr: string | null
  addressEn: string | null
  linkedinUrl: string | null
  twitterUrl: string | null
  youtubeUrl: string | null
  instagramUrl: string | null
  facebookUrl: string | null
  descriptionAr: string | null
  descriptionEn: string | null
  copyrightAr: string | null
  copyrightEn: string | null
}

const emptyForm = {
  phone: "",
  phone2: "",
  email: "",
  whatsapp: "",
  addressAr: "",
  addressEn: "",
  linkedinUrl: "",
  twitterUrl: "",
  youtubeUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  descriptionAr: "",
  descriptionEn: "",
  copyrightAr: "",
  copyrightEn: "",
}

export default function FooterManagementPage() {
  const [form, setForm] = useState(emptyForm)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const config = await getFooterConfig()
    if (config) {
      setForm({
        phone: config.phone || "",
        phone2: config.phone2 || "",
        email: config.email || "",
        whatsapp: config.whatsapp || "",
        addressAr: config.addressAr || "",
        addressEn: config.addressEn || "",
        linkedinUrl: config.linkedinUrl || "",
        twitterUrl: config.twitterUrl || "",
        youtubeUrl: config.youtubeUrl || "",
        instagramUrl: config.instagramUrl || "",
        facebookUrl: config.facebookUrl || "",
        descriptionAr: config.descriptionAr || "",
        descriptionEn: config.descriptionEn || "",
        copyrightAr: config.copyrightAr || "",
        copyrightEn: config.copyrightEn || "",
      })
    }
  }

  async function handleSubmit() {
    setIsLoading(true)
    try {
      await updateFooterConfig(form)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (error) {
      console.error("Error saving footer config:", error)
    }
    setIsLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#1f2b3b]/10 rounded-xl flex items-center justify-center">
            <FootprintsIcon className="w-6 h-6 text-[#1f2b3b]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1f2b3b]">Footer Management</h1>
            <p className="text-[#6b7280]">Configure footer content and social links</p>
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

      {/* Contact Information Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[#e5e7eb]">
          <Phone className="w-5 h-5 text-[#fe6a52]" />
          <h2 className="text-lg font-semibold text-[#1f2b3b]">Contact Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151]">Primary Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+967 777000000"
              className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151]">Secondary Phone</Label>
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
        />
      </div>

      {/* Social Media Links Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[#e5e7eb]">
          <Globe className="w-5 h-5 text-[#fe6a52]" />
          <h2 className="text-lg font-semibold text-[#1f2b3b]">Social Media Links</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151] flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-[#0077b5]" /> LinkedIn
            </Label>
            <Input
              value={form.linkedinUrl}
              onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/company/..."
              className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151] flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X (Twitter)
            </Label>
            <Input
              value={form.twitterUrl}
              onChange={(e) => setForm({ ...form, twitterUrl: e.target.value })}
              placeholder="https://x.com/..."
              className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151] flex items-center gap-2">
              <Youtube className="w-4 h-4 text-[#ff0000]" /> YouTube
            </Label>
            <Input
              value={form.youtubeUrl}
              onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              placeholder="https://youtube.com/@..."
              className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151] flex items-center gap-2">
              <Instagram className="w-4 h-4 text-[#e4405f]" /> Instagram
            </Label>
            <Input
              value={form.instagramUrl}
              onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
              placeholder="https://instagram.com/..."
              className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#374151] flex items-center gap-2">
            <Facebook className="w-4 h-4 text-[#1877f2]" /> Facebook
          </Label>
          <Input
            value={form.facebookUrl}
            onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
            placeholder="https://facebook.com/..."
            className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
          />
        </div>
      </div>

      {/* Footer Text Content Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[#e5e7eb]">
          <FileText className="w-5 h-5 text-[#fe6a52]" />
          <h2 className="text-lg font-semibold text-[#1f2b3b]">Footer Text Content</h2>
        </div>

        <BilingualInput
          label="Footer Description"
          nameAr="descriptionAr"
          nameEn="descriptionEn"
          valueAr={form.descriptionAr}
          valueEn={form.descriptionEn}
          onChangeAr={(v) => setForm({ ...form, descriptionAr: v })}
          onChangeEn={(v) => setForm({ ...form, descriptionEn: v })}
          multiline
        />

        <BilingualInput
          label="Copyright Text"
          nameAr="copyrightAr"
          nameEn="copyrightEn"
          valueAr={form.copyrightAr}
          valueEn={form.copyrightEn}
          onChangeAr={(v) => setForm({ ...form, copyrightAr: v })}
          onChangeEn={(v) => setForm({ ...form, copyrightEn: v })}
        />
      </div>
    </div>
  )
}
