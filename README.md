🚀 SaaS Backend Application
Welcome to the SaaS Backend Platform! This backend service allows companies to manage subscription plans, employees, and files securely and efficiently. Built for scalability and ease of integration, it's perfect for any B2B SaaS product.


## 🌟 Features

- 🏢 Company Registration & Authentication
    - Register with: name, email, password, country, industry (e.g., Finance, E-commerce).
    - Email verification required for activation
- 📦 Subscription Management
    | Plan      | Files/Month   | Users | Price                              |
    | :-------- | :-------      | :---- | :----                              |
    | 🆓 Free   | 10            | 	1      | Free                            |
    | 🪙 Basic  | 100        |   Up to 10  | $5/month per employee           |
    | 💎 Premium| 1000      | Unlimited | $300/month + $0.50/file over 1000  |

## 📡 API Endpoints

---

### 💼 Company Routes

#### Register a new company  
```http
POST /register
```

#### Login a company  
```http
POST /login
```

#### Verify company email  
```http
GET /verify/:token
```

| Parameter | Type     | Description                      |
| :-------- | :------- | :------------------------------- |
| token     | string   | **Required**. Verification token |

#### Request new verification email  
```http
POST /verify
```

#### Update specific company field  
```http
PUT /change/:field
```

| Parameter | Type     | Description                   |
| :-------- | :------- | :---------------------------- |
| field     | string   | **Required**. Field to update |

#### Change password  
```http
PUT /change-password
```

#### Get company dashboard (auth)  
```http
GET /
```

---

### 👥 Employee Routes

#### Get all employees (admin only)  
```http
GET /all
```

#### Register new employee  
```http
POST /register
```

#### Employee login  
```http
POST /login
```

#### Verify employee email  
```http
GET /verify/:token
```

| Parameter | Type     | Description                      |
| :-------- | :------- | :------------------------------- |
| token     | string   | **Required**. Verification token |

#### Resend verification email  
```http
POST /verify
```

#### Set password after activation  
```http
PUT /set-password
```

#### Delete employee (admin only)  
```http
DELETE /delete/:id
```

| Parameter | Type     | Description               |
| :-------- | :------- | :------------------------ |
| id        | string   | **Required**. Employee ID |

---

### 📂 File Routes

#### View a file  
```http
GET /:id
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| id        | string   | **Required**. File ID |

#### Upload a file  
```http
POST /upload
```

#### Update file info or permissions  
```http
PUT /:id
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| id        | string   | **Required**. File ID |

#### Delete a file  
```http
DELETE /:id
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| id        | string   | **Required**. File ID |

---

### 💳 Subscription Routes

#### Get all subscription plans  
```http
GET /
```

#### Create a new subscription  
```http
POST /create
```

#### Select a subscription plan  
```http
POST /select
```
## ⚙️ Technologies Used
- Node.js + Express – REST API & Routing
- MongoDB – NoSQL database for data storage
- JWT – Secure authentication & authorization
- Multer – Handle file uploads
- Nodemailer – Email account verification
- Next.js – Cron jobs (optimized for Vercel)## ⚙️ Technologies Used
- Node.js + Express – REST API & Routing
- MongoDB – NoSQL database for data storage
- JWT – Secure authentication & authorization
- Multer – Handle file uploads
- Nodemailer – Email account verification
- Next.js – Cron jobs (optimized for Vercel)
## 🛠️ Setup Instructions
🔧 Prerequisites
- Node.js
- MongoDB
- SMTP Email Service (e.g., Gmail, Mailtrap, SendGrid)

## Installation

📥 Install Dependencies

```bash
  npm install
```

🚀 Run the App

```bash
  npm start
```
    
App will be available at: http://localhost:3000
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`                    – App port (e.g., `3000`)

`NODE_ENV`                – Environment (`development`, `production`)

`UPLOAD_SIZE_LIMIT`       – Max upload size (e.g., `10mb`)

`BASE_URL`                – Base URL of your app (e.g., `http://localhost:3000`)

`API_URL`                 – API base URL (e.g., `http://localhost:3000/api`)

`MONGO_URI`               – MongoDB connection string

`JWT_VERIFICATION_SECRET` – Secret key for email verification tokens

`JWT_ACCESS_SECRET`       – Secret key for access tokens

`SMTP_HOST`               – SMTP server host (e.g., `smtp.gmail.com`)

`SMTP_PORT`               – SMTP port (e.g., `587`)

`SMTP_USER`               – Email address used to send emails

`SMTP_PASSWORD`           – Email account password or app-specific password

