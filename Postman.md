{
  requestId: {
    type: String,
    required: true
  },
  serialNumber: {
    type: Number,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  inputImageUrls: {
    type: [String],
    required: true
  },
  outputImageUrls: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}