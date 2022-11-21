let timerName = {}

if (window.localStorage.getItem('times')) {
  timerName = JSON.parse(window.localStorage.getItem('times'))
} else {
  timerName = {
    randori: {
      minutes: 2,
      seconds: 0,
      rounds: 6,
    },
    uchikomi: {
      minutes: 5,
      seconds: 0,
    },
    waterBreak: {
      minutes: 2,
      seconds: 0,
    },
    break: {
      minutes: 0,
      seconds: 30,
    },
  }
}

let currentTime, endTime, differenceTime, remainingTime
let currentMode = 'randori'
let masterMode
let currentRound = 1
let totalRounds = timerName.randori.rounds
document.querySelector('.round').querySelector('.timer-minutes').textContent =
  totalRounds

const adjustTime = {
  add: () => {
    timerName[currentMode]['minutes']++
    displayMin.textContent = `${timerName[currentMode]['minutes']}`.padStart(
      2,
      '0'
    )
    displaySec.textContent = `${timerName[currentMode]['seconds']}`.padStart(
      2,
      '0'
    )
  },
  subtract: () => {
    if (timerName[currentMode]['minutes'] > 0) {
      timerName[currentMode]['minutes']--
      displayMin.textContent = `${timerName[currentMode]['minutes']}`.padStart(
        2,
        '0'
      )
      displaySec.textContent = `${timerName[currentMode]['seconds']}`.padStart(
        2,
        '0'
      )
    } else {
      return
    }
  },
}

let interval
const addTimeBtn = document.querySelector('.fa-plus')
const subTimeBtn = document.querySelector('.fa-minus')
const displayMin = document.getElementById('js-minutes')
const displaySec = document.getElementById('js-seconds')
const startBtn = document.getElementById('js-btn')
const resetBtn = document.getElementById('js-reset-btn')
const progress = document.getElementById('js-progress')
const roundSelect = document.getElementById('round-select')
const modeBtn = document.getElementById('js-mode-buttons')
const settingsBtn = document.querySelector('.fa-gear')
const timerBtn = document.querySelector('.fa-clock')
const saveBtn = document.getElementById('settings-save').querySelector('button')
const closeBtn = document.querySelector('.close-button')

const mainBtn = document.querySelectorAll('.main-button')
mainBtn.forEach((btn) => btn.addEventListener('mousedown', buttonDown))
mainBtn.forEach((btn) => btn.addEventListener('touchstart', buttonDown))
mainBtn.forEach((btn) => btn.addEventListener('mouseup', buttonUp))
mainBtn.forEach((btn) => btn.addEventListener('touchend', buttonUp))

document.querySelector('body').addEventListener('keydown', keyPress)

resetBtn.addEventListener('click', resetTimerCompletely)
modeBtn.addEventListener('click', handleMode)
settingsBtn.addEventListener('click', slideOut)
saveBtn.addEventListener('click', saveSettings)
closeBtn.addEventListener('click', slideOut)

function buttonDown(e) {
  e.target.classList.add('active')
}

function buttonUp(e) {
  e.target.classList.remove('active')
}

startBtn.addEventListener('click', (e) => {
  if (e.target.dataset.action === 'start') startTimer()
  else pauseTimer()
})

function getRemainingTime(endTime) {
  currentTime = Date.parse(new Date())
  differenceTime = +(endTime - currentTime)

  const minutes = Math.floor(differenceTime / 60 / 1000)
  const seconds = Math.floor(differenceTime / 1000) % 60

  return {
    minutes,
    seconds,
  }
}

