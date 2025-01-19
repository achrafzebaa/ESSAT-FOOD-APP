import foodModel from "../models/foodModel.js";
import fs from 'fs'


// add food item



const addFood = async(req,res)=>{


    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })
    try {
        await food.save();
        res.json({success:true,message:"Food Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

// all food list
const listFood = async (req,res)=>{
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export const updateFood = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    let image;

    // Check if an image was uploaded
    if (req.file) {
        image = req.file.filename; // Get the filename of the uploaded image
    }

    try {
        // Find the food item by ID and update it
        const updatedFood = await foodModel.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                category,
                image // Update the image if a new one was uploaded
            },
            { new: true } // Return the updated document
        );

        if (!updatedFood) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        res.json({ success: true, message: "Food item updated successfully", data: updatedFood });
    } catch (error) {
        console.error("Error updating food item:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
//remove food item
const removeFood = async (req,res) =>{
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"FOOD REMOVED"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}
// Fetch food item by ID
const getFoodById = async (req, res) => {
    const foodId = req.params.id; // Get the ID from the request parameters

    try {
        const food = await foodModel.findById(foodId); // Find the food item by ID

        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        res.json({ success: true, data: food }); // Return the food item
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { addFood, listFood, removeFood, getFoodById }; // Export the new function


