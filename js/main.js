"use strict";
import { textError, telError, textErrorName, emailError, fileError} from "./errors.js";

let currentForm = 1;
const patternGeo = /^[ა-ჰ]+$/u;
const patterEmail = /^[a-zA-Z0-9._%+-]+@redberry\.ge$/;
const patternNumber = /^(\+995\s?5|5)\s?(\d{3}\s?){2}\d{2}$/;

const formPrivate = document.querySelector('.form-private');
const textInputsformOne = document.querySelectorAll('.form-private input[type="text"]');
const emailInput = document.getElementById('email');
const numberInput = document.getElementById('mobile');

const inputFields = Array.from(formPrivate.querySelectorAll('input')).filter(input=>input.type != 'file');

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

const allInputs = document.querySelectorAll('input');
// add error messages to each input
allInputs.forEach(input=>{
    addErrorText(input);
});


formPrivate.addEventListener('input', function(event){

    const file = document.querySelector('input[type="file"]').files[0];
    if(file) saveImage(file);
    // Array.every method is buggy
    textInputsformOne.forEach(input=>{
        checkTextValidity(input);
    });

    let textsValid = Array.from(textInputsformOne).every(input=>{
        console.log(input.id, checkTextValidity(input));
        return checkTextValidity(input);
    });
    let emailValid = checkEmailValidity(emailInput);
    let numberValid = checkNumberValidity(numberInput);

    if(emailValid && numberValid && textsValid && (file || localStorage.getItem('imageData'))){
        // console.log('email, num, textInputs valid');
        nextBtn.addEventListener('click', nextForm);
        prevBtn.addEventListener('click', prevForm);
    }else{
        console.log(
            'emaildata:', emailValid,
            'number', numberValid,
            'text:', textsValid,
            )
        console.log('invalid')
        nextBtn.removeEventListener('click',nextForm);
        prevBtn.removeEventListener('click',prevForm);
    }
    saveData();
});



// formExperience.addEventListener('input', function(event){
//     textInputs.forEach(input=>{
//         checkTextValidity(input);
//     });
// });

function saveData(){
    const formData = {};
    inputFields.forEach(input => {
        formData[input.id] = input.value;
    });
    formData['about-user'] = document.getElementById('about-user').value;
    localStorage.setItem('formData', JSON.stringify(formData));
}

// display saved data
displayData();

// fill in input fields from local storage
function displayData(){
    const formData = JSON.parse(localStorage.getItem('formData'));
    if(formData){
        inputFields.forEach(input => {
            input.value = formData[input.id];
            if(input.type == 'text'){
                checkTextValidity(input);
            }else if(input.type == 'tel'){
                checkNumberValidity(input);
            }else if(input.type == 'email'){
                checkEmailValidity(input);
            }else if(input.type == 'date'){
                checkDateValidity(input);
            }
        });
    } 
}


function addErrorText(input, text){
    if(input.name !== 'name' &&  input.name !== 'surname'){
        text = textError;
    }else if( (input.name == 'name' || input.name == 'surname')) {
            text = textErrorName;
    }
    else if(input.type == 'tel') text = telError;
    else if(input.type == 'file') text = fileError;
    else if(input.type == 'email') text = emailError;

    const errorElement = document.createElement('p');
    errorElement.innerText = text;
    errorElement.className = 'error';
    input.parentElement.appendChild(errorElement);
}

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
function checkDateValidity(input){
    if(input.value) return true;
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


const prevBtn = document.querySelector('.previous-btn');
const nextBtn = document.querySelector('.next-btn');

prevBtn.addEventListener('click', prevForm);
nextBtn.addEventListener('click', nextForm);

function nextForm(){
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


displayCurrentForm(currentForm);
