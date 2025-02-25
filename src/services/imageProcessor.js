// const csv = require('csv-parser');
// const fs = require('fs');
// const ImageProcessor = require('../utils/imageProcessor');
// const Request = require('../models/Request');

// class CsvService {
//     static async processCSV(filePath, requestId) {
//         try {
//             const request = await Request.findOne({ requestId });
//             if (!request) throw new Error('Request not found');

//             request.status = 'PROCESSING';
//             await request.save();

//             const results = [];
            
//             // Read CSV file
//             await new Promise((resolve, reject) => {
//                 fs.createReadStream(filePath)
//                     .pipe(csv())
//                     .on('data', (data) => results.push(data))
//                     .on('end', resolve)
//                     .on('error', reject);
//             });

//             // Process each row
//             for (const row of results) {
//                 const inputUrls = row['Input Image Urls'].split(',').map(url => url.trim());
//                 const outputUrls = [];

//                 // Process each image
//                 for (const imageUrl of inputUrls) {
//                     try {
//                         const processedUrl = await ImageProcessor.processImage(imageUrl);
//                         outputUrls.push(processedUrl);
//                     } catch (error) {
//                         console.error(`Error processing image ${imageUrl}:`, error);
//                         outputUrls.push('processing_failed');
//                     }
//                 }

//                 // Update product in request
//                 request.products.push({
//                     serialNumber: row['S. No.'],
//                     productName: row['Product Name'],
//                     inputImageUrls: inputUrls,
//                     outputImageUrls: outputUrls,
//                     status: 'COMPLETED'
//                 });
//             }

//             request.status = 'COMPLETED';
//             request.completedAt = new Date();
//             await request.save();

//             // Clean up
//             fs.unlinkSync(filePath);

//         } catch (error) {
//             console.error('CSV processing error:', error);
//             const request = await Request.findOne({ requestId });
//             if (request) {
//                 request.status = 'FAILED';
//                 await request.save();
//             }
//             throw error;
//         }
//     }
// }

// module.exports = CsvService;


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
        // await axios.post(webhookURL, { requestId, status: 'COMPLETED' });
        await Request.updateOne({ id: requestId }, { status: 'COMPLETED', updatedAt: new Date() });
    } catch (error) {
        // await axios.post(webhookURL, { requestId, status: 'FAILED' });
        await Request.updateOne({ id: requestId }, { status: 'FAILED', updatedAt: new Date() });
    }
}

module.exports = { processImages };