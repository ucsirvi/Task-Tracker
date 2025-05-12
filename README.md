# Task Tracker - Full Stack Project Management Application

A modern, responsive web application for managing projects and tasks with a beautiful UI and robust backend.

## 🌟 Features

- **User Authentication**
  - Secure login and registration
  - JWT-based authentication
  - Theme preferences (Light/Dark mode)

- **Project Management**
  - Create and manage multiple projects
  - Project details and statistics
  - Project-specific task organization

- **Task Management**
  - Create, edit, and delete tasks
  - Set task priorities (High, Medium, Low)
  - Track task status (To Do, In Progress, Done)
  - Set due dates for tasks
  - Filter and search tasks

- **Modern UI/UX**
  - Responsive design for all devices
  - Dark/Light theme support
  - Clean and intuitive interface
  - Real-time updates

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Headless UI
- Hero Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- CORS

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/task-tracker.git
cd task-tracker
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Environment Setup

Create `.env` files in both client and server directories:

**Server (.env)**
```
PORT=4000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

**Client (.env)**
```
VITE_API_URL=http://localhost:4000/api
```

4. Start the development servers

```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## 📦 Deployment

### Backend Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: task-tracker-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: 14.x or higher

4. Add Environment Variables:
   ```
   PORT=4000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   ```

### Frontend Deployment on Render

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: task-tracker-frontend
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
   - **Node Version**: 14.x or higher

4. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

## 🔧 Troubleshooting

### Common Issues and Solutions

1. **CORS Errors**
   - Ensure the backend CORS configuration includes your frontend URL
   - Check if the API URL in frontend environment variables is correct
   - Verify that the backend is running and accessible

2. **MongoDB Connection Issues**
   - Verify your MongoDB URI is correct
   - Check if MongoDB Atlas IP whitelist includes your IP
   - Ensure network connectivity to MongoDB

3. **Authentication Problems**
   - Clear browser local storage
   - Verify JWT_SECRET is properly set
   - Check if token is being sent in request headers

4. **Build Failures**
   - Clear node_modules and reinstall dependencies
   - Update Node.js to the latest LTS version
   - Check for conflicting package versions

### Development Tips

1. **Running Both Servers**
   ```bash
   # Terminal 1 (Backend)
   cd server
   npm run dev

   # Terminal 2 (Frontend)
   cd client
   npm run dev
   ```

2. **Testing API Endpoints**
   - Use Postman or similar tool to test API endpoints
   - Base URL: http://localhost:4000/api
   - Include Authorization header: `Bearer <token>`

3. **Debugging**
   - Check browser console for frontend errors
   - Monitor server logs for backend issues
   - Use React Developer Tools for component debugging

4. **Code Quality**
   ```bash
   # Run ESLint
   cd client
   npm run lint

   # Format code
   npm run format
   ```

## 📚 API Documentation

### Authentication Endpoints
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Project Endpoints
- GET `/api/projects` - Get all projects
- POST `/api/projects` - Create new project
- GET `/api/projects/:id` - Get project details
- PATCH `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project

### Task Endpoints
- GET `/api/tasks` - Get all tasks
- POST `/api/tasks` - Create new task
- PATCH `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Umesh Choudhary 

## 🙏 Acknowledgments

- React.js community
- Tailwind CSS team
- MongoDB team
- All contributors and supporters

