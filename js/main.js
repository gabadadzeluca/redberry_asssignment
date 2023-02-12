"use strict";
import {textError, telError, textErrorName, emailError, fileError} from "./errors.js";
import {getDegrees} from "./degrees.js";

const degreesList = await getDegrees();
let currentForm = 1;
const patternGeo = /^[ა-ჰ]+$/u;
const patternEmail = /^[a-zA-Z0-9._%+-]+@redberry\.ge$/;
const patternNumber = /^(\+995\s?5|5)\s?(\d{3}\s?){2}\d{2}$/; 

const formPrivateDiv = document.querySelector('.form-private');

const formExperienceDiv = document.querySelector('.form-experience');
const formEducationDiv = document.querySelector('.form-education');
function displayCurrentForm(currentForm){
    if(currentForm == 1){
        prevBtn.style.display = 'none';
        formPrivateDiv.style.display = 'flex';
        formExperienceDiv.style.display = 'none';
        formEducationDiv.style.display = 'none';
        nextBtn.style.position = 'absolute';
        nextBtn.style.left = '90%';
    }else if(currentForm == 2){
        displayResume();
        prevBtn.style.display = 'block'
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
        if(key !== 'user-image'){
            data[key] = value;
        }
    }
    const textarea = form.querySelector('textarea');
    data[textarea.name] = textarea.value;
    const selectInput = form.querySelector('select');
    if(selectInput){
        data[selectInput.name] = selectInput.value;
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
    const selectInput = form.querySelector('select');

    let emailValid;
    let numberValid;
    let textAreaValid = checkTextarea(textArea);
    let selectValid;
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

    
    checkAllInputs(form.querySelectorAll('input'));
    // textInputs.forEach(input=>{
    //     checkTextValidity(input);
    // });
    // dateInputs.forEach(input=>{
    //     checkDateValidity(input);
    // });

    let textsValid = (textInputs).every(input=>{
        return checkTextValidity(input);
    });
    let datesValid = (dateInputs).every(input=>{
        return checkDateValidity(input);
    });

    let validationArray = [];
    let formIsValid = false;    
    if(form.parentElement == formPrivateDiv){
        validationArray = [textsValid, emailValid, numberValid];
    }else if(form.parentElement == formExperienceDiv){
        validationArray = [textsValid, datesValid, textAreaValid];
    }else{ // education div
        validationArray = [textsValid, datesValid, textAreaValid, selectValid];
    }
    formIsValid = validationArray.every(value=>{
        console.log(value);
        return value === true;

    });
    console.log(form.id,"valid:",formIsValid);

    
    if(textArea && textArea.dataset.mandatory == true){
        console.log('mandatory', textArea.dataset.mandatory);
        checkTextarea(textArea);
    }

}


displayData(formPrivate);
displayData(formExp);
displayData(formEdu);
// add checking for local storage


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
                  selectInput.value = data[selectInput.name];
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
    const parentForm = (inputFields[0].parentElement.parentElement.parentElement);
    const selectInput = parentForm.querySelector('select');
    if(selectInput) checkSelect(selectInput);
}
//add options to a select element
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
    if(input.value !== "") {
        console.log("date is valid:", input.value);
        displayValidInput(input);
        // input.style.border = '1px solid var(--green)'
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
    if(textarea.value.length > 2){
        displayValidInput(textarea);
        return true;
    }else{
        displayInvalidInput(textarea);
    }
}

function checkSelect(select){
    if(select.value !== "default" && select.value != ''){
        displayValidInput(select);
        console.log(select, 'valid');
        
        return true;
    }else{
        displayInvalidInput(select);
        console.log(select,"invalid")
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
    let options = '<option disabled selected value="default">აირჩიეთ ხარისხი</option>';
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
        element.classList.forEach(className=>{
            element.classList.remove(className);
        });
        if(element.name == 'degree') element.value = "default";
    });
    container.append(formCopy);
    formCopy.addEventListener('input', ()=>{
        handleForm(formCopy);
        saveForm(formCopy);
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
        element.id = `${element.id}${count}`
    });
    parentElement.append(formCopy);
    formCopy.addEventListener('input', ()=>{
        handleForm(formCopy);
        saveForm(formCopy);
    });
}

function displayResume(){
    const resumeContainer = document.querySelector('.resume-active');
    displayUserInfo(resumeContainer);
}

function displayUserInfo(resumeContainer){
    const image = resumeContainer.querySelector('img');
    const nameDiv = resumeContainer.querySelector('.name');
    const emailDiv = resumeContainer.querySelector('.email');
    const aboutDiv = resumeContainer.querySelector('.about-user');
    
    let imageData = JSON.parse(localStorage.getItem('imageData'));
    image.src = imageData;    
    // add checks    
    let {name, surname, email,tel} = JSON.parse(localStorage.getItem('formPrivate'));
    let aboutUser = JSON.parse(localStorage.getItem('formPrivate'))['about-user'];
    nameDiv.innerHTML = name + ' ' + surname;
    emailDiv.innerHTML = email; 
    aboutDiv.innerHTML = aboutUser;
}