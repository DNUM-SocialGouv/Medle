export const isEmpty = obj =>
   !obj ||
   (Object.keys(obj).length === 0 && obj.constructor === Object) ||
   (obj.constructor === Array && obj.length === 0)

export const deleteProperty = (obj, property) => {
   const res = { ...obj }
   delete res[property]
   return res
}

export const capitalize = str => {
   if (!str || !str.length) return ""

   return str[0].toUpperCase() + str.slice(1)
}
