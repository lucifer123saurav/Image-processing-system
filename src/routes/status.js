// const express = require('express');
// const router = express.Router();
// const statusController = require('../controllers/statusController');

// router.get('/status/:requestId', statusController.getStatus);

// module.exports = router;
const express = require('express');
const Request = require('../models/Request');
const Product = require('../models/Product');

const router = express.Router();

router.get('/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await Request.findOne({ id: requestId });
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.status(200).json({ requestId, status: request.status });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add this to your existing status.js
router.get('/:requestId/csv', async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await Request.findOne({ id: requestId });
        const products = await Product.find({ requestId });
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        // Generate CSV content
        let csvContent = 'S. No.,Product Name,Input Image Urls,Output Image Urls\n';
        
        products.forEach(product => {
            csvContent += `${product.serialNumber},${product.productName},`;
            csvContent += `"${product.inputImageUrls.join(',')}",`;
            csvContent += `"${product.outputImageUrls.join(',')}"\n`;
        });

        // Set headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=output_${requestId}.csv`);

        res.send(csvContent);

    } catch (err) {
        console.error('CSV generation error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;