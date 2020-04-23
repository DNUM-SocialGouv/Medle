export const mapForSelect = (data, fnValue, fnLabel) => {
   if (!data) return null
   return { value: fnValue(data), label: fnLabel(data) }
}

export const mapArrayForSelect = (data, fnValue, fnLabel) => {
   if (!data || !data.length) return null
   return data.map(curr => ({ value: fnValue(curr), label: fnLabel(curr) }))
}
