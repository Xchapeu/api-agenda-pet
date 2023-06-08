import express from "express";
import { prisma } from "../database/prismaClient";

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const vacinas = await prisma.vacina.findMany();

        return res.json(vacinas);
    } catch (error) {
        next(error);
    }
});

export default router;