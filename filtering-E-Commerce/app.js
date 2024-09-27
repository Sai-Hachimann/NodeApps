//utility packages
require('dotenv').config();
require('express-async-errors');

//express
const express = require('express');
const app = express();

//router
const productsRouter = require('./routes/products');
//db
const connectDB = require('./db/connect');

//errormiddlewares
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

//routes
app.get('/', (req, res) => {
  res.send('hello from home page');
});

//products routes
app.use('/api/v1/products', productsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

async function startFn() {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startFn();
