/**
 * Transform an object into an array of objects (of shape {name, value}).
 * Filter with the labels if provided, and possibility to rename the property if the label is
 * in the shape of {valueToUse: valueToDisplay}.
 */
export const objToArray = (obj, labels = []) => {
  if (!obj) return []

  if (!labels?.length) return Object.keys(obj).map((property) => ({ name: property, value: obj[property] || 0 }))

  return labels
    .map((label) => {
      switch (typeof label) {
        case "string":
          return {
            name: label,
            value: obj[label],
          }
        case "object": {
          // Assert there is only one key in label object
          const [key] = Object.keys(label)

          return {
            name: label[key],
            value: obj[key],
          }
        }
        default:
          return { value: undefined }
      }
    })
    .filter((item) => !!item.value)
}

export function castArrayInMap({ array, propAsKey }) {
  return array.reduce((acc, curr) => {
    return { [curr[propAsKey]]: curr, ...acc }
  }, {})
}
