"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, FolderKanban, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DataTable from "@/components/admin/data-table"
import FormModal from "@/components/admin/form-modal"
import BilingualInput from "@/components/admin/bilingual-input"
import { getProjects, createProject, updateProject, deleteProject, toggleProjectActive } from "./actions"

interface Project {
  id: string
  titleAr: string
  titleEn: string
  shortDescriptionAr: string
  shortDescriptionEn: string
  categoryAr: string | null
  categoryEn: string | null
  imageUrl: string
  ctaLabelAr: string
  ctaLabelEn: string
  ctaLink: string | null
  order: number
  isActive: boolean
}

const emptyForm = {
  titleAr: "",
  titleEn: "",
  shortDescriptionAr: "",
  shortDescriptionEn: "",
  categoryAr: "",
  categoryEn: "",
  imageUrl: "",
  ctaLabelAr: "عرض التفاصيل",
  ctaLabelEn: "View Details",
  ctaLink: "",
  order: 0,
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Project | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const data = await getProjects()
    setProjects(data)
  }

  function openCreateModal() {
    setEditingItem(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  function openEditModal(item: Project) {
    setEditingItem(item)
    setForm({
      titleAr: item.titleAr,
      titleEn: item.titleEn,
      shortDescriptionAr: item.shortDescriptionAr,
      shortDescriptionEn: item.shortDescriptionEn,
      categoryAr: item.categoryAr || "",
      categoryEn: item.categoryEn || "",
      imageUrl: item.imageUrl,
      ctaLabelAr: item.ctaLabelAr,
      ctaLabelEn: item.ctaLabelEn,
      ctaLink: item.ctaLink || "",
      order: item.order,
    })
    setIsModalOpen(true)
  }

  async function handleSubmit() {
    setIsLoading(true)
    try {
      if (editingItem) {
        await updateProject(editingItem.id, form)
      } else {
        await createProject(form)
      }
      await loadData()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving project:", error)
    }
    setIsLoading(false)
  }

  async function handleDelete(item: Project) {
    if (confirm(`Are you sure you want to delete "${item.titleEn}"?`)) {
      await deleteProject(item.id)
      await loadData()
    }
  }

  async function handleToggleActive(item: Project) {
    await toggleProjectActive(item.id)
    await loadData()
  }

  const columns = [
    {
      key: "image",
      label: "Image",
      className: "w-20",
      render: (item: Project) =>
        item.imageUrl ? (
          <img src={item.imageUrl || "/placeholder.svg"} alt="" className="w-14 h-10 object-cover rounded-lg" />
        ) : (
          <div className="w-14 h-10 bg-[#f3f4f6] rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-[#9ca3af]" />
          </div>
        ),
    },
    {
      key: "titleAr",
      label: "Title",
      render: (item: Project) => (
        <div>
          <p className="font-medium text-[#1f2b3b]">{item.titleAr}</p>
          <p className="text-xs text-[#9ca3af]">{item.titleEn}</p>
        </div>
      ),
    },
    {
      key: "categoryAr",
      label: "Category",
      render: (item: Project) => (
        <span className="inline-flex px-2 py-1 bg-[#f3f4f6] rounded-lg text-xs text-[#6b7280]">
          {item.categoryAr || item.categoryEn || "-"}
        </span>
      ),
    },
    {
      key: "order",
      label: "Order",
      className: "w-20",
      render: (item: Project) => (
        <span className="inline-flex items-center justify-center w-8 h-8 bg-[#f3f4f6] rounded-lg text-sm font-medium">
          {item.order}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      className: "w-24",
      render: (item: Project) =>
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
          <div className="w-12 h-12 bg-[#7cb798]/10 rounded-xl flex items-center justify-center">
            <FolderKanban className="w-6 h-6 text-[#7cb798]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1f2b3b]">Projects</h1>
            <p className="text-[#6b7280]">{projects.length} projects</p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={openCreateModal} className="bg-[#fe6a52] hover:bg-[#e55a42] text-white rounded-xl gap-2">
            <Plus className="w-5 h-5" />
            Add Project
          </Button>
        </motion.div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={projects}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        isActiveKey="isActive"
      />

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Project" : "Add Project"}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      >
        <div className="space-y-6">
          <BilingualInput
            label="Title"
            nameAr="titleAr"
            nameEn="titleEn"
            valueAr={form.titleAr}
            valueEn={form.titleEn}
            onChangeAr={(v) => setForm({ ...form, titleAr: v })}
            onChangeEn={(v) => setForm({ ...form, titleEn: v })}
            required
          />

          <BilingualInput
            label="Short Description"
            nameAr="shortDescriptionAr"
            nameEn="shortDescriptionEn"
            valueAr={form.shortDescriptionAr}
            valueEn={form.shortDescriptionEn}
            onChangeAr={(v) => setForm({ ...form, shortDescriptionAr: v })}
            onChangeEn={(v) => setForm({ ...form, shortDescriptionEn: v })}
            multiline
            required
          />

          <BilingualInput
            label="Category"
            nameAr="categoryAr"
            nameEn="categoryEn"
            valueAr={form.categoryAr}
            valueEn={form.categoryEn}
            onChangeAr={(v) => setForm({ ...form, categoryAr: v })}
            onChangeEn={(v) => setForm({ ...form, categoryEn: v })}
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151]">
              Image URL <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
              required
            />
          </div>

          <BilingualInput
            label="CTA Button Label"
            nameAr="ctaLabelAr"
            nameEn="ctaLabelEn"
            valueAr={form.ctaLabelAr}
            valueEn={form.ctaLabelEn}
            onChangeAr={(v) => setForm({ ...form, ctaLabelAr: v })}
            onChangeEn={(v) => setForm({ ...form, ctaLabelEn: v })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">CTA Link</Label>
              <Input
                value={form.ctaLink}
                onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                placeholder="https://example.com/project"
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
        </div>
      </FormModal>
    </div>
  )
}
