"use strict";
import {textError, telError, textErrorName, emailError, fileError} from "./errors.js";
import {getDegrees} from "./degrees.js";
import {
    hideError, showError, 
    checkDateValidity, checkSelect, checkTextValidity, checkEmailValidity,
    checkTextarea, checkNumberValidity, displayUserInfo, displayFinalResume, saveNumber
} from "./functional.js";
import { displayInput } from "./resume.js";
import { formatPrivate, sendData, formatData} from "./requests.js";


let currentForm = 1;

const formPrivateDiv = document.querySelector('.form-private');

const formExperienceDiv = document.querySelector('.form-experience');
const formEducationDiv = document.querySelector('.form-education');
const resumeContainer = document.querySelector('.resume-active');

const finishBtn = document.querySelector('.finish-btn');
const prevBtn = document.querySelector('.previous-btn');
const nextBtn = document.querySelector('.next-btn');


function displayCurrentForm(currentForm){

    if(currentForm == 1){
        prevBtn.style.display = 'none';
        formPrivateDiv.style.display = 'flex';
        formExperienceDiv.style.display = 'none';
        formEducationDiv.style.display = 'none';
        hideResume();
        finishBtn.style.display = 'none';
    }else if(currentForm == 2){
        displayResume();
        prevBtn.style.display = 'block'
        prevBtn.style.cursor = 'pointer';
        prevBtn.style.backgroundColor = 'var(--purple)';
        formPrivateDiv.style.display = 'none';
        formExperienceDiv.style.display = 'flex';
        formEducationDiv.style.display = 'none';
        finishBtn.style.display = 'none';
        nextBtn.style.display = 'block';
    }else if(currentForm == 3){
        formPrivateDiv.style.display = 'none';
        formExperienceDiv.style.display = 'none';
        formEducationDiv.style.display = 'flex';
        finishBtn.style.display = 'block';
        nextBtn.style.display = 'none';
    }
}
const allInputs = document.querySelectorAll('input');
const formPrivate = formPrivateDiv.querySelector('form');
const formExp = formExperienceDiv.querySelector('form');
const formEdu = formEducationDiv.querySelector('form');

// add error messages to each input
allInputs.forEach(input=>{
    addErrorText(input);
});


[formPrivate, formExp, formEdu].forEach(form=>{
    form.addEventListener('input', ()=>{
        handleForm(form);
        saveForm(form);
        displayInput();
    });
});

if(!localStorage.getItem('formsExp')){localStorage.setItem('formsExp', JSON.stringify([]));}
if(!localStorage.getItem('formsEdu')){localStorage.setItem('formsEdu', JSON.stringify([]));}


function saveForm(form){
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
        if(key !== 'user-image'){
            data[key] = value;
            if(key == 'mobile')data[key] = saveNumber(value);
        }
    }
    const textarea = form.querySelector('textarea');
    data[textarea.name] = textarea.value;
    const selectInput = form.querySelector('select');
    if(selectInput){
        const selectedOption = selectInput.options[selectInput.selectedIndex];
        data[selectInput.name] = selectedOption.id;
    }
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



function handleForm(form){
    const numberInput = form.querySelector('input[type="tel"]');
    const emailInput = form.querySelector('input[type="email"]'); 
    const textInputs = Array.from(form.querySelectorAll('input[type="text"]'));
    const dateInputs = Array.from(form.querySelectorAll('input[type="date"]'));
    const textArea = form.querySelector('textarea');
    const fileInput = form.querySelector('input[type="file"]');
    const selectInput = form.querySelector('select');

    let emailValid;
    let numberValid;
    let textAreaValid = checkTextarea(textArea);
    let selectValid;

    checkAllInputs(form.querySelectorAll('input'));

    if(selectInput){
        selectValid = checkSelect(selectInput);
    }
    if(fileInput) {
        const file = fileInput.files[0];
        if(file) saveImage(file);
    }
    if(emailInput && numberInput){
        emailValid = checkEmailValidity(emailInput);
        numberValid = checkNumberValidity(numberInput);
    }
    let textsValid = (textInputs).every(input=>{
        return checkTextValidity(input);
    });
    let datesValid = (dateInputs).every(input=>{
        return checkDateValidity(input);
    });
    let imageValid = localStorage.getItem('imageData') !== null;

    let validationArray = [];
    let formIsValid;    
    if(form.parentElement == formPrivateDiv){
        validationArray = [textsValid, emailValid, numberValid, imageValid];
    }else if(form.parentElement == formExperienceDiv){
        validationArray = [textsValid, datesValid, textAreaValid];
    }else{ // education div
        validationArray = [textsValid, datesValid, textAreaValid, selectValid];
    }
    formIsValid = validationArray.every(value=>{
        console.log(form,validationArray, value);
        return value === true;
    });
    console.log("valid:",formIsValid);
    if(formIsValid == false){
        nextBtn.removeEventListener('click', nextForm);
        prevBtn.removeEventListener('click', prevForm);
    }else{
        nextBtn.addEventListener('click', nextForm);
        prevBtn.addEventListener('click', prevForm);
    }
    
}

