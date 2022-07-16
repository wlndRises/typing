import { chunk, randomSort } from "./helper"

const modules = import.meta.globEager('./modules/*.ts')

const wordModuleList: string[] = []

Object.keys(modules).forEach((key) => {
  const word = modules[key].default
  wordModuleList.push(...word)
})

// 倒计时秒数
export const TIME = 7

export const words = chunk(randomSort(wordModuleList), 30)
