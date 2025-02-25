# 🖼️ Image Processing System

A robust **Node.js** application that processes CSV files containing product and image information, compresses images, and provides status updates via RESTful API endpoints.

---

## 🚀 Features

✅ CSV file upload and validation  
✅ Asynchronous image processing  
✅ 50% image compression  
✅ Real-time status tracking  
✅ Output CSV generation  
✅ RESTful API architecture  
✅ MongoDB integration  
✅ Error handling and logging  

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Image Processing**: Sharp
- **File Upload**: Multer
- **Validation**: Custom CSV validator
- **Documentation**: Swagger/OpenAPI

---

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

---

## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/lucifer123saurav/Image-processing-system.git
cd image-processing-system
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Set up environment variables
```bash
cp .env.example .env
```

### 4️⃣ Configure your `.env` file
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
NODE_ENV=development
```

### 5️⃣ Start the server
```bash
# Development
npm run dev

# Production
npm start
```

---

## 🔄 API Endpoints

### 📤 Upload CSV
```http
POST /api/upload
Content-Type: multipart/form-data
```

### 📊 Check Status
```http
GET /api/status/:requestId
```

### 📥 Download Processed CSV
```http
GET /api/status/:requestId/csv
```

---

## 📝 CSV Format

### 🔹 Input CSV Format
```csv
S. No.,Product Name,Input Image Urls
1,SKU1,https://example.com/image1.jpg
2,SKU2,https://example.com/image2.jpg
```

### 🔹 Output CSV Format
```csv
S. No.,Product Name,Input Image Urls,Output Image Urls
1,SKU1,https://example.com/image1.jpg,http://processed-image1.jpg
2,SKU2,https://example.com/image2.jpg,http://processed-image2.jpg
```

---

## 🎯 Usage Example

### 📌 Prepare your CSV file with required columns:
- **S. No.**
- **Product Name**
- **Input Image URLs**

### 📤 Upload CSV file
```bash
curl -X POST -F "file=@test.csv" https://image-processing-system-os5s.onrender.com/upload
```

### 🔍 Check processing status
```bash
curl https://image-processing-system-os5s.onrender.com/status/your-request-id
```

### 📥 Download processed CSV
```bash
curl https://image-processing-system-os5s.onrender.com/status/your-request-id/csv
```

---

## 📊 Response Examples

### ✅ Upload Success
```json
{
    "requestId": "661e656f-e896-4844-9c3a-a6650f1244c7",
    "message": "File uploaded successfully. Processing started.",
    "productsProcessed": 2
}
```

### 📊 Status Check
```json
{
    "requestId": "661e656f-e896-4844-9c3a-a6650f1244c7",
    "status": "COMPLETED",
    "products": [
        {
            "serialNumber": 1,
            "productName": "SKU1",
            "inputImageUrls": ["https://example.com/image1.jpg"],
            "outputImageUrls": ["http://processed-image1.jpg"]
        }
    ]
}
```

---

## 🔍 Status Codes

| Code  | Meaning            |
|-------|--------------------|
| **202** | Request Accepted  |
| **200** | Success          |
| **400** | Bad Request      |
| **404** | Not Found        |
| **500** | Server Error     |

---

## 🧪 Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

---

## 📦 Project Structure
```bash
image-processing-system/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── uploadController.js
│   │   └── statusController.js
│   ├── models/
│   │   ├── Request.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── upload.js
│   │   └── status.js
│   ├── utils/
│   │   ├── csvValidator.js
│   │   └── imageProcessor.js
│   └── app.js
├── uploads/
│   └── processed/
├── .env
└── package.json
```

---

## 🛣️ Roadmap

- [ ] Add authentication/authorization  
- [ ] Implement rate limiting  
- [ ] Add cloud storage support  
- [ ] Implement webhook notifications  
- [ ] Add progress tracking  
- [ ] Create dashboard UI  

---

## 🤝 Contributing

1. **Fork** the repository  
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)  
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)  
4. **Push to the branch** (`git push origin feature/AmazingFeature`)  
5. **Open a Pull Request**  

---

## 👥 Authors

👤 **Saurav Suman** - [GitHub Profile](https://github.com/lucifer123saurav)

---

## 🙏 Acknowledgments

- **Node.js** community  
- **Express.js** team  
- **MongoDB** team  
- **All contributors**  

Made with ❤️ and **Node.js** 🚀

