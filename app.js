let timerName = {
    randori: {
        minutes: 0,
        seconds: 0,
        rounds: 0,
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
        seconds: 30,
    },
}

let currentTime, endTime, differenceTime, remainingTime
let currentMode = 'randori'

const adjustTime = {
    add: () => {
        timerName[currentMode]['minutes']++
        displayMin.textContent = `${timerName[currentMode]['minutes']}`.padStart(2, '0')
        displaySec.textContent = `${timerName[currentMode]['seconds']}`.padStart(2, '0')
    },
    subtract: () => {
        if (timerName[currentMode]['minutes'] > 0){
            timerName[currentMode]['minutes']--
            displayMin.textContent = `${timerName[currentMode]['minutes']}`.padStart(2, '0')
            displaySec.textContent = `${timerName[currentMode]['seconds']}`.padStart(2, '0')
        } else {
            return
        }        
    }
}

let interval
// let timerState
const addTimeBtn = document.querySelector('.fa-plus')
const subTimeBtn = document.querySelector('.fa-minus')
const displayMin = document.getElementById('js-minutes')
const displaySec = document.getElementById('js-seconds')
const startBtn = document.getElementById('js-btn')
const resetBtn = document.getElementById('js-reset-btn')
const fullscreenBtn = document.getElementById('fullscreen')
const progress = document.getElementById("js-progress")
const buttonSound = new Audio("button-sound.mp3");

addTimeBtn.addEventListener('click', adjustTime.add)
subTimeBtn.addEventListener('click', adjustTime.subtract)
resetBtn.addEventListener('click', resetTimer)
resetBtn.addEventListener('mousedown', buttonDown)
resetBtn.addEventListener('touchstart', buttonDown)
resetBtn.addEventListener('mouseup', buttonUp)
resetBtn.addEventListener('touchend', buttonUp)
fullscreenBtn.addEventListener('click', fullscreenChange)

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

function startTimer(currentMode) {
    // timerState = 'start'
    const mode = currentMode
    let minutes = +timerName.mode.minutes * 60
    let seconds = +timerName.mode.seconds
    
    // let endTime = ((minutes + seconds) * 1000) + Date.parse(new Date())

    if (timerName.randori.minutes === 0 && timerName.randori.seconds === 0) return

    if (differenceTime > 0) endTime = differenceTime + Date.parse(new Date())
    else endTime = ((minutes + seconds) * 1000) + Date.parse(new Date())

    getRemainingTime(endTime)
    
    // buttonSound.play()
    
    startBtn.dataset.action = 'pause'
    startBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'
    startBtn.classList.add('active')
    
    interval = setInterval(() => {
        remainingTime = getRemainingTime(endTime)
        updateClock()
        
        if(differenceTime <= 0){
            pauseTimer()
        }
    }, 1000);
}

function pauseTimer() {
    // timerState = 'pause'
    clearInterval(interval)

    startBtn.dataset.action = 'start'
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i>'
    startBtn.classList.remove('active')
}

function updateClock() {
    const minutes = Math.floor(differenceTime / 60 / 1000)
    const seconds = Math.floor(differenceTime / 1000) % 60

    displayMin.textContent = `${minutes}`.padStart(2, '0')
    displaySec.textContent = `${seconds}`.padStart(2, '0')

    const total = timerName.randori.minutes * 60
    const remaining = remainingTime.minutes * 60 + remainingTime.seconds
    progress.max = total
    progress.value = total - remaining
}

function resetTimer() {
    // timerState = 'stop'
    pauseTimer()
    getRemainingTime(Date.parse(new Date()))

    progress.value = 0
    // displayMin.textContent = `${timerName.randori.minutes}`.padStart(2, '0')
    // displaySec.textContent = `${timerName.randori.seconds}`.padStart(2, '0')
    
    displayMin.textContent = `${timerName[currentMode]['minutes']}`.padStart(2, '0')
    displaySec.textContent = `${timerName[currentMode]['seconds']}`.padStart(2, '0')
}

const modeBtn = document.getElementById('js-mode-buttons')
modeBtn.addEventListener('click', handleMode)

function handleMode(event) {
    const modes = event.target.dataset.mode

    if (!modes) return

    switchMode(modes)
    resetTimer()
}

function switchMode(mode){
    currentMode = mode
    console.log(currentMode)

    displayMin.textContent = `${timerName[currentMode]['minutes']}`.padStart(2, '0')
    displaySec.textContent = `${timerName[currentMode]['seconds']}`.padStart(2, '0')

    document
        .querySelectorAll('button[data-mode]')
        .forEach((e) => e.classList.remove('active'))
    document.querySelector(`[data-mode='${currentMode}']`).classList.add('active')
    document.body.style.backgroundColor = `var(--${currentMode})`
}

const modeButtons = document.querySelectorAll('.mode-button')
modeButtons.forEach(e => {
    // console.log(e)
    // console.log(e.classList.contains('active'))
    if(e.classList.contains('active')) console.log(`${e.dataset.mode} is active`)
})