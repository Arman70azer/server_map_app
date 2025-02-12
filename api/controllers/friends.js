const fs = require("fs");
const db = require("../../db.json"); // Chargement de la base de données

function saveDB(data) {
    fs.writeFileSync("./db.json", JSON.stringify(data, null, 2), "utf8");
};

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

        //ex-ami
        let exFriend = db.users.find(u => u.email === friend);
        if (!exFriend) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        const exFriendIndex = exFriend.friends.indexOf(email);
        if (exFriendIndex === -1){
            return res.status(404).json({ error: "Ami non trouvé dans la liste" });
        }

        exFriend.friends.splice(exFriendIndex, 1);

        // Sauvegarder les modifications dans le fichier JSON
        try {
        fs.writeFileSync("./db.json", JSON.stringify(db, null, 2), "utf-8");
        return res.status(200).json({ message: "Ami supprimé avec succès" });
        } catch (error) {
        return res.status(500).json({ error: "Erreur lors de la sauvegarde" });
        }
    },

    // Méthode pour rechercher un ami
    searchFriend: function(req, res) {
        const { email, friend } = req.body;

        // Vérification si l'email est valide et si les deux emails sont différents
        if (!email || !friend || email === friend) {
        return res.status(400).json({ message: "Invalid request or same email" });
        }

        console.log(friend);

        // Recherche dans la base de données si l'email existe
        const foundFriend = db.users.find(user => user.email === friend);

        if (foundFriend) {
        // Si l'email existe, retourne juste l'email
        return res.status(200).json({ email: foundFriend.email });
        } else {
        // Si l'email n'existe pas, retourne une erreur
        return res.status(404).json({ message: "User not found" });
        }
    },

    inviteUser: function (req, res) {
        const { email, friend } = req.body;

        if (!email || !friend) {
            return res.status(400).json({ error: "Les champs 'email' et 'friend' sont requis." });
        }

        // Trouver l'utilisateur cible (friend)
        let targetUser = db.users.find(user => user.email === friend);
        if (!targetUser) {
            return res.status(404).json({ error: "Utilisateur cible non trouvé." });
        }

        // Vérifier si l'invitation existe déjà
        if ((targetUser.invitations && targetUser.invitations.includes(email)) || targetUser.friends.includes(email)) {
            return res.status(409).json({ error: "Invitation déjà envoyée ou déjà ami." });
        }

        // Ajouter l'invitation
        if (!targetUser.invitations) {
            targetUser.invitations = []; // S'assurer que le tableau existe
        }
        targetUser.invitations.push(email);

        // Sauvegarder les modifications dans la base de données
        saveDB(db);

        return res.status(200).json({ message: `Invitation envoyée à ${friend}.` });
    },

    acceptInvite: function (req, res) {
        const { email, friend } = req.body;

        if (!email || !friend) {
            return res.status(400).json({ error: "Email ou ami manquant." });
        }

        // Trouver l'utilisateur actuel et l'ami dans la base de données
        let user = db.users.find(u => u.email === email);
        let friendUser = db.users.find(u => u.email === friend);

        if (!user || !friendUser) {
            return res.status(404).json({ error: "Utilisateur ou ami non trouvé." });
        }

        // Vérifier si l'ami est bien dans la liste des invitations
        if (!user.invitations.includes(friend)) {
            return res.status(400).json({ error: "Invitation non trouvée." });
        }

        // Ajouter l'ami à la liste des amis de l'utilisateur
        user.friends = user.friends || [];
        if (!user.friends.includes(friend)) {
            user.friends.push(friend);
        }

        // Ajouter l'utilisateur à la liste des amis du friendUser
        friendUser.friends = friendUser.friends || [];
        if (!friendUser.friends.includes(email)) {
            friendUser.friends.push(email);
        }

        // Supprimer l'invitation après acceptation
        user.invitations = user.invitations.filter(invite => invite !== friend);
        friendUser.invitations = friendUser.invitations.filter(invite => invite !== email);

        // Sauvegarder les modifications
        try {
            fs.writeFileSync("./db.json", JSON.stringify(db, null, 2), "utf-8");
            return res.status(200).json({
                email: friend.email,
                lat: parseFloat(friend.position.lat.toFixed(6)),
                lon: parseFloat(friend.position.lon.toFixed(6)),
                connected: friend.connected,
            });
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors de la sauvegarde." });
        }
    }
  
};
