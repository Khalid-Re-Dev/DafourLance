// Server-only use: preserve arbitrary CMS icon names without shipping the registry.
import * as icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
export default function ServiceIcon({ name }: { name: string }) {
  const candidate = icons[name as keyof typeof icons]
  const Icon = (candidate && (typeof candidate === 'function' || (typeof candidate === 'object' && '$$typeof' in candidate))
    ? candidate : icons.Sparkles) as LucideIcon
  return <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-[#fe6a52] group-hover:text-white transition-colors duration-400" aria-hidden="true" />
}
