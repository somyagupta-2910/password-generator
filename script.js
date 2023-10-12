// Fetch all the HTML Elements
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// Initially the Password is empty
let password = "";
// Initially the password length is 10
let passwordLength = 10;
// Initally the only Upper case checkbox is selected
let checkCount = 0;

handleSlider();

//set strength circle color to grey
setIndicator("#ccc");

// Function to control slider and set Password length
function handleSlider(){
    // set default values for the slider and the length Display
    inputSlider.value = passwordLength;
    lengthDisplay.textContent = passwordLength;

    // Filling color based on the slider position
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

// sets color of the circle based on password strength
function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;    
}

// generate random integer function
function getRndInteger(min, max){
    // An integer value between min and max
    return Math.floor(Math.random() * (max-min)) + min;
}

// generate random number between 0-9
function generateRandomNumber(){
    return getRndInteger(0,9);
}

// generate random lowercase letter
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

// generate random uppercase letter
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

// generate random uppercase letter
function generateSymbol(){
    // get random integer from 0 to string's length and return a character from the symbols array
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// calculate strength of password and set the indicator accordingly
function calcStrength(){
    // intialize the four checkbox corresponding variables
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    // check if the respective checkbox has been checked and change the value accordingly
    if(uppercaseCheck.checked){
        hasUpper = true;
    }
    if(lowercaseCheck.checked){
        hasLower = true;
    }
    if(numbersCheck.checked){
        hasNum = true;
    }
    if(symbolsCheck.checked){
        hasSym = true;
    }

    //  Based on different conditions set the indicator
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
            setIndicator("#ff0")
    }
    else{
        setIndicator("#f00");
    }
}

// Function to copy the content to clipboard using clipboard API.
// It returns a promise.
// We need to use aysnc and await
async function copyContent(){
    // We use the navigator.clipboard.writeText to copy to clipbpard
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        // Display in the span tag, that text was successfully copied
        copyMsg.textContent = "Copied";
    }
    catch(e){
        copyMsg.textContent = "Failed";
    }

    // Make the Span visbile when copy is clicked
    copyMsg.classList.add("active"); // active class is created in the CSS file

    // We set a timeout that will remove the Copied text after some time
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// counting the number of checkboxes are ticked
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })

    // special condition for password length
    if(passwordLength < checkCount){
        // if the assword length is less than the check boxes selected count, then we will make the password length same as the checkCount
        passwordLength = checkCount;
        // call; the handleslider function for updating the slider length and t
        handleSlider();
    }
}

// Check if all checkboxes are checked or not
// Looping through each checkbox and listen to the event and modify the count accordingly
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// Event Listner for Slider
inputSlider.addEventListener('input', (e) => {
    // access the value of the slider and update the password length
    passwordLength = e.target.value;
    // call the handleslider function with the updated passwordLegnth value
    handleSlider();
})

// Event Listner for copy button
copyBtn.addEventListener('click', ()=>{
    // When the password field is non-empty, we can call the copyContent function and enable copying of password
    if(passwordDisplay.value){
        copyContent();
    }
})

// Shuffling the Passwords
function shufflePassword(array){
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// Event Listener for Generate Password Button
generateBtn.addEventListener('click', ()=>{
    // if no checkbox is selected, then we will not generate password
    if(checkCount == 0){
        return;
    }
    // update password length if it is less than number of checks
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    // remove old generated password
    password = "";

    // adding into password based on the checked entities
    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // add into the password, the array's value
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }

    // add remaining number of characters 
    for(let i=0; i<passwordLength - funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle the password so that there is ni pattern
    password = shufflePassword(Array.from(password));

    // Show the password in the field
    passwordDisplay.value = password;
    
    // Calculate Strength
    calcStrength();
});