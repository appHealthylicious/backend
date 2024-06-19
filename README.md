![Healthylicious](https://storage.googleapis.com/healthylicious-assets/Healthylicious%20Header.png "Healthylicious Logo")
## Healthylicious - Backend
Healthylicious is a mobile application designed to promote healthier eating habits by providing personalized meal recommendations based on users' dietary preferences and available ingredients. Whether you are looking to lose weight, manage a health condition, or simply eat more nutritious foods, Healthylicious is your go-to companion for a healthier lifestyle.

## Tech Stack
- Hapi JS
- Firebase
- Google Cloud Storage
- Google Cloud Run

## Project Setup
```
# clone Healthylicious repository
$ git clone 
# change directory to backend
$ cd backend
```
### Configure .env
```
DATABASE_URL= <YOUR_DATABASE_URL>
JWT_SECRET = <YOUR JWT PASSWORD>
FIREBASE_API_KEY = <YOUR_API_KEY>
PORT = <PORT>
EMAIL_USER= <YOUR_EMAIL>
EMAIL_PASS= <YOUR_PASSWORD>
```

### Configure firebase-service-account.json
{
	"type": "service_account",
	"project_id": "<YOUR_PROJECT_ID>",
	"private_key_id": "<YOUR_PRIVATE_KEY_ID>",
	"private_key": "<YOUR_PRIVATE_KEY>",
	"client_email": "<YOUR_CLIENT_EMAIL>",
	"client_id":  "<YOUR_CLIENT_ID>",
	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
	"token_uri": "https://oauth2.googleapis.com/token",
	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
	"client_x509_cert_url": "<YOUR_CLIENT_X509_CERT_URL>",
	"universe_domain": "googleapis.com"
}

## Features

|  Endpoint|Method |Description|
|--|--|--|
|**AUTH**||
| /register | POST  |Create Healthylicious Account|
| /login| POST|Login to Healthylicious App| 
| /login/google |POST | Login with Google|
|/request-reset-password|POST|Request Reset password|
|**USER PROFILE**||
| /user/profile|POST |Add user profile details| 
|/user/profile|PUT |Update user profile details |
| /user/profile/{uid}| GET|View user profile details | 
|/user/dislikes|POST|Add dislikes / allergies ingredients|
|/user/dislikes |GET| View dislikes / allergies ingredients|
|**FEATURES**||
|/ingredients |GET |View all ingredients sorted by categories |
|/ingredients/search | GET | Search ingredients |
|/recipes|GET|View all recipes title and image|
|/recipes/search|GET|Search recipes|
|/recipes/{title}|GET | View detailed recipe
|/recommendations|GET| View recipes grouped by categories: Easy to Make, Quick to Cook, Breakfast, Dessert, Snack
|/rate|POST|Rate the recipe|
|/rate/recommendations|GET| View recommended recipe based on rating
|/rating|GET|View all recipes rating
|/generate|POST|Generate recipes recommendation


## API Documentation

### POST /register
**Request**
Method: POST
Endpoint: /register
Body parameters:
```json
{
	"email": "<your_email>",
	"password": "<your_password>"
}
```

### POST /login
**Request**
Method: POST
Endpoint: /login
Body parameters:
```json
{
	"email": "<your_email>",
	"password": "<your_password>"
}
```

### POST /request-reset-password
**Request**
Method: POST
Endpoint: /request-reset-password
Body parameters:
```json
{
	"email": "<your_email>"
}
```

### POST /user/profile
**Request**
Method: POST
Endpoint: /user/profile
Header : Authorization: Bearer "token"
Body parameters:
```json
{
	"username": "Name",
	"age": 21,
	"weight": 50,
	"height": 175
}
```

### PUT /user/profile
Method: PUT
Endpoint: /user/profile
Header : Authorization: Bearer "token"
Body parameters: 
```json
{
	"username": "New Name",
	"age": 21,
	"weight": 50,
	"height": 175
}
```


### GET /user/profile
Method: GET
Endpoint: /user/profile{uid}
Header : Authorization: Bearer "token"
Body parameters: -

### POST /user/dislikes
Method: POST
Endpoint: /user/dislikes
Header : Authorization: Bearer "token"
Body parameters: 
```json
["beef","corn","bacon","potato,crab"]
```
### GET /user/dislikes
Method: GET
Endpoint: /user/dislikes
Header : Authorization: Bearer "token"
Body parameters:  -

### GET /ingredients
Method: Get
Endpoint: /ingredients
Body parameters: -

### GET /ingredients/search
Method: Get
Endpoint: /ingredients/search
Body parameters: 
- Key : query
- Value : chili (your ingredient search)

### GET /recipes
Method: GET
Endpoint: /ingredients
Body parameters: -

### GET /recipes/search
Method: GET
Endpoint: /ingredients/search
Body parameters: 
- Key : query
- Value : chili (your recipes key search)

### GET /recipes/search
Method: GET
Endpoint: /ingredients/{title}
Body parameters: -

### GET /recommendations
Method: GET
Endpoint: /recommendations
Body parameters: -

###  POST /rate
Method: POST
Endpoint: /rate
Header : Authorization: Bearer "token"
Body parameters: 
```json
{
	"recipeId": "15",
	"rating": 3
}
```

### GET /rate/recommendations
Method: GET
Endpoint: /rate/recommendations
Header : Authorization: Bearer "token"
Body parameters: -

### GET /rating
Method: GET
Endpoint: /rating
Body parameters: -

### POST /generate
Method: POST
Endpoint: /generate
Header : Authorization: Bearer "token"
Body parameters: 
```json
{
	"ingredients": "beef, butter, salt"
}
```




### Healthylicious - Because healthy should be delicious!
