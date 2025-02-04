const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../models/index");
const { User } = db;
require("dotenv").config();

// Fonction pour générer un JWT
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "2d" });
};

// Signup
const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      throw Error("Veuillez remplir toutes les informations !");

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw Error("Email already in use");

    // Créer un nouvel utilisateur
    const newUser = await User.create({
      email,
      password: await bcrypt.hash(password, 10),
    });

    // Générer un token JWT
    const token = generateToken(newUser.id);
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });

    res.status(201).json({ user: user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      throw Error("Veuillez remplir toutes les informations !");

    // Rechercher l'utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user) throw Error("Mot de passe ou utilisateur incorrect !");

    // Comparer les mots de passe
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw Error("Mot de passe ou utilisateur incorrect !");
    user.password = undefined;
    // Générer un token JWT
    const token = generateToken(user.id);

    res.status(200).json({ user: user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { signup, login };
