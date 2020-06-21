import { getUser } from "./helper/helper.js";
import fire from "./class/Backend.js";

let formElem;
let errorElem;
let publishButton;
let titleElem;
let contentElem;
let descriptionElem;
let id;

export default async function initAddArticle() {
    initializeGlobals();
    await setArticle();
    eventListeners();
}

function initializeGlobals() {
    formElem = document.querySelector(".form");
    errorElem = document.querySelector(".form .error");
    publishButton = document.querySelector(".publish-button button");
    titleElem = document.querySelector(".input-container input[name=title]");
    contentElem = document.querySelector(".input-container textarea[name=content]");
    descriptionElem = document.querySelector(".input-container textarea[name=description]");
}

function eventListeners() {
    publishButton.addEventListener("click", async function() {
        try {
            errorElem.textContent = "";
            const buttonText = publishButton.textContent;
            let status = "PUBLISHED";
            if (buttonText !== "Publish") {
                status = "SAVED";
            }        
            const result = await fire("editArticle", {status}, {id});
            if (result.status === "PUBLISHED") {
                window.router.navigate(`./view-article.html?id=${result.id}`);
                publishButton.textContent = "Unpublish";
            } else {
                publishButton.textContent = "Publish";
            }
            errorElem.textContent = `${buttonText}ed`;
        } catch (exception) {
            console.log(exception);
        }
        
    });

    formElem.addEventListener('submit', async function(e) {
        e.preventDefault();
        const title = document.querySelector(".form .input-container input[name=title]").value;
        const topic = document.querySelector(".form .input-container select[name=topic]").value;
        const description = document.querySelector(".form .input-container textarea[name=description]").value;
        const content = document.querySelector(".form .input-container textarea[name=content]").value;
        try {
            errorElem.textContent = "";
            if (id) {
                await fire("editArticle", {title, topic, description, content}, {id});
            } else {
                const result = await fire("addArticle", {title, topic, description, content});
                publishButton.style.visibility = "visible";
                publishButton.animate({
                    opacity: [0, 1],
                }, {
                    duration: 300,
                    easing: "ease-in-out",
                });
                id = result.id;
                history.replaceState({}, "", `./add-article.html?id=${id}`);
            }
            errorElem.textContent = "Saved";
        } catch (exception) {
            console.log(exception);
            errorElem.innerHTML = exception.replace("\n","<br/>");
        }
    });
}

async function setArticle() {
    await getUser(true, false);
    let params = new URLSearchParams(document.location.search.substring(1));
    id = params.get("id"); 
    if(!id) {
        publishButton.style.visibility = "hidden";
    } else {
        try {
            const result = await fire("getArticle", {}, {id});
            titleElem.value= result.title;
            descriptionElem.value = result.description;
            contentElem.value = result.content;
            if (result.status === "PUBLISHED") {
                publishButton.textContent = "Unpublish";
            }
        } catch (exception) {
            console.log(exception);
            window.router.navigate("./profile.html");
        }

    }
}
    