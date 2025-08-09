const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  responses: [{
    questionId: { type: Number, required: true },
    answer: { type: Number, min: 1, max: 5 }
  }],
  score: { 
    type: Number, 
    min: 0, 
    max: 100 
  },
  status: { 
    type: String, 
    enum: ['pending', 'reviewed'], 
    default: 'pending' 
  },
  doctorNotes: String,
  severity: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'low'
  }
}, { timestamps: true });

// Pre-save hook to calculate score and severity
evaluationSchema.pre('save', function(next) {
  if (this.responses && this.responses.length > 0) {
    const total = this.responses.reduce((sum, r) => sum + r.answer, 0);
    this.score = Math.round((total / (this.responses.length * 5)) * 100);
    
    if (this.score < 30) this.severity = 'low';
    else if (this.score < 70) this.severity = 'moderate';
    else this.severity = 'high';
  }
  next();
});

module.exports = mongoose.model('Evaluation', evaluationSchema);