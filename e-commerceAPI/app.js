require('dotenv').config();
require('express-async-errors');
//Database
const connectDB = require('./db/connect');
//utility
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
//routers
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRoutes');
const productsRouter = require('./routes/productsRouter');
const reviewRouter = require('./routes/reviewsRouter');
//errorHandler Middlewares
const notFoundMiddleWare = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//express
const express = require('express');
const app = express();

//additional packages
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload());

//routes

app.get('/', (req, res) => {
  res.status(200).send('Home Route');
});
app.get('/api/v1', (req, res) => {
  console.log(req.signedCookies);
  res.status(200).send('Home Route');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleware);
//port variable
const port = process.env.PORT || 5000;

async function startfn() {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`the server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startfn();
