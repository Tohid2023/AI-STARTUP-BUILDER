# AI-STARTUP-BUILDER

Welcome to **AI-STARTUP-BUILDER**! This is a multi-tier web application designed to help build and brainstorm AI startup ideas. It leverages modern web technologies, AI APIs (OpenAI/Google Gemini), and a custom Machine Learning microservice.

## Project Structure

This repository is organized into three main services, each serving a distinct purpose:

1. **`client/` (Frontend)**
   - Built with **React**, **Vite**, and **Tailwind CSS**.
   - Handles the user interface and user interactions.
   - Communicates with the `server` to fetch and display data.

2. **`server/` (Backend Node.js API)**
   - Built with **Node.js** and **Express**.
   - Serves as the main gateway for the frontend.
   - Handles user authentication (JWT/bcrypt), database interactions (**Mongoose/MongoDB**), and integrates with external AI providers (OpenAI, Google Generative AI).

3. **`ml-service/` (Machine Learning API)**
   - Built with **Python** and **Flask**.
   - A dedicated microservice running on port `5003`.
   - Provides specialized endpoints for:
     - Predicting startup categories (Naive Bayes).
     - Extracting keywords using NLTK.
     - Recommending features, tech stacks, and monetization strategies.
     - Calculating idea similarity (TF-IDF cosine similarity).

---

## 🚀 How to Start the Project

To run the full application locally, you will need to start all three services in separate terminal windows.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Python 3](https://www.python.org/)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas URI)

### 1. Start the Machine Learning Service (`ml-service`)

First, let's get the Python microservice running:

```bash
# Navigate to the ml-service directory
cd ml-service

# Create a virtual environment (if you haven't already)
python3 -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install the required dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```
*The ML service should now be running on `http://localhost:5003`.*

### 2. Start the Backend Server (`server`)

Next, start the Node.js Express server:

```bash
# Open a new terminal and navigate to the server directory
cd server

# Install dependencies
npm install

# IMPORTANT: You need a .env file to run the server. 
# Make sure to configure your environment variables (e.g., MongoDB URI, OpenAI/Gemini API keys, JWT secret) in the server/.env file.

# Start the server using node (or nodemon for development)
npx nodemon index.js
# OR
node index.js
```
*The Backend server will connect to the database and start listening for requests.*

### 3. Start the Frontend Client (`client`)

Finally, start the React development server:

```bash
# Open a third terminal and navigate to the client directory
cd client

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
*Vite will provide a local URL (typically `http://localhost:5173`) where you can view the application in your browser.*

---

## Environment Variables

Make sure to set up your environment variables. You will likely need a `.env` file in the `server` directory containing things like:
- `PORT` (e.g., 5000)
- `MONGO_URI` (Your MongoDB connection string)
- `JWT_SECRET` (For authentication)
- `OPENAI_API_KEY` (If using OpenAI)
- `GEMINI_API_KEY` (If using Google Gemini)
