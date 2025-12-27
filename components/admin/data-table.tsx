"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Edit2, Trash2, MoreVertical, Eye, EyeOff, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[]
  data: T[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onToggleActive?: (item: T) => void
  isActiveKey?: keyof T
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  onToggleActive,
  isActiveKey,
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <th className="w-10 px-4 py-4">
                <GripVertical className="w-4 h-4 text-[#d1d5db]" />
              </th>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn("px-4 py-4 text-left text-sm font-semibold text-[#6b7280]", col.className)}
                >
                  {col.label}
                </th>
              ))}
              <th className="w-20 px-4 py-4 text-right text-sm font-semibold text-[#6b7280]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f4f6]">
            {data.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-[#f9fafb]/50 transition-colors"
              >
                <td className="px-4 py-4">
                  <GripVertical className="w-4 h-4 text-[#d1d5db] cursor-grab" />
                </td>
                {columns.map((col) => (
                  <td key={String(col.key)} className={cn("px-4 py-4 text-sm text-[#374151]", col.className)}>
                    {col.render ? col.render(item) : String(item[col.key as keyof T] ?? "-")}
                  </td>
                ))}
                <td className="px-4 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(item)} className="gap-2">
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onToggleActive && isActiveKey && (
                        <DropdownMenuItem onClick={() => onToggleActive(item)} className="gap-2">
                          {item[isActiveKey] ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(item)}
                            className="gap-2 text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="py-12 text-center text-[#9ca3af]">
          <p>No items found</p>
        </div>
      )}
    </div>
  )
}
