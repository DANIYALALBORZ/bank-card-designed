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
    cvv2.value.length >= 4 && year.focus()
})

year.addEventListener('input', () => {
    year.value.length >= 2 && month.focus()
})

month.addEventListener('input', (e) => {
    if (month.value.length >= 2) {
        month.blur();
    }
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

        savedCardNumbers ? savedCardNumbers = JSON.parse(savedCardNumbers) : savedCardNumbers = [];

        if (!savedCardNumbers.includes(cardNumber)) {
            savedCardNumbers.push(cardNumber);

            localStorage.setItem('cardNumbers', JSON.stringify(savedCardNumbers))

            console.log('حله');
        } else {
            console.log('این کارت قبلا ذخیره شده')
        }

    }
})

// -------------------------------------------------------------------------------