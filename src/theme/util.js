// usage : invertColor("00FF00") returns FF00FF
export const invertColor = hex => {
  return (Number(`0x1${hex}`) ^ 0xffffff)
    .toString(16)
    .substr(1)
    .toUpperCase()
}
