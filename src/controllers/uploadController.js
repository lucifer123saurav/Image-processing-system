const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const csv = require('csv-parser');
const Request = require('../models/Request');
const ImageProcessor = require('../utils/imageProcessor');

exports.uploadCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No CSV file uploaded' });
        }

        const requestId = uuidv4();
        const results = [];

        // Read CSV file
        await new Promise((resolve, reject) => {
            fs.createReadStream(req.file.path)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', resolve)
                .on('error', reject);
        });

        // Create new request
        const request = new Request({
            requestId,
            status: 'PENDING',
            products: []
        });
        await request.save();

        // Process CSV data asynchronously
        processCSVData(results, request);

        // Delete temporary CSV file
        fs.unlinkSync(req.file.path);

        res.status(202).json({
            requestId,
            message: 'File uploaded successfully. Processing started.'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

async function processCSVData(results, request) {
    try {
        request.status = 'PROCESSING';
        await request.save();

        for (const row of results) {
            const inputUrls = row['Input Image Urls'].split(',').map(url => url.trim());
            const outputUrls = [];

            // Process each image
            for (const imageUrl of inputUrls) {
                try {
                    const processedUrl = await ImageProcessor.processImage(imageUrl);
                    outputUrls.push(processedUrl);
                } catch (error) {
                    console.error(`Error processing image ${imageUrl}:`, error);
                    outputUrls.push('processing_failed');
                }
            }

            // Add processed product to request
            request.products.push({
                serialNumber: row['S. No.'],
                productName: row['Product Name'],
                inputImageUrls: inputUrls,
                outputImageUrls: outputUrls,
                status: 'COMPLETED'
            });
        }

        request.status = 'COMPLETED';
        request.completedAt = new Date();
        await request.save();
    } catch (error) {
        console.error('CSV processing error:', error);
        request.status = 'FAILED';
        await request.save();
    }
}