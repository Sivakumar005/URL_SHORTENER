import express from "express";
import { urlModel } from "../model/shortUrl.js";
/////////////////////////
// CREATE
/////////////////////////
export const createUrl = async (req, res) => {
    try {
        const { fullUrl } = req.body;
        if (!fullUrl) {
            return res.status(400).json({ msg: "Full URL is required" });
        }
        console.log("Received fullUrl:", fullUrl);
        const existingUrl = await urlModel.findOne({ fullUrl });
        if (existingUrl) {
            return res.status(409).json({
                msg: "URL already shortened",
                data: existingUrl,
            });
        }
        const shortUrl = await urlModel.create({ fullUrl });
        return res.status(201).json({
            msg: "Short URL created successfully",
            data: shortUrl,
        });
    }
    catch (err) {
        console.error("Error creating URL:", err);
        return res.status(500).json({
            msg: "Something went wrong",
            error: err.message,
        });
    }
};
/////////////////////////
// GET ALL
/////////////////////////
export const getAllUrl = async (req, res) => {
    try {
        const shortUrls = await urlModel.find();
        if (shortUrls.length === 0) {
            return res.status(404).json({ msg: "No short URLs found" });
        }
        return res.status(200).json({
            msg: "Short URLs found",
            data: shortUrls,
        });
    }
    catch (err) {
        console.error("Error fetching URLs:", err);
        return res.status(500).json({ msg: "Something went wrong", error: err.message });
    }
};
/////////////////////////
// GET ONE + REDIRECT
/////////////////////////
export const getUrl = async (req, res) => {
    try {
        const id = req.params.id;
        const shortUrl = await urlModel.findOne({ shorturl: req.params.id });
        if (!shortUrl) {
            return res.status(404).json({ msg: "Short url not found" });
        }
        shortUrl.clicks++;
        await shortUrl.save();
        return res.redirect(shortUrl.fullUrl);
    }
    catch (err) {
        console.error("Error redirecting URL:", err);
        return res.status(500).json({ msg: "Something went wrong", error: err.message });
    }
};
/////////////////////////
// DELETE
/////////////////////////
export const deleteUrl = async (req, res) => {
    try {
        const shortUrl = await urlModel.findByIdAndDelete(req.params.id);
        if (!shortUrl) {
            return res.status(404).json({ msg: "Short URL not found" });
        }
        return res.status(200).json({ msg: "Short URL successfully deleted" });
    }
    catch (err) {
        console.error("Error deleting URL:", err);
        return res.status(500).json({ msg: "Something went wrong", error: err.message });
    }
};
//# sourceMappingURL=shortUrl.js.map