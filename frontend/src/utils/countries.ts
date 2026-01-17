import joypixels from 'emoji-toolkit'

export function getCountryName(countryCode: string): string {
  const regionNames = new Intl.DisplayNames('en', { type: 'region' })
  return regionNames.of(countryCode) || 'Unknown'
}

export function getCountryEmoji(countryCode: string): string {
  if (!countryCode) return ''
  const shortname = `:flag_${countryCode.toLowerCase()}:`
  return joypixels.shortnameToImage(shortname)
}
