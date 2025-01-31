# School Management System API

## Description

A robust and scalable Node.js API for managing schools, classrooms, and students with **role-based access control (RBAC)**. Built using **MongoDB, JWT authentication, and the Axion template structure**.

## Features

- **Role-Based Access Control (RBAC)**: Superadmins and School Administrators
- **JWT Authentication** for secure access
- **MongoDB Integration** for data persistence
- **Comprehensive Input Validation & Error Handling**
- **API Rate Limiting & Security Measures**
- **Swagger API Documentation**
- **Unit and Integration Tests**

## Prerequisites

Ensure you have the following installed before setting up the project:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Cloud Instance)
- [Redis](https://redis.io/) (Caching)

## Installation

1.  **Clone the repository:**

        git clone https://github.com/victorige/School-Management-System-API.git

        cd School-Management-System-API

2.  **Install dependencies:**

        npm install

3.  **Set up environment variables:** Create a `.env` file in the root directory and add the following variables:

        `SERVICE_NAME=school-managment

        MONGO_URI=mongodb://localhost:27017/school-managment
        REDIS_URI=redis://localhost:6379

        AUTH_TOKEN_SECRET=<jwt-secret>
        SUPER_ADMIN_EMAIL=super.admin@exaple.com
        SUPER_ADMIN_PASSWORD=password

        SERVER_PORT=5111
        SERVER_URL=http://localhost:5111`

4.  **Start MongoDB and Redis:** Ensure MongoDB and Redis are running before starting the API.

        mongod --dbpath /path/to/your/mongodb/data

        redis-server

5.  **Run the application:**

    - Development mode:

            npm run dev

    - Production mode:

            npm run start

## API Documentation

The API documentation is generated using Swagger. After starting the server, visit:

    http://localhost:5111/api-docs

## Auth Flow

To use the application, you need to seed a super admin account via:

    https://localhost:5111/api/seed/admin

Then, you can log in with the `auth/login` endpoint to generate a Bearer token.

## Sample Deployed Application

The app is deployed to:

    https://school-management-system-api-t2qn.onrender.com/api

## Database Schema Design

You can view the database design on Lucidchart:

[Lucidchart Database Design](https://lucid.app/lucidchart/8fd46ba6-79e2-4672-981b-6f854702dadf/edit?page=0_0&invitationId=inv_677996c1-d2e2-43e4-bdf1-2e99905c6325#)

Or view it on Google Drive:

[Google Drive Database Design](https://drive.google.com/file/d/18RZhH_6iYM7AVvu9vP1JI-rTyOnd1IqY/view?usp=drive_link)

## Test Coverage

View the test coverage screenshot:

[Test Coverage Screenshot](https://drive.google.com/file/d/19djBOlbwnoBk7n2EF8ecD19AGvTYA0TF/view?usp=drive_link)

## Running Tests

Run the test suite with:

    npm run test

For test coverage:

    npm run test:coverage

## Deployment Instructions

1.  **Build and run the application in production mode:**

        npm run start

2.  **Use a process manager (e.g., PM2) for better reliability:**

        pm2 start server.js --name school-management-api

## Contribution

Feel free to submit pull requests or report issues.

## License

This project is licensed under the **ISC License**.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Auth Flow](#auth-flow)
- [Deployed Application](#sample-deployed-application)
- [Database Schema Design](#database-schema-design)
- [Test Coverage](#test-coverage)
- [Running Tests](#running-tests)
- [Deployment Instructions](#deployment-instructions)
- [Contribution](#contribution)
- [License](#license)
