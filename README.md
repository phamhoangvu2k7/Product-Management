# Product Management System

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green) ![Express.js](https://img.shields.io/badge/Express.js-v5.1.0-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-forestgreen) ![License](https://img.shields.io/badge/license-ISC-lightgrey)

A comprehensive web application for managing product inventories, built with **Node.js** and **Express 5**. This system allows for full CRUD operations, cloud-based image management, and rich text editing for product descriptions.

## ✨ Key Features

* **Product CRUD:** Complete Create, Read, Update, and Delete functionality for product management.
* **Cloud Image Storage:** Seamless integration with **Cloudinary** for uploading and managing product images via **Multer**.
* **Rich Text Editor:** Integrated **TinyMCE** editor, allowing users to write formatted product descriptions (HTML support).
* **SEO-Friendly URLs:** Automatic slug generation for products using `mongoose-slug-updater`.
* **Flash Notifications:** Real-time feedback for user actions (success/error messages) using `express-flash`.
* **Method Override:** Support for PUT and DELETE HTTP verbs in HTML forms.

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js (v5.1.0)
* **Database:** MongoDB, Mongoose ODM (v8.x)
* **Frontend:** Pug Template Engine, HTML/CSS
* **Utilities:**
    * `dotenv`: Environment variable management.
    * `md5`: Data encryption.
    * `moment`: Date and time formatting.
    * `streamifier`: Buffer to stream conversion for uploads.

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

* [Node.js](https://nodejs.org/) installed.
* [MongoDB](https://www.mongodb.com/) (Local or Atlas connection string).
* A [Cloudinary](https://cloudinary.com/) account for image storage.

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/product-management.git](https://github.com/your-username/product-management.git)
    cd product-management
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your credentials:

    ```env
    # App Settings
    PORT=3000

    # Database
    MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/product-management

    # Session Security
    SESSION_SECRET=your_super_secret_random_string

    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4.  **Run the application**
    ```bash
    npm start
    ```
    The server will start at `http://localhost:3000`.

## 📂 Project Structure

```text
product-management/
├── config/             # Database & Cloudinary configurations
├── controllers/        # Route logic and request handling
├── models/             # Mongoose schemas and models
├── public/             # Static files (CSS, JS, Images, TinyMCE)
├── routes/             # Express route definitions
├── views/              # Pug templates for the UI
├── index.js            # Main application entry point
└── package.json        # Project dependencies
