"use strict";

const formsExp = JSON.parse(localStorage.getItem('formsExp'));
const formsEdu = JSON.parse(localStorage.getItem('formsEdu'));
const formPrivate = JSON.parse(localStorage.getItem('formPrivate'));

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
                if(key.includes('position')) continue; 
                else if(key.includes('employer')) continue;
                if(key.includes('start-date')) data['start_date'] = data[key];
                else if(key.includes('describtion')) data['description'] = data[key];
            }
            delete data[key];
        }
    }
    console.log(formsArray);
}