displayData(formPrivate);
if(JSON.parse(localStorage.getItem('formsExp')).length > 0){
    displayData(formExp);
}
if(JSON.parse(localStorage.getItem('formsEdu')).length > 0){
    displayData(formEdu);
}


function displayData(form){ 
    const inputFields = form.querySelectorAll('input');
    let textarea = form.querySelector('textarea');
    if(form.parentElement == formPrivateDiv){
        const formData = JSON.parse(localStorage.getItem(`${form.id}`));
        if(formData){
            textarea.value = formData[textarea.name];
            inputFields.forEach(input => {
                if(input.type == 'file') return;
                input.value = formData[input.name];
            });
            checkAllInputs(inputFields);
        }
    }else{
        let data;
        let array;

        let selectInput;
        if(form.parentElement == formExperienceDiv){
            array = JSON.parse(localStorage.getItem('formsExp'));
        }else{
            selectInput = form.querySelector('select');
            array = JSON.parse(localStorage.getItem('formsEdu'));
        }
        if(array.length > 0){
            data = array.find(item=> item.formName == form.id).data;
            textarea.value = data[textarea.name];
            inputFields.forEach(input=>{
                input.value = data[input.name]; 
            });
            if (selectInput) {
                setTimeout(() => {
                    const id = data[selectInput.name];
                    const template = selectInput.querySelector(`option[id="${id}"]`);
                    selectInput.value = template.value;
                }, 0);
              }
            checkAllInputs(inputFields);
        }
    }
   
}

function checkAllInputs(inputFields){
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
    let parentForm = (inputFields[0].parentElement.parentElement);
    if(parentForm.tagName.toLowerCase() !== 'form'){
        parentForm = parentForm.parentElement;
    }
    const selectInput = parentForm.querySelector('select');
    if(selectInput) checkSelect(selectInput);
    const textarea = parentForm.querySelector('textarea');
    if(textarea) checkTextarea(textarea);
}
//add options to a select element
const degreesList = await getDegrees();
displayDegrees();

function addErrorText(input, text){
    if(input.type == 'text' && input.name !== 'name' &&  input.name !== 'surname'){
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

function saveImage(file) { // save image as base64
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        const imageData = reader.result;
        const label = document.querySelector('label[for="user-image"]');
        try {
            hideError(label); //pass in label to use it as a child element
            localStorage.setItem('imageData', JSON.stringify(imageData));
        } catch (err) {
            showError(label);
        }
    });
    reader.readAsDataURL(file);
}
  
function displayDegrees(){
    let degreeMenu = document.getElementById('degree-menu');
    let options = '<option disabled selected value="default">????????????????????? ?????????????????????</option>';
    degreesList.forEach(obj=>{
        options +=  `<option style="width:30rem"value="${obj.title}" id=${obj.id}>${obj.title}</option>`;
    });
    degreeMenu.innerHTML = options;
}




