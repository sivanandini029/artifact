
getSuggestions();
const postContainerElem = document.querySelector(".post-container");


async function getSuggestions() {
    const suggestions = await backend.fire("getSuggestions");
    
    suggestions.suggestions.forEach(el => {
        makePost(el);
    })
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
    const created = new Date(parseInt(data.created));
    if (data.owner.username) {
        elem("DIV", ["author-name"], `by ${data.owner.username}`, authorDetailsElem);
    } else {
        elem("DIV", ["author-name"], "by unknown", authorDetailsElem);
    }
    elem("DIV", ["date"], `${months[created.getMonth()]} ${created.getDate()}`, authorDetailsElem);
    
    elem("DIV", ["contents"], data.description, postElem);
}