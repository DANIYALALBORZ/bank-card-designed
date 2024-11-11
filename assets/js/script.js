const cardContainer = document.querySelector('.card-container');
const inputs = document.querySelectorAll('input');

cardContainer.addEventListener('click', () => {
    cardContainer.classList.toggle('flipped');
})

inputs.forEach((input) => {
    input.addEventListener('click', (e) => {
        e.stopPropagation();
    })
})

// -------------------------------------------------------------------------

const cardNumberInput = document.querySelector('.card-number');
const cvv2 = document.getElementById('cvv2');
const year = document.getElementById('year');
const month = document.getElementById('month');
const saveBtn = document.getElementById('save-btn');


cardNumberInput.addEventListener('input', (e) => {
    let cardNumber = e.target.value;

    cardNumber = cardNumber.replace(/[۰-۹]/g, function (d) {
        return String.fromCharCode(d.charCodeAt(0) - 1728);
    });

    // 1. \s means all of the white spaces like tab, space, Enter...
    // 2. /\s/g, '' means to replace whiteSpaces with '';
    cardNumber = cardNumber.replace(/[^0-9۰-۹]/g, '');

    if (cardNumber.length >= 16) {
        cardNumber = cardNumber.slice(0, 16);
        cvv2.focus()
    }

    // (\d{4}) means to match each 4 digits;
    // (?=\d) means 'check if the next character is a digit or not';
    // '$1 ' means after the first capture group "(\d{4})" add a space;
    let formattedCardNumber = cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');

    e.target.value = formattedCardNumber;
})

cvv2.addEventListener('input', () => {
    if (cvv2.value.length > 3) {
        cvv2.value = cvv2.value.slice(0, 4)
        year.focus()
    }
    removeSvCards()
})

year.addEventListener('input', () => {
    if (year.value.length > 1) {
        year.value = year.value.slice(0, 2);
        month.focus()
    }
    removeSvCards()
})

month.addEventListener('input', (e) => {
    if (month.value.length > 1) {
        month.value = month.value.slice(0, 2)
        month.blur();
    }
    removeSvCards()
})



function handleBackspace(input, e, newIndex) {
    if (e.inputType == 'deleteContentBackward' && input.value == '') {
        inputs[newIndex].focus()
    }
}


inputs.forEach((input, index) => {
    if (index >= 1) {
        input.addEventListener('input', (e) => {
            let newIndex = index - 1;
            handleBackspace(input, e, newIndex)
        })
    }
})

// -------------------------------------------------------------------------------
// save card info to local storage

saveBtn.addEventListener('click', () => {
    let cardNumber = cardNumberInput.value;
    let savedCardNumbers = localStorage.getItem('cardNumbers');
    if (cardNumber.length === 19) {

        const cardInfo = {
            cardNumber: cardNumber.replace(/ /g, ''),
            cardYear: year.value,
            cardMonth: month.value.padStart(2, '0'),
        }

        savedCardNumbers ? savedCardNumbers = JSON.parse(savedCardNumbers) : savedCardNumbers = [];

        let cardExist = false;
        savedCardNumbers.forEach(cardNumb => {
            cardExist = cardNumb.cardNumber === cardNumber.replace(/ /g, '') && true;
        })

        if (parseInt(month.value) <= 0 || parseInt(month.value) > 12) {
            alert('ماه انقضاء اشتباه است.')
        } else if (!cardExist) {
            month.value = month.value.padStart(2, '0');
            savedCardNumbers.push(cardInfo);
            localStorage.setItem('cardNumbers', JSON.stringify(savedCardNumbers))
            // location.reload(true);
        } else {
            alert('این کارت قبلا ذخیره شده')
        }

    }
})

// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// show saved card numbers from local storage

cardNumberInput.addEventListener('click', () => {
    let savedCardNumbers = JSON.parse(localStorage.getItem('cardNumbers'));
    console.log(savedCardNumbers);
    if (savedCardNumbers) {
        showSaved(savedCardNumbers);
    }
})

function showSaved(savedCardNumbers) {
    let i = savedCardNumbers.length <= 4 ? 0 : savedCardNumbers.length - 4
    let topPosition = 8;

    removeSvCards()

    for (i; i < savedCardNumbers.length; i++) {
        let container = document.getElementById('card-numbers-container');
        let input = document.createElement('input');
        input.type = 'button';
        console.log(topPosition);
        input.classList = `saved-card-numbers -top-${topPosition}`;
        input.value = savedCardNumbers[i].cardNumber;
        topPosition = topPosition + 8;
        let yearValue = savedCardNumbers[i].cardYear;
        let monthValue = savedCardNumbers[i].cardMonth;
        input.addEventListener('click', (e) => {
            e.stopPropagation();
            cardNumberInput.value = input.value.replace(/(\d{4})(?=\d)/g, '$1 ');
            year.value = yearValue;
            month.value = monthValue;
            removeSvCards()
        })
        container.appendChild(input);
    }

    document.addEventListener('click', (e) => {
        removeSvCards()
    })
}

function removeSvCards() {
    let svCards = document.querySelectorAll('#card-numbers-container>input.saved-card-numbers');
    svCards.forEach(card => {
        card.remove();
    })
}

// -------------------------------------------------------------------------------
