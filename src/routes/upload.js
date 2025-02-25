const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Request = require('../models/Request');
const Product = require('../models/Product');
const ImageProcessor = require('../utils/imageProcessor');
const { validateCSV } = require('../utils/csvValidators');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const requestId = uuidv4();
        const request = new Request({ id: requestId });
        await request.save();

        const products = [];
        
        // Process CSV and images
        await new Promise((resolve, reject) => {
            fs.createReadStream(req.file.path)
                .pipe(csv())
                .on('data', async (row) => {
                    try {
                        // Validate CSV row
                        validateCSV(row);

                        const serialNumber = parseInt(row['S. No.']);
                        const productName = row['Product Name'].trim();
                        const inputImageUrls = row['Input Image Urls']
                            .split(',')
                            .map(url => url.trim())
                            .filter(url => url);

                        products.push({
                            requestId,
                            serialNumber,
                            productName,
                            inputImageUrls,
                            outputImageUrls: [] // Will be populated later
                        });
                    } catch (error) {
                        console.error('Row processing error:', error);
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });

        // Save products and start processing images
        if (products.length > 0) {
            const savedProducts = await Product.insertMany(products);
            
            // Process images asynchronously
            processImagesAsync(requestId, savedProducts);

            res.status(202).json({
                requestId,
                message: 'File uploaded successfully. Image processing started.',
                productsProcessed: products.length
            });
        } else {
            throw new Error('No valid products found in CSV');
        }

        // Cleanup
        fs.unlinkSync(req.file.path);

    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({
            error: 'Internal Server Error',
            message: err.message
        });
    }
});

async function processImagesAsync(requestId, products) {
    try {
        // Update request status to PROCESSING
        await Request.findOneAndUpdate(
            { id: requestId },
            { status: 'PROCESSING' }
        );

        for (const product of products) {
            const outputUrls = [];
            
            // Process each image
            for (const imageUrl of product.inputImageUrls) {
                try {
                    const processedUrl = await ImageProcessor.processImage(imageUrl);
                    outputUrls.push(processedUrl);
                } catch (error) {
                    console.error(`Error processing image ${imageUrl}:`, error);
                    outputUrls.push('processing_failed');
                }
            }

            // Update product with processed image URLs
            await Product.findByIdAndUpdate(product._id, {
                outputImageUrls: outputUrls
            });
        }

        // Update request status to COMPLETED
        await Request.findOneAndUpdate(
            { id: requestId },
            { 
                status: 'COMPLETED',
                updatedAt: new Date()
            }
        );

    } catch (error) {
        console.error('Image processing error:', error);
        await Request.findOneAndUpdate(
            { id: requestId },
            { 
                status: 'FAILED',
                updatedAt: new Date()
            }
        );
    }
}

module.exports = router;