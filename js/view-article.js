const authorDetailsElem = document.querySelector(".article .author-details");
const ownerNameElem = document.querySelector(".author-details .details .name");
const websiteButton = document.querySelector(".website-button .button");
const topicElem = document.querySelector(".meta-article .labels .label .name");
const titleElem = document.querySelector(".main .title");
const descriptionElem = document.querySelector(".main .article .description");
const impressionElem = document.querySelector(".details .reads");
const contentElem = document.querySelector(".content");
const iconElem = document.querySelector(".labels .label .icon");
const timeToReadElem = document.querySelector(".meta-article .time-to-read");
const ownerNameElem2 = document.querySelector(".author-more .name-website .name");
const bioElem = document.querySelector(".author-more .description");
const websiteButton2 = document.querySelector(".author-more .name-website a");
const followTopicElem = document.querySelector(".follow-container .topic");
const responseElem = document.querySelector(".response-section .input-container textarea[name=response]");
const impressionsElem = document.querySelector(".impressions-follow .impressions-container");
const impressionsNumElem = document.querySelector(".impressions-follow .impressions-container .no-of-impressions");
const impressionsIconElem = document.querySelector(".impressions-container .icon");

fillDetails();

async function fillDetails() {
    // get info of current user
    const user = await getUser(false, false);

    // get id of the article currently being viewed
    let params = new URLSearchParams(document.location.search.substring(1));
    let id = params.get("id");
    if(!id){
        window.location.href = "./index.html";
    }

    // get info about the article
    const result = await backend.fire("getArticle", {}, {id});
    

    titleElem.textContent = result.title;
    descriptionElem.textContent = result.description;
    result.content.split("\n").forEach((para) => {
        if(para){
            elem("P", [], para, contentElem);
        }
    });
    ownerNameElem.textContent = result.owner.username;
    if(result.owner.website) {
        websiteButton.href = result.owner.website;
    } else{
        websiteButton.style.visibility = "hidden";
    }
    
    setImrpressions(result.owner.articles, result.viewer_has_liked, result.owner.impressions, result.impressions)
    topicElem.textContent = result.topic;
    iconElem.src = "assets/web.svg";

    const timetoReadInt = Math.ceil(contentElem.textContent.replace("\n", "").split(" ").length / 100);
    const created = new Date(parseInt(result.created)*1000);
    timeToReadElem.textContent = `${timetoReadInt} min${timetoReadInt > 1? "s": ""} read \n\u2022 ${months[created.getMonth()]} ${created.getDate()}`;
    
    ownerNameElem2.textContent = result.owner.username;
    bioElem.textContent = result.owner.bio;

    if(result.owner.website) {
        websiteButton2.href = result.owner.website;
    } else{
        websiteButton2.style.visibility = "hidden";
    }

    followTopicElem.textContent = `Topic: ${result.topic}`;

    impressionsElem.addEventListener("click", async function() {
        if(user) {
            try {
                const imp = await backend.fire("toggleImpression", {}, {id});
                setImrpressions(imp.owner.articles, imp.viewer_has_liked, imp.owner.impressions, imp.impressions)
            } catch(exception) {
                console.log(exception);
            }
        } else {
            window.location.href = "./login.html";
        }
        
    });    
}

function setImrpressions(article, viewerLiked, allImpressions, thisImpression) {
    impressionElem.textContent = `${article} article${article > 1? "s": ""}, ${allImpressions} impression${allImpressions > 1? "s": ""}`;
    impressionsNumElem.textContent = thisImpression;

    if (viewerLiked) {
        impressionsIconElem.classList.add("active");
    } else {
        impressionsIconElem.classList.remove("active");
    }
}
