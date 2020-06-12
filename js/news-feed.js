const postContainerElem = document.querySelector(".post-container");
const userProfileElem = document.querySelector(".user-profile");
const userArticleElem = document.querySelector(".user-profile .user-articles");

getSuggestions();

async function getSuggestions() {
    await getUser(true, false);
    try {
        const suggestions = await backend.fire("getSuggestions");
        suggestions.suggestions.forEach(el => {
            makePost(el);
        })
    } catch (exception) {

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

loadProfile();

async function loadProfile() {
    try {
       const result = await getUser(true, false);
       console.log(result);
       const username = document.querySelector(".user-profile .profile-container .profile-name");
       username.textContent = result.username;

       result.articles.filter(data => data.status === "PUBLISHED").forEach(data => {
        const postElem = elem("A", ["subject"], "", userArticleElem);
        postElem.href = `./view-article.html?id=${data.id}`;

        const headingElem = elem("DIV", ["heading"], data.title, postElem);
        elem("DIV", ["readings"], `${data.views} views, ${data.impressions} impressions`, postElem);
     });
    } catch (exception) {
        console.log(exception);
     }
}