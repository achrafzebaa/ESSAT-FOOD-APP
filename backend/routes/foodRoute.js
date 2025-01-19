import express from "express";
import { addFood, listFood, removeFood, getFoodById,updateFood } from "../controllers/foodController.js"; // Import the new function
import multer from "multer";

const foodRouter = express.Router();

// Image storage engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Define routes
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.get("/:id", getFoodById); // Add this line to fetch food by ID
foodRouter.post("/remove", removeFood);
foodRouter.put("/edit/:id", upload.single("image"), updateFood);
export default foodRouter;