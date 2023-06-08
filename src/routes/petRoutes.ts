import express from "express";
import { prisma } from "../database/prismaClient";

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const pets = await prisma.pet.findMany();
        return res.json(pets);
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
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

export default router;