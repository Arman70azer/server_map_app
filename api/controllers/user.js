// api/controllers/users.js
const fs = require('fs');
const db = require("../../db.json");

module.exports = {
  updateUser: function (req, res) {
    const { authorization } = req.headers;
    const { avatar, name } = req.body;

    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Vérification de l'access token
    const decoded = authorization; // À remplacer par une méthode de validation sécurisée
    const user = db.users.find(u => u.id === decoded);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Mise à jour de l'utilisateur
    user.avatar = avatar || user.avatar;
    user.name = name || user.name;

    // Sauvegarder la mise à jour dans le fichier JSON
    fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));

    return res.status(200).json(user);
  }
};
