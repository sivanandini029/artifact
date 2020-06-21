export default class Router {
  constructor({ baseUrl, beforeLoad, afterLoad, pageInitFns } = {}) {
    this.baseUrl = baseUrl || "";
    this.beforeLoad = beforeLoad || (() => {});
    this.afterLoad = afterLoad || (() => {});
    this.pageInitFns = pageInitFns || [];

    
    window.addEventListener("popstate", (evt) => {
      this.navigate(evt.srcElement.location.href);
    });
  }
  
  async startPage() {
    await this.pageInit();
    this.replaceAnchors();
    this.afterLoad();
  }

  getCurrentUri(relative = false) {
    let route = window.location.href.split("?")[0];
    if (relative) {
      route = route.split(this.baseUrl)[1];
    }
    return route;
  }

  async loadPage(pageUrl) {
    try {
      const res = await fetch(pageUrl);
      const result = await res.text();
      const contents = new DOMParser().parseFromString(result, "text/html");
      return contents;
    } catch (exception) {
      console.log("Couldn't load page");
      console.error(exception);
      throw exception;
    }
  }

  async navigate(href) {
    try {
      this.beforeLoad(); 
      const newDocument = await this.loadPage(href);
      history.pushState({}, '', href)
      
      // replace title
      document.title = newDocument.title;
      
      // replace container
      const containerElem = document.querySelector(".container");
      const styleElem = document.querySelector("style");
      const newContainerElem = newDocument.querySelector(".container");
      const newStyleElem = newDocument.querySelector("style");

      const fadeOut = containerElem.animate({
        opacity: [1, 0]
      }, 500);

      fadeOut.addEventListener("finish", async () => {
        // load styles
        this.loadStyles(document, newDocument);

        containerElem.parentElement.removeChild(containerElem);
        styleElem && styleElem.parentElement.removeChild(styleElem);
        
        document.body.appendChild(newContainerElem);
        newContainerElem.style.opacity = 0;
        newStyleElem && document.head.appendChild(newStyleElem);
        // call the page init function
        await this.pageInit();

        this.replaceAnchors();
        this.afterLoad();
        newContainerElem.animate({
          opacity: [0, 1]
        }, 500).addEventListener("finish", () => {
          newContainerElem.style.opacity = 1;
        })
      });
      
    } catch (exception) {
      console.error(exception);
    }
  }
  
  async pageInit() {
    const currentPage = this.getCurrentUri(true);
    const currentPageObj = this.pageInitFns.find((initFn) => 
      (Array.isArray(initFn.path) && initFn.path.includes(currentPage)) || initFn.path === currentPage
    );
    if (currentPageObj) {
      await currentPageObj.fn();
    }
  }
  
  replaceAnchors() {
    document.querySelectorAll("a").forEach((el) => {
      const href = el.href;
      if (href.indexOf(this.baseUrl) !== -1 ) {
        el.addEventListener("click", async (evt) => {
          evt.preventDefault();
          if (href.indexOf(this.getCurrentUri()) === -1 || [this.baseUrl, `${this.baseUrl}/`].includes(this.getCurrentUri())) {
            await this.navigate(href);
          }
        });
      }
    });
  }

  loadStyles(document, newDocument) {
    let oldStyles = [];
    let newStyles = [];
     
    // get old styles
    const oldStylesElem = document.querySelectorAll("link[rel=stylesheet]");
    for (let i = 0; i < oldStylesElem.length; i++) {
      oldStyles.push(oldStylesElem[i].getAttribute("href"));
    }

    const newStylesElem = newDocument.querySelectorAll("link[rel=stylesheet]");
    for (let i = 0; i < newStylesElem.length; i++) {
      newStyles.push(newStylesElem[i].getAttribute("href"));
    }

    let diffPositions = [];
    let stylesToAdd = [];

    newStyles.forEach(newStyle => {
      if (!oldStyles.includes(newStyle)) { 
        stylesToAdd.push(newStyle)    ;
      }
    });

    oldStyles.forEach((oldStyle, i) => {
      if (!newStyles.includes(oldStyle)) {
        diffPositions.push(i);
      }
    });

    if (stylesToAdd.length >= diffPositions.length) {
      diffPositions.forEach((diffPos) => {
        oldStylesElem[diffPos].href = stylesToAdd[0];
        stylesToAdd.splice(0, 1);
      });
      stylesToAdd.forEach(styleToAdd => {
        const styleRef = document.createElement("link");
        styleRef.rel = "stylesheet";
        styleRef.type = "text/css";
        styleRef.href = styleToAdd;
        document.getElementsByTagName("head")[0].appendChild(styleRef)
      });
    } else {
      stylesToAdd.forEach((styleToAdd, i) => {
        oldStylesElem[i].href = styleToAdd;
      });

      const deletingPos = diffPositions.splice(stylesToAdd.length);
      deletingPos.forEach(deletingPosition => {
        oldStylesElem[deletingPosition].parentElement.removeChild(oldStylesElem[deletingPosition]);
      })
    }
  }
}
