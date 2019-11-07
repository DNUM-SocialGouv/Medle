export const isEmpty = obj => Object.keys(obj).length === 0 && obj.constructor === Object

export const deleteProperty = (obj, property) => {
   const res = { ...obj }
   delete res[property]
   return res
}
