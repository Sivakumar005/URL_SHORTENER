import mongoose from "mongoose";
import { nanoid } from "nanoid";
const shortUrl = new mongoose.Schema({
    fullUrl: {
        type: String,
        required: true
    },
    shorturl: {
        type: String,
        required: true,
        default: () => nanoid().substring(0, 10)
    },
    clicks: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
});
export const urlModel = mongoose.model("ShortUrl", shortUrl);
//# sourceMappingURL=shortUrl.js.map