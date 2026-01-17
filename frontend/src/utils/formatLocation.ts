export function formatLocationName(item: any): string {
  const address = item.address ?? {}
  const parts: string[] = []

  const road =
    address.road || address.pedestrian || address.footway || address.highway
  if (road) parts.push(road)

  const locality =
    address.village || address.town || address.city || address.hamlet
  if (locality) parts.push(locality)

  return parts.length ? parts.join(', ') : item.display_name || ''
}
