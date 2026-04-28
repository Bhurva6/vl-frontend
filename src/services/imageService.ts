const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export async function fetchPresignedUrl(imageId: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/api/presigned-url?key=${encodeURIComponent(imageId)}`)
    if (!res.ok) return null
    const data = (await res.json()) as { url?: string }
    return data.url ?? null
  } catch {
    return null
  }
}
