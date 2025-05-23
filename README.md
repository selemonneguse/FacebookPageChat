# FACEBOOKPAGECHAT

A Facebook page chat application built with React frontend and Express backend.

## Prerequisites

Before running the application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or higher recommended)
- [npm](https://www.npmjs.com/) (v6.x or higher recommended)

## Installation

### Clone the repository

```bash
git clone https://github.com/selemonneguse/FacebookPageChat
cd FACEBOOKPAGECHAT
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create an `.env` file if necessary:

```bash
cp .env.example .env  # If an example file exists
```

Then edit the `.env` file with your configuration values.

### Frontend Setup

1. Install dependencies in the root directory:

```bash
cd ..  # Return to the root directory if you were in backend
npm install
```

## Running the Application

### Start the Backend Server

1. From the root directory:

```bash
cd backend
npm start
```

The backend server should now be running on http://localhost:5000 (or your configured port).

### Start the Frontend Development Server

1. Open a new terminal window/tab
2. From the root directory:

```bash
npm start
```

The React app should now be running on http://localhost:3000, and your browser should automatically open.

## Project Structure

```
FacebookPageChat/
├── backend/               # Express.js backend
├── public/                # Static files
├── src/                   # React frontend source code
│   ├── components/        # Reusable components (if added)
│   ├── App.js             # Main app component
│   └── ...                # Other frontend files
├── .env.example           # Example environment config
├── package.json           # Root config for frontend
├── README.md              # This file
```

## Available Scripts

In the backend directory (`backend`), you can run:

### `npm start`

Runs the server in development mode.

In the root directory, you can run:

### `npm start`

Runs the React app in development mode.

### `npm test`

Launches the test runner.

### `npm run build`

Builds the app for production to the `build` folder.
