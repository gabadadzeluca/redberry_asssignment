"use strict";

const formsExp = JSON.parse(localStorage.getItem('formsExp'));
const formsEdu = JSON.parse(localStorage.getItem('formsEdu'));
const formPrivate = JSON.parse(localStorage.getItem('formPrivate'));


let binaryData;
function base64toBlob(){
    const base64EncodedString = JSON.parse(localStorage.getItem('imageData')).split(',')[1];
    binaryData = atob(base64EncodedString);
}
base64toBlob();

const blob = new Blob([binaryData], { type: 'image/jpeg' });


let experiences = [];
let educations = [];
const url = 'https://resume.redberryinternship.ge/api/cvs';
formatData(formsEdu);
formatData(formsExp);

function formatData(formsArray){
    for (let i = 0; i < formsArray.length; i++) {
        const original = formsArray[i];
        const data = original.data;
        const keys = Object.keys(data);
        for (let j = 0; j < keys.length; j++) {
            let key = keys[j];
            if(formsArray == formsEdu){
                if(key.includes('institution'))data['insitute'] = data[key]; 
                else if(key.includes('grad-date')) data['due-date'] = data[key];
                else if(key.includes('grad-describtion')) data['description'] = data[key];
                else if(key.includes('degree')) data['degree_id'] = data[key];
            }else if(formsArray == formsExp){
                if(key == 'position') continue; 
                else if(key == 'employer') continue;
                else if(key.includes('position')) data['position'] = data[key];
                else if(key.includes('employer')) data['employer'] = data[key];
                else if(key.includes('start-date')) data['start_date'] = data[key];
                else if(key.includes('describtion')) data['description'] = data[key];
            }
            delete data[key];
        }
        if(formsArray == formsEdu){
            educations.push(data);
        }else if(formsArray == formsExp){
            experiences.push(data);
        }
    }
}

formatPrivate(formPrivate);

function formatPrivate(formPrivate){
    const imageData = JSON.parse(localStorage.getItem('imageData'));
    const base64Image = imageData.split(',')[1];
    formPrivate['phone_number'] = formPrivate['mobile'];
    delete formPrivate['mobile'];
    formPrivate['about_me'] = formPrivate['about-user'];
    delete formPrivate['about-user'];
    formPrivate['image'] = blob;
    console.log(formPrivate);
}


const dataToSend = {
    "name": formPrivate.name,
    "surname": formPrivate.surname,
    "email": formPrivate.email,
    "phone_number": formPrivate.phone_number,
    "experiences": experiences,
    "educations": educations,
    "image": formPrivate.image,
    "about_me": formPrivate.about_me
}

console.log(dataToSend);






