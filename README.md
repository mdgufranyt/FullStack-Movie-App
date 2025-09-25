# FullStack-Movie-App

A full-stack web application for browsing, viewing, and interacting with movies. Built with React, Express, and MongoDB.

---

## Features

### User Features
- **Sign Up & Login:** Secure authentication using bcrypt and JWT.
- **Browse Movies:** Explore movies by categories with interactive carousels.
- **View Details:** See movie title, description, image, YouTube trailer, and comments.
- **Commenting:** Add comments to movies and view others' feedback.

### Admin Features
- **Admin Login:** Secure admin access via dedicated route and key.
- **Add Movies:** Upload new movies with title, description, YouTube URL, and image.
- **Movie Management:** Images are securely uploaded and stored.

---

## Technologies Used

- **Frontend:** React, React Router, SwiperJS, Avatar
- **Backend:** Express, Mongoose, Multer, bcryptjs, JWT
- **Database:** MongoDB

---

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB (local or remote)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mdgufranyt/FullStack-Movie-App.git
   ```

2. **Install dependencies:**
   - Frontend:
     ```bash
     cd frontend
     npm install
     ```
   - Backend:
     ```bash
     cd backend
     npm install
     ```

3. **Start MongoDB:** (if running locally)
   ```bash
   mongod
   ```

4. **Start the backend server:**
   ```bash
   node index.js
   ```

5. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

---

## Usage

- Visit the frontend URL (e.g., `http://localhost:5173`)
- Register or login as a user to browse and comment.
- Login as admin (via `/adminLogin`) to add new movies.

---

## File Structure

```
frontend/
  src/
    pages/
    components/
  App.jsx
  App.css
backend/
  models/
  routes/
  uploads/
```

---

## API Endpoints (Backend)

- `POST /signUp` – User registration
- `POST /login` – User login
- `GET /getMovies` – Get all movies
- `POST /getMovie` – Get details for a single movie
- `POST /uploadMovie` – Admin: upload a new movie
- `POST /createComment` – Add a comment to a movie

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

## License

[MIT](LICENSE)

---

## Author

- [mdgufranyt](https://github.com/mdgufranyt)
