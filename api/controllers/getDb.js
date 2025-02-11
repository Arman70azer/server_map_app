const fs = require("fs");
const path = require("path");

const db = path.join(__dirname, "../../db.json");
console.log("Path to db.json: ", db);  // Vérifie que le chemin est correct

module.exports = {
  getDbData: (req, res) => {
    console.log("ca passa"); // Vérifie si cette ligne est exécutée
    fs.readFile(db, "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.status(200).json(JSON.parse(data)); // Retourne les données du fichier JSON
    });
  }
};