function nextForm(){
    if(currentForm == 3) return;
    currentForm++;
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

let formCountEdu = localStorage.getItem('formCountEdu');
if(!formCountEdu){
    formCountEdu = 1;
    localStorage.setItem('formCountEdu', formCountEdu);
}

let formCountExp = localStorage.getItem('formCountExp');
if(!formCountExp){
    formCountExp = 1;
    localStorage.setItem('formCountExp', formCountExp);
}

function duplicateForm(){
    let form;
    let container;
    let formCount;
    if(this.id == 'edu-btn'){
        container = document.querySelector('.form-education');
        formCountEdu++;
        localStorage.setItem('formCountEdu', formCountEdu);
        formCount = formCountEdu;
    }else if(this.id == 'exp-btn'){
        container = document.querySelector('.form-experience');
        formCountExp++;
        localStorage.setItem('formCountExp', formCountExp);
        formCount = formCountExp;
    }
    form = container.querySelector('form');
    const formCopy = form.cloneNode(true);
    formCopy.id = `${form.id}${formCount}`;
    formCopy.querySelectorAll('[name]').forEach(element => {
        element.name = `${element.name}${formCount}`;
        if(element.name !== 'degree'){
            element.value = '';
        }
        if(element.name.includes('degree')) element.value = "default";
        
        element.classList.forEach(className=>{
            element.classList.remove(className);
        });
    });
    container.append(formCopy);
    formCopy.addEventListener('input', ()=>{
        handleForm(formCopy);
        saveForm(formCopy);
        displayInput();
    });
}

displayCurrentForm(currentForm);


const formArrayEdu = JSON.parse(localStorage.getItem('formsEdu'));
const formArrayExp = JSON.parse(localStorage.getItem('formsExp'));
displayForms(formArrayEdu);
displayForms(formArrayExp);

// takes in an array of objects ([{ fileName:name, data:{} ...}]]) => updates HTML
function displayForms(formsArray){
    if(formsArray.length > 1){
        // create and display additional form for refresh
        formsArray.forEach(object=>{
            createFormHTML(object);
        });
    }
}

function createFormHTML(object){
    const formName = object.formName;
    const data = object.data;

    if(document.querySelector(`form[id=${formName}]`) !== null) return; // if a form already exists do nothing
    // create a new form and fill in the inputs
    const strEdu = 'formEdu';
    const parentElement = formName.includes(strEdu)? formEducationDiv : formExperienceDiv;

    const formTemplate = parentElement.querySelector('form');

    const count = formName.slice(7);
    const formCopy = formTemplate.cloneNode(true);

    formCopy.id = `${formName}`;
    
    formCopy.querySelectorAll('[name]').forEach(element => {
        element.name = `${element.name}${count}`;
        element.value = data[element.name];
        element.id = `${element.id}${count}`;
        if(element.name.includes('degree')){
            const id = data[element.name];
            const selectInput = element.querySelector(`option[id="${id}"]`);
            element.value = selectInput.value;
        }
    });
    checkAllInputs(formCopy.querySelectorAll('input'));
    parentElement.append(formCopy);
    formCopy.addEventListener('input', ()=>{
        handleForm(formCopy);
        saveForm(formCopy);
        displayInput();
    });
}

function displayResume(){
    resumeContainer.style.display = 'flex';
    displayUserInfo(resumeContainer);    
}
function hideResume(){
    resumeContainer.style.display = 'none';
}

displayInput();

finishBtn.addEventListener('click', ()=>{
    sendRequest();
    displayFinalResume();
});


function sendRequest(){
    const formsEdu = JSON.parse(localStorage.getItem('formsEdu'));
    const formsExp = JSON.parse(localStorage.getItem('formsExp'));
    const formPrivate = JSON.parse(localStorage.getItem('formPrivate'));
    let experiences = [];
    let educations = [];



    formatData(formsEdu, educations);
    formatData(formsExp, experiences);
    formatPrivate(formPrivate);

    const formData = new FormData();
    formData.append('name', formPrivate.name);
    formData.append('surname', formPrivate.surname);
    formData.append('email', formPrivate.email);
    formData.append("phone_number", formPrivate.phone_number);
    formData.append('experiences', JSON.stringify(experiences));
    formData.append('educations', JSON.stringify(educations));
    formData.append('image', formPrivate.image);
    formData.append('about_me', formPrivate.about_me);

    console.log([...formData.entries()]);    
    sendData(formData);
}