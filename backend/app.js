// Déclaration des modules nécessaires au bon fonctionnement de l'API après installation via le package npm //
// dotenv pour protéger les accès à la bdd de mongoDb //

const express = require('express');
const helmet = require('helmet');
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');

// Déclaration des routes user et sauce //
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const { json } = require('body-parser');

// appel à express et mise en place du middleware pour accès et configuration des requêtes //
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 
                'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
              );
  res.setHeader('Access-Control-Allow-Methods',
                'GET, POST, PUT, DELETE, PATCH, OPTIONS'
              );
  next();
});

app.use(express.json());
app.use(helmet());

// Connexion à mongoDb //
mongoose.connect('mongodb+srv://jimbob:<PASSWORD>@cluster0-pme76.mongodb.net/test?retryWrites=true&w=majority', { 
  useNewUrlParser: true,
  useUnifiedTopology: true 
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Traitement des images et des routes //
app.use('/images', express.static(path.join(__dirname, '/images'))); 
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;