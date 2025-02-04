// models/Stock.js
module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define(
    "Stock",
    {
      product_id: {
        type: DataTypes.STRING,
        unique: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {
      tableName: "stocks",
      timestamps: false,
    }
  );

  return Stock;
};
