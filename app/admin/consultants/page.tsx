"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Users, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import DataTable from "@/components/admin/data-table"
import FormModal from "@/components/admin/form-modal"
import BilingualInput from "@/components/admin/bilingual-input"
import { getConsultants, createConsultant, updateConsultant, deleteConsultant, toggleConsultantActive } from "./actions"

interface Consultant {
  id: string
  nameAr: string
  nameEn: string
  roleAr: string
  roleEn: string
  descriptionAr: string | null
  descriptionEn: string | null
  imageUrl: string | null
  isFeatured: boolean
  order: number
  isActive: boolean
}

const emptyForm = {
  nameAr: "",
  nameEn: "",
  roleAr: "",
  roleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  imageUrl: "",
  isFeatured: false,
  order: 0,
}

export default function ConsultantsPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Consultant | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const data = await getConsultants()
    setConsultants(data)
  }

  function openCreateModal() {
    setEditingItem(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  function openEditModal(item: Consultant) {
    setEditingItem(item)
    setForm({
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      roleAr: item.roleAr,
      roleEn: item.roleEn,
      descriptionAr: item.descriptionAr || "",
      descriptionEn: item.descriptionEn || "",
      imageUrl: item.imageUrl || "",
      isFeatured: item.isFeatured,
      order: item.order,
    })
    setIsModalOpen(true)
  }

  async function handleSubmit() {
    setIsLoading(true)
    try {
      if (editingItem) {
        await updateConsultant(editingItem.id, form)
      } else {
        await createConsultant(form)
      }
      await loadData()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving consultant:", error)
    }
    setIsLoading(false)
  }

  async function handleDelete(item: Consultant) {
    if (confirm(`Are you sure you want to delete "${item.nameEn}"?`)) {
      await deleteConsultant(item.id)
      await loadData()
    }
  }

  async function handleToggleActive(item: Consultant) {
    await toggleConsultantActive(item.id)
    await loadData()
  }

  const columns = [
    {
      key: "nameAr",
      label: "Name",
      render: (item: Consultant) => (
        <div>
          <p className="font-medium text-[#1f2b3b]">{item.nameAr}</p>
          <p className="text-xs text-[#9ca3af]">{item.nameEn}</p>
        </div>
      ),
    },
    {
      key: "roleAr",
      label: "Role",
      render: (item: Consultant) => (
        <div>
          <p className="text-[#374151]">{item.roleAr}</p>
          <p className="text-xs text-[#9ca3af]">{item.roleEn}</p>
        </div>
      ),
    },
    {
      key: "order",
      label: "Order",
      className: "w-20",
      render: (item: Consultant) => (
        <span className="inline-flex items-center justify-center w-8 h-8 bg-[#f3f4f6] rounded-lg text-sm font-medium">
          {item.order}
        </span>
      ),
    },
    {
      key: "isFeatured",
      label: "Featured",
      className: "w-24",
      render: (item: Consultant) =>
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
      render: (item: Consultant) =>
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#fe6a52]/10 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-[#fe6a52]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1f2b3b]">Consultants</h1>
            <p className="text-[#6b7280]">{consultants.length} consultants</p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={openCreateModal} className="bg-[#fe6a52] hover:bg-[#e55a42] text-white rounded-xl gap-2">
            <Plus className="w-5 h-5" />
            Add Consultant
          </Button>
        </motion.div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={consultants}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        isActiveKey="isActive"
      />

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Consultant" : "Add Consultant"}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      >
        <div className="space-y-6">
          <BilingualInput
            label="Name"
            nameAr="nameAr"
            nameEn="nameEn"
            valueAr={form.nameAr}
            valueEn={form.nameEn}
            onChangeAr={(v) => setForm({ ...form, nameAr: v })}
            onChangeEn={(v) => setForm({ ...form, nameEn: v })}
            required
          />

          <BilingualInput
            label="Role"
            nameAr="roleAr"
            nameEn="roleEn"
            valueAr={form.roleAr}
            valueEn={form.roleEn}
            onChangeAr={(v) => setForm({ ...form, roleAr: v })}
            onChangeEn={(v) => setForm({ ...form, roleEn: v })}
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

          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151]">Image URL</Label>
            <Input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
            />
          </div>

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
        </div>
      </FormModal>
    </div>
  )
}
