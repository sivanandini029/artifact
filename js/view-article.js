import { getUser, elem, months } from "./helper/helper.js";
import fire from "./class/Backend.js";

let ownerNameElem;
let authorDetailsElem;
let websiteButton;
let topicElem;
let titleElem;
let descriptionElem;
let impressionElem;
let contentElem;
let iconElem;
let timeToReadElem;
let authorMoreElem;
let ownerNameElem2;
let bioElem;
let websiteButton2;
let followTopicElem;
let responseElem;
let impressionsElem;
let impressionsNumElem;
let impressionsIconElem;
let responseFormElem;
let response;
let responseErrorElem;
let commentSection;
let commentElem;
let loginMsg;
let authHeaderElem;
let noauthHeaderElem;
let user;

export default async function initViewArticle() {
    initializeGlobals();
    await fillDetails();
}
function initializeGlobals() {
    authorDetailsElem = document.querySelector(".article .author-details");
    ownerNameElem = document.querySelector(".author-details .details .name");
    websiteButton = document.querySelector(".website-button .button");
    topicElem = document.querySelector(".meta-article .labels .label .name");
    titleElem = document.querySelector(".main .title");
    descriptionElem = document.querySelector(".main .article .description");
    impressionElem = document.querySelector(".details .reads");
    contentElem = document.querySelector(".content");
    iconElem = document.querySelector(".labels .label .icon");
    timeToReadElem = document.querySelector(".meta-article .time-to-read");
    authorMoreElem = document.querySelector(".article-more .author-details");
    ownerNameElem2 = document.querySelector(".author-more .name-website .name");
    bioElem = document.querySelector(".author-more .description");
    websiteButton2 = document.querySelector(".author-more .name-website a");
    followTopicElem = document.querySelector(".follow-container .topic");
    responseElem = document.querySelector(".response-section .input-container textarea[name=response]");
    impressionsElem = document.querySelector(".impressions-follow .impressions-container");
    impressionsNumElem = document.querySelector(".impressions-follow .impressions-container .no-of-impressions");
    impressionsIconElem = document.querySelector(".impressions-container .icon");
    responseFormElem = document.querySelector(".response-section .form ")
    response = document.querySelector(".response-section .form .input-container textarea[name=response]");
    responseErrorElem = document.querySelector(".response-section .error");
    commentSection = document.querySelector(".response-section");
    commentElem = document.querySelector(".responses");
    loginMsg = document.querySelector(".login-message");
    authHeaderElem = document.querySelector(".header.auth");
    noauthHeaderElem = document.querySelector(".header.no-auth");

}


