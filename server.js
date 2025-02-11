const express = require("express");
const SwaggerExpress = require("swagger-express-mw");

const app = express();
const config = { appRoot: __dirname };  // Le chemin vers ton fichier swagger.yml

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) { throw err; }
  
  // Enregistre les routes générées automatiquement par Swagger
  swaggerExpress.register(app);

  // Démarre ton serveur
  app.listen(8080, () => console.log("API running on http://localhost:8080"));
});

