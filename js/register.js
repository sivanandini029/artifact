const formElem = document.querySelector(".form");
const errorElem = document.querySelector(".form .error");
checkLogin();

async function checkLogin() {
    await getUser(false, true);
}
formElem.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.querySelector(".form .input-container input[name=username]").value;
    const email = document.querySelector(".form .input-container input[name=email]").value;
    const password = document.querySelector(".form .input-container input[name=password]").value;
    try {
        errorElem.textContent = "";
        await backend.fire("register", {username, email, password});
        window.location.href = "./profile.html";
    } catch (exception) {
            errorElem.innerHTML = exception.replace("\n","<br/>");
    }
});