const db = require("../models/index");
const { Invoice, Order, Order_item } = db;

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: {
        model: Order,
        as: "order",
      },
    });

    res.status(200).json({ invoices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInvoicesByOrderId = async (req, res) => {
  try {
    const { id } = req.params;

    const invoices = await Invoice.findAll({
      where: { order_id: id },
      include: [
        {
          model: Order,
          as: "order",
          include: [
            {
              model: Order_item,
              as: "order_items",
            },
          ],
        },
      ],
    });

    res.status(200).json({ invoices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    res.status(200).json({ invoice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const items = { ...req.body };

    const invoice = await Invoice.create(items);

    res.status(201).json({ invoice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const items = { ...req.body };

    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    await invoice.update(items);

    res.status(200).json({ invoice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    await invoice.destroy();

    res.status(200).json({ message: "Facture supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
