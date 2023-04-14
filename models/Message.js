const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  messageBoard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MessageBoard',
    required: true
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