async function fillDetails() {
    // get info of current user
    user = await getUser(false, false);
    
    if (user) {
        noauthHeaderElem.parentElement.removeChild(noauthHeaderElem);
    } else {
        authHeaderElem.parentElement.removeChild(authHeaderElem);
    }
    
    try {
        // get id of the article currently being viewed
        let params = new URLSearchParams(document.location.search.substring(1));
        let id = params.get("id");
        if (!id) {
            window.router.navigate("./index.html");
        }
        
        // get info about the article
        const result = await fire("getArticle", {}, {id});
        
        if (!result) {
            window.router.navigate("./index.html");
        }
        titleElem.textContent = result.title;
        descriptionElem.textContent = result.description;
        result.content.split("\n").forEach((para) => {
            if(para){
                elem("P", [], para, contentElem);
            }
        });

        ownerNameElem.textContent = result.owner.username || "Unknown";
        if(result.owner.website) {
            websiteButton.href = result.owner.website;
        } else{
            websiteButton.style.visibility = "hidden";
        }
        
        setImpressions(result.owner.articles, result.viewer_has_liked, result.owner.impressions, result.impressions)
        topicElem.textContent = result.topic;
        iconElem.src = "assets/web.svg";
    
        const timetoReadInt = Math.ceil(contentElem.textContent.replace("\n", "").split(" ").length / 100);
        const created = new Date(parseInt(result.created)*1000);
        timeToReadElem.textContent = `${timetoReadInt} min${timetoReadInt > 1? "s": ""} read \n\u2022 ${months[created.getMonth()]} ${created.getDate()}`;
        
        if (Object.keys(result.owner).length !== 0) {
            ownerNameElem2.textContent = result.owner.username;
            bioElem.textContent = result.owner.bio;
        
            if(result.owner.website) {
                websiteButton2.href = result.owner.website;
            } else{
                websiteButton2.style.visibility = "hidden";
            }
        } else {
            authorMoreElem.style.display = "none";
        }
    
        followTopicElem.textContent = `Topic: ${result.topic}`;
    
        impressionsElem.addEventListener("click", async function() {
            if (user) {
                try {
                    const imp = await fire("toggleImpression", {}, {id});
                    setImpressions(imp.owner.articles, imp.viewer_has_liked, imp.owner.impressions, imp.impressions)
                } catch(exception) {
                    console.log(exception);
                }
            } else {
                window.router.navigate("./login.html");
            }
            
        });  
        if (user) {
            responseFormElem.addEventListener("submit", async function(e) {
                e.preventDefault();
                const comment = response.value;
                try {
                    responseErrorElem.textContent = "";
                    const com = await fire("addComment", {comment}, {id});
                    responseErrorElem.textContent = "success";
                    response.value = "";
                    makeComment(com);
                } catch(exception) {
                    console.error(exception);
                    responseErrorElem.innerHTML = exception.replace("\n","<br/>");
                }
            });
        } else {
            commentSection.style.display = "none";
            loginMsg.style.display = "block";
            loginMsg.innerHTML = "<a class=\"link\" href=\"./login.html\">LOGIN</a> TO COMMENT";
        }
        
        if (result.comments.length > 0) {
            result.comments.forEach(el => {
                makeComment(el);
            })
        } else {
            const noResponseElem = elem("DIV", ["response"], "No comments", commentElem);
            noResponseElem.style.color = "#999999";
            noResponseElem.style.fontSize = "1.3rem";
        }
        function makeComment(data) {
            const commentResponseElem = elem("DIV", ["response"], "", commentElem);
            const profileElem = elem("DIV", ["profile-container"], "", commentResponseElem);
            const profilePicElem = elem("DIV", ["profile-pic", "small"], "", profileElem);
            const imgElem = elem("IMG", ["picture"], "", profilePicElem);
            imgElem.src = "assets/undraw_profile_pic_ic5t 1.svg";
            const detailsElem = elem("DIV", ["details"], "", profileElem);
            const nameElem = elem("DIV", ["name", "make-purple"], data.username, detailsElem);
            const dateElem = new Date(parseInt(result.created)*1000);
            elem("DIV", ["reads"], `${months[dateElem.getMonth()]} ${dateElem.getDate()}`, detailsElem);
            const contentElem = elem("DIV", ["explanation"], data.content, detailsElem);
            const userImpressionElem = elem("DIV", ["impression"], "", commentResponseElem);
            const impressionContainer = elem("DIV", ["impressions-container", "bottom-control"], "", userImpressionElem);
            const impIconElem = elem("DIV", ["icon", "small"], "", impressionContainer);
            const impIconElem1 = elem("IMG", [], "", impIconElem);
            impIconElem1.src = "assets/favorites-button 2.svg";
            const commentImpressionNum = elem("DIV", ["number-of-likes"], "", impressionContainer);
            commentImpressionNum.textContent = data.impressions;
            userImpressionElem.addEventListener("click", async function() {
                if (!user) {
                    window.router.navigate("./login.html");
                    return;
                }
                try {
                    
                    const imp1 = await backend.fire("toggleCommentImpression", {}, {id:data.id});
                
                    commentImpressionNum.textContent = imp1.impressions;
                    if (imp1.viewer_has_liked) {
                        impIconElem.classList.add("active");
                    } else {
                    impIconElem.classList.remove("active");
                    }
                } catch(exception) {
                    console.log(exception);
                }     
            });  
           
            if (data.viewer_has_liked) {
                impIconElem.classList.add("active");
            } else {
                impIconElem.classList.remove("active");
            }
        }  
    } catch (exception) {
        console.log(exception);
        window.router.navigate("./index.html");
    }
}

function setImpressions(article, viewerLiked, allImpressions, thisImpression) {
    if (article && allImpressions) {
        impressionElem.textContent = `${article} article${article > 1? "s": ""}, ${allImpressions} impression${allImpressions > 1? "s": ""}`;
    }
    impressionsNumElem.textContent = thisImpression;

    if (viewerLiked) {
        impressionsIconElem.classList.add("active");
    } else {
        impressionsIconElem.classList.remove("active");
    }
}


