# Real-Time Chat Application

A real-time chat application built with Node.js, Express.js, and JavaScript.

## Key Features & Benefits

*   **Real-time Messaging:** Instant message delivery between users.
*   **User Authentication:** Secure signup and login functionality.
*   **User Sidebar:** Displays a list of online users for easy interaction.
*   **Cloudinary Integration:** Image storage and management using Cloudinary.
*   **Modular Design:** Well-structured codebase for easy maintenance and extension.

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

*   **Node.js:**  Version 16 or higher.
*   **npm:** Node Package Manager (comes with Node.js).
*   **MongoDB:** A running instance of MongoDB.
*   **Cloudinary Account:** For image storage.

List of key dependencies can be found in `backend/package.json`.

```json
{
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "cloudinary": "^2.7.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^17.0.1",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.17.0",
    "mongoose": "^8.16.1"
  }
}
```

## Installation & Setup Instructions

Follow these steps to set up the project:

1.  **Clone the Repository:**
    ```bash
    git clone <repository_url>
    cd real-time-chat
    ```

2.  **Navigate to the Backend Directory:**
    ```bash
    cd backend
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Configure Environment Variables:**

    Create a `.env` file in the `backend/` directory and add the following environment variables:

    ```
    PORT=5000
    MONGO_URI=<Your MongoDB Connection String>
    JWT_SECRET=<Your JWT Secret Key>
    CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
    CLOUDINARY_API_KEY=<Your Cloudinary API Key>
    CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
    ```

    *Replace the placeholders with your actual values.*

5.  **Run the Backend:**
    ```bash
    npm run dev #For development with nodemon
    #or
    npm run start #For production
    ```

## Usage Examples & API Documentation

### API Endpoints:

**Authentication Routes:**

*   `POST /api/auth/signup`:  Register a new user.
    *   Request Body: `{ fullName, email, password }`

*   `POST /api/auth/login`:  Authenticate and login a user.
    *   Request Body: `{ email, password }`

*   `POST /api/auth/logout`: Logs out the user by clearing the cookie.

**Message Routes:**

*   `GET /api/messages/users`: Get list of users for the sidebar (excluding the logged-in user).

### Code Examples:

**Signup Controller:**

```js
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../library/utils.js";
import cloudinary from "../library/cloudinary.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

// SIGNUP
export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "All the three fields ...
```

**Get Users For Sidebar Controller:**

```js
import User from "../models/user.model.js";
import Message from "../models/messages.model.js";
import pkg from "cloudinary";
const { cloudinary } = pkg;

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUser = await req.user._id;
    const findUsers = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    );
    res.send(findUsers);
  } catch (error) {
    console.log(
      `An error occurred while performing the task: ${error.message}`
    );
    res.status(500).json({ error: error.message });
  }
};
```

## Configuration Options

*   **PORT:**  The port the server listens on (default: 5000).
*   **MONGO_URI:**  The MongoDB connection string.
*   **JWT_SECRET:**  Secret key used for JSON Web Token signing.
*   **CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET:** Cloudinary account credentials.

These variables can be configured in the `.env` file in the `backend/` directory.

## Contributing Guidelines

Contributions are welcome!  Here's how you can contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your branch to your forked repository.
5.  Submit a pull request.

Please follow the existing code style and conventions.

## License Information

No license specified. All rights reserved to the owner, arpan62825.

## Acknowledgments

*   This project utilizes the following open-source libraries:
    *   Express.js
    *   Mongoose
    *   Cloudinary
    *   jsonwebtoken
    *   bcryptjs
