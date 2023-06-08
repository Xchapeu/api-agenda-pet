import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import loginRoutes from "./routes/loginRoutes";
import racaRoutes from "./routes/racaRoutes";
import vacinaRoutes from "./routes/vacinaRoutes";
import petRoutes from "./routes/petRoutes";

const api = express();
const port = process.env.PORT || 5000;

//Config
api.use(cors());
api.use(express.urlencoded({ extended: true }));
api.use(express.json());

//Routes
api.use("/users", userRoutes);
api.use("/login", loginRoutes);
api.use("/racas", racaRoutes);
api.use("/pets", petRoutes);
api.use("/vacinas", vacinaRoutes);

api.listen(port, () => console.log("Server running on port: ", port));