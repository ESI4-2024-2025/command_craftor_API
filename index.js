require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const https = require('https')
const http = require('http')
const fs = require('fs')

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

const corsOptions = {
  origin: ['https://commandcraftor.ebasson.fr', 'http://localhost:3000'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(express.json())
app.use(cors(corsOptions))

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

const ItemRoutes = require('./routes/Item')
app.use('/item', ItemRoutes)
require('./routes/Item')(app)

const BlocRoutes = require('./routes/Bloc')
app.use('/bloc', BlocRoutes)
require('./routes/Bloc')(app)

const PotionRoutes = require('./routes/Potion')
app.use('/potion', PotionRoutes)
require('./routes/Potion')(app)

if (process.env.NODE_ENV === 'development') {
  http.createServer(app).listen(process.env.PORT ?? 3002, () => {
    console.log('=====================')
    console.log('')
    console.log('############')
    console.log(`The node express DEV app is listening at http://127.0.0.1:${process.env.PORT ?? 3002}`)
    console.log('############')
    console.log('')
    console.log('=====================')
  });
} else {
  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/www.ebasson.fr/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/www.ebasson.fr/fullchain.pem')
  };

  https.createServer(httpsOptions, app).listen(process.env.PORT ?? 3002, () => {
    console.log('=====================')
    console.log('')
    console.log('############')
    console.log(`The node express app is listening at https://127.0.0.1:${process.env.PORT ?? 3002}`)
    console.log('############')
    console.log('')
    console.log('=====================')
  });
}