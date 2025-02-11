// api/controllers/auth.js
const db = require("../../db.json"); // Chargement de la base de données JSON

module.exports = {
  authenticateUser: function (req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "ID token is required" });
    }

    // Simuler la validation du token
    const user = db.users.find(u => u.email === email && u.password == password);
    if (!user) {
      return res.status(401).json({ message: "Invalid ID token" });
    }

    // Générer un token d'accès factice
    const access_token = "token" + user.id;
    return res.status(200).json({ access_token });
  },


  registerUser: function (req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Vérifie si l'email existe déjà
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Crée un nouvel utilisateur
    const newUser = {
      id: db.users.length + 1,
      email,
      password // ⚠️ Ne pas stocker en clair (utiliser bcrypt en prod)
    };

    db.users.push(newUser);

    // Écriture dans le fichier db.json (simulé comme une base de données)
    fs.writeFile(db, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error saving user" });
      }

      // Génération du token factice
      const access_token = "fake-jwt-token-" + newUser.id;
      return res.status(201).json({ access_token });
    });
  }
};


