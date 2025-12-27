"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Handshake, ImageIcon, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DataTable from "@/components/admin/data-table"
import FormModal from "@/components/admin/form-modal"
import BilingualInput from "@/components/admin/bilingual-input"
import { getPartners, createPartner, updatePartner, deletePartner, togglePartnerActive } from "./actions"

interface Partner {
  id: string
  nameAr: string
  nameEn: string
  logoUrl: string
  websiteUrl: string | null
  order: number
  isActive: boolean
}

const emptyForm = {
  nameAr: "",
  nameEn: "",
  logoUrl: "",
  websiteUrl: "",
  order: 0,
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Partner | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const data = await getPartners()
    setPartners(data)
  }

  function openCreateModal() {
    setEditingItem(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  function openEditModal(item: Partner) {
    setEditingItem(item)
    setForm({
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      logoUrl: item.logoUrl,
      websiteUrl: item.websiteUrl || "",
      order: item.order,
    })
    setIsModalOpen(true)
  }

  async function handleSubmit() {
    setIsLoading(true)
    try {
      if (editingItem) {
        await updatePartner(editingItem.id, form)
      } else {
        await createPartner(form)
      }
      await loadData()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving partner:", error)
    }
    setIsLoading(false)
  }

  async function handleDelete(item: Partner) {
    if (confirm(`Are you sure you want to delete "${item.nameEn}"?`)) {
      await deletePartner(item.id)
      await loadData()
    }
  }

  async function handleToggleActive(item: Partner) {
    await togglePartnerActive(item.id)
    await loadData()
  }

  const columns = [
    {
      key: "logo",
      label: "Logo",
      className: "w-20",
      render: (item: Partner) =>
        item.logoUrl ? (
          <img
            src={item.logoUrl || "/placeholder.svg"}
            alt=""
            className="w-12 h-12 object-contain rounded-lg bg-[#f9fafb] p-1"
          />
        ) : (
          <div className="w-12 h-12 bg-[#f3f4f6] rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-[#9ca3af]" />
          </div>
        ),
    },
    {
      key: "nameAr",
      label: "Name",
      render: (item: Partner) => (
        <div>
          <p className="font-medium text-[#1f2b3b]">{item.nameAr}</p>
          <p className="text-xs text-[#9ca3af]">{item.nameEn}</p>
        </div>
      ),
    },
    {
      key: "websiteUrl",
      label: "Website",
      render: (item: Partner) =>
        item.websiteUrl ? (
          <a
            href={item.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#6366f1] hover:underline text-sm"
          >
            <ExternalLink className="w-3 h-3" />
            Link
          </a>
        ) : (
          <span className="text-[#9ca3af] text-sm">-</span>
        ),
    },
    {
      key: "order",
      label: "Order",
      className: "w-20",
      render: (item: Partner) => (
        <span className="inline-flex items-center justify-center w-8 h-8 bg-[#f3f4f6] rounded-lg text-sm font-medium">
          {item.order}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      className: "w-24",
      render: (item: Partner) =>
        item.isActive ? (
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
            Inactive
          </span>
        ),
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#f5c842]/10 rounded-xl flex items-center justify-center">
            <Handshake className="w-6 h-6 text-[#f5c842]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1f2b3b]">Partners</h1>
            <p className="text-[#6b7280]">{partners.length} partners</p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={openCreateModal} className="bg-[#fe6a52] hover:bg-[#e55a42] text-white rounded-xl gap-2">
            <Plus className="w-5 h-5" />
            Add Partner
          </Button>
        </motion.div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={partners}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        isActiveKey="isActive"
      />

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Partner" : "Add Partner"}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      >
        <div className="space-y-6">
          <BilingualInput
            label="Partner Name"
            nameAr="nameAr"
            nameEn="nameEn"
            valueAr={form.nameAr}
            valueEn={form.nameEn}
            onChangeAr={(v) => setForm({ ...form, nameAr: v })}
            onChangeEn={(v) => setForm({ ...form, nameEn: v })}
            required
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151]">
              Logo URL <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151]">Website URL (optional)</Label>
            <Input
              value={form.websiteUrl}
              onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
              placeholder="https://partner-website.com"
              className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151]">Display Order</Label>
            <Input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number.parseInt(e.target.value) || 0 })}
              className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
            />
          </div>
        </div>
      </FormModal>
    </div>
  )
}
