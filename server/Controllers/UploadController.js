import fs from "fs";

export const uploadImage = async (req, res) => {
    const files = await req.files;
    try {
        const { path, originalname } = files[0];
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = path + "." + ext;
        fs.renameSync(path, newPath);
        res.json(newPath.replace("uploads", ""));
    } catch (error) {
        res.json(error.message);
    }
}