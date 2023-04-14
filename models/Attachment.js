const mongoose = require('mongoose');
const { Schema } = mongoose;

const attachmentSchema = new Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project' }
});

module.exports = mongoose.model('Attachment', attachmentSchema);
