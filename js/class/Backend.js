class Backend {
    baseURL = "./api";

    endpoints = {
        hello: {
            url: "/index.php",
            method: "GET",
        },

        register: {
            url: "/user/index.php",
            method: "POST",
        },

        login: {
            url: "/user/login.php",
            method: "POST",
        },

        logout: {
            url: "/user/logout.php",
            method: "GET",
        },

        getUser: {
            url: "/user/index.php",
            method: "GET",
        },

        getSuggestions: {
            url: "/article/suggestion.php",
            method: "GET",
        },

        addArticle: {
            url: "/article/index.php",
            method: "POST",
        },

        editUser: {
            url: "/user/index.php",
            method: "PATCH",
        },

        getArticle: {
            url: "/article/index.php",
            method: "GET",
        },

        toggleImpression: {
            url: "/article/impression.php",
            method: "POST",
        },

        changePassword: {
            url: "/user/change-password.php",
            method: "PATCH",
        },

        addComment: {
            url: "/article/comment/index.php",
            method: "POST",
        },

        toggleCommentImpression: {
            url: "/article/comment/impression.php",
            method: "POST",
        },

        editArticle: {
            url: "/article/index.php",
            method: "PATCH",
        }
    };

    constructor(newBaseURL = "") {
        this.baseURL = newBaseURL ? newBaseURL : this.baseURL;
    }

    fire = async (type, body = {}, getParams = {}) => {
        const request = { ...this.endpoints[type] };
        if (getParams) {
            const qs = Object.keys(getParams)
                .map(
                    (k) =>
                        encodeURIComponent(k) +
                        "=" +
                        encodeURIComponent(getParams[k])
                )
                .join("&");
            request.url += qs ? `?${qs}` : "";
        }

        const headers = new Headers({
            "Content-Type": "application/json",
        });
        let requestBody = {
            method: request.method,
            headers,
        };

        if (request.method.toUpperCase() !== "GET") {
            requestBody.body = JSON.stringify(body);
        }

        let res, result;
        try {
            res = await fetch(`${this.baseURL}${request.url}`, requestBody);
        } catch (exception) {
            console.log(exception, "couldn't even send the request");
            throw "Couldn't send request";
        }

        try {
            result = await res.json();
            if (res.status < 200 || res.status > 299) {
                throw result.message;
            }
        } catch (exception) {
            console.error(exception);
            throw exception;
        }

        return result.data;
    };
}
