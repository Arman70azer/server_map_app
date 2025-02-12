const fs = require("fs");
const db = require("../../db.json"); // Chargement de la base de données

module.exports = {
  deleteFriend: function (req, res) {
    const { email, friend } = req.body;

    // Vérification que l'email et le friend sont bien présents
    if (!email || !friend) {
      return res.status(400).json({ error: "Email ou ami manquant" });
    }

    // Trouver l'utilisateur par son email
    let user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Vérifier si l'ami est dans la liste des amis de l'utilisateur
    const friendIndex = user.friends.indexOf(friend);
    if (friendIndex === -1) {
      return res.status(404).json({ error: "Ami non trouvé dans la liste" });
    }

    // Supprimer l'ami de la liste des amis
    user.friends.splice(friendIndex, 1);

    // Sauvegarder les modifications dans le fichier JSON
    try {
      fs.writeFileSync("./db.json", JSON.stringify(db, null, 2), "utf-8");
      return res.status(200).json({ message: "Ami supprimé avec succès" });
    } catch (error) {
      return res.status(500).json({ error: "Erreur lors de la sauvegarde" });
    }
  }
};
