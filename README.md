# PSI

This project consists of a front-end and a back-end. The front-end is built with Angular, and the back-end is built with Node.js and Express.

**Note:** I only worked on the back-end part of this project.

This project is a web application that consists of a front-end built with Angular and a back-end built with Node.js and Express. The application allows users to manage websites and webpages, perform evaluations, and generate reports. The back-end handles API requests, database interactions, and business logic.

## Back-End

### Prerequisites

- Node.js
- npm

### Installation

1. Navigate to the back-end directory:
    ```sh
    cd back-end-etapa1
    ```

2. Grant execute permissions to the nodemon binary:
    ```sh
    chmod +x /node_modules/.bin/nodemon
    ``` 

### Running the Server

To start the server, run:
```sh
npm run devstart
```

The server will be running on `http://localhost:3036/`.

### API Endpoints

`Website Routes`

- `GET /website/:id` - Get a website by ID
- `POST /website` - Create a new website
- `DELETE /website/:id` - Delete a website by ID
- `POST /website/:id/webpages` - Add a webpage to a website
- `PUT /website/:id/updateAvaliacao` - Update the evaluation of a website
- `POST /website/:id/evaluate` - Evaluate and save reports for a website
- `POST /website/:id` - Evaluate a website

`Webpage Routes`

- `GET /webpage/:id` - Get a webpage by ID
- `POST /webpage` - Create a new webpage
- `DELETE /webpage` - Delete webpages
- `POST /webpage/:webpageId/filter` - Filter webpage tests

### Database

The project uses MongoDB as the database. Make sure to set up your MongoDB connection string in `back-end-etapa1/index.js`.

