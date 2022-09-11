let timerName = {
    randori: 0,
    uchikomi: 0,
    break: 0,
    waterBreak: 0,
}

let currentTime, endTime, differenceTime, remainingTime

const adjustTime = {
    add: () => {
        timerName.randori++
        displayMin.textContent = `${timerName.randori}`.padStart(2, '0')
    },
    subtract: () => {
        if (timerName.randori > 0){
            timerName.randori--
            displayMin.textContent = `${timerName.randori}`.padStart(2, '0')
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

// startBtn.addEventListener('click', startTimer)

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
    let minutes = +displayMin.textContent * 60
    let seconds = +displaySec.textContent
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

    // currentTime = 0
    // endTime = 0
    // differenceTime = 0
    // remainingTime = 0

    // displayMin.textContent = 00
    // displaySec.textContent = 00
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