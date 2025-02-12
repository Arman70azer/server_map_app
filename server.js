const express = require("express");
const { getDbData } = require("./api/controllers/getDb");
const { authenticateUser, registerUser, delog } = require("./api/controllers/auth");
const { userLocation } = require("./api/controllers/locations");
const { deleteFriend, searchFriend, inviteUser, acceptInvite, refuseInvite } = require("./api/controllers/friends");

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

app.post("/accept", acceptInvite);

app.post("/refuse", refuseInvite);

app.post("/register", registerUser);

app.post("/delog", delog)

// Lancer le serveur
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
