import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'

import { blogsRouter } from './controllers/blogs.js'
import { loginRouter } from './controllers/login.js'
import { testRouter } from './controllers/test.js'
import { unknownEndpoint, errorHandler, tokenExtractor } from './utils/middleware.js'
import { usersRouter } from './controllers/users.js'
import config from './config.js'
import logger from './utils/logger.js'

logger.info('connecting to', config.MONGODB_URL)

//creates connection to the mongoDB database
mongoose
  .connect(config.MONGODB_URL)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });


mongoose.set('runValidators', true)

const app = express()
//middlewares
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))

app.use(tokenExtractor)

//routers
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)

export { app }