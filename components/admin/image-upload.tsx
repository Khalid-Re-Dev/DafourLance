"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, ImageIcon, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  value: string | string[] // يدعم رابط واحد أو مصفوفة روابط
  onChange: (value: string | string[]) => void
  multiple?: boolean
  category?: string
  label?: string
}

export default function ImageUpload({ 
  value, 
  onChange, 
  multiple = false, 
  category = "projects", 
  label = "Image" 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const images = Array.isArray(value) ? value : value ? [value] : []

  async function uploadFile(file: File) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("category", category)

    const response = await fetch("/api/upload", { method: "POST", body: formData })
    if (!response.ok) throw new Error("Upload failed")
    const data = await response.json()
    return data.url
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setIsUploading(true)
    try {
      if (multiple) {
        const uploadPromises = files.map(uploadFile)
        const newUrls = await Promise.all(uploadPromises)
        onChange([...images, ...newUrls])
      } else {
        const url = await uploadFile(files[0])
        onChange(url)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (urlToRemove: string) => {
    if (multiple) {
      onChange(images.filter(url => url !== urlToRemove))
    } else {
      onChange("")
    }
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-[#374151]">{label}</label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatePresence>
          {images.map((url) => (
            <motion.div 
              key={url} 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-video rounded-xl overflow-hidden border border-[#e5e7eb]"
            >
              <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {(multiple || images.length === 0) && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="aspect-video border-2 border-dashed border-[#e5e7eb] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#f9fafb] transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-[#fe6a52] animate-spin" />
            ) : (
              <>
                <Plus className="w-6 h-6 text-[#9ca3af] mb-1" />
                <span className="text-xs text-[#6b7280]">Add Image</span>
              </>
            )}
          </motion.div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}