const Auth = require("../models/Auth");
const Image = require("../models/Image")

const createImage = async (req, res, next) => {
    try {
        const { imageUrl, name } = req.body;
        const userId = req.user.userId;


        const newImage = new Image({
            image_url: imageUrl,
            userId: userId,
            name: name
        });


        const savedImage = await newImage.save();

        return res.status(201).json({ success: true, savedImage });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false,message: "Internal server error" });
    }
}

module.exports = { createImage };
