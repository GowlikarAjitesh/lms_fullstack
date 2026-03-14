require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDB = require('./database/db');
const authRoutes = require('./routes/auth-routes');
const userRoutes = require('./routes/user-routes');
const instructorRoutes = require('./routes/instructor-course-routes');
const instructorMediaRoutes = require('./routes/instructor-media-routes');
const instructorRoutesPublic = require('./routes/instructor-routes');
const studentCourseRoutes = require('./routes/student-course-route');
const studentOrderRoutes = require('./routes/order-routes');
const studentBoughtCoursesRoutes = require('./routes/student-brought-courses-route');
const studentCourseProgressRoutes = require('./routes/course-progress-routes');
const adminRoutes = require('./routes/admin-routes');

const app = express();
const PORT = process.env.PORT || 3000;

//db connection
connectToDB();

//cors
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174"];
// console.log(allowedOrigins);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],

}));
//middleware
app.use(express.json());


//routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/instructor/course', instructorRoutes);
app.use('/api/instructor/media', instructorMediaRoutes);
app.use('/api/instructors', instructorRoutesPublic);
app.use('/api/student/course', studentCourseRoutes);
app.use('/api/student/order', studentOrderRoutes);
app.use('/api/student/courses-bought', studentBoughtCoursesRoutes);
app.use('/api/student/course-progress', studentCourseProgressRoutes);
app.use('/api/admin', adminRoutes);

//gloabal error handling
app.use((err, req, res, next) => {
    console.log('Error: ', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong'
    })
})

app.listen(PORT, ()=>{
    console.log(`Server is listening on the Port ${PORT}`);
})
