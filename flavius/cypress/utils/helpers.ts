export const capitalize = (input: string) => {
  if (input.length > 0) {
    const output = input.toLowerCase().split('')
    output[0] = output[0].toUpperCase()
    return output.join('')
  }
  return input
}
