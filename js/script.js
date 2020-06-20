// page init function
import Router from "./class/Router.js";
import { initViewArticle } from "./view-article.js";

window.addEventListener("load", function () {
    const loadingScreenMain = document.querySelector(".loader");
  
    setTimeout(async () => {
        const router = new Router({ baseUrl, beforeLoad, afterLoad, pageInitFns });
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
    fn: () => console.log("Init fn of index.html")
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
  deleteLoader();
};
const createLoader = () => {
    const topLoader = elem("DIV", "top-loader");
    elem("DIV", "loader", "", topLoader);
    elem("DIV", "loader", "", topLoader);
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

// add navbar as fixed in scroll
window.addEventListener("scroll", () => {
    const headerElem = document.querySelector(".header");
    if (window.scrollY > 50 && !headerElem.classList.contains("active")) {
        headerElem.classList.add("active");
    } else if (window.scrollY <= 50 && headerElem.classList.contains("active")) {
        headerElem.classList.remove("active");
    }
});

const logout = async () => {
    try {
        await backend.fire("logout");
        window.location.href = "./index.html";
    } catch (exception) {
        throw exception;
    }
}

const logoutButton = document.getElementById("logout-button");
if (logoutButton) {
    logoutButton.addEventListener("click", function() {
        logout();
    });
}