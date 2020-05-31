class Backend {
    baseURL = "http://localhost/artifact/api";

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

        getUser: {
            url: "/user/index.php",
            method: "GET",
        },

        getSuggestions: {
            url: "/article/suggestion.php",
            method: "GET",
        },
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
            return;
        }

        try {
            result = await res.json();
            if (res.status < 200 || res.status > 299) {
                throw result.message;
            }
        } catch (exception) {
            console.error(exception);
            return;
        }

        return result.data;
    };
}
