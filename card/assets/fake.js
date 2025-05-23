const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    totalOnlyOnes: 0,
    totalTime: 290,
    loop: null
}

let onlyOne=0
let dimension=0
let flipped=0

const prepareCards = (items,onlyOne) => {
    const randomPicks = []
    let majors = 0
    if (onlyOne == 1){
        majors = 2
    } else {
        majors = 1
    }

    for (let index = 0; index < items; index++) {
        randomPicks.push(majors)
    }

    const randomIndex = Math.floor(Math.random() * items)
    randomPicks[randomIndex]=onlyOne

    return randomPicks
}

const pickItemRandom = (max) => {
    return Math.floor(Math.random() * max) + 1
}

const pickHeadsTails = () => {
    return Math.floor(Math.random()*2) + 1
}

const generateGame = () => {
    selectors.boardContainer.classList.remove('flipped')
    dimensions = selectors.board.getAttribute('data-dimension')

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }

    const itemId = pickItemRandom(9)
    onlyOne = pickHeadsTails()
    const items = prepareCards((dimensions * dimensions),onlyOne) 

    for (let index = 0; index < (dimensions * dimensions); index++) {
        var elem = document.querySelector('.card-back'+( '00' + index ).slice( -2 ))
        elem.innerText=items[index]
        elem.style.background = 'url(./items/fakes/' + itemId +items[index] + '.png) round';
    }
//    const cards = `
//        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
//            ${items.map(item => `
//                <div class="card">
//                    <div class="card-front"></div>
//                    <div class="card-back${item}">${item}</div>
//                </div>
//            `).join('')}
//       </div>
//    `
//    const parser = new DOMParser().parseFromString(cards, 'text/html')
//    selectors.board.replaceWith(parser.querySelector('.board'))

    startGame()
}

const nextGame = () => {

    const itemId = pickItemRandom(9)
    onlyOne = pickHeadsTails()
    const items = prepareCards((dimensions * dimensions),onlyOne) 

    for (let index = 0; index < (dimensions * dimensions); index++) {
        var elem = document.querySelector('.card-back'+( '00' + index ).slice( -2 ))
        elem.innerText=items[index]
        elem.style.background = 'url(./items/fakes/' + itemId +items[index] + '.png) round';
    }
}

const startGame = () => {
    state.gameStarted = true
    selectors.boardContainer.classList.remove('flipped')
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.add('flipped')
    })
    state.loop = setInterval(() => {
        state.totalTime--
        if (state.totalTime < 0){
            setTimeout(() => {
                selectors.boardContainer.classList.add('flipped')
                selectors.win.innerHTML = `
                    <span class="win-text">
                    Breeeeeeeeeed!<br />
                        You found <span class="highlight">${state.totalOnlyOnes}</span> Only-Ones!
                    </span>
                `
    
                clearInterval(state.loop)
            }, 1000)
            selectors.boardContainer.classList.remove('flipped')
        }
        selectors.moves.innerText = `${state.totalOnlyOnes} Only-Ones`
        currentTime = (state.totalTime+10)/10
        if (currentTime < 0) {currentTime=0}
        selectors.timer.innerText = `Time: ${currentTime} Sec`
    }, 100)
}

const flipBackCards = () => {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('flipped')
    })
    flipped=0
}

const openCards = () => {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('flipped')
    })
}

const flipCard = card => {
    if(flipped==0){
    flipped++
//    if (!state.gameStarted) {
//        startGame()
//    }

        if (card.innerText == onlyOne) {
            card.children[0].style.background='url(./items/fakes/pass.png) round';
            card.classList.remove('flipped')
            state.totalOnlyOnes++
        } else {
            card.children[0].style.background='url(./items/fakes/fail.png) round';
            card.classList.remove('flipped')
        }
        
        setTimeout(() => {
            card.children[0].style.background='';
            flipBackCards()
        }, 1000)
        setTimeout(() => {
            nextGame()
            openCards()
        }, 1500)
    }

}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement
        if (eventTarget.className.includes('card') && eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON') {
            location.reload(true)
        }
    })
}

generateGame()
attachEventListeners()