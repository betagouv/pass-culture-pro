export const FORMAT_DD_MM_YYYY_HH_mm = 'DD/MM/YYYY HH:mm'
export const FORMAT_DD_MM_YYYY = 'DD/MM/YYYY'
export const FORMAT_HH_mm = 'HH:mm'

export const formatDateYYYYMMDD = (date) => {
  return date.toLocaleDateString("fr-CA", {year: "numeric", month: "2-digit", day: "2-digit"})
}
