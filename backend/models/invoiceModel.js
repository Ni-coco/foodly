const { all } = require("axios");

// models/Invoice.js
module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    "Invoice",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "orders",
          key: "id",
        },
      },
      billing_address: {
        type: DataTypes.TEXT,
      },
      payment_method: {
        type: DataTypes.STRING,
      },
      payment_status: {
        type: DataTypes.ENUM("paid", "failed"),
      },
      cp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // purchase_date: {
      //   type: DataTypes.DATE,
      //   allowNull: false,
      // },
      // total_price: {
      //   type: DataTypes.FLOAT,
      //   allowNull: false,
      // },
    },
    {
      tableName: "invoices",
      timestamps: false,
    }
  );

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order",
    });
  };

  return Invoice;
};
