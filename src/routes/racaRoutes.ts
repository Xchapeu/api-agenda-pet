import express from "express";
import { prisma } from "../database/prismaClient";

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const racas = await prisma.raca.findMany();

        const sortedRacas = racas.sort((a, b) => a.nome > b.nome ? 1 : -1);
        
        return res.json(sortedRacas);
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const { nome } = req.body;

        const verifyIfRacaExists = await prisma.user.findMany({
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
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const id  = req.params.id;
        const parsedId = parseInt(id);

        if(!id) {
            return res.status(400).json({ error: "Raça não encontrada." })
        }

        await prisma.raca.delete({
            where: {
                id: parsedId
            }
        });

        return res.json({ message: "Raça Deletada." });
    } catch(err) {
        next(err)
    }
})

export default router;