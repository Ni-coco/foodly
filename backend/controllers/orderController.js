const db = require("../models/index");
const { Order, Order_item, Invoice } = db;

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
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

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInvoiceByOrderId = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findOne({
      where: { order_id: id },
    });

    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    res.status(200).json({ invoice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
