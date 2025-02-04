// models/Order_item.js
module.exports = (sequelize, DataTypes) => {
  const Order_item = sequelize.define(
    "Order_item",
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
      product_id: {
        type: DataTypes.STRING,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "order_items",
      timestamps: false,
    }
  );

  Order_item.associate = (models) => {
    Order_item.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order",
    });
  };

  return Order_item;
};
