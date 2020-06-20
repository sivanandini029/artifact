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
    this.replaceAnchors();
    await this.pageInit();
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
      const newContainerElem = newDocument.querySelector(".container");

      const fadeOut = containerElem.animate({
        opacity: [1, 0]
      }, 500);

      fadeOut.addEventListener("finish", () => {
        containerElem.innerHTML = newContainerElem.innerHTML;
        this.replaceAnchors();
        this.afterLoad();
        containerElem.animate({
          opacity: [0, 1]
        }, 500);

        // call the page init function
        this.pageInit();
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
      if (href.indexOf(this.baseUrl) !== -1) {
        el.addEventListener("click", async (evt) => {
          evt.preventDefault();
          if (this.getCurrentUri() !== href) {
            await this.navigate(href);
          }
        });
      }
    });
  }
}
