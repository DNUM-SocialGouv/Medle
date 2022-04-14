export const isETPValid = (etp) => !Number.isNaN(Number.parseFloat(etp)) && Number.parseFloat(etp) >= 0
