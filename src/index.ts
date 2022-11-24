import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json())
app.use(cors());

app.use(routes)

app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`))