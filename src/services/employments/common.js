export const isValid = ({ year, month, hospitalId }) =>
  year && month && hospitalId && /^[0-9]{4}$/.test(year) && /^[0-9]{2}$/.test(month) && /^[0-9]+$/.test(hospitalId)
