const db = require("../models/index");
const { User, Order, Order_item } = db;
require("dotenv").config();
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    const fields = { ...req.body };

    if (!fields.email || !fields.password) {
      return res
        .status(400)
        .json({ error: "Veuillez remplir tous les champs" });
    }

    const existing = await User.findOne({ where: { email: fields.email } });
    if (existing) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }
    const hashedPassword = await bcrypt.hash(fields.password, 10);
    fields.password = hashedPassword;
    await User.create(fields);

    const user = await User.findOne({
      where: { email: fields.email },
      exclude: ["password"],
    });

    res.status(200).json({
      message: "Utilisateur crée avec succès",
      user: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID utilisateur requis" });
    }
    const updates = { ...req.body };
    delete updates.id;

    if (!Object.keys(updates).length) {
      return res
        .status(400)
        .json({ error: "Aucun champ à mettre à jour fourni" });
    }

    const existingUser = await User.findByPk(id);

    if (!existingUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    await existingUser.update(updates);

    res.status(200).json({
      message: "Utilisateur mis à jour avec succès",
      user: existingUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID utilisateur requis" });
    }

    const existingUser = await User.findByPk(id);

    if (!existingUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    await existingUser.destroy();

    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.showUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    if (!users) {
      return res.status(404).json({ error: "Aucun utilisateur trouvé" });
    }

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.showUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID utilisateur requis" });
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID utilisateur requis" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const orders = await Order.findAll({
      where: { user_id: id },
      include: [
        {
          model: Order_item,
          as: "order_items",
        },
      ],
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "Aucune commande trouvée." });
    }

    return res.json(orders);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes : ", error);
    return res.status(500).json({ error: "Une erreur est survenue." });
  }
};

exports.getOrderByUserById = async (req, res) => {
  try {
    const { id, orderId } = req.params;
    if (!id || !orderId) {
      return res
        .status(400)
        .json({ error: "ID utilisateur et ID commande requis" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const order = Order.findByPk(orderId, {
      include: [
        {
          model: Order_item,
          as: "order_items",
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    return res.json(order);
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande : ", error);
    return res.status(500).json({ error: "Une erreur est survenue." });
  }
};
