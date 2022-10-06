let timerName = {
  randori: {
    minutes: 0,
    seconds: 2,
    rounds: 2,
  },
  uchikomi: {
    minutes: 0,
    seconds: 0,
  },
  waterBreak: {
    minutes: 2,
    seconds: 0,
  },
  break: {
    minutes: 0,
    seconds: 3,
  },
}

let screenResolution = {
  width: 0,
  height: 0,
}

function getScreenResolution() {
  screenResolution.width = window.innerWidth
  screenResolution.height = window.innerHeight

  document.querySelector('body').style.height = `${screenResolution.height}px`

  console.log(screenResolution)

  const main = document.querySelectorAll('main')
  main.forEach((x) => (x.style.height = `${screenResolution.height}px`))
  main.forEach((x) => (x.style.width = `${screenResolution.width}px`))

  console.log(main[0].style.height)
}

window.onload = getScreenResolution
window.addEventListener('resize', getScreenResolution)

let currentTime, endTime, differenceTime, remainingTime
let currentMode = 'randori'
let masterMode
let currentRound = 1

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
// const buttonSound = new Audio('button-sound.mp3')
const roundSelect = document.getElementById('round-select')
const modeBtn = document.getElementById('js-mode-buttons')
const settingsBtn = document.querySelector('.fa-gear')
const timerBtn = document.querySelector('.fa-clock')

// addTimeBtn.addEventListener('click', adjustTime.add)
// subTimeBtn.addEventListener('click', adjustTime.subtract)
resetBtn.addEventListener('click', resetTimer)
resetBtn.addEventListener('mousedown', buttonDown)
resetBtn.addEventListener('touchstart', buttonDown)
resetBtn.addEventListener('mouseup', buttonUp)
resetBtn.addEventListener('touchend', buttonUp)
modeBtn.addEventListener('click', handleMode)
settingsBtn.addEventListener('click', scrollToSetting)
timerBtn.addEventListener('click', scrollToTimer)
// fullscreenBtn.addEventListener('click', fullscreenChange)

function buttonDown(e) {
  e.target.classList.add('active')
}

function buttonUp(e) {
  e.target.classList.remove('active')
}

function fullscreenChange() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}

startBtn.addEventListener('click', (e) => {
  if (e.target.dataset.action === 'start') startTimer()
  else pauseTimer()
})

// roundSelect.addEventListener('click', (e) => {
//   timerName.randori.rounds = +roundSelect.value
// })

function getRemainingTime(endTime) {
  currentTime = Date.parse(new Date())
  differenceTime = +(endTime - currentTime)

  const minutes = Math.floor(differenceTime / 60 / 1000)
  const seconds = Math.floor(differenceTime / 1000) % 60

  return {
    // difference,
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

  // buttonSound.play()

  startBtn.dataset.action = 'pause'
  startBtn.textContent = 'pause'
  startBtn.classList.add('active')

  document.getElementById('round-select-output').textContent = currentRound

  interval = setInterval(() => {
    remainingTime = getRemainingTime(endTime)
    updateClock()

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

  // if (currentRound === timerName.randori.rounds) currentRound = 1

  // document.getElementById('round-select-output').textContent = currentRound

  progress.value = 0

  displayMin.textContent = `${timerName[currentMode]['minutes']}`.padStart(
    2,
    '0'
  )
  displaySec.textContent = `${timerName[currentMode]['seconds']}`.padStart(
    2,
    '0'
  )
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

setTimeout(scrollToTimer, 1500)
