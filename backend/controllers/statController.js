const { Sequelize } = require("sequelize");
const db = require("../models/index");
const { Invoice } = db;

const getCities = async (req, res) => {

  try {
    const invoice_cp = await Invoice.findAll({
      attributes: ["cp", [Sequelize.fn("COUNT", Sequelize.col("cp")), "count"]],
      group: ["cp"],
      order: [[Sequelize.literal("count"), "DESC"]],
    });

    const formattedResults = invoice_cp.map((inv) => ({
      cp: inv.cp,
      count: inv.dataValues.count,
    }));

    res.status(200).json({ data: formattedResults });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// const getRevenueByDay = async (req, res) => {
//   try {
//     const revenueData = await Invoice.findAll({
//       attributes: [
//         [Sequelize.fn("DATE", Sequelize.col("purchase_date")), "date"],
//         [Sequelize.fn("SUM", Sequelize.col("total_price")), "total_revenue"],
//       ],
//       group: [Sequelize.fn("DATE", Sequelize.col("purchase_date"))],
//       order: [[Sequelize.fn("DATE", Sequelize.col("purchase_date")), "ASC"]],
//     });

//     const formattedResults = revenueData.map((entry) => ({
//       date: entry.dataValues.date,
//       total_revenue: entry.dataValues.total_revenue,
//     }));

//     res.status(200).json({ data: formattedResults });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

module.exports = { getCities };
