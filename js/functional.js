"use strict"

const patternGeoName = /^[ა-ჰ]+$/u;
const patternGeo = /^[ა-ჰ\s]+$/;

const patternEmail = /^[a-zA-Z0-9._%+-]+@redberry\.ge$/;
const patternNumber = /^(\+995\s?5|5)\s?(\d{3}\s?){2}\d{2}$/; 


function checkTextValidity(input){
    if(input.name.includes('name') || input.name.includes('surname')){
        if (! patternGeoName.test(input.value) || input.value.length < 2) {
            displayInvalidInput(input);
            showError(input);
        }else{
            displayValidInput(input);
            hideError(input);
            return true;
        }
    }else{
        if(!patternGeo.test(input.value) || input.value.length < 2){   
            displayInvalidInput(input);
            showError(input);
        }else{
            displayValidInput(input);
            hideError(input);
            return true;
        }
    }
}

function checkEmailValidity(input){
    if(!patternEmail.test(input.value)){
        displayInvalidInput(input);
        showError(input);
    }else{
        displayValidInput(input);
        hideError(input);
        return true;
    }
}

function checkNumberValidity(input){
    if(!patternNumber.test(input.value.trim())){
        displayInvalidInput(input);
        showError(input);
    }else{
        displayValidInput(input);
        hideError(input);
        return true;
    }
}

function checkDateValidity(input){
    if(input.value !== "") {
        displayValidInput(input);
        return isValidDate(input.value);
    }else{
        displayInvalidInput(input);
        return false;
    }
}

function isValidDate(dateString) {
    let date = new Date(dateString);
    return !isNaN(date.getTime());
}

function checkTextarea(textarea){
    if(textarea.getAttribute('data-mandatory') == 'true'){
        if(patternGeo.test(textarea.value) && textarea.value.trim().length > 2){
            displayValidInput(textarea);
            return true;
        }else{
            displayInvalidInput(textarea);
            return false;
        }
    }
}


function checkSelect(select){
    if(select.value !== "default"){
        displayValidInput(select);
        return true;
    }else{
        displayInvalidInput(select);
    }

}

function showError(input) {
    const parent = input.parentElement;
    const error = parent.querySelector('.error');
    error.style.display = 'inline';
}
function hideError(input){
    const parent = input.parentElement;
    parent.querySelector('.error').style.display = 'none';
}

function displayInvalidInput(input){
    input.classList.forEach(className=>{
        input.classList.remove(className);
    });
    input.classList.add('invalid');
}
function displayValidInput(input){
    input.classList.forEach(className=>{
        input.classList.remove(className);
    });
    input.classList.add('valid')
}



export {
    displayInvalidInput, displayValidInput, hideError, showError, 
    checkDateValidity, checkSelect, checkTextValidity, checkEmailValidity,
    checkTextarea, checkNumberValidity, patternEmail, patternGeo, patternNumber, patternGeoName
}