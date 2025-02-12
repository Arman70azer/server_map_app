const express = require("express");
const { getDbData } = require("./api/controllers/getDb");
const { authenticateUser, registerUser } = require("./api/controllers/auth");
const { userLocation } = require("./api/controllers/locations");
const { deleteFriend, searchFriend, inviteUser } = require("./api/controllers/friends");

const app = express();
const port = 8080;

// Utilisation de json pour parser les requêtes entrantes avec un corps JSON
app.use(express.json());

// Définir les routes en fonction de swagger.yml

// Endpoint pour récupérer les données de la DB
app.get("/api", getDbData);

app.post("/auth", authenticateUser);

app.post("/friends", deleteFriend);

app.post("/locations", userLocation);

app.post("/search", searchFriend);

app.post("/invitations", inviteUser);

app.post("/register", registerUser);

// Autres routes (par exemple pour la mise à jour de l'utilisateur)
app.put("/users", (req, res) => {
  const { name, avatar } = req.body;
  // Logique pour mettre à jour l'utilisateur
  // Par exemple, modifier le db.json ou répondre avec des données modifiées
  res.status(200).json({ message: "Utilisateur mis à jour", name, avatar });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
