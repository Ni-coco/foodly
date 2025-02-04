const db = require("../models/index");
const { Role } = db;

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();

    if (!roles) {
      return res.status(404).json({ error: "Aucun rôle trouvé" });
    }

    res.status(200).json({ roles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getRoles };
