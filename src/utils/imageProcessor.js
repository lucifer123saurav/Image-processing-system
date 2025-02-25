const sharp = require('sharp');
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;

class ImageProcessor {
    static async processImage(imageUrl) {
        try {
            // Download image
            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer'
            });

            // Generate unique filename
            const filename = `processed_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
            const outputDir = path.join(__dirname, '../../uploads/processed');
            const outputPath = path.join(outputDir, filename);

            // Ensure directory exists
            await fs.mkdir(outputDir, { recursive: true });

            // Process image - compress by 50%
            await sharp(response.data)
                .jpeg({ quality: 50 }) // Compress quality by 50%
                .toFile(outputPath);

            // In a real production environment, you would upload this to cloud storage
            // For now, we'll return a local URL
            return `http://localhost:3000/processed/${filename}`;
        } catch (error) {
            console.error('Image processing error:', error);
            throw error;
        }
    }
}

module.exports = ImageProcessor;