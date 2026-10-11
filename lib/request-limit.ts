const buckets = new Map<string, {count: number; until: number}>()
/** Best-effort per-process protection; resets on restart, never replaces auth. */
export function allowRequest(key: string, limit: number, windowMs: number, now = Date.now()) {
 const bucket = buckets.get(key)
 if (bucket && bucket.until > now) {
  if (bucket.count >= limit) return false
  bucket.count++; return true
 }
 if (buckets.size >= 10000) {
  for (const [k,v] of buckets) if (v.until <= now) buckets.delete(k)
  if (buckets.size >= 10000) return false
 }
 buckets.set(key, {count:1, until:now+windowMs}); return true
}
