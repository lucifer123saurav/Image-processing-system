# Image Processing System

A Node.js application that processes CSV files containing product and image information, compresses images, and provides status updates via API.

## Features
- CSV file upload and validation
- Asynchronous image processing
- 50% image compression
- Status tracking
- Output CSV generation
- RESTful API

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Sharp (image processing)
- Multer (file upload)

## Installation
1. Clone the repository
```bash
git clone <repository-url>


Install dependencies
BASH

npm install
Set up environment variables
BASH

cp .env.example .env
# Update .env with your configurations
Start the server
BASH

npm run dev
API Endpoints
POST /api/upload - Upload CSV file
GET /api/status/:requestId - Check processing status
GET /api/status/:requestId/csv - Download output CSV
Usage
Prepare CSV file with columns:

S. No.
Product Name
Input Image Urls
Upload using POST /api/upload

Use returned requestId to check status

Download processed CSV when complete

Development
Run tests: npm test
Lint code: npm run lint
Build: npm run build
Contributing
Fork the repository
Create feature branch
Commit changes
Push to branch
Create Pull Request