function startTimer() {
  let minutes = +timerName[currentMode]['minutes'] * 60
  let seconds = +timerName[currentMode]['seconds']

  if (
    timerName[currentMode].minutes === 0 &&
    timerName[currentMode]['seconds'] === 0
  )
    return

  if (differenceTime > 0) endTime = differenceTime + Date.parse(new Date())
  else endTime = (minutes + seconds) * 1000 + Date.parse(new Date())

  getRemainingTime(endTime)

  startBtn.dataset.action = 'pause'
  startBtn.textContent = 'pause'
  startBtn.classList.add('active')

  document.getElementById('round-select-output').textContent = currentRound

  if (currentMode !== 'break') playSound()

  console.log(displaySec.textContent)
  interval = setInterval(() => {
    remainingTime = getRemainingTime(endTime)
    updateClock()

    if (currentMode !== 'break' && differenceTime === 0) endSound()

    if (differenceTime < 0) {
      clearInterval(interval)
      resetTimer()

      switch (currentMode) {
        case 'randori':
          if (currentRound < timerName.randori.rounds) {
            console.log(`current round: ${currentRound}`)
            clearInterval(interval)
            switchMode('break')
            startTimer()
          } else {
            clearInterval(interval)
            currentRound = 1
            document.getElementById('round-select-output').textContent =
              currentRound
          }
          break
        case 'break':
          clearInterval(interval)
          if (masterMode === 'break') return
          else {
            currentRound++
            document.getElementById('round-select-output').textContent =
              currentRound

            switchMode('randori')
            startTimer()
          }
          break
      }
    }
  }, 1000)
}

function pauseTimer() {
  clearInterval(interval)

  startBtn.dataset.action = 'start'
  startBtn.textContent = 'start'
  startBtn.classList.remove('active')
}

function updateClock() {
  const minutes = Math.floor(differenceTime / 60 / 1000)
  const seconds = Math.floor(differenceTime / 1000) % 60

  displayMin.textContent = `${minutes}`.padStart(2, '0')
  displaySec.textContent = `${seconds}`.padStart(2, '0')

  if (displayMin.textContent == 0 && displaySec.textContent == 15) clapSound()

  const total =
    timerName[currentMode]['minutes'] * 60 + timerName[currentMode]['seconds']
  const remaining = remainingTime.minutes * 60 + remainingTime.seconds
  progress.max = total
  progress.value = total - remaining
}

function resetTimer() {
  pauseTimer()
  getRemainingTime(Date.parse(new Date()))

  progress.value = 0

  document.getElementById('round-select-output').textContent = currentRound

  displayMin.textContent = `${timerName[currentMode]['minutes']}`.padStart(
    2,
    '0'
  )
  displaySec.textContent = `${timerName[currentMode]['seconds']}`.padStart(
    2,
    '0'
  )
}

function resetTimerCompletely() {
  currentRound = 1
  resetTimer()
}

function handleMode(event) {
  const modes = event.target.dataset.mode

  if (!modes) return

  masterMode = modes

  switchMode(modes)
  resetTimer()
}

function switchMode(mode) {
  currentMode = mode
  console.log(currentMode)

  displayMin.textContent = `${timerName[currentMode]['minutes']}`.padStart(
    2,
    '0'
  )
  displaySec.textContent = `${timerName[currentMode]['seconds']}`.padStart(
    2,
    '0'
  )

  document.getElementById('round-select-total').textContent =
    timerName.randori.rounds

  document
    .querySelectorAll('button[data-mode]')
    .forEach((e) => e.classList.remove('active'))
  document.querySelector(`[data-mode='${currentMode}']`).classList.add('active')
  document.body.style.backgroundColor = `var(--${currentMode})`
}

const modeButtons = document.querySelectorAll('.mode-button')

modeButtons.forEach((e) => {
  if (e.classList.contains('active')) console.log(`${e.dataset.mode} is active`)
})

const changeTimeBtns = document.querySelectorAll('.change-time')

changeTimeBtns.forEach((x) => x.addEventListener('click', changeTime))

