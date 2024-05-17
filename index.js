require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')


const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Options de configuration pour swagger-jsdoc
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Command Craftor API Documentation',
      version: '1.0.0',
      description: 'Documentation for your API',
    },
  },
  apis: ['./routes/*.js'], // Utilisez le chemin vers vos fichiers de routes
};


// Initialise swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Middleware pour servir la documentation Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



require('./config/database')

app.use(express.json())
app.use(cors())

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())
const UserRoutes = require('./routes/User')
app.use('/user', UserRoutes)
require('./routes/User')(app)

const RequestRoutes = require('./routes/Request')
app.use('/request', RequestRoutes)
require('./routes/Request')(app)

app.listen(process.env.PORT ?? 5000, () => {
  // eslint-disable-next-line no-console
  console.log('=====================')
  console.log('')
  console.log('############')
  console.log(`The node express app is listening at http://127.0.0.1: ${process.env.PORT}`)
  console.log('############')
  console.log('')
  console.log('=====================')
})