const timer = {
    randori: 0,
    uchikomi: 0,
    break: 0,
    waterBreak: 0,
}

let interval

const addTimeBtn = document.querySelector('.fa-plus')
const subTimeBtn = document.querySelector('.fa-minus')
const displayMin = document.getElementById('js-minutes')
const displaySec = document.getElementById('js-seconds')
const startBtn = document.getElementById('js-btn')

const adjustTime = {
    add: () => {
        timer.randori++
        displayMin.textContent = `${timer.randori}`.padStart(2, '0')
    },
    subtract: () => {
        if (timer.randori > 0){
            timer.randori--
            displayMin.textContent = `${timer.randori}`.padStart(2, '0')
        } else {
            return
        }        
    }
}

addTimeBtn.addEventListener('click', adjustTime.add)
subTimeBtn.addEventListener('click', adjustTime.subtract)

const getRemainingTime = (endTime) => {
    const currentTime = Date.parse(new Date())
    const difference = endTime - currentTime

    console.log(difference)

    const minutes = Math.floor(difference / 60 / 1000)
    const seconds = Math.floor(difference / 1000) % 60
    
    return {
        difference,
        minutes,
        seconds,
    }
} 

const startTimer = () => {
    let minutes = +displayMin.textContent * 60
    let seconds = +displaySec.textContent
    let endTime = ((minutes + seconds) * 1000) + Date.parse(new Date())
    
    getRemainingTime(endTime)
}

startBtn.addEventListener('click', startTimer)

const fullscreenBtn = document.getElementById('fullscreen')
fullscreenBtn.addEventListener('click', () => {
    document.documentElement.requestFullscreen().catch((e) => {
        console.log(e)
    })
})
