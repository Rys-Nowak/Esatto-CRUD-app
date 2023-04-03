import { fileURLToPath } from "url";
import { dirname } from "path";
import express, { urlencoded } from "express";
import cors from "cors";

import customersRouter from "./routes/customers.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/static", express.static("./static/"));
app.use(
    cors({
        origin:
            process.env.NODE_ENV === "production"
                ? "https://esatto-crud-app.azurewebsites.net"
                : "http://127.0.0.1:3000",
        methods: ["GET", "PUT", "POST", "DELETE"],
    })
);
app.use(express.json());
app.use(urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname + "/views" });
});
app.use("/api/customers", customersRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`App started on port ${PORT}`));
