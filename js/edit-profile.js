const basicDetailsFormElem = document.querySelector("form[name=basic-details]");
const firstNameElem = document.querySelector(".input-group .input-container input[name=firstname]");
const lastNameElem = document.querySelector(".input-group .input-container input[name=lastname]");
const bioElem = document.querySelector(".input-container textarea[name=bio]");
const websiteElem = document.querySelector(".input-group .input-container input[name=website]");
const dobElem = document.querySelector(".input-group .input-container input[name=dob]");

fillDetails();
async function fillDetails() {
    const result = await getUser();
    console.log(result);
    firstNameElem.value = result.first_name;
    lastNameElem.value = result.last_name;
    bioElem.value = result.bio;
    websiteElem.value = result.website;
    dobElem.value = result.dob;
    const dob = new Date(parseInt(result.dob)*1000);
    dobElem.value = `${dob.getDate()}-${dob.getMonth()+1}-${dob.getFullYear()}`;
}
    basicDetailsFormElem.addEventListener('submit', async function(e) {
        e.preventDefault();
        const firstName = firstNameElem.value;
        const lastName = lastNameElem.value;
        const bio = bioElem.value;
        const website = websiteElem.value;
        const dob = dobElem.value;
        await backend.fire("editUser", {first_name:firstName, last_name:lastName, bio:bio, dob:dob, website:website});
        
    })
    

