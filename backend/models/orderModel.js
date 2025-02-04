// models/Order.js
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "cancelled"),
        defaultValue: "pending",
      },
    },
    {
      tableName: "orders",
      timestamps: true,
      underscored: true,
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    Order.hasMany(models.Order_item, {
      foreignKey: "order_id",
      as: "order_items",
    });

    Order.hasOne(models.Invoice, {
      foreignKey: "order_id",
      as: "invoice",
    });
  };

  return Order;
};
