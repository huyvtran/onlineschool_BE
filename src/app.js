const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const sequelize = require('./util/database');
const authRoutes = require('./routes/auth.router');
const teacherRoutes = require('./routes/teacher.router');
const videoRoutes = require('./routes/videoUpload.router');
const studentRoutes = require('./routes/student.router');
const doubtRoutes = require('./routes/doubt.router');
const assignment = require('./routes/assignment.router');
const reportRoutes = require('./routes/reports.router');
const masterRoutes = require('./routes/masters.router');
const principalroutes = require('./routes/principal.router');
const cors = require('cors');
const app = express();
const multer = require('multer');

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({extended: false, limit: '1024mb'}));
app.use(multer().single('video'));
app.use(express.static(path.join(__dirname, 'public')));
// parse application/json
app.use(bodyparser.json({limit: '1024mb'}));
app.use(bodyparser.text({limit: '1024mb'}));

app.use(cors({
    origin: '*'
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Origin', '*');
    res.setHeader('Access-Control-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Headers', 'Content-Type, Authorization');
    next();
});

// Routes
app.use('/api/auth',authRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/doubt', doubtRoutes);
app.use('/api/assignment',assignment)
app.use('/api/report', reportRoutes);
app.use('/api/master', masterRoutes);
app.use('/api/principal', principalroutes);

// Error Handling
app.use((error, req, res, next) => {
    const status = 500;
    const message = error.message;
    res.status(status).json({
        message: message,
        status: status,
    }); 
});

sequelize.sync()
    .then(result => {
        
    })
    .catch(error =>{
        console.log(error);
    })

app.use('/', (req, res, next) => {
    res.send('<h1> Hello, Welcome to Online Schools </h1>');
}).listen(7070);
