# Library Management System - Frontend

A modern React-based Library Management System developed using **React, Vite, Redux Toolkit, Bootstrap, Axios, and React Router**. The application communicates with a .NET Core Web API backend using JWT authentication and role-based authorization.

---

# Features

## Authentication

- Login
- Register
- Forgot Password
- Reset Password
- Change Password
- Email Confirmation
- JWT Authentication
- Refresh Token
- Logout

---

## Role-Based Authorization

- Admin
- Librarian
- Member

Protected routes prevent unauthorized access based on user roles.

---

## Dashboard

- Total Books
- Total Users
- Active Loans
- Overdue Loans
- Total Fines
- Available Book Copies

---

## Book Management

- View Books
- Add Books
- Edit Books
- Delete Books
- Search Books

---

## Category Management

- View Categories
- Add Categories
- Edit Categories
- Delete Categories

---

## Publisher Management

- View Publishers
- Add Publishers
- Edit Publishers
- Delete Publishers

---

## Loan Management

- Borrow Books
- Return Books
- Loan History

---

## Fine Management

- View Fines
- Fine Status

---

## User Management

- View Users
- Create Librarian Accounts
- Role-Based Access Control

---

## Profile

- View User Information
- Change Password

---

# Technologies Used

## Frontend

- React 19
- Vite
- Redux Toolkit
- React Redux
- React Router DOM
- Axios
- Bootstrap 5
- React Icons

---

## Testing

- Vitest
- React Testing Library
- Jest DOM
- User Event

---

# Project Structure

```text
src
|
|-- components
|-- hooks
|-- layouts
|-- pages
|-- redux
│   |-- slices
│   |-- store
|-- routes
|-- services
|-- test
|-- App.jsx
|-- main.jsx
|-- index.css

```

---

## Installation

Clone the repository

```bash

git clone https://github.com/your-username/LibraryManagementSystemFrontend.git

```

Move into the project directory

```bash

cd LibraryManagementSystemFrontend

```

Install dependencies

```bash

npm install

```

Run the development server

```bash
npm run dev

```

# Build

```bash

npm run build

```

---

# Run Tests

Run all tests

```bash

npm run test

```

Run tests once

```bash

npm run test:run

```

---

# Current Test Coverage

- LoadingSpinner Component
- ProtectedRoute Component
- Login Component

Current Status

- 3 Test Files
- 12 Passing Tests

---

# Backend

This frontend communicates with the **Library Management API (.NET Core)** using Axios and JWT authentication.

---

# Authors

Developed as part of the Web Application Development coursework.

---

# License

This project is developed for educational purposes.