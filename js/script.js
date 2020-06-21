// page init function
import Router from "./class/Router.js";
import { elem } from "./helper/helper.js";
import fire from "./class/Backend.js";
import initIndex from "./index.js";
import initLogin from "./login.js";
import initRegister from "./register.js";
import initViewArticle from "./view-article.js";

window.addEventListener("load", function () {
    const loadingScreenMain = document.querySelector(".loader");
  
    setTimeout(async () => {
        window.router = new Router({ baseUrl, beforeLoad, afterLoad, pageInitFns });
        await router.startPage();
        loadingScreenMain.animate({
            opacity: [1, 0],
        }, {
            duration: 300,
            easing: "ease-in-out",
        }).addEventListener("finish", async () => {
            loadingScreenMain.style.display = "none";
        });
    }, 2000);
});

const baseUrl = "http://localhost/artifact";
const pageInitFns = [
    {
        path: ["/", "/index.html"],
        fn: initIndex,
    },
    {
        path: ["/login.html"],
        fn: initLogin,
    },
    {
        path: ["/register.html"],
        fn: initRegister,
    },
    {
        path: "/view-article.html",
        fn: initViewArticle,
    },
];
const beforeLoad = () => {
    createLoader();
};
const afterLoad = () => {
    adjustHeaderForScroll();
    eventListeners();
    deleteLoader();
};
const createLoader = () => {
    const topLoader = elem("DIV", ["top-loader"]);
    elem("DIV", ["loader"], "", topLoader);
    elem("DIV", ["loader"], "", topLoader);
    topLoader.animate({
      opacity: [0, 1]
    }, 50);
};
  
const deleteLoader = () => {
    const topLoader = document.querySelector(".top-loader");
    if (topLoader) {
        const topLoaderFadeOut = topLoader.animate({
            opacity: [1, 0]
        }, 50);

        topLoaderFadeOut.addEventListener("finish", () => {
            topLoader.parentElement.removeChild(topLoader);
        });
    }
}

function eventListeners() {
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            try {
                await fire("logout");
                window.router.navigate("./index.html");
            } catch (exception) {
                throw exception;
            }
        });
    }
}

// add navbar as fixed in scroll
window.addEventListener("scroll", () => {
    adjustHeaderForScroll();
});

function adjustHeaderForScroll() {
    const headerElem = document.querySelector(".header");
    if (window.scrollY > 50 && !headerElem.classList.contains("active")) {
        headerElem.classList.add("active");
    } else if (window.scrollY <= 50 && headerElem.classList.contains("active")) {
        headerElem.classList.remove("active");
    }
}
