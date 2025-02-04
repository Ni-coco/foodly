const request = require("supertest");
const express = require("express");

const app = express();
app.get("/test", (req, res) => res.status(200).send("Test route"));

describe("Test du serveur", () => {
    let server;

    beforeAll((done) => {
        server = app.listen(3000, () => {
            global.agent = request.agent(server);
            done();
        });
    });

    afterAll((done) => {
        server.close(done);
    });

    it("Devrait répondre avec un statut 404 sur /", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(404);
    });

    it("Devrait répondre avec un statut 200 sur /test", async () => {
        const res = await request(app).get("/test");
        expect(res.statusCode).toBe(200);
    });
});