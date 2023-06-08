import express from "express";
import { prisma } from "../database/prismaClient";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
    
        return res.json(users);
    } catch (error) {
        console.log(error);
    }
});

//List of user's pets
router.get("/:id/pets", async (req, res, next) => {
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
})

router.post("/", async (req, res, next) => {
    try {
        const { nome, email, senha, score, level } = req.body;
    
        const verifyIfUserExists = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
    
        if(verifyIfUserExists) {
            return res.status(400).json({ error: "Usuário já cadastrado!" })
        }
    
        const user = await prisma.user.create({
            data: {
                nome: nome,
                email: email,
                senha: senha,
                score: score,
                level: level
            },
        });
    
        return res.json(user);
    } catch (error) {
        next(error);
    }
});

export default router;
