// api/controllers/auth.js
const db = require("../../db.json"); // Chargement de la base de données JSON

module.exports = {
  authenticateUser: function (req, res) {
    const { id_token } = req.body;

    if (!id_token) {
      return res.status(400).json({ message: "ID token is required" });
    }

    // Simuler la validation du token
    const user = db.users.find(u => u.id_token === id_token);
    if (!user) {
      return res.status(401).json({ message: "Invalid ID token" });
    }

    // Générer un token d'accès factice
    const access_token = "fake-jwt-token-for-" + user.id;
    return res.status(200).json({ access_token });
  }
};
