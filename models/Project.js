const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  attachments: [{ type: Schema.Types.ObjectId, ref: 'Attachment' }],
  messageBoards: [{ type: Schema.Types.ObjectId, ref: 'MessageBoard' }],
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
