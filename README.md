# MovieHub 🎬

A full-stack movie review platform where users can discover, rate, and discuss movies.

## Features

- **User Authentication** - Secure registration and login with email verification
- **Movie Discovery** - Browse and search movies from TMDB API
- **Reviews & Ratings** - Write and read reviews from the community
- **User Profiles** - Manage your profile and review history
- **Premium & Admin Roles** - Support for different user roles and permissions
- **Email Notifications** - Verification emails via Mailgun

## Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Mailgun API for emails

**Frontend:**
- HTML5 & CSS3
- Vanilla JavaScript
- Responsive Design

## Setup

### Prerequisites
- Node.js v18+
- MongoDB account
- Mailgun account (for email verification)
- TMDB API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Backend-final
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   TMDB_API_KEY=your_tmdb_api_key
   MAILGUN_DOMAIN=your_mailgun_domain
   MAILGUN_SMTP_API_KEY=your_mailgun_api_key
   EMAIL_FROM=noreply@your_domain.com
   FRONTEND_URL=http://localhost:5000
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   ```
   http://localhost:5000
   ```

## Project Structure

```
├── Frontend/           # HTML, CSS, JS files
│   ├── css/           # Stylesheets
│   ├── js/            # Frontend logic
│   └── *.html         # Pages
├── src/
│   ├── controllers/   # Route handlers
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   ├── utils/         # Utility functions
│   └── config/        # Configuration
└── scripts/           # Build scripts
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify?token=...` - Verify email
- `GET /api/movies` - Get all movies
- `POST /api/reviews` - Create review
- `GET /api/reviews/:movieId` - Get movie reviews


## Author
Akbar Khalili