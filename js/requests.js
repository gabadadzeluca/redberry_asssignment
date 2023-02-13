"use strict";

const url = 'https://resume.redberryinternship.ge/api/cvs';

function b64toBlob(){
    const base64EncodedString = JSON.parse(localStorage.getItem('imageData')).split(',')[1];
    let byteCharacters = atob(base64EncodedString);

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: 'image/jpeg'});
    return blob;
}

export function formatData(formsArray,finalArray){
    for (let i = 0; i < formsArray.length; i++) {
        const original = formsArray[i];
        const data = original.data;
        const keys = Object.keys(data);
        for (let j = 0; j < keys.length; j++) {
            let key = keys[j];
            if(formsArray[0].formName == 'formEdu'){
                if(key.includes('institution'))data['institute'] = data[key]; 
                else if(key.includes('grad-date')) data['due_date'] = data[key];
                else if(key.includes('grad-describtion')) data['description'] = data[key];
                else if(key.includes('degree')) data['degree_id'] = data[key];
            }else if(formsArray[0].formName == 'formExp'){
                if(key == 'position') continue; 
                else if(key == 'employer') continue;
                else if(key.includes('position')) data['position'] = data[key];
                else if(key.includes('employer')) data['employer'] = data[key];
                else if(key.includes('start-date')) data['start_date'] = data[key];
                else if(key.includes('end-date')) data['due_date'] = data[key];
                else if(key.includes('describtion')) data['description'] = data[key];
            }
            delete data[key];
        }
        finalArray.push(data);
    }
}

export function formatPrivate(formPrivate){
    const blob = b64toBlob();
    formPrivate['phone_number'] = formPrivate['mobile'];
    delete formPrivate['mobile'];
    formPrivate['about_me'] = formPrivate['about-user'];
    delete formPrivate['about-user'];
    formPrivate['image'] = blob;
}

export function sendData(data){
    fetch(url,{
        method:'POST',
        headers: {
            'Content-Type':'multipart/form-data'
        },
        body: data,
    })
    .then(response=>{
        if(response){
            console.log(response);
            console.log("response status:",response.statusText);
        }
    })
    .catch(error=>console.log(error))
}
