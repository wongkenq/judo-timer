let timerName = {
  randori: {
    minutes: 0,
    seconds: 2,
    rounds: 6,
  },
  uchikomi: {
    minutes: 5,
    seconds: 0,
  },
  waterBreak: {
    minutes: 0,
    seconds: 2,
  },
  break: {
    minutes: 0,
    seconds: 5,
  },
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
const fullscreenBtn = document.getElementById('fullscreen')
const progress = document.getElementById('js-progress')
const roundSelect = document.getElementById('round-select')
const modeBtn = document.getElementById('js-mode-buttons')
const settingsBtn = document.querySelector('.fa-gear')
const timerBtn = document.querySelector('.fa-clock')
const saveBtn = document.getElementById('settings-save').querySelector('button')

const mainBtn = document.querySelectorAll('.main-button')
mainBtn.forEach((btn) => btn.addEventListener('mousedown', buttonDown))
mainBtn.forEach((btn) => btn.addEventListener('touchstart', buttonDown))
mainBtn.forEach((btn) => btn.addEventListener('mouseup', buttonUp))
mainBtn.forEach((btn) => btn.addEventListener('touchend', buttonUp))

resetBtn.addEventListener('click', resetTimerCompletely)
modeBtn.addEventListener('click', handleMode)
settingsBtn.addEventListener('click', scrollToSetting)
timerBtn.addEventListener('click', scrollToTimer)
saveBtn.addEventListener('click', saveSettings)

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

  if (currentMode !== 'break') playSound()

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

function scrollToTimer() {
  let timer = document.querySelector('.app')
  timer.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
  document.querySelector('.fa-clock').style.color = 'white'
  document.querySelector('.fa-gear').style.color = 'black'
}

function scrollToSetting() {
  let setting = document.getElementById('settings')
  setting.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'start',
  })
  document.querySelector('.fa-clock').style.color = 'black'
  document.querySelector('.fa-gear').style.color = 'white'
}

setTimeout(scrollToTimer, 500)

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
        secondsNum += 30
        seconds.textContent = secondsNum

        if (secondsNum === 60) {
          minutes.textContent++
          minutes.textContent = minutes.textContent.padStart(2, '0')
          secondsNum = 0
          seconds.textContent = '00'
        }
      } else {
        if (minutes.textContent > 0 || seconds.textContent > 0) {
          if (seconds.textContent == 30) {
            secondsNum = 0
            seconds.textContent = '00'
          } else {
            secondsNum = 30
            seconds.textContent = '30'
            minutes.textContent--
            minutes.textContent = minutes.textContent.padStart(2, '0')
          }
        } else {
          console.log('no negative time')
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

  switchMode(currentMode)
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
