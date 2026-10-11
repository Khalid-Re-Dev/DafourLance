"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Sparkles, Check } from "lucide-react"
import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DataTable from "@/components/admin/data-table"
import FormModal from "@/components/admin/form-modal"
import BilingualInput from "@/components/admin/bilingual-input"
import { getServices, createService, updateService, deleteService, toggleServiceActive } from "./actions"

const ICON_OPTIONS = [
  "Megaphone", "Palette", "Code2", "BarChart3", "Globe", "GraduationCap",
  "Sparkles", "Rocket", "Cpu", "Cloud", "Database", "Shield",
  "LineChart", "PenTool", "Briefcase", "Headphones", "Search", "Settings2",
  "Smartphone", "Zap", "Target", "Users", "Layers", "Brain",
] as const

function getIconComponent(name: string): LucideIcon {
  return (LucideIcons[name as keyof typeof LucideIcons] as LucideIcon) ?? LucideIcons.Sparkles
}

interface Service {
  id: string
  icon: string
  titleAr: string
  titleEn: string
  descriptionAr: string | null
  descriptionEn: string | null
  order: number
  isActive: boolean
  isFeatured: boolean
}

const emptyForm = {
  icon: "Sparkles",
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  order: 0,
  isActive: true,
  isFeatured: false,
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Service | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const data = await getServices()
    setServices(data)
  }

  function openCreateModal() {
    setEditingItem(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  function openEditModal(item: Service) {
    setEditingItem(item)
    setForm({
      icon: item.icon,
      titleAr: item.titleAr,
      titleEn: item.titleEn,
      descriptionAr: item.descriptionAr || "",
      descriptionEn: item.descriptionEn || "",
      order: item.order,
      isActive: item.isActive,
      isFeatured: item.isFeatured,
    })
    setIsModalOpen(true)
  }

  async function handleSubmit() {
    setIsLoading(true)
    try {
      if (editingItem) {
        await updateService(editingItem.id, form)
      } else {
        await createService(form)
      }
      await loadData()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving service:", error)
    }
    setIsLoading(false)
  }

  async function handleDelete(item: Service) {
    if (confirm(`Are you sure you want to delete "${item.titleEn}"?`)) {
      await deleteService(item.id)
      await loadData()
    }
  }

  async function handleToggleActive(item: Service) {
    await toggleServiceActive(item.id)
    await loadData()
  }

  const columns = [
    {
      key: "icon",
      label: "Icon",
      className: "w-20",
      render: (item: Service) => {
        const Icon = getIconComponent(item.icon)
        return (
          <div className="w-10 h-10 bg-[#fef2ee] rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#fe6a52]" aria-hidden="true" />
          </div>
        )
      },
    },
    {
      key: "titleAr",
      label: "Title",
      render: (item: Service) => (
        <div>
          <p className="font-medium text-[#1f2b3b]">{item.titleAr}</p>
          <p className="text-xs text-[#9ca3af]">{item.titleEn}</p>
        </div>
      ),
    },
    {
      key: "order",
      label: "Order",
      className: "w-20",
      render: (item: Service) => (
        <span className="inline-flex items-center justify-center w-8 h-8 bg-[#f3f4f6] rounded-lg text-sm font-medium">
          {item.order}
        </span>
      ),
    },
    {
      key: "isFeatured",
      label: "Featured",
      className: "w-24",
      render: (item: Service) =>
        item.isFeatured ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fe6a52]/10 text-[#fe6a52] rounded-full text-xs font-medium">
            <Check className="w-3 h-3" /> Yes
          </span>
        ) : (
          <span className="text-[#9ca3af] text-xs">No</span>
        ),
    },
    {
      key: "isActive",
      label: "Status",
      className: "w-24",
      render: (item: Service) =>
        item.isActive ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
            Inactive
          </span>
        ),
    },
  ]

  const SelectedIcon = getIconComponent(form.icon)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#fe6a52]/10 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#fe6a52]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1f2b3b]">Services</h1>
            <p className="text-[#6b7280]">{services.length} services</p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={openCreateModal} className="bg-[#fe6a52] hover:bg-[#e55a42] text-white rounded-xl gap-2">
            <Plus className="w-5 h-5" />
            Add Service
          </Button>
        </motion.div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={services}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        isActiveKey="isActive"
      />

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Service" : "Add Service"}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      >
        <div className="space-y-6">
          {/* Icon Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151]">
              Icon <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#fef2ee] rounded-xl flex items-center justify-center shrink-0">
                <SelectedIcon className="w-6 h-6 text-[#fe6a52]" aria-hidden="true" />
              </div>
              <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
                <SelectTrigger className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {ICON_OPTIONS.map((name) => {
                    const IconComp = getIconComponent(name)
                    return (
                      <SelectItem key={name} value={name}>
                        <span className="flex items-center gap-2">
                          <IconComp className="w-4 h-4" aria-hidden="true" />
                          {name}
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <BilingualInput
            label="Service Title"
            nameAr="titleAr"
            nameEn="titleEn"
            valueAr={form.titleAr}
            valueEn={form.titleEn}
            onChangeAr={(v) => setForm({ ...form, titleAr: v })}
            onChangeEn={(v) => setForm({ ...form, titleEn: v })}
            required
          />

          <BilingualInput
            label="Description"
            nameAr="descriptionAr"
            nameEn="descriptionEn"
            valueAr={form.descriptionAr}
            valueEn={form.descriptionEn}
            onChangeAr={(v) => setForm({ ...form, descriptionAr: v })}
            onChangeEn={(v) => setForm({ ...form, descriptionEn: v })}
            multiline
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">Display Order</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number.parseInt(e.target.value) || 0 })}
                className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">Featured</Label>
              <div className="flex items-center gap-2 h-10">
                <Switch checked={form.isFeatured} onCheckedChange={(v) => setForm({ ...form, isFeatured: v })} />
                <span className="text-sm text-[#6b7280]">{form.isFeatured ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151]">Active</Label>
            <div className="flex items-center gap-2 h-10">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              <span className="text-sm text-[#6b7280]">{form.isActive ? "Active" : "Inactive"}</span>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  )
}
