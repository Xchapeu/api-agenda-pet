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

    const sortedRacas = racas.sort((a, b) => a.nome > b.nome ? 1 : -1);
    
    return res.json(sortedRacas);
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

api.delete("/racas/:id", async (req, res, next) => {

    try {
        const id  = req.params.id;
        const parsedId = parseInt(id);

        await prisma.raca.delete({
            where: {
                id: parsedId
            }
        });

        return res.json({ message: "Raça Deleteda" });
    } catch(err) {
        next(err)
    }
});

api.get("/:id/pets", async (req, res) => {
    const tutorId = req.params.id;

    try {
        const pets = await prisma.pet.findMany({
            where: {
                tutorId: parseInt(tutorId)
            }
        });

        if(!pets) {
            return res.json({ message: "Lista de pets vazia!" })
        }
    
        return res.json(pets);
    } catch (error) {
        res.json(error)
    }
});

api.post("/pets", async (req, res) => {
    try {
        const { nome, idade, sexo, raca, chip, castracao, tutorId } = req.body;
    
        const verifyIfPetExists = await prisma.pet.findFirst({
            where: {
                tutorId: tutorId,
                AND: {
                    nome: nome
                }
            }
        });
    
        if(verifyIfPetExists) {
            return res.status(400).json({ error: "Pet já cadastrado!" })
        }
    
        const petCreated = await prisma.pet.create({
            data: {
                nome: nome,
                idade: idade,
                sexo: sexo,
                raca: raca,
                chip: chip,
                castracao: castracao,
                tutorId: tutorId 
            }
        });
    
        return res.json(petCreated);
    } catch (error) {
        console.log(error)
        res.json({ message: error })
    }
})

api.get("/vacinas", async (req, res, next) => {
    try {
        const vacinas = await prisma.vacina.findMany();

        return res.json(vacinas);
    } catch (error) {
        next(error);
    }
})

api.listen(port, () => console.log("Server running on port: ", port));