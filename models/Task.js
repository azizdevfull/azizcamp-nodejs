const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
