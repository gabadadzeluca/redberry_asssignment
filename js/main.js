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
const formEducationDiv = document.querySelector('.form-education');
function displayCurrentForm(currentForm){
    if(currentForm == 1){
        prevBtn.style.backgroundColor = 'var(--light-gray)';
        prevBtn.style.cursor = 'auto';
        formPrivateDiv.style.display = 'flex';
        formExperienceDiv.style.display = 'none';
        formEducationDiv.style.display = 'none';
    }else if(currentForm == 2){
        displayResume();
        prevBtn.style.cursor = 'pointer';
        prevBtn.style.backgroundColor = 'var(--purple)';
        formPrivateDiv.style.display = 'none';
        formExperienceDiv.style.display = 'flex';
        formEducationDiv.style.display = 'none';
    }else if(currentForm == 3){
        formPrivateDiv.style.display = 'none';
        formExperienceDiv.style.display = 'none';
        formEducationDiv.style.display = 'flex';
    }
}
const allInputs = document.querySelectorAll('input');
const formPrivate = formPrivateDiv.querySelector('form');
const formExp = formExperienceDiv.querySelector('form');
const formEdu = formEducationDiv.querySelector('form');

[formPrivate, formExp, formEdu].forEach(form=>{
    form.addEventListener('input', ()=>{
        handleForm(form);
        saveForm(form);
    });
});
if(!localStorage.getItem('formsExp')){localStorage.setItem('formsExp', JSON.stringify([]));}
if(!localStorage.getItem('formsEdu')){localStorage.setItem('formsEdu', JSON.stringify([]));}


function saveForm(form){
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    const textarea = form.querySelector('textarea');
    data[textarea.name] = textarea.value;

    let array = [];
    const newObject = {};
    
    if(form.parentElement == formPrivateDiv){
        localStorage.setItem("formPrivate", JSON.stringify(data));
    }else{// if not first form
        if(form.parentElement == formEducationDiv){
            if (localStorage.getItem("formsEdu")) {
                array = JSON.parse(localStorage.getItem("formsEdu"));
            }
        }else if(form.parentElement == formExperienceDiv){
            if (localStorage.getItem("formsExp")) {
                array = JSON.parse(localStorage.getItem("formsExp"));
            }
        }
        
        const objectExists = array.some(object=>{
            return object.formName == form.id;
        });
        if(objectExists){
            array.forEach(object=>{
                if(object.formName == form.id){
                    console.log('already exists');
                    object['data'] = data;
                }
            });
        }else{
            newObject['formName'] = form.id;
            newObject['data'] = data;
            array.push(newObject);
        }

        if(form.parentElement == formEducationDiv){
            localStorage.setItem("formsEdu", JSON.stringify(array));
        }else{
            localStorage.setItem("formsExp", JSON.stringify(array));
        }
    }
}

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
        console.log('mandatory', textArea.dataset.mandatory);
        checkTextarea(textArea);
    }

}


// display saved data(first form)
displayData(formPrivate);
displayData(formExp);

function displayData(form){ 
    const inputFields = form.querySelectorAll('input');
    if(form.parentElement == formPrivateDiv){
        const formData = JSON.parse(localStorage.getItem(`${form.id}`));
        if(formData){
            inputFields.forEach(input => {
                if(input.type == 'file') return;
                input.value = formData[input.name];
            });
        }
       
    }else{
        let data;
        let array;
        let textarea = form.querySelector('textarea');
        if(form.parentElement == formExperienceDiv){
            array = JSON.parse(localStorage.getItem('formsExp'));
        }else{
            array = JSON.parse(localStorage.getItem('formsEdu'));
        }
        if(array.length > 0){
            console.log(array);
            data = array.find(item=> item.formName == form.id).data;
            textarea.value = data[textarea.name];
            inputFields.forEach(input=>{
                console.log(input.name);
                input.value = data[input.name]; 
            });
        }
       
        
    }
    inputFields.forEach(input=>{
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
//add options to a select element
displayDegrees();

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
        input.classList.add('valid');
        // input.style.border = '1px solid var(--green)'
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

if( !localStorage.getItem('fomrCountEdu')) localStorage.setItem('formCountEdu', 0);
let formCountEdu = localStorage.getItem('fomrCountEdu');
console.log('formcountEdu:',formCountEdu);

if(!localStorage.getItem('formCountExp')) localStorage.setItem('formCountExp', 0);
let formCountExp = localStorage.getItem('formCountExp');

function duplicateForm(){
    let form;
    let container;
    let formCount;
    if(this.id == 'edu-btn'){
        container = document.querySelector('.form-education');
        form = container.querySelector('form');
        formCountEdu++;
        
        localStorage.setItem('formCountEdu', formCountEdu);
        formCount = formCountEdu;
    }else if(this.id == 'exp-btn'){
        container = document.querySelector('.form-experience');
        form = container.querySelector('form');
        formCountExp++;
        localStorage.setItem('formCountExp', formCountExp);
        formCount = formCountExp;
    }
    const formCopy = form.cloneNode(true);
    formCopy.id = `${form.id}${formCount}`;
    formCopy.querySelectorAll('[name]').forEach(element => {
        element.name = `${element.name}${formCount}`;
        element.value = '';
        element.classList.forEach(className=>{
            element.classList.remove(className);
        });
    });
    container.append(formCopy);
    formCopy.addEventListener('input', ()=>{
        handleForm(formCopy);
        saveForm(formCopy);
    });
}

displayCurrentForm(currentForm);



function displayForms(){
    // if local storage contains more than one form create copies and display them on the start

}

function displayResume(){
    const resumeContainer = document.querySelector('.resume-active');
    // displayUserInfo(resumeContainer);
}

function displayUserInfo(resumeContainer){
    const image = resumeContainer.querySelector('img');
    const nameDiv = resumeContainer.querySelector('.name');
    const emailDiv = resumeContainer.querySelector('.email');
    const aboutDiv = resumeContainer.querySelector('.about-user');
    
    let imageData = JSON.parse(localStorage.getItem('imageData'));
    image.src =  imageData.image;

    let {name, surname, email,tel} = JSON.parse(localStorage.getItem('formPrivate'));
    let aboutUser = JSON.parse(localStorage.getItem('formPrivate'))['about-user'];
    nameDiv.innerHTML = name + ' ' + surname;
    emailDiv.innerHTML = email; 
    aboutDiv.innerHTML = aboutUser;
}