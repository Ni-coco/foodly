"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("invoices", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      billing_address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      cp: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      payment_method: {
        type: Sequelize.STRING(50),
      },
      payment_status: {
        type: Sequelize.STRING(50),
      },
      cp: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("invoices");
  },
};