function changeTime(e) {
  let minutes = e.target.parentNode.querySelector('.timer-minutes')
  let seconds = e.target.parentNode.querySelector('.timer-seconds')
  let secondsNum = +seconds.textContent

  switch (e.target.parentNode.className) {
    case 'time':
      if (e.target.textContent === '+') {
        minutes.textContent++
        minutes.textContent = minutes.textContent.padStart(2, '0')
      } else {
        if (minutes.textContent > 0) {
          minutes.textContent--
          minutes.textContent = minutes.textContent.padStart(2, '0')
        } else {
          console.log('no negative time')
        }
      }
      break

    case 'break':
      if (e.target.textContent === '+') {
        secondsNum += 15
        seconds.textContent = secondsNum

        if (seconds.textContent == 60) {
          seconds.textContent = '00'
          minutes.textContent++
          minutes.textContent = minutes.textContent.padStart(2, '0')
        }
      } else {
        if (seconds.textContent > 0) {
          secondsNum -= 15
          seconds.textContent = secondsNum
          seconds.textContent = seconds.textContent.padStart(2, '0')
        } else if (minutes.textContent > 0) {
          minutes.textContent--
          minutes.textContent = minutes.textContent.padStart(2, '0')
          seconds.textContent = 45
        }
      }
      break

    case 'round':
      console.log('round')
      if (e.target.textContent === '+') {
        minutes.textContent++
      } else {
        if (minutes.textContent > 1) {
          minutes.textContent--
        } else {
          console.log('no negative time')
        }
      }
      break

    case 'uchikomi':
      if (e.target.textContent === '+') {
        minutes.textContent++
        minutes.textContent = minutes.textContent.padStart(2, '0')
      } else {
        if (minutes.textContent > 0) {
          minutes.textContent--
          minutes.textContent = minutes.textContent.padStart(2, '0')
        } else {
          console.log('no negative time')
        }
      }
      break

    case 'waterbreak':
      if (e.target.textContent === '+') {
        minutes.textContent++
        minutes.textContent = minutes.textContent.padStart(2, '0')
      } else {
        if (minutes.textContent > 0) {
          minutes.textContent--
          minutes.textContent = minutes.textContent.padStart(2, '0')
        } else {
          console.log('no negative time')
        }
      }
      break

    default:
      console.log('nothing')
  }
}

function saveSettings() {
  console.log('settings saved')
  timerName.randori.minutes = +document
    .querySelector('.time')
    .querySelector('.timer-minutes').textContent
  timerName.randori.rounds = +document
    .querySelector('.round')
    .querySelector('.timer-minutes').textContent
  timerName.break.minutes = +document
    .querySelector('.break')
    .querySelector('.timer-minutes').textContent
  timerName.break.seconds = +document
    .querySelector('.break')
    .querySelector('.timer-seconds').textContent
  timerName.uchikomi.minutes = +document
    .querySelector('.uchikomi')
    .querySelector('.timer-minutes').textContent
  timerName.waterBreak.minutes = +document
    .querySelector('.waterbreak')
    .querySelector('.timer-minutes').textContent

  window.localStorage.setItem('times', JSON.stringify(timerName))

  switchMode(currentMode)
  slideOut()
}

switchMode(currentMode)

function playSound() {
  let audio = new Audio('./sounds/1bell (2).mp3')
  audio.play()
}

function endSound() {
  let audio = new Audio('./sounds/3bell (2).mp3')
  audio.play()
}

function clapSound() {
  let audio = new Audio('./sounds/clapper.mp3')
  audio.play()
}

const html = document.querySelector('body')

html.addEventListener('mousemove', (e) => {
  const timer = html.getAttribute('timer')
  if (timer) {
    clearTimeout(timer)
    html.setAttribute('timer', '')
  }

  const t = setTimeout(() => {
    html.setAttribute('timer', '')
    html.classList.add('hide-cursor')
  }, 1500)
  html.setAttribute('timer', t)

  html.classList.remove('hide-cursor')
})

const buttons = document.querySelectorAll('button')
buttons.forEach((button) => {
  button.addEventListener('mousemove', (e) => {
    const timer = button.getAttribute('timer')
    if (timer) {
      clearTimeout(timer)
      button.setAttribute('timer', '')
    }

    const t = setTimeout(() => {
      button.setAttribute('timer', '')
      button.classList.add('hide-cursor')
    }, 1500)
    button.setAttribute('timer', t)

    button.classList.remove('hide-cursor')
  })
})

function slideOut() {
  document.getElementById('settings').classList.toggle('closed')
}

const fullscreenBtn = document.querySelector('.fullscreen')
fullscreenBtn.addEventListener('click', toggleFullscreen)

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

function keyPress(e) {
  console.log(e.key)

  switch (e.key) {
    case ' ':
      if (startBtn.classList.contains('active')) pauseTimer()
      else startTimer()
      break
    case 'Enter':
      if (document.getElementById('settings').classList.contains('closed'))
        return
      else saveSettings()
      break
    case 'Escape':
      resetTimerCompletely()
      break
  }
}
