"use strict";

let currentForm = 1;
const patternGeo = /^[ა-ჰ]+$/;


const textInputs = document.querySelectorAll('input[type="text"]');

document.querySelector('.form-private').addEventListener('input', function(event){
    textInputs.forEach(input=>{
        checkTextValidity(input);
    });
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
