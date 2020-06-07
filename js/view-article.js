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
const websiteButton2 = document.querySelector(".author-more .name-website button");
const followTopicElem = document.querySelector(".follow-container .topic");
const responseElem = document.querySelector(".response-section .input-container textarea[name=response]");
const impressionsElem = document.querySelector(".impressions-follow .impressions-container");
const impressionsNumElem= document.querySelector(".impressions-follow .impressions-container .no-of-impressions");
const impressionsErrorElem = document.querySelector(".impressions-follow .error");

fillDetails();
async function fillDetails() {
    const user = await getUser(false, false);
    let params = new URLSearchParams(document.location.search.substring(1));
    let id = params.get("id");
    console.log(id);
    if(id == null){
        window.location.href = "./index.html";
    }
    const result = await backend.fire("getArticle", {}, {id});
    console.log(result);
    titleElem.textContent = result.title;
    descriptionElem.textContent = result.description;
    result.content.split("\n").forEach((para) => {
        if(para){
            elem("P", [], para, contentElem);
        }
    });
    ownerNameElem.textContent = result.owner.username;
    
    if(result.owner.website) {
        websiteButton.addEventListener("click",  function() {
            window.location.href = result.owner.website;
    
        });
    } else{
        websiteButton.style.display = "hidden";
    }
    
    impressionElem.textContent = result.owner.impressions + " " + "impressions" + ", " + result.owner.articles + " " + "articles";
    topicElem.textContent = result.topic;
    iconElem.src = "assets/web.svg";
    timeToReadElem.textContent = Math.floor(contentElem.textContent.replace("\n", "").split(" ").length/100) + " " + "mins" + " " + "read" + " " + "\n\u2022" + " ";
    const created = new Date(parseInt(result.created)*1000);
    elem("SPAN", ["time-to-read"], `${months[created.getMonth()]} ${created.getDate()}`, timeToReadElem);

    ownerNameElem2.textContent = result.owner.username;
    bioElem.textContent = result.owner.bio;

    if(result.owner.website) {
        websiteButton2.addEventListener("click",  function() {
            window.location.href = result.owner.website;
    
        });
    } else{
        websiteButton2.style.display = "hidden";
    }

    followTopicElem.textContent = "Topic:" + result.topic;

    
    impressionsElem.addEventListener("click", async function(e) {
        e.preventDefault();
        if(user) {
            try {
                impressionsErrorElem.textContent = "";
                const imp = await backend.fire("toggleImpression", {}, {id});
                impressionsNumElem.textContent = imp.impressions;
            } catch(exception) {
                    console.log(exception);
            }
        } else {
                window.location.href = "./login.html";
            }
           
    
        });
       
    
    
}


















































    // userNameElem.textContent = result.username;
    // console.log(username);
    
    // });
    // const hai = result.articles;
    
    //     




