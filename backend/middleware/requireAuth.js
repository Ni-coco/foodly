const jwt = require("jsonwebtoken");
const db = require("../models/index");
const { User } = db;
require("dotenv").config();

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

   try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "email", "role_id"],
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = {
      id: user._id,
      role: user.role_id,
    };

    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
