const fs = require("fs");
const db = require("../../db.json"); 

module.exports = {
    userLocation: function (req, res) {
        const { email, position } = req.body;

        if (!email || !position || typeof position.lat !== "number" || typeof position.lon !== "number") {
            return res.status(400).json({ error: "Données invalides" });
        }

        // Trouver l'utilisateur dans la base de données
        let user = db.users.find(u => u.email === email);
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        // Mettre à jour la position et le statut connecté de l'utilisateur
        user.position = position;
        user.connected = true;

        // Sauvegarder les modifications dans le fichier JSON
        try {
            fs.writeFileSync("./db.json", JSON.stringify(db, null, 2), "utf-8");
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors de la sauvegarde" });
        }

        // Trouver les amis de l'utilisateur 
        let friendsData = db.users.filter(u => user.friends && user.friends.includes(u.email));

        // Construire la réponse (liste des amis)
        res.status(200).json(friendsData.map(friend => ({
            email: friend.email,
            lat: parseFloat(friend.position.lat.toFixed(6)),
            lon: parseFloat(friend.position.lon.toFixed(6)),
            connected: friend.connected
        })));
    }
};
