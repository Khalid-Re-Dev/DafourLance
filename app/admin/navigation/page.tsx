"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Navigation, ExternalLink, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import DataTable from "@/components/admin/data-table"
import FormModal from "@/components/admin/form-modal"
import BilingualInput from "@/components/admin/bilingual-input"
import { getNavItems, createNavItem, updateNavItem, deleteNavItem, toggleNavItemVisible } from "./actions"

interface NavItem {
  id: string
  labelAr: string
  labelEn: string
  href: string
  order: number
  isVisible: boolean
  isExternal: boolean
}

const emptyForm = {
  labelAr: "",
  labelEn: "",
  href: "",
  order: 0,
  isVisible: true,
  isExternal: false,
}

export default function NavigationPage() {
  const [navItems, setNavItems] = useState<NavItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<NavItem | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const data = await getNavItems()
    setNavItems(data)
  }

  function openCreateModal() {
    setEditingItem(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  function openEditModal(item: NavItem) {
    setEditingItem(item)
    setForm({
      labelAr: item.labelAr,
      labelEn: item.labelEn,
      href: item.href,
      order: item.order,
      isVisible: item.isVisible,
      isExternal: item.isExternal,
    })
    setIsModalOpen(true)
  }

  async function handleSubmit() {
    setIsLoading(true)
    try {
      if (editingItem) {
        await updateNavItem(editingItem.id, form)
      } else {
        await createNavItem(form)
      }
      await loadData()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving nav item:", error)
    }
    setIsLoading(false)
  }

  async function handleDelete(item: NavItem) {
    if (confirm(`Are you sure you want to delete "${item.labelEn}"?`)) {
      await deleteNavItem(item.id)
      await loadData()
    }
  }

  async function handleToggleVisible(item: NavItem) {
    await toggleNavItemVisible(item.id)
    await loadData()
  }

  const columns = [
    {
      key: "labelAr",
      label: "Label",
      render: (item: NavItem) => (
        <div>
          <p className="font-medium text-[#1f2b3b]">{item.labelAr}</p>
          <p className="text-xs text-[#9ca3af]">{item.labelEn}</p>
        </div>
      ),
    },
    {
      key: "href",
      label: "Link",
      render: (item: NavItem) => (
        <div className="flex items-center gap-1">
          <code className="px-2 py-1 bg-[#f3f4f6] rounded text-xs text-[#6b7280]">{item.href}</code>
          {item.isExternal && <ExternalLink className="w-3 h-3 text-[#9ca3af]" />}
        </div>
      ),
    },
    {
      key: "order",
      label: "Order",
      className: "w-20",
      render: (item: NavItem) => (
        <span className="inline-flex items-center justify-center w-8 h-8 bg-[#f3f4f6] rounded-lg text-sm font-medium">
          {item.order}
        </span>
      ),
    },
    {
      key: "isExternal",
      label: "External",
      className: "w-24",
      render: (item: NavItem) =>
        item.isExternal ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <Check className="w-3 h-3" /> Yes
          </span>
        ) : (
          <span className="text-[#9ca3af] text-xs">No</span>
        ),
    },
    {
      key: "isVisible",
      label: "Visible",
      className: "w-24",
      render: (item: NavItem) =>
        item.isVisible ? (
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Visible
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
            Hidden
          </span>
        ),
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#6366f1]/10 rounded-xl flex items-center justify-center">
            <Navigation className="w-6 h-6 text-[#6366f1]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1f2b3b]">Navigation</h1>
            <p className="text-[#6b7280]">{navItems.length} menu items</p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={openCreateModal} className="bg-[#fe6a52] hover:bg-[#e55a42] text-white rounded-xl gap-2">
            <Plus className="w-5 h-5" />
            Add Nav Item
          </Button>
        </motion.div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={navItems}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onToggleActive={handleToggleVisible}
        isActiveKey="isVisible"
      />

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Nav Item" : "Add Nav Item"}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      >
        <div className="space-y-6">
          <BilingualInput
            label="Label"
            nameAr="labelAr"
            nameEn="labelEn"
            valueAr={form.labelAr}
            valueEn={form.labelEn}
            onChangeAr={(v) => setForm({ ...form, labelAr: v })}
            onChangeEn={(v) => setForm({ ...form, labelEn: v })}
            required
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#374151]">
              Link (href) <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.href}
              onChange={(e) => setForm({ ...form, href: e.target.value })}
              placeholder="#about, /blog, https://external.com"
              className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
              required
            />
            <p className="text-xs text-[#9ca3af]">
              Use # for anchor links, / for internal pages, or full URL for external
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
              <Label className="text-sm font-medium text-[#374151]">Visible</Label>
              <div className="flex items-center gap-2 h-10">
                <Switch checked={form.isVisible} onCheckedChange={(v) => setForm({ ...form, isVisible: v })} />
                <span className="text-sm text-[#6b7280]">{form.isVisible ? "Yes" : "No"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">External Link</Label>
              <div className="flex items-center gap-2 h-10">
                <Switch checked={form.isExternal} onCheckedChange={(v) => setForm({ ...form, isExternal: v })} />
                <span className="text-sm text-[#6b7280]">{form.isExternal ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  )
}
