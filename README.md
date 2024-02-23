# Invoice-Generator NodeJS Application

This is a simple NodeJS application for generating PDF Invoices from text data.

### Technologies used:
- NodeJS
- Express (for creating server)
- MongoDB (for storing data)
- Puppeteer (for generating PDF from HTML template)
- Jsonwebtoken (for authentication)
- AWS S3 Bucket (for storing BLOB PDF files)


## Project Setup:

1. Clone the repository to your machine.
2. Go inside the project(repo) directory, by doing `cd Invoice-Generator`
3. Install all of the dependencies, by doing `npm install`. Make sure you are inside the root directory of the repo.
4. Now create a `.env` file inside your root directory. This file will contain all of your secret credentials for running this application.
5. Now add these variables inside you `.env` file. Make sure those variable that are not a number put it as a string (inside a quote).
<br>

`PORT = 4040`
<br>
`JWT_SECRET_KEY = `
<br>
`JWT_EXPIRES_IN = "7D"`
<br>
`MONGODB_URL = `
<br>
`BUCKET_NAME = `
<br>
`BUCKET_REGION = `
<br>
`BUCKET_ACCESS_KEY = `
<br>
`BUCKET_SECRET_ACCESS_KEY = `

6. Now after all of these setup is done, you can run the application by `node index.js` or you can run using `nodemon`, for that you have to add this `"start": "nodemon src/index.js"` script inside your `package.json` file under scripts section.


## API Endpoints:


### Endpoint: 1 (User Signup)

**API:** `/api/v1/signup` 
- Method: POST

**Parameters:**
- `name`: Name of the user
- `email`: Vaid Email of the user
- `password`: A valid password (>= 8 characters), atleast 1 uppercase, 1 lowercase, 1 number, 1 speacial character 

**Response:**
- 201 Created: Returns a JSON user object.


### Endpoint: 2 (User Login)

**API:** `/api/v1/login` 
- Method: POST

**Parameters:**
- `email`: Email of the user
- `password`:  Password of the user

**Response:**
- 200 Ok: Returns a JSON object containing auth token.


### Endpoint: 3 (Order Creation)

**API:** `api/v1/create-order` 
- Method: POST

**Parameters:**
- `[{ "name": "demo", "quantity": 16, "price": 50000 }]`: Send the data inside request body as JSON data.
- include the auth token inside request header, as `Authorization: Bearer<one_space>token`

**Response:**
- 201 Created: Returns a PDF file.


### Endpoint: 4 (Get all Invoices)

**API:** `api/v1/get-all-invoices` 
- Method: GET

**Parameters:**
- include the auth token inside request header, as `Authorization: Bearer<one_space>token`

**Response:**
- 200 Ok: Returns a list of Invoices inside an array.
