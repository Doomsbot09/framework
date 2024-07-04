export const notEmpty = (data: string): boolean => {
  const text = data.replace(/ /g, '')
  if (text !== '') return true
  return false
}
