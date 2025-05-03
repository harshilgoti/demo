# Habits Tracker

A full-stack application for tracking daily habits and routines. This project consists of two main components: a frontend application (habits-fe) and a backend API (habits-be).

## Project Structure

```
habits/
├── habits-fe/         # Frontend React application
├── habits-be/         # Backend API server
```

## Demo

[Watch Demo Video](https://drive.google.com/file/d/1y6fpXuFe4GJhnVs3Hz04KH5hU83YzbYy/view)

## Features

- User authentication and authorization
- Create, read, update, and delete habits
- Track daily progress on habits
- Visualize habit completion with statistics
- Responsive design for mobile and desktop use

## Installation and Setup

### Full Installation Process

1. Clone the repository:

   ```
   git clone https://github.com/harshilgoti/habits.git
   cd habits
   ```

2. You'll see two folders (`habits-fe` and `habits-be`) and the demo video file.

### Running the Backend

1. Navigate to the backend directory:

   ```
   cd habits-be
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root of the backend directory with the following .env.sample:

4. Start the development server:
   ```
   npm run dev
   ```

The backend server will be running at `http://localhost:5000`.

### Running the Frontend

1. Open a new terminal window and navigate to the frontend directory:

   ```
   cd habits-fe
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root of the frontend directory with the following .env.sample:

4. Start the development server:
   ```
   npm run dev
   ```

The frontend application will be running at `http://localhost:3000`.

## Quick Start Guide

```bash
# Clone the repository
git clone https://github.com/harshilgoti/habits.git
cd habits

# Setup and run the backend
cd habits-be
npm install
npm run dev

# Open a new terminal window
# Setup and run the frontend
cd ../habits-fe
npm install
npm run dev
```

After these steps, you can access:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
