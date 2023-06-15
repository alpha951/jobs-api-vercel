require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();


app.use(express.static('./public'))

// secirity packages

const cors = require('cors');
const xss = require('xss-clean');
const ratelimit = require('express-rate-limit');

// database
const connectDB = require('./db/connect');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//authentication
const authenticateUser = require('./middleware/authentication');
const authRouter = require('./routes/auth');
// jobs
const jobsRouter = require('./routes/jobs');


// Swagger
const path = require('path');
const swaggerDocumentPath = path.join(__dirname, 'swagger.yaml');

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(swaggerDocumentPath);

// extra packages
app.use(express.json());

// routes
app.get('/', (req, res) => {
  // res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
  res.send('jobs-api');

});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));


// `app.set('trust proxy', 1)` is setting a trust proxy to the Express app.

app.set('trust proxy', 1); // trust first proxy

// security middleware
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(ratelimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100  // limit each IP to 100 requests per windowMs
}));


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', [authenticateUser, jobsRouter]);

// middleware for error handling (keep at the end of the file)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI).then(() =>
      console.log("Connected to MongoDB..."))
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;