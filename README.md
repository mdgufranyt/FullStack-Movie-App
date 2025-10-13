# Full Stack Movie App

A modern full-stack movie application built with React frontend and Node.js serverless functions for Vercel deployment.

---

## Features

### User Features

- **Sign Up & Login:** Secure authentication using bcrypt and JWT
- **Browse Movies:** Explore movies with interactive interface
- **View Details:** See movie title, description, image, YouTube trailer, and comments
- **Commenting:** Add comments to movies and view others' feedback

### Admin Features

- **Admin Login:** Secure admin access for movie management
- **Add Movies:** Upload new movies with title, description, YouTube URL, and image
- **Movie Management:** Images are uploaded to Cloudinary for cloud storage

---

## Tech Stack

- **Frontend:** React 18, React Router DOM, Tailwind CSS, Vite
- **Backend:** Node.js serverless functions, MongoDB Atlas, JWT authentication
- **Storage:** Cloudinary for image uploads
- **Database:** MongoDB Atlas
- **Deployment:** Vercel

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movieApp?retryWrites=true&w=majority

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Local Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mdgufranyt/FullStack-Movie-App.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   cd frontend && npm install
   ```

3. **Set up environment variables** (see above)

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Deployment

This app is configured for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

---

## Usage

- Visit the frontend URL (e.g., `http://localhost:3000`)
- Register or login as a user to browse and comment
- Login as admin (via `/adminLogin`) to add new movies

---

## Project Structure

```
├── api/                    # Serverless functions for Vercel
│   ├── login.js
│   ├── signUp.js
│   ├── getMovies.js
│   ├── getMovie.js
│   ├── uploadMovie.js
│   ├── getUserDetails.js
│   ├── checkAdmin.js
│   └── createComment.js
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── ...
├── vercel.json           # Vercel configuration
└── package.json          # Root dependencies
```

---

## API Endpoints

- `POST /api/signUp` - User registration
- `POST /api/login` - User login
- `GET /api/getMovies` - Get all movies
- `GET /api/getMovie?id=` - Get single movie
- `POST /api/uploadMovie` - Upload new movie (admin)
- `GET /api/getUserDetails` - Get user details
- `POST /api/checkAdmin` - Check if user is admin
- `POST /api/createComment` - Create comment

---

## Issues Fixed

1. **Proper Vercel Structure**: Moved API functions to `/api` directory
2. **Serverless Functions**: Converted to proper Vercel serverless function format
3. **Database Connection**: Implemented connection caching for serverless
4. **CORS Headers**: Added proper CORS handling
5. **Error Handling**: Improved error handling across frontend and backend
6. **Environment Setup**: Proper environment variable configuration
7. **Build Configuration**: Updated vercel.json for proper routing

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

## License

[MIT](LICENSE)

---

## Author

- [mdgufranyt](https://github.com/mdgufranyt)
