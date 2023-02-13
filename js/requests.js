"use strict";

const url = 'https://resume.redberryinternship.ge/api/cvs';

const formsExp = JSON.parse(localStorage.getItem('formsExp'));
const formsEdu = JSON.parse(localStorage.getItem('formsEdu'));
const formPrivate = JSON.parse(localStorage.getItem('formPrivate'));


export function base64toBlob(){
    const base64EncodedString = JSON.parse(localStorage.getItem('imageData')).split(',')[1];
    let binaryData = atob(base64EncodedString);
    return binaryData;
}
const blob = new Blob([base64toBlob], { type: 'image/jpeg' });


export function formatData(formsArray){
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

export function formatPrivate(formPrivate){

    formPrivate['phone_number'] = formPrivate['mobile'];
    delete formPrivate['mobile'];
    formPrivate['about_me'] = formPrivate['about-user'];
    delete formPrivate['about-user'];
    formPrivate['image'] = blob;
}


// const dataToSend = {
//     "name": formPrivate.name,
//     "surname": formPrivate.surname,
//     "email": formPrivate.email,
//     "phone_number": formPrivate.phone_number,
//     "experiences": experiences,
//     "educations": educations,
//     "image": formPrivate.image,
//     "about_me": formPrivate.about_me
// }

export function sendData(data){
    fetch(url,{
        method:'POST',
        headers: {
            'content-type':'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response=>{
        if(response.ok){
            console.log(response);
            console.log("response status:",response.statusText);
        }
    })
    .catch(error=>console.log(error))
}



