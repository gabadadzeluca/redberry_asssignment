"use strict";

let currentForm = 1;
const patternGeo = /^[ა-ჰ]+$/;
const patterEmail = /^[a-zA-Z0-9._%+-]+@redberry\.ge$/;
const patternNumber = /^(\+995\s?5|5)\s?(\d{3}\s?){2}\d{2}$/;

const formPrivate = document.querySelector('.form-private');
// const textInputs = document.querySelectorAll('input[type="text"]');
// const emailInput = document.getElementById('email');
// const numberInput = document.getElementById('mobile');

formPrivate.addEventListener('input', function(event){
    
    formPrivate.querySelectorAll('input').forEach(input=>{
        if(input.type == 'text'){
            checkTextValidity(input);
        }else if(input.type == 'tel'){
            checkNumberValidity(input);
        }else if(input.type == 'email'){
            checkEmailValidity(input);
        }else if(input.type == 'file'){
            const file = input.files[0];
            if(file) saveImage(file);
        }
    });
});

// test
document.getElementById('test').src = JSON.parse(localStorage.getItem('imageData')).image;
document.getElementById('test').style.width = '10rem';


function saveImage(file){
    const reader = new FileReader();
    reader.addEventListener('load', ()=>{
        const imageData = {
            image: reader.result
        };
        try{
            hideError(document.querySelector('label[for="user-image"]'))
            localStorage.setItem('imageData', JSON.stringify(imageData));
        }catch(err){
            console.log('image too large');
            showError(document.querySelector('label[for="user-image"]'));
        }
    });
    reader.readAsDataURL(file);
}

//display input
// function displayUserInput(){
//     let data = JSON.parse(localStorage.getItem('form-one-data'));
//     formPrivate.querySelectorAll('input').forEach(input=>{
//         formPrivate.querySelector(`#${input.id}`).innerText = data[input.id];
//     });
// }

function checkTextValidity(input){
    if (! patternGeo.test(input.value) || input.value.length < 2) {
        displayInvalidInput(input);
        showError(input);
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
        return true;
    }
}

function checkNumberValidity(input){
    if(!patternNumber.test(input.value)){
        displayInvalidInput(input);
        showError(input);
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
