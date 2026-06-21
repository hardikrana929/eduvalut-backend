# EduVault Backend 🔐⚙️

Welcome to the backend repository for **EduVault**. This is a robust **Node.js** and **Express** application designed to handle data management, secure user authentication, and routing configurations for the EduVault ecosystem.

The live API is deployed and accessible at: **[eduvalut-backend.vercel.app](https://eduvalut-backend.vercel.app)**

---

## 🚀 Features

*   **RESTful Routing:** Organized endpoint structure managed via custom express routers (`stdRouter.js`).
*   **Database Integration:** Scalable database configuration optimized for cloud deployment on platforms like Railway.
*   **Secure Authentication:** Secure user flows, including password reset logic and authentication middleware.
*   **CORS Enabled:** Cross-Origin Resource Sharing (CORS) configured to securely connect with your frontend.
*   **Serverless Ready:** Configured with `vercel.json` for rapid and optimized serverless deployment on Vercel.

---

## 🛠️ Tech Stack

*   **Runtime Environment:** Node.js
*   **Framework:** Express.js
*   **Language:** JavaScript (ES6+)
*   **Hosting/Deployment:** Vercel & Railway

---

## 📦 Getting Started & Installation

Follow these steps to set up and run the backend server locally on your machine.

### Prerequisites

Ensure you have **Node.js** (v18.x or higher recommended) and **npm** installed.

### 1. Clone the Repository
```bash
git clone [https://github.com/hardikrana929/eduvalut-backend.git](https://github.com/hardikrana929/eduvalut-backend.git)
cd eduvalut-backend
```
2. Install Dependencies
```npm install```
3. Environment Configuration
Create a .env file in the root directory of your project to store your secret keys and database configurations (Note: .env is omitted from Git tracking for security):
```PORT=5000
DATABASE_URL=your_railway_database_url_here
JWT_SECRET=your_jwt_secret_here
# Add any other required environment variables below
```
4. Start the Server
To spin up your local development server, run:
```npm start```
📂 Project Structure
```
eduvalut-backend/
├── config/          # Database configuration and connection setups
├── Controllers/     # Route controller functions handling core business logic
├── middleware/      # Custom Express middleware (Authentication, logging, etc.)
├── Routes/          # Express route definitions (e.g., stdRouter.js)
├── utils/           # Helper functions and utilities (e.g., password reset logic)
├── .gitignore       # Git ignore settings (ignoring .env, node_modules)
├── app.js           # Main Express application configuration & CORS setups
├── server.js        # Entry point file to start and listen on the server
├── vercel.json      # Serverless deployment configuration for Vercel
├── package.json     # Node.js project manifest, scripts, and dependencies
└── package-lock.json# Locked dependency tree for version consistency
```
