export const mapForSelect = (data, fnValue, fnLabel) => (!data ? null : { label: fnLabel(data), value: fnValue(data) })

export const mapArrayForSelect = (data, fnValue, fnLabel) =>
  !data?.length ? [] : data.map((curr) => ({ label: fnLabel(curr), value: fnValue(curr) }))
