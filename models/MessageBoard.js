const mongoose = require('mongoose');

const messageBoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }]
}, { timestamps: true });

const MessageBoard = mongoose.model('MessageBoard', messageBoardSchema);

module.exports = MessageBoard;
