const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: {
      validator: async function(email) {
        // Check if email exists with a different role
        const user = await this.constructor.findOne({ email });
        return !user || user._id.equals(this._id);
      },
      message: 'Email already registered with a different role'
    }
  },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['patient', 'doctor'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);