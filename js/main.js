"use strict";
import {textError, telError, textErrorName, emailError, fileError} from "./errors.js";
import {getDegrees} from "./degrees.js";

const degreesList = await getDegrees();
let currentForm = 1;
const patternGeo = /^[ა-ჰ]+$/u;
const patterEmail = /^[a-zA-Z0-9._%+-]+@redberry\.ge$/;
const patternNumber = /^(\+995\s?5|5)\s?(\d{3}\s?){2}\d{2}$/; 

const formPrivateDiv = document.querySelector('.form-private');

const formExperienceDiv = document.querySelector('.form-experience');
const formEdu = document.querySelector('.form-education');
function displayCurrentForm(currentForm){
    if(currentForm == 1){
        prevBtn.style.backgroundColor = 'var(--light-gray)';
        prevBtn.style.cursor = 'auto';
        formPrivateDiv.style.display = 'flex';
        formExperienceDiv.style.display = 'none';
        formEdu.style.display = 'none';
    }else if(currentForm == 2){
        prevBtn.style.cursor = 'pointer';
        prevBtn.style.backgroundColor = 'var(--purple)';
        formPrivateDiv.style.display = 'none';
        formExperienceDiv.style.display = 'flex';
        formEdu.style.display = 'none';
    }else if(currentForm == 3){
        formPrivateDiv.style.display = 'none';
        formExperienceDiv.style.display = 'none';
        formEdu.style.display = 'flex';
    }
}
const allInputs = document.querySelectorAll('input');
const formPrivate = formPrivateDiv.querySelector('form');
const formExp = formExperienceDiv.querySelector('form');

[formPrivate, formExp].forEach(form=>{
    form.addEventListener('input', ()=>{
        handleForm(form);
    });
});

// add error messages to each input
allInputs.forEach(input=>{
    addErrorText(input);
});

function handleForm(form){
    const numberInput = form.querySelector('input[type="tel"]');
    const emailInput = form.querySelector('input[type="email"]'); 
    const textInputs = Array.from(form.querySelectorAll('input[type="text"]'));
    const dateInputs = Array.from(form.querySelectorAll('input[type="date"]'));
    const textArea = form.querySelector('textarea');
    const fileInput = form.querySelector('input[type="file"]');
    if(fileInput) {
        const file = fileInput.files[0];
        if(file) saveImage(file);
    }
    if(emailInput && numberInput){
        checkNumberValidity(numberInput);
        checkEmailValidity(emailInput);
    }

    textInputs.forEach(input=>{
        checkTextValidity(input);
    });
    dateInputs.forEach(input=>{
        checkDateValidity(input);
    });

    let textsValid = (textInputs).every(input=>{
        return checkTextValidity(input);
    });
    let datesValid = (dateInputs).every(input=>{
        return checkDateValidity(input);
    });
    
    if(textArea && textArea.dataset.mandatory == true){
        checkTextarea(textArea);
    }

    saveData(form);
}

function saveData(form){
    const formData = {};
    const formParent = form.parentElement;
    Array.from(form.querySelectorAll('input')).forEach(input=>{
        if(input.type !== 'file') formData[input.id] = input.value;
    });

    if(formParent.className == 'form-private'){
        formData['about-user'] = form.querySelector('textArea').value;
    }else if(formParent.className == 'form-experience'){
        formData['describtion'] = form.querySelector('textarea').value;
    }else{ // if education
        formData['grad-describtion'] = form.querySelector('textarea').value;
    }
    
    localStorage.setItem(`${form.id}`, JSON.stringify(formData));
}

// display saved data(first form)
// displayData(formPrivateDiv.querySelector('form'));
// displayData(formExperienceDiv.querySelector('form'));

function displayData(form){ 
    const inputFields = form.querySelectorAll('input');
    const formData = JSON.parse(localStorage.getItem(`${form.id}`));
    if(formData){
        inputFields.forEach(input => {
            if(input.type == 'file') return;
            input.value = formData[input.name];
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
//add options to a select element
displayDegrees();

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if(mutation.type === "childList") {
            console.log('mutation')
        }
    });
});
observer.observe(document.querySelector('body'), {childList:true});

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
// document.getElementById('test').src = JSON.parse(localStorage.getItem('imageData')).image;
// document.getElementById('test').style.width = '30rem';
// document.getElementById('test').style.backgroundColor = 'blue';


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
    if(input.value) {
        input.classList.remove('invalid');
        return isValidDate(input.value);
    }else{
        input.classList.add('invalid');
        return false;
    }
}

function isValidDate(dateString) {
    let date = new Date(dateString);
    return !isNaN(date.getTime());
}

function checkTextarea(textarea){
    if(textarea.value.length > 2){
        textarea.classList.remove('invalid');
        textarea.classList.add('valid');
        return true;
    }else{
        textarea.classList.add('invalid');
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


// function for comparing dates
function isFinishDateLater(startDate, finishDate) {
    let start = new Date(startDate);
    let finish = new Date(finishDate);
    return !isNaN(start.getTime()) && !isNaN(finish.getTime()) && finish > start;
}


function displayDegrees(){
    let degreeMenu = document.getElementById('degree-menu');
    let options = '<option disabled selected>აირჩიეთ ხარისხი</option>';
    degreesList.forEach(obj=>{
        options +=  `<option value="${obj.title}" id=${obj.id}>${obj.title}</option>`;
    });
    degreeMenu.innerHTML = options;
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

const addExpBtn = document.getElementById('exp-btn');
const addEduBtn = document.getElementById('edu-btn');

addEduBtn.addEventListener('click', duplicateForm);
addExpBtn.addEventListener('click', duplicateForm);

if( !localStorage.getItem('fomrCount')) localStorage.setItem('formCount', 1);
let formCount = 1 || localStorage.getItem('fomrCount');
console.log(formCount);

function duplicateForm(){
    let form;
    let container;
    formCount++;
    localStorage.setItem('formCount', formCount);
    if(this.id == 'edu-btn'){
        container = document.querySelector('.form-education');
        form = container.querySelector('form');
    }else{
        container = document.querySelector('.form-experience');
        form = container.querySelector('form');
    }
    const formCopy = form.cloneNode(true);
    formCopy.id = `${form.id}${formCount}`;
    formCopy.querySelectorAll('[name]').forEach(element => {
        element.name = `${element.name}${formCount}`;
      });
    container.append(formCopy);
}

displayCurrentForm(currentForm);
