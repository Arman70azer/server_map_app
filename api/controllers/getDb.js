const fs = require("fs");
const path = require("path");

// Définir le chemin vers le fichier db.json
const dbPath = path.join(__dirname, "../../db.json");

module.exports = {
  getDbData: (_, res) => {
    // Lire le fichier db.json
    fs.readFile(dbPath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
      // Retourner les données du fichier JSON
      res.status(200).json(JSON.parse(data));
    });
  }
};

