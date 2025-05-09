# SPEND SENSE

## Overview

SPEND SENSE is a full-stack web application designed to help users manage their expenses efficiently. The project is built with a React-based frontend and a Node.js backend, providing a seamless and responsive user experience. The application allows users to track their spending, categorize expenses, and gain insights into their financial habits.

---

## Features

### Frontend
- **React with Vite**: Fast and optimized development environment.
- **Responsive Design**: Ensures compatibility across devices.
- **Dynamic Components**: Built with reusable and modular React components.
- **State Management**: Efficient handling of application state.
- **Modern Styling**: Styled using CSS and other modern techniques.

### Backend
- **Node.js with Express**: Lightweight and scalable backend framework.
- **Database Integration**: Centralized data storage and retrieval.
- **Authentication**: Secure user login and registration.
- **RESTful APIs**: Clean and structured API endpoints for frontend-backend communication.
- **Middleware**: Custom middleware for request validation and error handling.

---

## Project Structure

```
Expense-Tracker-Opensoft/
├── Readme.md
├── backend/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── controllers/
│       ├── db/
│       ├── middleware/
│       ├── models/
│       └── routers/
└── frontend/
    ├── .env
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── README.md
    ├── vite.config.js
    ├── public/
    └── src/
        ├── App.css
        ├── index.css
        ├── Layout.jsx
        ├── main.jsx
        ├── assets/
        └── components/
```

---

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for database)

### Backend Setup
1. Navigate to the `backend` directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables in `.env` file:
   ```
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```
4. Start the server:
   ```sh
   npm start
   ```

### Google OAuth Setup
1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the "Google+ API" and "Google OAuth 2.0" services.
3. Create OAuth 2.0 credentials and set the redirect URI to `http://localhost:5000/api/oauth/google/callback`.
4. Add the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to your `.env` file.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

---

## Usage

1. Open the application in your browser at `http://localhost:3000` (frontend) and `http://localhost:5000` (backend).
2. Register or log in to your account.
3. Add, edit, or delete expenses.
4. View categorized expense summaries and insights.

---

## Technologies Used

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB

---

## Team Members

```
Shivam Kumar
Madhav Samdani
Harsh Dalmia
Ranveer Raj
Nikhil Patel
```

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.


## Acknowledgments

Special thanks to the OpenSoft team for their support and guidance.