const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');

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

// Générer la spécification Swagger
const swaggerSpec = swaggerJsdoc(options);

// Écrire la spécification Swagger dans un fichier JSON
fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2), 'utf-8');

console.log('Swagger specification written to swagger.json');
