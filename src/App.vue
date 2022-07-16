<script setup lang="ts">
import { TIME, words } from '~/words'

const level = ref(0)
const pointer = ref(0)

const realWords = computed(() => {
  return words[unref(level)]
})

const currentWord = computed(() => {
  return unref(realWords)[unref(pointer)]
})

const countdown = ref(TIME)

const initialOffset = 133
const nextOffset = 38

const offset = computed(() => {
  return initialOffset - pointer.value * nextOffset
})

let red = 0
let blue = 0
let green = 255
let rotationOffset = -90
const colorAddition = 25.5
const rotationAddition = 9

const quarters = ref<HTMLDivElement[]>([])
const message = ref('Level-0')

const elInput = ref<HTMLInputElement>()
const inputValue = ref('')
const placeholder = ref('Type the text above to begin...')

const score = ref(0)
const highscore = ref(0)

const animation = reactive({
  wheel: true,
  fade: true,
  bounce: false,
})

function handleOnfocus() {
  placeholder.value = ''
}

function handleOnblur() {
  placeholder.value = 'Type the text above to begin...'
}

function setColors() {
  if (green === 255 && red < 255 && blue === 0) {
    red += colorAddition
    rotationOffset += rotationAddition
    for (let i = 1; i < 4; i++) {
      quarters.value[i].style.transform
        = `rotate(${rotationOffset}deg)`
    }
  }
  else if (green > 0 && red === 255 && blue === 0) {
    green -= colorAddition
    rotationOffset += rotationAddition
    for (let i = 2; i < 4; i++) {
      quarters.value[i].style.transform
        = `rotate(${rotationOffset}deg)`
    }
  }
  else if (green === 0 && red === 255 && blue < 255) {
    blue += colorAddition
    rotationOffset += rotationAddition
    for (let i = 3; i < 4; i++) {
      quarters.value[i].style.transform
        = `rotate(${rotationOffset}deg)`
    }
  }
}

function changeLevel(newLevel: number) {
  // reset
  inputValue.value = ''

  animation.wheel = true

  red = blue = 0
  green = 255
  rotationOffset = -90

  level.value = newLevel
  pointer.value = 0
  message.value = `Level-${newLevel}`

  quarters.value.forEach((quater) => {
    const color = `rgb(${red}, ${green}, ${blue})`
    quater.style.borderLeftColor = quater.style.borderTopColor = color
    quater.style.transform = `rotate(${rotationOffset}deg)`
  })
}

function setHighScore() {
  if (score.value > highscore.value)
    highscore.value = score.value

  score.value = 0
}

function handleOninput() {
  if (level.value === 0 && pointer.value === 0 && inputValue.value.length === 1) {
    const timed = setInterval(clockHandler, 1000)
    function clockHandler() {
      if (countdown.value > 0) {
        countdown.value--
        if (countdown.value === 0) {
          elInput.value?.blur()
          message.value = 'Game Over'
          animation.fade = true
          animation.bounce = false
          setTimeout(() => {
            clearInterval(timed)
            changeLevel(0)
            countdown.value = TIME
            setHighScore()
          }, 1000)
        }
      }
    }
  }

  animation.wheel = false

  animation.fade = false
  animation.bounce = false

  if (inputValue.value === currentWord.value) {
    setColors()
    score.value += countdown.value
    if (pointer.value >= 19 && pointer.value !== 29)
      countdown.value = TIME - 1
    else countdown.value = TIME
    if (blue === 255) {
      changeLevel(level.value + 1)
    }
    else {
      pointer.value += 1
      inputValue.value = ''

      animation.bounce = true
      quarters.value.forEach((quater) => {
        const color = `rgb(${red}, ${green}, ${blue})`
        quater.style.borderLeftColor = quater.style.borderTopColor = color
      })
    }
  }
}

function getLetterColor(letter: string, index: number) {
  if (inputValue.value.length <= index)
    return 'text-white'
  return inputValue.value[index] === letter ? 'text-blue' : 'text-red'
}
</script>

<template>
  <div text-center flex flex-col mt12 mr25>
    <div>
      <p class="counthead">
        Countdown
      </p>
      <p class="secs">
        {{ countdown }}
      </p>
    </div>
    <div class="wordlist">
      <div class="arrow" />
      <div class="scrollingwords" :style="{ marginTop: `${offset}px` }">
        <ul list-none>
          <li v-for="item in realWords" :key="item" :class="{ active: item === currentWord }">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div flex flex-col justify-center items-center mt--25>
    <div class="circular">
      <div v-for="index in 4" :key="index" ref="quarters" class="quarters movers" :class="[animation.wheel ? `wheel${index}` : '']" />
      <div class="bouncy" :class="{ fade: animation.fade, bounce: animation.bounce }" />
      <p class="word">
        <span v-for="(letter, index) in [...currentWord]" :key="letter + index" :class="getLetterColor(letter, index)">{{ letter }}</span>
      </p>
    </div>
    <div>
      <input
        ref="elInput"
        v-model="inputValue"
        class="input"
        type="text"
        :placeholder="placeholder"
        spellcheck="false"
        @focus="handleOnfocus"
        @blur="handleOnblur"
        @input="handleOninput"
      >
    </div>
    <div class="message">
      {{ message }}
    </div>
  </div>
  <div text-center>
    <div flex>
      <div mx-25>
        <p class="scorehead">
          Score
        </p>
        <p class="score">
          {{ score }}
        </p>
      </div>
      <div class="hign" cursor-none>
        <p class="highhead">
          Your High Score
        </p>
        <p class="highscore">
          {{ highscore }}
        </p>
      </div>
    </div>
    <footer>
      Author
      <span text="white"><del>Wind</del></span>
    </footer>
  </div>
</template>
