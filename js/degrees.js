const url = 'https://resume.redberryinternship.ge/api/degrees';

export async function getDegrees(){
    let degrees = [];
    const res = await fetch(url);
    const text = await res.json();
    degrees = text;
    return degrees;
}