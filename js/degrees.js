const url = 'https://resume.redberryinternship.ge/api/degrees';

export async function getDegrees(){
    let degrees = [];
    try{
        const res = await fetch(url);
        const text = await res.json();
        degrees = text;
        return degrees;
    }catch(err){
        console.log("couldn't load degrees: ",err);
    }
}
