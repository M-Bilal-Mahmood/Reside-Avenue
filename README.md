# Reside Avenue

A full-stack Airbnb-inspired property listing web application built with Node.js, Express, and MongoDB.

## 🔗 Live Demo
[reside-avenue-production.up.railway.app](https://reside-avenue-production.up.railway.app)

## ✨ Features
- Browse property listings from around the world
- Create, edit and delete your own listings
- Upload property images via Cloudinary
- Interactive map for each listing using Leaflet + OpenCage geocoding
- User authentication (signup, signin, logout) with Passport.js
- Leave and delete reviews with star ratings
- Flash notifications for all user actions
- Fully responsive design for mobile and desktop
- Protected routes — only owners can edit/delete their listings
- Session-based auth with MongoDB session store

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** Passport.js, passport-local-mongoose
- **File Upload:** Multer, Cloudinary
- **Templating:** EJS, ejs-mate
- **Validation:** Joi
- **Maps:** Leaflet.js, OpenCage Geocoding API
- **Deployment:** Railway

## ⚙️ Setup Locally

1. Clone the repo
   git clone https://github.com/M-Bilal-Mahmood/Reside-Avenue.git
   cd Reside-Avenue

2. Install dependencies
   npm install

3. Create a .env file in the root with these variables
   ATLAS_DB=your_mongodb_connection_string
   SECRET=your_session_secret
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   OPENCAGE_API_KEY=your_opencage_api_key

4. Run the app
   npm run dev
