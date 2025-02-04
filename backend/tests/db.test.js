// db.test.js
const sequelize = require("../config/database");

beforeAll(async () => {
    // Synchroniser la base de données avant les tests
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    // Fermer la connexion après les tests
    await sequelize.close();
});

describe("Test de connexion à la base de données", () => {
    it("Devrait se connecter correctement à PostgreSQL", async () => {
        try {
            await sequelize.authenticate();
            expect(true).toBe(true); // Si la connexion réussit
        } catch (error) {
            expect(true).toBe(false); // Si la connexion échoue
        }
    });
});
