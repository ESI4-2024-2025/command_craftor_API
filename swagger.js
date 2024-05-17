const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentation for your API',
        },
    },
    apis: ['./routes/*.js'], // Spécifiez ici le chemin vers vos fichiers de routes contenant les annotations Swagger
};

// Générer la spécification Swagger
const swaggerSpec = swaggerJsdoc(options);

// Écrire la spécification Swagger dans un fichier JSON
fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2), 'utf-8');

console.log('Swagger specification written to swagger.json');
