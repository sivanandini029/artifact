const profileElem = document.querySelector(".profile-container");
const postsecElem = document.querySelector(".post-section");
loadProfile();

async function loadProfile() {
   try {
      const result = await getUser(true, false);
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

      result.articles.forEach(el => {
         makePost(el);
      })
      
      function makePost(data) {
         const postElem = elem("A", ["post"], "", postsecElem);
         postElem.href = `./view-article.html?id=${data.id}`;

         const subjectElem = elem("DIV", ["subject"], "", postElem);
         const headingElem = elem("DIV", ["heading"], data.title, subjectElem);
         const iconsElem = elem("DIV", ["icons"], "", subjectElem);
         const editElem = elem("DIV", ["icon"], "", iconsElem);
         const editIconImg = elem("IMG", [], "", editElem);
         editIconImg.src = "assets/edit-tools.svg";
         const deleteElem = elem("DIV", ["icon"], "", iconsElem);
         const deleteImg = elem("IMG", [], "", deleteElem);
         deleteImg.src = "assets/send-to-trash.svg";
         

         const labelsElem = elem("DIV", ["labels"], "", postElem);
         const labelElem = elem("DIV", ["label"], "", labelsElem);
         const iconElem = elem("IMG", ["icon"], "", labelElem);
         iconElem.src = "assets/web.svg";
         elem("DIV", ["name"], data.topic, labelElem);
         const statusElem = elem("DIV", ["status"], data.status, labelsElem);

         const contentElem = elem("DIV", ["contents"], data.description, postElem);
      }
   } catch (exception) {
      console.log(exception);
   }
}