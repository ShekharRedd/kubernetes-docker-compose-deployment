const Blog = require("../models/blogModel");
const cloudinary = require('cloudinary');

exports.addBlog = async (req, res) => {
    try {
        const { title, img, description, public_id, user_id } = req.body;
        const blog = await Blog.create({ title, img, description, public_id, user_id });
        res.status(201).json({
            success: true,
            blog
        })
    } catch (error) {
        console.log(error);
    }
}

// exports.deleteBlog = async (req, res) => {
//     try {
//         const { _id, public_id } = req.body;
//         cloudinary.uploader.destroy(public_id, ({ result }) => {
//             console.log("delete",result);
//         });
//         const blog = await Blog.findByIdAndDelete(_id);
//         res.status(200).json({ success: true, blog });
//     } catch (error) {
//         console.log(error);
//     }
// }


exports.deleteBlog = async (req, res) => {
    try {
        const { _id, public_id } = req.body;

        // Log public_id to ensure it's correctly passed
        console.log("public_id:", public_id);

        // Use async/await with Cloudinary's destroy method
        const result = await cloudinary.uploader.destroy(public_id);

        console.log("Cloudinary delete result:", result);  // Log result to check response

        // Delete blog from the database
        const blog = await Blog.findByIdAndDelete(_id);

        // Return response
        res.status(200).json({ success: true, blog, cloudinaryResult: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



exports.updateBlog = async (req, res) => {
    try {

        if (req.body.imgChange) {
            cloudinary.uploader.destroy(req.body.del_id, ({ result }) => {
                console.log("update",result);
            });
        }

        const newBlog = await Blog.findByIdAndUpdate(req.body._id, req.body, {
            new: true
        });

        res.status(200).json({
            success: true,
            newBlog
        })

    } catch (error) {
        console.log(error);
    }
}

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json({
            success: true,
            blogs
        })
    } catch (error) {
        console.log(error);
    }
}