export const getUser = async (redirectOnFail = true, redirectOnSuccess = false) => {
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