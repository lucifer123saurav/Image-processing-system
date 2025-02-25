const validateCSV = (data) => {
    const requiredColumns = ['S. No.', 'Product Name', 'Input Image Urls'];
    
    // Check if all required columns exist
    const hasRequiredColumns = requiredColumns.every(column => 
        Object.keys(data).includes(column)
    );

    if (!hasRequiredColumns) {
        throw new Error('CSV missing required columns');
    }

    // Validate data format
    if (!data['S. No.'] || !data['Product Name'] || !data['Input Image Urls']) {
        throw new Error('Invalid data format');
    }

    // Validate URLs
    const urls = data['Input Image Urls'].split(',').map(url => url.trim());
    const validUrls = urls.every(url => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    });

    if (!validUrls) {
        throw new Error('Invalid URL format');
    }

    return true;
};

module.exports = { validateCSV };