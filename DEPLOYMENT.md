# Deployment Guide

## Quick Deployment to Vercel

### 1. Prerequisites

- GitHub account
- Vercel account
- MongoDB Atlas database
- Cloudinary account

### 2. Environment Variables

Set these in your Vercel dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movieApp?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Deploy Steps

1. Push your code to GitHub
2. Connect GitHub repo to Vercel
3. Import project in Vercel
4. Add environment variables in Vercel settings
5. Deploy!

### 4. Project Structure (Clean)

```
├── api/                  # Serverless API functions
├── frontend/            # React frontend
├── package.json        # Root dependencies
├── vercel.json        # Vercel configuration
└── .env.example       # Environment template
```

### 5. What Was Removed

- `/backend/` - Legacy Express server (not needed for serverless)
- `README_NEW.md` - Duplicate file
- All unused dependencies and files

Your app is now optimized for Vercel deployment! 🚀
