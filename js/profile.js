const profileElem = document.querySelector(".profile-container");
loadProfile();

async function loadProfile(){
   try {
      const result = await getUser();
      console.log(result);
      const username = document.querySelector(".user-profile .profile-container .profile-name");
      const bioElem = document.querySelector(".user-profile .profile-container .bio");
      const nameAgeElem = document.querySelector(".user-profile .profile-container .small");
      const websiteElem = document.querySelector(".user-profile .profile-container .website a");
      
      // set username
      username.textContent = result.username;

      // set bio
      bioElem.textContent = result.bio;

      // set name and age
      let nameAgeContents = "";
      if (result.first_name) {
         nameAgeContents += result.first_name;
      } 
      if (result.last_name) {
         nameAgeContents += " " + result.last_name;
      }
      if (result.dob) {
         const age = Math.floor((new Date() - result.dob * 1000) / (60 * 60 * 24 * 365.25 * 1000));
         nameAgeContents += ", " + age;
      }
      nameAgeElem.textContent = nameAgeContents;

      // set website
      websiteElem.textContent = result.website
      websiteElem.href = result.website;
   } catch (exception) {
      console.log(exception);
   }
}
