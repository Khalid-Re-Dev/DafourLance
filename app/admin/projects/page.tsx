"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, FolderKanban, ImageIcon, LayoutGrid, List, Search, Filter, MoreHorizontal, ExternalLink, Eye, EyeOff, Trash2, Edit2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import DataTable from "@/components/admin/data-table"
import FormModal from "@/components/admin/form-modal"
import BilingualInput from "@/components/admin/bilingual-input"
import ImageUpload from "@/components/admin/image-upload"
import { getProjects, createProject, updateProject, deleteProject, toggleProjectActive } from "./actions"

// الواجهة المحدثة لتشمل الحقول الجديدة
interface Project {
  id: string
  titleAr: string
  titleEn: string
  shortDescriptionAr: string
  shortDescriptionEn: string
  fullDescriptionAr: string | null // ✨ جديد
  fullDescriptionEn: string | null // ✨ جديد
  categoryAr: string | null
  categoryEn: string | null
  imageUrl: string
  galleryImages: string | null // ✨ جديد (JSON)
  ctaLabelAr: string
  ctaLabelEn: string
  ctaLink: string | null
  order: number
  isActive: boolean
  createdAt: Date
}

const emptyForm = {
  titleAr: "",
  titleEn: "",
  shortDescriptionAr: "",
  shortDescriptionEn: "",
  fullDescriptionAr: "", // ✨ جديد
  fullDescriptionEn: "", // ✨ جديد
  categoryAr: "",
  categoryEn: "",
  imageUrl: "",
  galleryImages: "[]", // ✨ جديد
  ctaLabelAr: "عرض التفاصيل",
  ctaLabelEn: "View Details",
  ctaLink: "",
  order: 0,
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingItem, setEditingItem] = useState<Project | null>(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    const data = await getProjects()
    setProjects(data as Project[])
  }

  const handleEdit = (project: Project) => {
    setEditingItem(project)
    setForm({
      ...project,
      fullDescriptionAr: project.fullDescriptionAr || "",
      fullDescriptionEn: project.fullDescriptionEn || "",
      galleryImages: project.galleryImages || "[]",
      categoryAr: project.categoryAr || "",
      categoryEn: project.categoryEn || "",
      ctaLink: project.ctaLink || "",
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      if (editingItem) {
        await updateProject(editingItem.id, form)
      } else {
        await createProject(form)
      }
      setIsModalOpen(false)
      setForm(emptyForm)
      setEditingItem(null)
      loadProjects()
    } catch (error) {
      console.error("خطأ أثناء الحفظ:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      {/* الرأس (Header) - كما في ملفك الأصلي مع الحفاظ على التنسيق العالي */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#fe6a52]/10 rounded-2xl">
            <FolderKanban className="w-8 h-8 text-[#fe6a52]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1f2b3b]">إدارة المشاريع</h1>
            <p className="text-[#6b7280] text-sm mt-1">قم بإدارة معرض أعمالك وتفاصيل المشاريع هنا</p>
          </div>
        </div>
        <Button 
          onClick={() => { setEditingItem(null); setForm(emptyForm); setIsModalOpen(true); }}
          className="bg-[#fe6a52] hover:bg-[#e55a42] text-white rounded-xl px-6 py-6 h-auto text-lg font-medium shadow-lg shadow-[#fe6a52]/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2"
        >
          <Plus className="w-5 h-5" /> إضافة مشروع جديد
        </Button>
      </div>

      {/* الجدول الرئيسي */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
        <DataTable
          data={projects}
          columns={[
            { 
              key: "titleAr", 
              label: "المشروع",
              render: (item: Project) => (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#e5e7eb] flex-shrink-0">
                    <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-[#1f2b3b]">{item.titleAr}</span>
                    <span className="text-xs text-[#9ca3af]">{item.categoryAr || 'بدون فئة'}</span>
                  </div>
                </div>
              )
            },
            { key: "order", label: "الترتيب" },
            {
                key: "isActive",
                label: "الحالة",
                render: (item: Project) => (
                  <Badge className={item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                    {item.isActive ? "نشط" : "معطل"}
                  </Badge>
                )
            }
          ]}
          onEdit={handleEdit}
          onDelete={async (item) => { if(confirm('هل أنت متأكد؟')) { await deleteProject(item.id); loadProjects(); } }}
          onToggleActive={async (item) => { await toggleProjectActive(item.id); loadProjects(); }}
          isActiveKey="isActive"
        />
      </div>

      {/* النافذة المنبثقة (Modal) - مدمجة مع الحقول المتقدمة */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "تعديل بيانات المشروع" : "إنشاء مشروع احترافي جديد"}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      >
        <div className="space-y-8 py-4">
          {/* النصوص الأساسية */}
          <BilingualInput
            label="عنوان المشروع"
            nameAr="titleAr"
            nameEn="titleEn"
            valueAr={form.titleAr}
            valueEn={form.titleEn}
            onChangeAr={(v) => setForm({ ...form, titleAr: v })}
            onChangeEn={(v) => setForm({ ...form, titleEn: v })}
            required
          />

          <BilingualInput
            label="الوصف المختصر (يظهر في القائمة)"
            nameAr="shortDescriptionAr"
            nameEn="shortDescriptionEn"
            valueAr={form.shortDescriptionAr}
            valueEn={form.shortDescriptionEn}
            onChangeAr={(v) => setForm({ ...form, shortDescriptionAr: v })}
            onChangeEn={(v) => setForm({ ...form, shortDescriptionEn: v })}
            multiline
            required
          />

          {/* ✨ الحقول الجديدة للوصف الكامل */}
          <BilingualInput
            label="وصف المشروع التفصيلي (داخل صفحة المشروع)"
            nameAr="fullDescriptionAr"
            nameEn="fullDescriptionEn"
            valueAr={form.fullDescriptionAr}
            valueEn={form.fullDescriptionEn}
            onChangeAr={(v) => setForm({ ...form, fullDescriptionAr: v })}
            onChangeEn={(v) => setForm({ ...form, fullDescriptionEn: v })}
            multiline
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUpload
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url as string })}
              label="الصورة الرئيسية (الغلاف)"
              category="covers"
            />

            {/* ✨ معرض الصور المحدث */}
            <ImageUpload
              value={JSON.parse(form.galleryImages || "[]")}
              onChange={(urls) => setForm({ ...form, galleryImages: JSON.stringify(urls) })}
              label="معرض صور المشروع (Grid)"
              multiple
              category="galleries"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">رابط المشروع الخارجي</Label>
              <Input 
                value={form.ctaLink} 
                onChange={(e) => setForm({...form, ctaLink: e.target.value})}
                placeholder="https://..."
                className="rounded-xl border-[#e5e7eb] focus:ring-[#fe6a52]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">ترتيب الظهور</Label>
              <Input 
                type="number"
                value={form.order} 
                onChange={(e) => setForm({...form, order: Number(e.target.value)})}
                className="rounded-xl border-[#e5e7eb] focus:ring-[#fe6a52]"
              />
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  )
}