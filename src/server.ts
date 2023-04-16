import express from "express";
import cors from "cors";
import { prisma } from "./database/prismaClient";

const api = express();
const port = process.env.PORT || 5000;
api.use(cors());
api.use(express.json());

//Users Routes
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

//Login Route
api.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if(!email || !senha) {
        return res.status(400).json({ error: "Dados não passados" })
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
});

//Raças Routes
api.get("/racas", async (req, res) => {
    const racas = await prisma.raca.findMany();
    
    return res.json(racas);
})

api.post("/racas", async (req, res) => {
    const { nome } = req.body;

    const verifyIfRacaExists = await prisma.user.findFirst({
        where: {
            nome: nome
        }
    });

    if(verifyIfRacaExists) {
        return res.status(400).json({ error: "Raça já cadastrada!" });
    }

    const racaCreated = await prisma.raca.create({
        data: {
            nome: nome
        }
    });

    return res.json(racaCreated);
});

api.delete("/racas/:id", async (req, res) => {

    const id  = req.params.id;
    const parsedId = parseInt(id);

    await prisma.raca.delete({
        where: {
            id: parsedId
        }
    });

    return res.json({ message: "Raça Deleteda" })
})

api.listen(port, () => console.log("Server running on port: ", port));