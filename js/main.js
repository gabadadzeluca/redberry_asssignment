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

    const file = document.querySelector('input[type="file"]').files[0];
    if(file) saveImage(file);
    let textsValid = Array.from(textInputs).every(input=>{
        return checkTextValidity(input);
    });
    let emailValid = checkEmailValidity(emailInput);
    let numberValid = checkNumberValidity(numberInput);

    if(emailValid && numberValid && textsValid && (file || localStorage.getItem('imageData'))){
        console.log('email, num, textInputs valid');
    }else console.log('not valid');
});

// test
document.getElementById('test').src = JSON.parse(localStorage.getItem('imageData')).image;
document.getElementById('test').style.width = '30rem';
document.getElementById('test').style.backgroundColor = 'blue';


function saveImage(file){
    const reader = new FileReader();
    reader.addEventListener('load', ()=>{
        const imageData = {
            image: reader.result
        };
        const label = document.querySelector('label[for="user-image"]');
        try{
            hideError(label); //pass in label to use it as a child element
            localStorage.setItem('imageData', JSON.stringify(imageData));
        }catch(err){
            showError(label);
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


const prevBtn = document.querySelector('.previous-btn');
const nextBtn = document.querySelector('.next-btn');

prevBtn.addEventListener('click', prevForm);
nextBtn.addEventListener('click', nextForm);

function nextForm(){
    // check if the input is valid
    // then go to the next form
    if(currentForm == 3) return;
    currentForm++;
    console.log(currentForm);
    displayCurrentForm(currentForm);
}

function prevForm(){
    if(currentForm == 1) return;
    currentForm --;
    displayCurrentForm(currentForm);
}

const formExperience = document.querySelector('.form-experience');
const formEdu = document.querySelector('.form-education');
function displayCurrentForm(currentForm){
    if(currentForm == 1){
        prevBtn.style.backgroundColor = 'var(--light-gray)';
        prevBtn.style.cursor = 'auto';
        formPrivate.style.display = 'flex';
        formExperience.style.display = 'none';
        formEdu.style.display = 'none';
    }else if(currentForm == 2){
        prevBtn.style.cursor = 'pointer';
        prevBtn.style.backgroundColor = 'var(--purple)';
        formPrivate.style.display = 'none';
        formExperience.style.display = 'flex';
        formEdu.style.display = 'none';
    }else if(currentForm == 3){
        formPrivate.style.display = 'none';
        formExperience.style.display = 'none';
        formEdu.style.display = 'flex';
    }
}