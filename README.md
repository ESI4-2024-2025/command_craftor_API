# CommandCraftor API 🎮

Une API RESTful moderne pour la gestion de commandes Minecraft, développée avec Node.js et Express.

## 📋 Table des matières

- [Description du projet](#description-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Installation et lancement](#installation-et-lancement)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Tests](#tests)
- [Fonctionnalités](#fonctionnalités)
- [Avantages et faiblesses](#avantages-et-faiblesses)
- [Alternatives et choix technologiques](#alternatives-et-choix-technologiques)
- [Déploiement](#déploiement)
- [Contribution](#contribution)

## 🎯 Description du projet

CommandCraftor API est une application backend conçue pour gérer et stocker les commandes Minecraft les plus populaires. Elle permet aux utilisateurs de :

- Rechercher et consulter des commandes Minecraft
- Gérer des utilisateurs avec authentification JWT
- Suivre les statistiques d'utilisation des commandes
- Gérer un système de tickets de support
- Envoyer des emails automatisés

## 🛠️ Technologies utilisées

### Backend Core
- **Node.js** (v14+) - Runtime JavaScript
- **Express.js** (v4.18.2) - Framework web rapide et minimaliste
- **MongoDB** avec **Mongoose** (v6.9.0) - Base de données NoSQL et ODM

### Authentification & Sécurité
- **JWT (jsonwebtoken)** (v9.0.0) - Gestion des tokens d'authentification
- **Crypto-js** (v4.1.1) - Chiffrement des mots de passe
- **CORS** (v2.8.5) - Gestion des requêtes cross-origin

### Validation & Documentation
- **Express-validator** (v7.0.1) - Validation des données d'entrée
- **Swagger** (swagger-jsdoc, swagger-ui-express) - Documentation API automatique

### Email & Templates
- **Nodemailer** (v6.9.1) - Envoi d'emails
- **MJML** (v4.15.3) - Création de templates d'emails responsives

### Logging & Monitoring
- **Winston** (v3.15.0) - Système de logging avancé

### Tests
- **Jest** (v29.7.0) - Framework de tests
- **Supertest** (v7.0.0) - Tests d'API
- **MongoDB Memory Server** (v10.1.2) - Base de données en mémoire pour les tests

### Déploiement
- **PM2** - Gestionnaire de processus pour la production
- **Docker** - Containerisation

## 📁 Structure du projet

```
commad_craftor_API/
├── 📁 config/
│   └── database.js              # Configuration MongoDB
├── 📁 controllers/
│   ├── blocControllers.js       # Contrôleur pour les blocs
│   ├── itemControllers.js       # Contrôleur pour les items
│   ├── potionControllers.js     # Contrôleur pour les potions
│   ├── requestControllers.js    # Contrôleur pour les commandes
│   ├── ticketControllers.js     # Contrôleur pour les tickets
│   └── userControllers.js       # Contrôleur pour les utilisateurs
├── 📁 middlewares/
│   ├── authJwt.js              # Middleware d'authentification JWT
│   └── index.js                # Point d'entrée des middlewares
├── 📁 models/
│   ├── blocModel.js            # Modèle de données pour les blocs
│   ├── enchantModel.js         # Modèle pour les enchantements
│   ├── itemModel.js            # Modèle pour les items
│   ├── materiauxModel.js       # Modèle pour les matériaux
│   ├── potionModel.js          # Modèle pour les potions
│   ├── requestModel.js         # Modèle pour les commandes
│   ├── ticketModel.js          # Modèle pour les tickets
│   ├── userModel.js            # Modèle pour les utilisateurs
│   ├── VersionsModel.js        # Modèle pour les versions Minecraft
│   └── 📁 Enum/
│       └── statut.js           # Énumérations des statuts
├── 📁 routes/
│   ├── Bloc.js                 # Routes pour les blocs
│   ├── Item.js                 # Routes pour les items
│   ├── Potion.js               # Routes pour les potions
│   ├── Request.js              # Routes pour les commandes
│   ├── Ticket.js               # Routes pour les tickets
│   └── User.js                 # Routes pour les utilisateurs
├── 📁 template/
│   ├── mail.css                # Styles CSS pour les emails
│   └── 📁 mail/
│       ├── addTicketMail.js    # Template email création ticket
│       ├── endTicketMail.js    # Template email fermeture ticket
│       ├── passwordModify.js   # Template email modification MDP
│       ├── passwordReset.js    # Template email reset MDP
│       └── verifyMail.js       # Template email vérification
├── 📁 mailer/
│   └── mailer.js               # Configuration du service d'email
├── 📁 test/                    # Tests unitaires et d'intégration
├── 📁 utils/
│   └── testDb.js               # Utilitaires pour les tests
├── index.js                    # Point d'entrée principal
├── logger.js                   # Configuration du système de logs
├── package.json                # Dépendances et scripts npm
└── Dockerfile                  # Configuration Docker
```

## 🚀 Installation et lancement

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB (local ou distant)
- npm ou yarn

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/commad_craftor_API.git
cd commad_craftor_API
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**
```bash
cp .env.example .env
```

Éditer le fichier `.env` avec vos paramètres :
```env
NODE_ENV=development
PORT=3002
MONGO_URL=mongodb://localhost:27017
MONGO_NAME=commandcraftor
TOKEN_SECRET=votre_secret_jwt_super_securise
SSL_PATH=/path/to/ssl/certificates
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre.email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
```

### Lancement

#### Développement
```bash
npm start
# ou
npm run startBack
```

#### Production avec PM2
```bash
npm run init           # Premier démarrage
npm run startBack      # Redémarrage
npm run updateDeploy   # Mise à jour et redémarrage
```

#### Tests
```bash
npm test
```

### Accès à l'application

- **API Base URL**: `http://localhost:3002`
- **Documentation Swagger**: `http://localhost:3002/api-docs`
- **Health Check**: `http://localhost:3002/users` (GET)

## ⚙️ Configuration

### Base de données
L'API utilise MongoDB. La configuration se trouve dans `config/database.js`.

### SSL/HTTPS
En production (`NODE_ENV=production`), l'API utilise HTTPS avec des certificats SSL configurés via `SSL_PATH`.

### CORS
Les origines autorisées sont configurées dans `index.js` :
- `https://commandcraftor.ebasson.fr` (production)
- `http://localhost:3000` (développement)

## 📚 API Documentation

La documentation complète de l'API est disponible via Swagger UI à l'adresse `/api-docs`.

### Endpoints principaux

#### Authentification
- `POST /users/login` - Connexion utilisateur
- `POST /users/register` - Inscription utilisateur
- `PUT /verify-token` - Vérification du token JWT

#### Commandes Minecraft
- `GET /getRequest` - Récupérer les 5 commandes les plus populaires
- `POST /ARequest` - Ajouter/mettre à jour une commande

#### Gestion utilisateur
- `GET /users` - Lister tous les utilisateurs
- `PUT /users/current` - Récupérer le profil utilisateur
- `PUT /users/update` - Mettre à jour le profil
- `PUT /users/addFavorite` - Ajouter aux favoris
- `DELETE /users/deleteFavorite` - Supprimer des favoris

#### Items Minecraft
- `GET /getItem` - Récupérer tous les items
- `POST /addItem` - Ajouter un nouvel item

#### Tickets de support
- `GET /tickets` - Lister tous les tickets
- `POST /tickets` - Créer un nouveau ticket
- `PUT /tickets/:id/statut` - Mettre à jour le statut
- `DELETE /tickets/:id` - Supprimer un ticket

#### Email Templates
- `POST /convert` - Convertir MJML en HTML

## 🧪 Tests

Le projet inclut une suite complète de tests :

```bash
# Exécuter tous les tests
npm test

# Tests avec couverture
npm run test:coverage
```

### Structure des tests
- Tests unitaires des contrôleurs
- Tests d'intégration des routes
- Tests des modèles de données
- Tests des middlewares

## 🎯 Fonctionnalités

### ✅ Implémentées
- ✅ Authentification JWT complète
- ✅ CRUD utilisateurs avec validation
- ✅ Gestion des commandes Minecraft populaires
- ✅ Système de tickets de support
- ✅ Envoi d'emails automatisés (MJML)
- ✅ Documentation API Swagger
- ✅ Logging avec Winston
- ✅ Tests unitaires et d'intégration
- ✅ Support HTTPS/SSL
- ✅ Déploiement PM2

### 🔄 En cours
- 🔄 Interface d'administration
- 🔄 Système de notifications push
- 🔄 Cache Redis pour les performances

### 📋 Prévues
- 📋 Rate limiting
- 📋 Monitoring avancé
- 📋 Migration vers TypeScript

## ⚖️ Avantages et faiblesses

### ✅ Avantages

**Performance**
- ✅ Architecture légère avec Express.js
- ✅ Base de données NoSQL rapide (MongoDB)
- ✅ Mise en cache possible avec Redis

**Développement**
- ✅ JavaScript partout (frontend/backend)
- ✅ Large écosystème npm
- ✅ Documentation automatique avec Swagger
- ✅ Tests automatisés complets

**Scalabilité**
- ✅ Architecture modulaire (MVC)
- ✅ Déploiement facile avec PM2/Docker
- ✅ Support natif des microservices

**Sécurité**
- ✅ Authentification JWT stateless
- ✅ Validation stricte des données
- ✅ Chiffrement des mots de passe
- ✅ CORS configuré

### ❌ Faiblesses

**Limitations Node.js**
- ❌ Single-threaded (problème pour les tâches CPU-intensives)
- ❌ Gestion mémoire manuelle nécessaire
- ❌ Écosystème npm parfois instable

**Base de données**
- ❌ MongoDB pas optimal pour les relations complexes
- ❌ Pas de transactions ACID natives (avant v4)
- ❌ Consommation mémoire plus élevée

**Maintenance**
- ❌ JavaScript dynamique = erreurs runtime possibles
- ❌ Dépendances nombreuses à maintenir
- ❌ Debugging parfois complexe (callbacks/promises)

## 🔄 Alternatives et choix technologiques

### Backend Framework

#### Express.js ✅ (Choix actuel)
**Pourquoi choisi :**
- Simplicité et flexibilité maximale
- Large communauté et écosystème
- Performance élevée pour les APIs REST
- Documentation excellente

**Alternatives considérées :**
- **Fastify** : Plus rapide, mais écosystème plus petit
- **Koa.js** : Moderne, mais moins de middlewares
- **NestJS** : TypeScript natif, mais plus complexe pour ce projet

### Base de données

#### MongoDB + Mongoose ✅ (Choix actuel)
**Pourquoi choisi :**
- Flexibilité du schéma pour les données Minecraft
- Performance excellente pour les lectures
- Intégration native avec Node.js
- Scaling horizontal facile

**Alternatives considérées :**
- **PostgreSQL** : ACID complet, mais relations complexes inutiles ici
- **Redis** : Ultra-rapide, mais persistence limitée
- **SQLite** : Simple, mais pas scalable

### Authentification

#### JWT ✅ (Choix actuel)
**Pourquoi choisi :**
- Stateless (scalabilité horizontale)
- Standard industrie
- Payload personnalisable
- Pas de session côté serveur

**Alternatives considérées :**
- **Sessions Express** : Simple, mais état côté serveur
- **OAuth 2.0** : Standard, mais complexité excessive
- **Passport.js** : Flexible, mais surcouche inutile

### Validation

#### Express-validator ✅ (Choix actuel)
**Pourquoi choisi :**
- Intégration native Express
- Validation côté serveur robuste
- Messages d'erreur personnalisables
- Chaîning des validations

**Alternatives considérées :**
- **Joi** : Plus puissant, mais syntaxe plus verbale
- **Yup** : Moderne, mais orienté frontend
- **Ajv** : Performance maximale, mais complexité JSON Schema

### Documentation

#### Swagger/OpenAPI ✅ (Choix actuel)
**Pourquoi choisi :**
- Standard industrie pour les APIs REST
- Interface interactive incluse
- Génération automatique possible
- Support excellent des outils

**Alternatives considérées :**
- **Postman Collections** : Pratique, mais pas standard
- **API Blueprint** : Markdown natif, mais moins populaire
- **GraphQL** : Moderne, mais overkill pour ce projet

## 🚀 Déploiement

### Développement
```bash
npm start
```

### Production

#### Avec PM2
```bash
npm run startBack
```

#### Avec Docker
```bash
docker build -t commandcraftor-api .
docker run -d -p 3002:3002 --env-file .env commandcraftor-api
```

#### Variables d'environnement production
```env
NODE_ENV=production
PORT=3002
MONGO_URL=mongodb://production-url
SSL_PATH=/etc/ssl/certs
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de code
- ESLint configuration incluse
- Tests obligatoires pour les nouvelles fonctionnalités
- Documentation Swagger pour les nouveaux endpoints
- Messages de commit conventionnels

### Structure des commits
```
type(scope): description

- feat: nouvelle fonctionnalité
- fix: correction de bug
- docs: documentation
- style: formatage
- refactor: refactoring
- test: ajout de tests
- chore: maintenance
```

## 📞 Support

- **Issues GitHub** : Pour les bugs et suggestions
- **Email** : support@commandcraftor.fr
- **Documentation** : `/api-docs` endpoint

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**CommandCraftor API** - Développé avec ❤️ pour la communauté Minecraft
