### SecureAuth - Modern Authentication System





A complete, secure, and modern authentication system built with Node.js, Express, and MongoDB. SecureAuth provides a robust foundation for user management with a beautiful, responsive UI and comprehensive security features.





## ✨ Features

- **User Authentication**

- Secure signup and login
- JWT-based authentication
- Password hashing with bcrypt
- Session management



- **Modern UI**

- Responsive design for all devices
- Password visibility toggle
- Real-time password strength meter
- Form validation with helpful error messages
- Smooth animations and transitions



- **Security**

- CORS protection
- Environment variable configuration
- Protected API routes
- Secure password storage



- **Developer Experience**

- MongoDB Atlas integration
- Health check endpoint
- Comprehensive error handling
- Well-documented codebase





## 🛠️ Technologies

- **Backend**

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcrypt



- **Frontend**

- Vanilla JavaScript
- HTML5
- CSS3
- Font Awesome icons





## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- MongoDB Atlas account or local MongoDB installation


## 🚀 Installation

1. **Clone the repository**


```shellscript
git clone https://github.com/petros1921/iNDOLiKE_BE_01.git
cd iNDOLiKE_BE_01
```

2. **Install dependencies**


```shellscript
npm install
# or
yarn install
```

3. **Configure environment variables**


Create a `.env` file in the root directory with the following variables:

```plaintext
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development
```

> 🔒 **Security Note**: Never commit your `.env` file to version control. Make sure it's listed in your `.gitignore`.



4. **Start the server**


```shellscript
npm start
# or
yarn start
```

5. **Access the application**


Open your browser and navigate to `http://localhost:3000`

## 📝 API Documentation

### Authentication Endpoints

#### Register a new user

```
POST /api/signup
```

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**

```json
{
  "message": "User created successfully"
}
```

#### Login

```plaintext
POST /api/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60a1b2c3d4e5f6g7h8i9j0k",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Protected Endpoints

#### Get user profile

```plaintext
GET /api/profile
```

**Headers:**

```plaintext
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "username": "johndoe",
  "email": "john@example.com",
  "createdAt": "2023-05-15T10:30:00.000Z"
}
```

### Health Check

#### Check server and database status

```plaintext
GET /api/health
```

**Response (200 OK):**

```json
{
  "status": "ok",
  "mongodb": "connected",
  "environment": {
    "nodeEnv": "development",
    "port": "3000",
    "mongodbUri": "set",
    "jwtSecret": "set"
  }
}
```

## 🔧 Configuration

### MongoDB Atlas Setup

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a new cluster (the free tier is sufficient for development)
3. Create a database user with read/write privileges
4. Add your IP address to the IP Access List
5. Click "Connect" and select "Connect your application"
6. Copy the connection string and replace `<password>` with your database user's password
7. Add the connection string to your `.env` file as `MONGODB_URI`


### Environment Variables

| Variable | Description | Default
|-----|-----|-----
| `PORT` | Port the server will run on | `3000`
| `MONGODB_URI` | MongoDB connection string | -
| `JWT_SECRET` | Secret key for JWT signing | -
| `NODE_ENV` | Application environment | `development`


## 🔒 Security Best Practices

This project implements several security best practices:

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **JWT Authentication**: Stateless authentication using secure JWT tokens
3. **Environment Variables**: Sensitive information is stored in environment variables
4. **CORS Protection**: API is protected against cross-origin requests
5. **Input Validation**: User inputs are validated before processing


## 🧪 Testing

### Manual Testing

1. **Registration Flow**:

1. Try registering with valid credentials
2. Try registering with an existing email/username
3. Test password strength meter with different passwords



2. **Login Flow**:

1. Login with valid credentials
2. Attempt login with incorrect password
3. Test "Remember me" functionality
4. Test password visibility toggle



3. **Protected Routes**:

1. Access profile with valid token
2. Attempt to access profile without token
3. Test token expiration handling





## 📱 Responsive Design

The UI is fully responsive and works on:

- Desktop browsers
- Tablets
- Mobile devices


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgements

- [Express.js](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - General purpose, document-based, distributed database
- [JWT](https://jwt.io/) - JSON Web Tokens for secure authentication
- [Font Awesome](https://fontawesome.com/) - Icon toolkit


---

Made with ❤️ by Petros Worku