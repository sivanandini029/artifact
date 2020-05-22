// all the super globals (not available in class folder) can be declared here

const backend = new Backend();

const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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