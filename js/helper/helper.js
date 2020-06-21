import fire from "../class/Backend.js";

export const getUser = async (redirectOnFail = true, redirectOnSuccess = false) => {
    try {
        const user = await fire("getUser");
        if (redirectOnSuccess) {
            window.router.navigate("./profile.html");
        }
        return user;
    } catch (exception) {
        if (redirectOnFail) {
            window.router.navigate("./login.html");
            throw exception;
        }
    }
}

export const elem = (type , classNames = [], content = "", parent = document.body, prepend = false) => {
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

export const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];