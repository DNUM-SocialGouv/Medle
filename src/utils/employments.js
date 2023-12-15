export const isValid = ({ year, month, hospitalId }) =>
  year && month && hospitalId && /^[0-9]{4}$/.test(year) && /^[0-9]{2}$/.test(month) && /^[0-9]+$/.test(hospitalId)

export const isHospitalValid = ({ hospitalId }) =>
  hospitalId && /^[0-9]+$/.test(hospitalId)


export const isEmployementValid = (etp) => !Number.isNaN(Number.parseFloat(etp)) && Number.parseFloat(etp) >= 0

export const isYearValid = (year) => Number.parseInt(year) >= 2000 && Number.parseInt(year) <= 2050

export const isMonthValid = (month) => Number.parseInt(month) >= 1 && Number.parseInt(month) <= 12
