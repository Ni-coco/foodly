const fs = require("fs");
const { Pool } = require("pg");
const db = require("../../models/index");
const { User } = db;
const bcrypt = require("bcrypt");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

(async () => {
  try {
    // 1) Charger les deux fichiers SQL
    const seedQuery = fs.readFileSync("./database/seeders/seeders.sql", "utf8");
    const stockSeedQuery = fs.readFileSync(
      "./database/seeders/stockSeed.sql",
      "utf8"
    );

    // 2) Exécuter le fichier SQL principal (roles, etc.)
    await pool.query(seedQuery);
    console.log("Seed de données (seeders.sql) réussi.");

    // 3) Exécuter le fichier SQL pour les stocks
    await pool.query(stockSeedQuery);
    console.log("Seed de données (stockSeed.sql) réussi.");

    // 4) Créer des utilisateurs AVEC bcrypt
    const adminUser = await User.create({
      email: "admin@gmail.com",
      password: await bcrypt.hash("Admin@123", 10),
      role_id: 2,
      first_name: "John",
      last_name: "Doe",
    });

    const normalUser = await User.create({
      email: "user@gmail.com",
      password: await bcrypt.hash("User@123", 10),
      role_id: 1,
      first_name: "Jane",
      last_name: "Smith",
    });

    console.log("Utilisateurs créés avec succès.");

    await pool.query(
      `
      INSERT INTO Orders (user_id, total_amount, status, created_at)
      VALUES
        ($1, 150.00, 'completed', NOW()), -- pour admin
        ($1, 299.99, 'pending', NOW()),
        ($2, 59.99, 'completed', NOW()),  -- pour user
        ($2, 89.50, 'pending', NOW())
      RETURNING id;
      `,
      [adminUser.id, normalUser.id]
    );

    console.log("Commandes insérées avec succès.");

    await pool.query(`
      INSERT INTO Order_items (order_id, product_id, quantity)
      VALUES
        (1, '3274080005003', 2),
        (1, '737628064502', 1),
        (2, '737628064502', 3),
        (3, '3274080005003', 4)
      ON CONFLICT DO NOTHING;
    `);

    console.log("Order_items insérés avec succès.");

    await pool.query(`
      INSERT INTO Invoices (order_id, billing_address, payment_method, payment_status, cp, purchase_date, total_price)
      VALUES
        (1, '123 Rue Principale', 'credit_card', 'paid', '69000', '2024-01-15 14:30:00', 150.75),
        (2, '7 Boulevard Example', 'paypal', 'failed', '21000', '2024-02-03 09:15:00', 200.50),
        (3, '99 Avenue Du Test', 'credit_card', 'paid', '13000', '2024-01-25 18:45:00', 175.20)
      ON CONFLICT DO NOTHING;
    `);
    

    console.log("Invoices insérés avec succès.");

    // 7) Fin du script
    await pool.end();
  } catch (error) {
    console.error("Error running seed:", error.message);
    await pool.end();
  }
})();
