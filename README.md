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
- [Redis](https://redis.io/) (Optional but recommended for caching)

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/YOUR_GITHUB_USERNAME/school-management-api.git
   cd school-management-api
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following variables:

   ```env
   SERVICE_NAME=school-managment

   MONGO_URI=mongodb://localhost:27017/school-managment
   REDIS_URI=redis://localhost:6379

   AUTH_TOKEN_SECRET=<jwt-secret>
   SUPER_ADMIN_EMAIL=super.admin@exaple.com
   SUPER_ADMIN_PASSWORD=password

   SERVER_PORT=5111
   SERVER_URL=http://localhost:5111
   ```

4. **Start MongoDB and Redis:**
   Ensure MongoDB and Redis are running before starting the API.

   ```sh
   mongod --dbpath /path/to/your/mongodb/data
   redis-server
   ```

5. **Run the application:**
   - Development mode:
     ```sh
     npm run dev
     ```
   - Production mode:
     ```sh
     npm run start
     ```

## API Documentation

The API documentation is generated using Swagger.
After starting the server, visit:

```
http://localhost:5111/api-docs
```

## Running Tests

Run the test suite with:

```sh
npm run test
```

For test coverage:

```sh
npm run test:coverage
```

## Deployment Instructions

1. **Build and run the application in production mode:**
   ```sh
   npm run start
   ```
2. **Use a process manager (e.g., PM2) for better reliability:**
   ```sh
   pm2 start server.js --name school-management-api
   ```

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
- [Running Tests](#running-tests)
- [Deployment Instructions](#deployment-instructions)
- [Contribution](#contribution)
- [License](#license)
