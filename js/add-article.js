const formElem = document.querySelector(".form");
const errorElem = document.querySelector(".form .error");
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
        errorElem.innerHTML = exception.replace("/n","<br/>");
    }
});