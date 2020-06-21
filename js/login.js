import { getUser } from "./helper/helper.js";
import fire from "./class/Backend.js";

let formElem;
let errorElem;

export default async function initLogin() {
    initializeGlobals();
    await checkLogin();
    eventListeners();
}

function initializeGlobals() {
    formElem = document.querySelector(".form");
    errorElem = document.querySelector(".form .error");
}

async function checkLogin() {
    await getUser(false, true);
}

function eventListeners() {
    formElem.addEventListener("submit", async function (e) {
        e.preventDefault();
        const username = document.querySelector(".form .input-container input[name=username]").value;
        const password = document.querySelector(".form .input-container input[name=password]").value;
        try {
            errorElem.textContent = "";
            await fire("login", {username, password});
            window.router.navigate("./news-feed.html");
        } catch (exception) {
                errorElem.textContent = exception;
        }
    });
}