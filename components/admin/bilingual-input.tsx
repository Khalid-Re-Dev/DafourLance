"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface BilingualInputProps {
  label: string
  nameAr: string
  nameEn: string
  valueAr: string
  valueEn: string
  onChangeAr: (value: string) => void
  onChangeEn: (value: string) => void
  multiline?: boolean
  required?: boolean
  placeholder?: { ar?: string; en?: string }
}

export default function BilingualInput({
  label,
  nameAr,
  nameEn,
  valueAr,
  valueEn,
  onChangeAr,
  onChangeEn,
  multiline = false,
  required = false,
  placeholder,
}: BilingualInputProps) {
  const InputComponent = multiline ? Textarea : Input

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-[#374151]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Arabic */}
        <div className="space-y-1.5">
          <span className="text-xs text-[#9ca3af] flex items-center gap-1">
            <span className="w-5 h-3.5 rounded overflow-hidden inline-block">
              <div className="w-full h-full bg-gradient-to-b from-green-700 via-white to-black" />
            </span>
            Arabic
          </span>
          <InputComponent
            name={nameAr}
            value={valueAr}
            onChange={(e) => onChangeAr(e.target.value)}
            placeholder={placeholder?.ar || `Enter ${label.toLowerCase()} in Arabic`}
            dir="rtl"
            className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
            required={required}
          />
        </div>

        {/* English */}
        <div className="space-y-1.5">
          <span className="text-xs text-[#9ca3af] flex items-center gap-1">
            <span className="w-5 h-3.5 rounded overflow-hidden inline-block">
              <div className="w-full h-full bg-gradient-to-b from-blue-900 via-white to-red-600" />
            </span>
            English
          </span>
          <InputComponent
            name={nameEn}
            value={valueEn}
            onChange={(e) => onChangeEn(e.target.value)}
            placeholder={placeholder?.en || `Enter ${label.toLowerCase()} in English`}
            dir="ltr"
            className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
            required={required}
          />
        </div>
      </div>
    </div>
  )
}
