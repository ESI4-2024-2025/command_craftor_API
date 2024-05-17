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
      title: 'Doc API CommandCraftor',
      version: '1.0.0',
      description: 'Documentation de l\'API de l\'application CommandCraftor une application de gestion de commandes Minecraft.\n\n Le Model des \'Utilisateurs\' est de \'Request\' sont disponible en bas de la page \n\n **ATTENTION** : Cette documentation est générée automatiquement à partir des annotations Swagger dans le code. \n\n Pour plus d\'informations sur les routes disponibles, veuillez consulter le code source de l\'application.',
    },
  },
  apis: ['./routes/*.js'], // Spécifiez ici le chemin vers vos fichiers de routes contenant les annotations Swagger
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