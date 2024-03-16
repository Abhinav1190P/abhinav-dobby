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
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const getImages = async (req, res, next) => {
    const page = req.params.page;
    const size = req.params.size;

    try {
        const skip = (page - 1) * size;

        const total = await Image.countDocuments({ userId: req.user.userId });
        let images = await Image.find({ userId: req.user.userId })
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(size);

        return res.json({ images, total });
    } catch (error) {
        next(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { createImage, getImages };
