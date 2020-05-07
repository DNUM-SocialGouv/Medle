export const mapForSelect = (data, fnValue, fnLabel) => (!data ? null : { value: fnValue(data), label: fnLabel(data) })

export const mapArrayForSelect = (data, fnValue, fnLabel) =>
  !data?.length ? null : data.map((curr) => ({ value: fnValue(curr), label: fnLabel(curr) }))
