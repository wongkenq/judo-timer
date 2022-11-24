// declare empty obj
let timerName = {}

// checks to see if user has saved settings previously. if so. loads the settings.
// if not, loads default settings
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

// if user clicks outside of the menu, it will close the menu
document.querySelector('.timer').addEventListener('click', () => {
  if (!document.getElementById('settings').classList.contains('closed')) {
    slideOut()
  }
})

// declaring various variables
let currentTime, endTime, differenceTime, remainingTime
let currentMode = 'randori'
let masterMode
let currentRound = 1
let totalRounds = timerName.randori.rounds
document.querySelector('.round').querySelector('.timer-minutes').textContent =
  totalRounds
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

// declaring obj with methods to add and subtract time
const adjustTime = {
  add: () => {
    // adds 1 minute to the current mode each time method is called
    // immediately displays changes on the screen, adds initial 0 if num < 10
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
    // subtracts 1 minute to the current mode each time method is called
    // immediately displays changes on the screen, adds initial 0 if num < 10
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

// adds event listener to each button for clicking and touch
mainBtn.forEach((btn) => btn.addEventListener('mousedown', buttonDown))
mainBtn.forEach((btn) => btn.addEventListener('touchstart', buttonDown))
mainBtn.forEach((btn) => btn.addEventListener('mouseup', buttonUp))
mainBtn.forEach((btn) => btn.addEventListener('touchend', buttonUp))
document.addEventListener('keydown', keyPress)
resetBtn.addEventListener('click', resetTimerCompletely)
modeBtn.addEventListener('click', handleMode)
settingsBtn.addEventListener('click', slideOut)
saveBtn.addEventListener('click', saveSettings)
closeBtn.addEventListener('click', slideOut)

// adds class of 'active' to the clicked button
function buttonDown(e) {
  e.target.classList.add('active')
}

function buttonUp(e) {
  e.target.classList.remove('active')
}

// starts timer if 'start' button is clicked
startBtn.addEventListener('click', (e) => {
  if (e.target.dataset.action === 'start') startTimer()
  else pauseTimer()
})

// gets remaining time by using Date method to get current time and compares it
// to the declared end time
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
  // declares variables from timerName of the current mode
  let minutes = +timerName[currentMode]['minutes'] * 60
  let seconds = +timerName[currentMode]['seconds']

  // if time displayed is 0, terminate function
  if (
    timerName[currentMode].minutes === 0 &&
    timerName[currentMode]['seconds'] === 0
  )
    return

  if (differenceTime > 0) endTime = differenceTime + Date.parse(new Date())
  else endTime = (minutes + seconds) * 1000 + Date.parse(new Date())

  getRemainingTime(endTime)

  // changes dataset and text of start button to 'pause'. adds 'active' class
  startBtn.dataset.action = 'pause'
  startBtn.textContent = 'pause'
  startBtn.classList.add('active')

  document.getElementById('round-select-output').textContent = currentRound

  // plays starting bell sound when starting timer that's not 'break'
  if (currentMode !== 'break') playSound()

  // console.log(displaySec.textContent)

  // runs function very 1 second
  interval = setInterval(() => {
    // gets how much time is remaining, and updates the display
    remainingTime = getRemainingTime(endTime)
    updateClock()

    // plays ending bell sound when time is 0, and not 'break' mode
    if (currentMode !== 'break' && differenceTime === 0) endSound()

    // stops the function from running again if time reaches 0 and resets timer
    if (differenceTime < 0) {
      clearInterval(interval)
      resetTimer()

      // checks which is the current mode
      switch (currentMode) {
        case 'randori':
          // checks if there's more rounds. stops function. switches mode to 'break'
          // starts timer
          if (currentRound < timerName.randori.rounds) {
            // console.log(`current round: ${currentRound}`)
            clearInterval(interval)
            switchMode('break')
            startTimer()
          } else {
            // if there's no more rounds, stops timer, sets current round back to 1 and updates display
            clearInterval(interval)
            currentRound = 1
            document.getElementById('round-select-output').textContent =
              currentRound
          }
          break
        case 'break':
          // stops timer and checks if the manually chosen mode is 'break'
          // if break is chosen automatically by the function, it will move on
          // to the next round, if there are any.
          // otherwise, it will stop at the end of the break timer
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

// pauses timer, and resumes with the current amount of time left.
function pauseTimer() {
  clearInterval(interval)

  // sets 'pause' button to 'start'
  startBtn.dataset.action = 'start'
  startBtn.textContent = 'start'
  startBtn.classList.remove('active')
}

// updates display
function updateClock() {
  // takes the current time left and calculates it into minutes and seconds
  const minutes = Math.floor(differenceTime / 60 / 1000)
  const seconds = Math.floor(differenceTime / 1000) % 60

  // updates display with the calculated values
  // also pads the beginning of the number with a leading 0, if it's < 10
  displayMin.textContent = `${minutes}`.padStart(2, '0')
  displaySec.textContent = `${seconds}`.padStart(2, '0')

  // plays 15 second warning sound
  if (displayMin.textContent == 0 && displaySec.textContent == 15) clapSound()

  // calculates total and remaining times. then sets progress bar max value to total
  // and updates it's progress with remaining time left.
  const total =
    timerName[currentMode]['minutes'] * 60 + timerName[currentMode]['seconds']
  const remaining = remainingTime.minutes * 60 + remainingTime.seconds
  progress.max = total
  progress.value = total - remaining
}

// stops timer. resets remaining time. resets progress bar. sets display to 00:00
// used when auto switching between rounds.
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

// function to completely reset timer.
// used when manually stopping.
function resetTimerCompletely() {
  currentRound = 1
  resetTimer()
}

// function figures out which mode is manually chosen and which is automatically switched to
function handleMode(event) {
  const modes = event.target.dataset.mode

  if (!modes) return

  masterMode = modes

  switchMode(modes)
  // resetTimer()
}

// swiches mode
function switchMode(mode) {
  currentMode = mode
  // console.log(currentMode)
  resetTimer()

  // updates display to chosen mode
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

  // updates data-mode selector
  document
    .querySelectorAll('button[data-mode]')
    .forEach((selector) => selector.classList.remove('active'))
  document.querySelector(`[data-mode='${currentMode}']`).classList.add('active')
  document.body.style.backgroundColor = `var(--${currentMode})`
}

// const modeButtons = document.querySelectorAll('.mode-button')

// modeButtons.forEach((e) => {
//   if (e.classList.contains('active')) console.log(`${e.dataset.mode} is active`)
// })

// function for adjusting times in the menu
const changeTimeBtns = document.querySelectorAll('.change-time')
changeTimeBtns.forEach((x) => x.addEventListener('click', changeTime))

// updates the dom to reflect changes live
function changeTime(e) {
  let minutes = e.target.parentNode.querySelector('.timer-minutes')
  let seconds = e.target.parentNode.querySelector('.timer-seconds')
  let secondsNum = +seconds.textContent

  // adds and subtracts times from targeted buttons
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

// saves the user selected times to memory and localstorage. then closes menu.
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

// switchMode(currentMode)

// plays various sounds
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

// hides cursor when idle
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

// open menu
function slideOut() {
  document.getElementById('settings').classList.toggle('closed')
}

const fullscreenBtn = document.querySelector('.fullscreen')
fullscreenBtn.addEventListener('click', toggleFullscreen)

// toggle fullscreen
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// listens to key presses to start timer or change timer mode
function keyPress(e) {
  // set active element back to 'body' because when active element is a button,
  // functions that use key presses don't work
  document.activeElement.blur()

  switch (e.code) {
    case 'Space':
      if (startBtn.dataset.action === 'start') startTimer()
      else pauseTimer()
      break
    case 'Enter':
      if (document.getElementById('settings').classList.contains('closed'))
        return
      else saveSettings()
      break
    case 'Escape':
      if (document.getElementById('settings').classList.contains('closed'))
        return
      else slideOut()
      break
    case 'KeyR':
      switchMode('randori')
      break
    case 'KeyU':
      switchMode('uchikomi')
      break
    case 'KeyW':
      switchMode('waterBreak')
      break
    case 'KeyB':
      switchMode('break')
      break
  }
}
