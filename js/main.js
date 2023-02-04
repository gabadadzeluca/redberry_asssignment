"use strict";

let currentForm = 1;
const patternGeo = /^[ა-ჰ]+$/;
const patterEmail = /^[a-zA-Z0-9._%+-]+@redberry\.ge$/;
const patternNumber = /^(\+995\s?5|5)\s?(\d{3}\s?){2}\d{2}$/;

const formPrivate = document.querySelector('.form-private');
const textInputs = document.querySelectorAll('input[type="text"]');
const emailInput = document.getElementById('email');
const numberInput = document.getElementById('mobile');

formPrivate.addEventListener('input', function(event){
    textInputs.forEach(input=>{
        checkTextValidity(input);
    });
    checkEmailValidity(emailInput);
    checkNumberValidity(numberInput);
});




function checkTextValidity(input){
    if (! patternGeo.test(input.value) || input.value.length < 2) {
        displayInvalidInput(input);
        showError(input);
        return false;
    }else{
        displayValidInput(input);
        hideError(input);
        return true;
    }
}

function checkEmailValidity(input){
    if(!patterEmail.test(input.value)){
        displayInvalidInput(input);
        showError(input);
    }else{
        displayValidInput(input);
        hideError(input);
    }
}

function checkNumberValidity(input){
    if(!patternNumber.test(input.value)){
        displayInvalidInput(input);
        showError(input);
    }else{
        displayValidInput(input);
        hideError(input);
    }
}

function showError(input) {
    const parent = input.parentElement;
    const error = parent.querySelector('p');
    error.style.display = 'inline';
}
function hideError(input){
    const parent = input.parentElement;
    parent.querySelector('p').style.display = 'none';
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

// image upload
const inputFile = document.querySelector('#user-image');
inputFile.addEventListener('change', function(event) {
  const reader = new FileReader();
    // reader.onload = function() { // upload img
        // previewImage.src = reader.result
    // }
    reader.readAsDataURL(event.target.files[0]);
});
