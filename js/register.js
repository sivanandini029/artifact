const formElem = document.querySelector(".form");
const errorElem = document.querySelector(".form .error");
formElem.addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.querySelector(".form .input-container input[name=username]").value;
    const email = document.querySelector(".form .input-container input[name=email]").value;
    const password = document.querySelector(".form .input-container input[name=password]").value;
    try {
        errorElem.textContent = "";
        await backend.fire("register", {username:username, email:email, password:password});
        window.location.href = "./profile.html";
    }
    catch (exception) {
            errorElem.innerHTML = exception.replace("/n","<br/>");
    }
});