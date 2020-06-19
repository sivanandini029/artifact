// all the super globals (not available in class folder) can be declared here

const backend = new Backend();

const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// add navbar as fixed in scroll
window.addEventListener("scroll", () => {
    const headerElem = document.querySelector(".header");
    if (window.scrollY > 50 && !headerElem.classList.contains("active")) {
        headerElem.classList.add("active");
    } else if (window.scrollY <= 50 && headerElem.classList.contains("active")) {
        headerElem.classList.remove("active");
    }
});

const elem = (type , classNames = [], content = "", parent = document.body, prepend = false) => {
    const el = document.createElement(type);
    classNames.forEach(className => el.classList.add(className));
    el.appendChild(document.createTextNode(content));
    if (prepend) {
        parent.prepend(el);
    } else {
        parent.append(el);
    }
    return el;
}

const getUser = async (redirectOnFail = true, redirectOnSuccess = false) => {
    try {
        const user = await backend.fire("getUser");
        if (redirectOnSuccess) {
            window.location.href = "./profile.html";
        }
        return user;
    } catch (exception) {
        if (redirectOnFail) {
            window.location.href = "./login.html";
            throw exception;
        }
    }
}

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