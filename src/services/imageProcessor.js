const axios = require('axios');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const Product = require('../models/Product');
const Request = require('../models/Request');
const { webhookURL } = require('../config');

async function processImage(url) {
    // const response = await axios.get(url, { responseType: 'arraybuffer' });
    // const buffer = Buffer.from(response.data, 'binary');
    // const compressedBuffer = await sharp(buffer)
    //     .resize({ width: Math.floor(response.data.width / 2) })
    //     .toBuffer();

    const outputUrl = `https://fake-storage-service/${uuidv4()}.jpg`;
    // Here we would upload the compressedBuffer to any of the storage service and get the outputUrl
    // For this example, we will just return a fake URL

    return outputUrl;
}

async function processImages(requestId) {
    try {
        const products = await Product.find({ requestId });
        for (const product of products) {
            const outputImageUrls = [];
            for (const inputImageUrl of product.inputImageUrls) {
                const outputImageUrl = await processImage(inputImageUrl);
                outputImageUrls.push(outputImageUrl);
            }
            product.outputImageUrls = outputImageUrls;
            await product.save();
        }
        await Request.updateOne({ id: requestId }, { status: 'COMPLETED', updatedAt: new Date() });
    } catch (error) {
        await Request.updateOne({ id: requestId }, { status: 'FAILED', updatedAt: new Date() });
    }
}

module.exports = { processImages };