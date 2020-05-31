# Artifact
 Artifact is an article sharing website. You can read articles, like them comment on them and you can make your own articles after making an account.

## API Documentation

The `base_url` will refer to the basic endpoint for the backend. In most cases this will be `https://localhost/project_name/api`, if you have cloned this project on the root of your server's directory. You should fill in this `base_url` in every mentioned endpoints. The endpoints are mainly classified into 3 (user, article and comment). 

Every other endpoints and endpoints with no access (endpoints that can be accessed only after logging in) may result in a 404 HTTP error. The HTTP status code will be present in the header as will be presented in the body with a message describing the facts in most cases.

Example: 
```JSON
{
    "statusCode": 201,
    "message": "Created new user",
    "data": {
        "username": "john",
        "email": "john@example.com"
    }
}
```

### User

- **`POST user/index.php`**

    Create a new user in the system. Requires 3 body parameters the username, email and password.

    |Parmeter|Optional|
    |---|---|
    |username|no|
    |email|no|
    |password|no|


- **`GET /user/index.php (AUTHENTICATED)`**

    Will get the information of the username specified by the username (if not specified the information of the currently logged in user).

    |Parmeter|Optional|
    |---|---|
    |username|yes|


- **`POST /user/login.php`**

    Login into a user account this will grant access to authenticated endpoints. The body parameters are username and password.

    |Parmeter|Optional|
    |---|---|
    |username|no|
    |password|no|


- **`GET /user/logout.php (AUTHENTICATED)`**

    Logout of the user account. No parameters are needed.


Articles

- **`POST /article/index.php (AUTHENTICATED)`**

    Create a new article entry. 

    |Parmeter|Optional|
    |---|---|
    |title|no|
    |description|no|
    |content|no|
    |topic|no|

- **`GET /article/index.php`**

    Will get the article and author information specified by an `id`.

    |Parmeter|Optional|
    |---|---|
    |id|no|

- **`GET /article/suggestions.php`**

    Get suggested articles for a particular user.

- **`GET /article/search.php`**

    Will get the articles based on the search parameters.

    |Parmeter|Optional|
    |---|---|
    |query|no|
    |topic|yes|
    |author|yes|


    