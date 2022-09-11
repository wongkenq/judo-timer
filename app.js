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
addTimeBtn.addEventListener('click', adjustTime.add)
subTimeBtn.addEventListener('click', adjustTime.subtract)
const displayMin = document.getElementById('js-minutes')
const displaySec = document.getElementById('js-seconds')
const startBtn = document.getElementById('js-btn')
startBtn.addEventListener('click', startTimer)
const fullscreenBtn = document.getElementById('fullscreen')

fullscreenBtn.addEventListener('click', () => {
    document.documentElement.requestFullscreen().catch((e) => {
        console.log(e)
    })
})

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
    
    interval = setInterval(() => {
        remainingTime = getRemainingTime(endTime)
        updateClock()

        if(differenceTime <= 0){
            clearInterval(interval)
        }
    }, 1000);
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