import express from "express";
import { prisma } from "../database/prismaClient";

const router = express.Router();

router.post("/", async (req, res, next) => {
    try {
        const { email, senha } = req.body;

        if(!email || !senha) {
            return res.status(400).json({ error: "Dados não passados" })
        }

        const userNotRegistered = await prisma.user.findMany({
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
    } catch (error) {
        next(error);
    }
});

export default router;