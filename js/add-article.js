const formElem = document.querySelector(".form");
const errorElem = document.querySelector(".form .error");
const publishButton = document.querySelector(".publish-button button[type=submit]");
const titleElem = document.querySelector(".input-container input[name=title]");
const contentElem = document.querySelector(".input-container textarea[name=content]");
const descriptionElem = document.querySelector(".input-container textarea[name=description]");
formElem.addEventListener('submit', async function(e) {
    e.preventDefault();
    const title = document.querySelector(".form .input-container input[name=title]").value;
    const topic = document.querySelector(".form .input-container select[name=topic]").value;
    const description = document.querySelector(".form .input-container textarea[name=description]").value;
    const content = document.querySelector(".form .input-container textarea[name=content]").value;
    try {
        errorElem.textContent = "";
        await backend.fire("addArticle", {title, topic, description, content});
        window.location.href = "./profile.html";
    } catch (exception) {
        console.log(exception);
        errorElem.innerHTML = exception.replace("\n","<br/>");
    }
});

let params = new URLSearchParams(document.location.search.substring(1));
let id = params.get("id"); 
if(!id) {
    publishButton.style.visibility = "hidden";
 } else {
        fillArticle();
        async function fillArticle() {
        const result = await backend.fire("getArticle", {}, {id});
        console.log(result);
        titleElem.value= result.title;
        descriptionElem.value = result.description;
        contentElem.value = result.content;
        }
}
    
    