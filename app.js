let timerName = {
    randori: {
        minutes: 0,
        seconds: 0,
    },
    uchikomi: 0,
    break: 0,
    waterBreak: 0,
}

let currentTime, endTime, differenceTime, remainingTime

const adjustTime = {
    add: () => {
        timerName.randori.minutes++
        displayMin.textContent = `${timerName.randori.minutes}`.padStart(2, '0')
    },
    subtract: () => {
        if (timerName.randori.minutes > 0){
            timerName.randori.minutes--
            displayMin.textContent = `${timerName.randori.minutes}`.padStart(2, '0')
        } else {
            return
        }        
    }
}

let interval
const addTimeBtn = document.querySelector('.fa-plus')
const subTimeBtn = document.querySelector('.fa-minus')
const displayMin = document.getElementById('js-minutes')
const displaySec = document.getElementById('js-seconds')
const startBtn = document.getElementById('js-btn')
const resetBtn = document.getElementById('js-reset-btn')
const fullscreenBtn = document.getElementById('fullscreen')
const buttonSound = new Audio("button-sound.mp3");

addTimeBtn.addEventListener('click', adjustTime.add)
subTimeBtn.addEventListener('click', adjustTime.subtract)

fullscreenBtn.addEventListener('click', () => {
    document.documentElement.requestFullscreen().catch((e) => {})
})

startBtn.addEventListener('click', (e) => {
    console.log(e.target)
    if (e.target.dataset.action === 'start') startTimer()
    else pauseTimer()
})

resetBtn.addEventListener('click', resetTimer)

function getRemainingTime(endTime) {
    currentTime = Date.parse(new Date())
    differenceTime = +(endTime - currentTime)

    console.log('times.difference: ' + differenceTime)

    const minutes = Math.floor(differenceTime / 60 / 1000)
    const seconds = Math.floor(differenceTime / 1000) % 60

    return {
        // difference,
        minutes,
        seconds,
    }
} 

function startTimer() {
    let minutes = +timerName.randori.minutes * 60
    let seconds = +timerName.randori.seconds
    let endTime = ((minutes + seconds) * 1000) + Date.parse(new Date())
    console.log('minutes: ' + minutes, 'seconds: ' + seconds)
    console.log('endtime: ' + endTime)
    getRemainingTime(endTime)
    
    // buttonSound.play()

    startBtn.dataset.action = 'pause'
    startBtn.textContent = 'pause'
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
    clearInterval(interval)

    startBtn.dataset.action = 'start'
    startBtn.textContent = 'start'
    startBtn.classList.remove('active')
}

function updateClock() {
    const minutes = Math.floor(differenceTime / 60 / 1000)
    const seconds = Math.floor(differenceTime / 1000) % 60
    // console.log(differenceTime)
    // console.log(minutes)
    // console.log(seconds)

    displayMin.textContent = `${minutes}`.padStart(2, '0')
    displaySec.textContent = `${seconds}`.padStart(2, '0')
}

function resetTimer() {
    pauseTimer()
    getRemainingTime(Date.parse(new Date()))
    // updateClock()

    displayMin.textContent = `${timerName.randori.minutes}`.padStart(2, '0')
    displaySec.textContent = `${timerName.randori.seconds}`.padStart(2, '0')
}
