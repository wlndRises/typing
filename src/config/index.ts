// 30个为一组
import defaultWords from './default'
import methods from './methods'
import commit from './commit'
import typescript from './typescript'
import verb from './verb'

// 倒计时秒数
export const TIME = 7

const List = [
  ...defaultWords,
  ...methods,
  ...commit,
  ...typescript,
  ...verb,
]

function chunk(arr: string[], size: number): string[][] {
  const result = []
  for (let i = 0; i < arr.length; i += size)
    result.push(arr.slice(i, i + size))

  return result
}

function randomSort(arr: any[]) {
  return arr.sort(() => Math.random() - 0.5)
}

export const words = randomSort(chunk(randomSort(List), 30))
