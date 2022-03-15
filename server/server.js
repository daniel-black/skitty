const express = require('express');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/dbConfig');
require('dotenv').config();

connectDB();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/user', require('./routes/userRoutes'));
// app.use('/api/university', require('./routes/universityRoutes'));

app.use(errorHandler);
app.listen(port, () => console.log(`Server running on port ${port}`));
