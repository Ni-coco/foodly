const db = require("../models/index");
const { Role } = db;

const checkRole = (allowedRoleIds) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Utilisateur non authentifié." });
      }

      // Récupère le rôle de l'utilisateur
      const userRole = await Role.findByPk(req.user.role);

      if (!userRole) {
        return res.status(401).json({ error: "Votre rôle n'existe pas." });
      }

      if (userRole.label === "admin") {
        return next();
      }

      // Vérifie si le rôle est dans la liste des rôles autorisés
      if (!allowedRoleIds.includes(req.user.role)) {
        return res.status(403).json({
          error: "Vous ne disposez pas des autorisations nécessaires.",
        });
      }

      next();
    } catch (error) {
      console.error("Role checking error:", error);
      return res.status(500).json({ error: "An error occurred." });
    }
  };
};

module.exports = checkRole;
