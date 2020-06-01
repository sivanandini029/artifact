const profileElem = document.querySelector(".profile-container");
getUser();

async function getUser(){
   const result = await backend.fire("getUser");
   console.log(result);
   const username = document.querySelector(".user-profile .profile-container .profile-name");
   username.textContent = result.username;
   const bioElem = document.querySelector(".user-profile .profile-container .bio");
   const nameAgeElem = document.querySelector(".user-profile .profile-container .small");
   const websiteElem = document.querySelector(".user-profile .profile-container .website");

   bioElem.textContent = result.bio;
   if(result.firstname&&result.lastname&&result.dob){
      nameAgeElem.textContent = result.firstname+" "+result.lastname+","+result.dob;
   }
   websiteElem.textContent =result.website
   websiteElem.href = result.website;
}
