import { fileURLToPath } from "url";
import { dirname } from "path";
import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import customersRouter from "./routes/customers.js";
import { restrict } from "./middlewares/restriction.js"; 

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const allowedOrigin =
    process.env.NODE_ENV === "production"
        ? process.env.ALLOWED_ORIGIN_PROD
        : process.env.ALLOWED_ORIGIN_DEV;

app.use("/static", express.static("./static/"));
app.use(
    cors({
        origin: allowedOrigin,
        methods: ["GET", "PUT", "POST", "DELETE"],
    })
);
app.use(express.json());
app.use(urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname + "/views" });
});
app.use("/api/customers", restrict, customersRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`App started on port ${PORT}`));
