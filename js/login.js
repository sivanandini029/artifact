const formElem = document.querySelector(".form");
const errorElem = document.querySelector(".form .error");
checkLogin();

async function checkLogin() {
    await getUser(false, true);
}

formElem.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.querySelector(".form .input-container input[name=username]").value;
    const password = document.querySelector(".form .input-container input[name=password]").value;
    try {
        errorElem.textContent = "";
        await backend.fire("login", {username, password});
        window.location.href = "./news-feed.html";
    } catch (exception) {
            errorElem.textContent = exception;
    }
});