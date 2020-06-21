import { getUser, elem, months } from "./helper/helper.js";
import fire from "./class/Backend.js";

let postContainerElem;

export default async function initIndex() {
    initializeGlobals();
    await getSuggestions();
}

function initializeGlobals() {
    postContainerElem = document.querySelector(".post-container");
}

async function getSuggestions() {
    await getUser(false, true);
    try {
        const suggestions = await fire("getSuggestions");
        suggestions.suggestions.forEach(el => {
            makePost(el);
        })
    } catch (exception) {
        console.log(exception);
    } 
}

function makePost(data) {
    const postElem = elem("A", ["post"], "", postContainerElem);
    postElem.href = `./view-article.html?id=${data.id}`;

    const labelsElem = elem("DIV", ["labels"], "", postElem);
    const labelElem = elem("DIV", ["label"], "", labelsElem);
    const iconElem = elem("IMG", ["icon"], "", labelElem);
    iconElem.src = "assets/web.svg";
    elem("DIV", ["name"], data.topic, labelElem);
    
    
    const subjectElem = elem("DIV", ["subject"], "", postElem);
    elem("DIV", ["heading"], data.title, subjectElem);
    elem("DIV", ["readings"], `${data.views} views, ${data.impressions} impressions`, subjectElem);

    const authorDetailsElem = elem("DIV", ["author-details"], "", postElem);
    const created = new Date(parseInt(data.created)*1000);
    if (data.owner.username) {
        elem("DIV", ["author-name"], `by ${data.owner.username}`, authorDetailsElem);
    } else {
        elem("DIV", ["author-name"], "by unknown", authorDetailsElem);
    }
    elem("DIV", ["date"], `${months[created.getMonth()]} ${created.getDate()}`, authorDetailsElem);
    
    elem("DIV", ["contents"], data.description, postElem);
}