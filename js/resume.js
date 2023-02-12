export function displayInput(){
    const resumeContainer = document.querySelector('.resume-active');
    const expDiv = resumeContainer.querySelector('.exp-div');
    const eduDiv = resumeContainer.querySelector('.edu-div');

    const expContainer = resumeContainer.querySelector('.exp');
    const eduContainer = resumeContainer.querySelector('.edu');
    
    const expArray = JSON.parse(localStorage.getItem('formsExp'));
    const eduArray = JSON.parse(localStorage.getItem('formsEdu'));

    console.log(expArray, eduArray);
    let expHTML = '';
    let eduHTML = '';
    expArray.forEach(obj=>{
        const data = obj.data;
        let num = obj.formName.slice(7);
        
        expHTML += `<div>`
        // title div
        expHTML += `<div class="title">` + data[`position` + num] + ', ';
        expHTML += data[`employer` + num] + `</div>`;
        // date div
        expHTML += `<div class="date">`
        expHTML += `<span class="start-date"> ` + data[`start-date` + num] + ', ' + `</span>`;
        expHTML += `<span class="end-date">` + data[`end-date${num}`] +  `</span></div>`
        
        expHTML += '<p>' + data[`describtion` + num] + '</p>' + '</div>';
      
        expContainer.innerHTML = expHTML;
    });
    eduArray.forEach(obj=>{
        const data = obj.data;
        let num = obj.formName.slice(7);
        eduHTML += `<div>`
        // title div
        eduHTML += `<div class="title">` + data[`institution` + num] + ', ';
        if(data['degree' + num] == 'default'){
            eduHTML += '' + `</div>`;
        }else{
            eduHTML += data[`degree` + num] + `</div>`;
        }
        // date div
        eduHTML += `<div class="date">`
        eduHTML += `<span class="start-date"> ` + data[`grad-date` + num] + '</span></div>';
        
        eduHTML += '<p>' + data[`grad-describtion` + num] + '</p>' + '</div>';
      
        eduContainer.innerHTML = eduHTML;
    });

    
}