const authorDetailsElem = document.querySelector(".article .author-details");
const userNameElem = document.querySelector(".author-details .details .name");
const websiteButton = document.querySelector(".website-button .button");
const topicElem = document.querySelector(".meta-article");
const titleElem = document.querySelector(".main .title");
const descriptionElem = document.querySelector(".main .article .description");
const impressionElem = document.querySelector(".details .reads");

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
    userNameElem.textContent = result.owner.username;
    websiteButton.addEventListener("click", async function() {
        window.location.href = result.website;

    });
    impressionElem.textContent = result.owner.impressions + " " + "articles" + ", " + result.owner.articles + " " + "impressions";

}


















































    // userNameElem.textContent = result.username;
    // console.log(username);
    
    // });
    // const hai = result.articles;
    
    //     const labelsElem = elem("DIV", ["labels"], "", topicElem);
    //     const labelElem = elem("DIV", ["label"], "", labelsElem);
    //     const iconElem = elem("IMG", ["icon"], "", labelElem);
    //     iconElem.src = "assets/web.svg";
    //     elem("DIV", ["name"], hai.topic, labelElem);
    //     console.log(hai.topic);




