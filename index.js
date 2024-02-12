//Import everything 
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "module";
import { register } from "./controllers/auth.js";
 
/* CONFIGS */
//Grab file URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//Use dependencies that were downloaded
dotenv.config();
const app = express();
app.use(express.json());
//Appropriate HTTP headers for security use
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
//Log HTTP requests
app.use(morgan("common"));
//Parse JSON data- size and nested objects
app.use(bodyParser.json({ limit: "30mb", extended: true}));
//Parse data from URL similar to above 
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
//Cross-Origin-Resource Sharing | prohibits making req. to different domain
app.use(cors());
//Where we keep assets (locally in this case) -->IRL keep assets in a storage
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE CONFIG */
//Upload assets -> What folder to be placed in
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "public/assets");
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

/* ROUTES for files */
app.post("/auth/register" , upload.single("picture"), register);

/* MONGOOSE SET */
const PORT = process.env.PORT || 6001;
mongoose
.connect(process.env.MONGO_URL, {
    useNewUrlParser: true;
    useUnifiedTopology: true;
}).then(() => {
    app.listen(PORT, () => console.log('Server Port: ${PORT}'));
}).catch((error) => console.log(`${error} did not connect`));