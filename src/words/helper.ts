export function chunk(arr: string[], size: number): string[][] {
  const result = []
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size))

  return result
}

export function randomSort(arr: any[]) {
  return arr.sort(() => Math.random() - 0.5)
}
