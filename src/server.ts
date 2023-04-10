import express from "express";
import cors from "cors";
import { prisma } from "./database/prismaClient";

const api = express();
api.use(cors());

api.use(express.json());

const port = process.env.PORT || 5000;

api.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();

    return res.json(users);
});

api.post("/users", async (req, res) => {

    const { nome, email, senha, score, level } = req.body;

    const verifyIfUserExists = await prisma.user.findFirst({
        where: {
            email: email
        }
    });

    if(verifyIfUserExists) {
        return res.status(400).json({ error: "Usuário já cadastrado!" })
    }

    const userCreated = await prisma.user.create({
        data: {
            nome: nome,
            email: email,
            senha: senha,
            score: score,
            level: level
        },
    });

    return res.json(userCreated);
});

api.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if(!email || !senha) {
        return res.status(400).json({ error: "dados não passados" })
    }

    const userNotRegistered = await prisma.user.findFirst({
        where: {
            email: email
        }
    });

    if(!userNotRegistered) {
        return res.status(400).json({ error: "Email não cadastrado!" })
    }

    const userConfirmed = await prisma.user.findFirst({
        where: {
            email: email,
            AND: {
                senha: senha
            }
        }
    });

    if(!userConfirmed) {
        return res.status(400).json({ error: "Email ou senha incorretos!" });
    }

    return res.json(userConfirmed);
})

api.listen(port, () => console.log("Server running on port: ", port));