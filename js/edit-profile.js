const basicDetailsFormElem = document.querySelector("form[name=basic-details]");
const firstNameElem = document.querySelector(".input-group .input-container input[name=firstname]");
const lastNameElem = document.querySelector(".input-group .input-container input[name=lastname]");
const bioElem = document.querySelector(".input-container textarea[name=bio]");
const websiteElem = document.querySelector(".input-group .input-container input[name=website]");
const dobElem = document.querySelector(".input-group .input-container input[name=dob]");
const accntCredentialsFormElem = document.querySelector("form[name=account-credentials]");
const userNameElem = document.querySelector(".input-container input[name=username]");
const emailElem = document.querySelector(".input-container input[name=email]");
const basicDetailsErrorElem = document.querySelector("form[name=basic-details] .error");
const accntCredentialsErrorElem = document.querySelector(".account-credentials .error");
const disableButton = document.querySelector(".disable-account .button");

fillDetails();
async function fillDetails() {
    const result = await getUser();
    console.log(result);
    firstNameElem.value = result.first_name;
    lastNameElem.value = result.last_name;
    bioElem.value = result.bio;
    websiteElem.value = result.website;
    dobElem.value = result.dob;
    userNameElem.value = result.username;
    emailElem.value = result.email;
    const dob = new Date(parseInt(result.dob)*1000);
    dobElem.value = `${dob.getDate()}-${dob.getMonth()+1}-${dob.getFullYear()}`;

    if(result.status === "DISABLED") 
    {
        disableButton.textContent = "Enable";
    }
}

basicDetailsFormElem.addEventListener('submit', async function(e) {
    e.preventDefault();
    const firstName = firstNameElem.value;
    const lastName = lastNameElem.value;
    const bio = bioElem.value;
    const website = websiteElem.value;
    const dob = dobElem.value;
    try {
        basicDetailsErrorElem.textContent = "";
        await backend.fire("editUser", {first_name:firstName, last_name:lastName, bio:bio, dob:dob, website:website});   
        basicDetailsErrorElem.textContent = "success";
    }
    catch (exception) {
        basicDetailsErrorElem.innerHTML = exception.replace("/n","<br/>");
    }
})

accntCredentialsFormElem.addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = userNameElem.value;
    const email = emailElem.value;
    try {
        accntCredentialsErrorElem.textContent = "";
        await backend.fire("editUser", {username:username, email:email});
        accntCredentialsErrorElem.textContent = "success";
    }
    catch(exception) {
        accntCredentialsErrorElem.innerHTML = exception.replace("/n","<br/>");
    }
})

disableButton.addEventListener('click', async function(e) {
    let status = "ACTIVE";

    if(disableButton.textContent === "Disable") {
       status = "DISABLED";
    }
    console.log(status);
    await backend.fire("editUser", {status:status});
    window.location.href = "./edit-profile.html";
})
