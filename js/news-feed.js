const postContainerElem = document.querySelector(".post-container");
const userProfileElem = document.querySelector(".user-profile");
const userArticleElem = document.querySelector(".user-profile .user-articles");
const emptyMessageElem = document.querySelector(".recent-articles .empty-message");
let nextPageUrl = 1;
let requestRunning = false;
let showedFeeds = [];

initNewsFeed();

async function initNewsFeed() {
    await getUser(true, false);
    await getSuggestions();
}

async function getSuggestions() {
    if (requestRunning) return false;
    try {
        requestRunning = true;
        const suggestions = await backend.fire("getSuggestions", {}, {page: nextPageUrl});
        if (suggestions.next_page) {
            nextPageUrl = suggestions.next_page;
            emptyMessageElem.style.display = "none";
        } else {
            emptyMessageElem.style.display = "block";
        }
        if (suggestions.suggestions.length > 0) {
            suggestions.suggestions.forEach(el => {
                if (!showedFeeds.includes(el.id)) {
                    makePost(el);
                    showedFeeds.push(el.id);
                } else {
                    console.log(el);
                }
            })
        } else if (nextPageUrl === 1) {
            elem("DIV", ["response", "empty-message"], "No published articles", postContainerElem);
        }
    } catch (exception) {
        console.log(exception)
    } finally {
        requestRunning = false;
    }
}

window.addEventListener("scroll", async () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (nextPageUrl) {
            getSuggestions();
        }
    }
});

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
        const username = document.querySelector(".user-profile .profile-container .profile-name");
        username.textContent = result.username;

        const userArticles = result.articles.filter(data => data.status === "PUBLISHED").slice(0, 9);
        if (userArticles.length > 0) {

            userArticles.forEach(data => {
                const postElem = elem("A", ["subject", "primary-link"], "", userArticleElem);
                postElem.href = `./view-article.html?id=${data.id}`;
    
                elem("DIV", ["heading"], data.title, postElem);
                elem("DIV", ["readings"], `${data.views} views, ${data.impressions} impressions`, postElem);
            });
        } else {
            const responseElem = elem("DIV", ["response"], "No published articles", userArticleElem);
            responseElem.style.color = "#999999";
            responseElem.style.fontSize = "1.3rem";
        }
    } catch (exception) {
        console.log(exception);
     }
}