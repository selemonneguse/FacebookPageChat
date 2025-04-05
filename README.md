# Chat Tast

A chat application built with React frontend and Express backend.

## Prerequisites

Before running the application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or higher recommended)
- [npm](https://www.npmjs.com/) (v6.x or higher recommended)

## Installation

### Clone the repository

```bash
git clone <your-repository-url>
cd Chat-Tast
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd chat/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create an `.env` file based on the example (if provided):

```bash
cp .env.example .env
```

Then edit the `.env` file with your configuration values.

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ..
```

You should now be in the `chat` directory.

2. Install dependencies:

```bash
npm install
```

## Running the Application

### Start the Backend Server

1. From the root directory:

```bash
cd chat/backend
npm start
```

The backend server should now be running on http://localhost:5000 (or your configured port).

### Start the Frontend Development Server

1. Open a new terminal window/tab
2. From the root directory:

```bash
cd chat
npm start
```

The React app should now be running on http://localhost:3000, and your browser should automatically open.

## Project Structure

```
Chat Tast/
│
├── chat/                      # Frontend (React)
│   ├── src/                   # Source files
│   │   ├── App.js             # Main React component
│   │   ├── App.css            # Styles for App component
│   │   ├── index.js           # Entry point
│   │   └── ...                # Other components/files
│   ├── package.json           # Frontend dependencies
│   └── ...
│
└── chat/backend/              # Backend (Express)
    ├── routes/                # API routes
    │   ├── main.js            # Main routes
    │   └── ...                # Other route files
    ├── controllers/           # Route controllers
    ├── server.js              # Express server setup
    ├── package.json           # Backend dependencies
    └── .env                   # Environment variables
```

## Available Scripts

In the backend directory (`chat/backend`), you can run:

### `npm start`

Runs the server in development mode.

In the frontend directory (`chat`), you can run:

### `npm start`

Runs the app in development mode.

### `npm test`

Launches the test runner.

### `npm run build`

Builds the app for production to the `build` folder .
