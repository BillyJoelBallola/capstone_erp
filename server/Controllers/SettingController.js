import { Setting } from "../Models/SettingsModel.js";

export const updateSettings = async (req, res) => {
    const { inventory, shared, humanResource, financial, id } = await req.body;
    try {
        const settingsData = await Setting.findById(id);
        settingsData.set({
            inventory,
            shared,
            humanResource,
            financial,
        });
        settingsData.save();
        res.status(200).json(settingsData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getSettings = async (req, res) => {
    try {
        const response = await Setting.find({});
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}