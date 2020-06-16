const formElem = document.querySelector(".form");
const errorElem = document.querySelector(".form .error");
const publishButton = document.querySelector(".publish-button button");
const titleElem = document.querySelector(".input-container input[name=title]");
const contentElem = document.querySelector(".input-container textarea[name=content]");
const descriptionElem = document.querySelector(".input-container textarea[name=description]");
let id;
// load article if id present
setArticle();

formElem.addEventListener('submit', async function(e) {
    e.preventDefault();
    const title = document.querySelector(".form .input-container input[name=title]").value;
    const topic = document.querySelector(".form .input-container select[name=topic]").value;
    const description = document.querySelector(".form .input-container textarea[name=description]").value;
    const content = document.querySelector(".form .input-container textarea[name=content]").value;
    try {
        errorElem.textContent = "";
        if (id) {
            console.log({title, topic, description, content});
            await backend.fire("editArticle", {title, topic, description, content}, {id});
        } else {
            await backend.fire("addArticle", {title, topic, description, content});
        }
        errorElem.textContent = "Saved";
    } catch (exception) {
        console.log(exception);
        errorElem.innerHTML = exception.replace("\n","<br/>");
    }
});

publishButton.addEventListener("click", async function() {
    try {
        errorElem.textContent = "";
        const buttonText = publishButton.textContent;
        let status = "PUBLISHED";
        if (buttonText !== "Publish") {
            status = "SAVED";
        }        
        const result = await backend.fire("editArticle", {status}, {id});
        if (result.status === "PUBLISHED") {
            publishButton.textContent = "Unpublish";
        } else {
            publishButton.textContent = "Publish";
        }
        errorElem.textContent = `${buttonText}ed`;
    } catch (exception) {
        console.log(exception);
    }
    
});

async function setArticle() {
    let params = new URLSearchParams(document.location.search.substring(1));
    id = params.get("id"); 
    if(!id) {
        publishButton.style.visibility = "hidden";
    } else {
        try {
            const result = await backend.fire("getArticle", {}, {id});
            console.log(result);
            titleElem.value= result.title;
            descriptionElem.value = result.description;
            contentElem.value = result.content;
            if (result.status === "PUBLISHED") {
                publishButton.textContent = "Unpublish";
            }
        } catch (exception) {
            console.log(exception);
            window.location.href = "./profile.html"
        }

    }
}
    