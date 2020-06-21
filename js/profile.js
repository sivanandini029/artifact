import { getUser, elem } from "./helper/helper.js";
import fire from "./class/Backend.js";

let postsecElem;

export default async function initProfile() {
   initializeGlobals();
   await loadProfile();
}

function initializeGlobals() {
   postsecElem = document.querySelector(".post-section .posts");
}

async function loadProfile() {
   try {
      const result = await getUser(true, false);
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
         const postElem = elem("DIV", ["post"], "", postsecElem);

         const subjectElem = elem("DIV", ["subject"], "", postElem);
         const headingElem = elem("DIV", ["heading"], data.title, subjectElem);
         const iconsElem = elem("DIV", ["icons"], "", subjectElem);
         const viewArticleElem = elem("A", ["icon"], "", iconsElem);
         const viewArticleIconImg = elem("IMG", [], "", viewArticleElem);
         viewArticleIconImg.src = "assets/eye.svg";
         viewArticleElem.href = `./view-article.html?id=${data.id}`;
         const editElem = elem("A", ["icon"], "", iconsElem);
         const editIconImg = elem("IMG", [], "", editElem);
         editIconImg.src = "assets/edit-tools.svg";
         editElem.href = `./add-article.html?id=${data.id}`;
         const deleteElem = elem("A", ["icon"], "", iconsElem);
         const deleteImg = elem("IMG", [], "", deleteElem);
         deleteImg.src = "assets/send-to-trash.svg";
         deleteElem.addEventListener("click", async function() {
            try {
               if (confirm("Are you sure, do you want to delete this post?")) {
                  const deletePost = await fire("deleteArticle", {}, {id: data.id});
                  postElem.style.overflow = "hidden";
                  const deleteAnim = postElem.animate({
                      height: [getComputedStyle(postElem).height, 0],
                  }, {
                     duration: 300,
                     easing: "ease-in-out"
                  });

                   deleteAnim.addEventListener("finish", () => {
                      postElem.parentElement.removeChild(postElem);
                   });
               } else {
               }   
            } catch(exception) {
               console.log(exception);
            }
         });

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