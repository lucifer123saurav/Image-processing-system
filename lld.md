# Low-Level Design Document

## System Components

### 1. API Layer
- **Upload Controller**
  - Handles CSV file upload
  - Validates file format
  - Initiates processing request
  - Returns request ID

- **Status Controller**
  - Checks processing status
  - Returns processed data
  - Generates output CSV

### 2. Service Layer
- **CSV Processing Service**
  - Reads CSV content
  - Validates data format
  - Maps data to models

- **Image Processing Service**
  - Downloads images
  - Compresses images (50%)
  - Generates output URLs
  - Handles processing errors

### 3. Data Layer
- **MongoDB Models**
  - Request model
  - Product model
  - Relationship management

### 4. Utility Layer
- **CSV Validator**
  - Format validation
  - Data validation
  - Error handling

- **Image Processor**
  - Compression logic
  - File management
  - Error handling

## Flow Diagram
```mermaid
sequenceDiagram
    Client->>API: Upload CSV
    API->>CSV Service: Process CSV
    CSV Service->>Database: Save Request
    API->>Client: Return RequestID
    CSV Service->>Image Service: Process Images
    Image Service->>Storage: Save Processed Images
    Image Service->>Database: Update Status
    Client->>API: Check Status
    API->>Database: Get Status
    API->>Client: Return Status