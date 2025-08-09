const Evaluation = require('../model/evaluationModel');

class EvaluationService {
  static async createEvaluation(patientId, responses) {
    const evaluation = new Evaluation({ patientId, responses });
    return await evaluation.save();
  }

  static async getPatientEvaluations(patientId) {
    return await Evaluation.find({ patientId })
      .sort({ date: -1 })
      .populate('doctorId', 'name email');
  }

  static async getPendingEvaluations() {
    return await Evaluation.find({ status: 'pending' })
      .populate('patientId', 'name email')
      .sort({ score: -1 });
  }

  static async addDoctorReview(evaluationId, doctorId, notes) {
    return await Evaluation.findByIdAndUpdate(
      evaluationId,
      { 
        doctorId, 
        doctorNotes: notes, 
        status: 'reviewed' 
      },
      { new: true }
    ).populate('patientId doctorId', 'name email');
  }

  static async getEvaluationReport(score) {
    if (score < 30) {
      return {
        message: "You're doing well",
        recommendations: [
          "Continue self-care practices",
          "Check-in again in 2 weeks"
        ]
      };
    } else if (score < 70) {
      return {
        message: "Moderate symptoms detected",
        recommendations: [
          "Schedule a therapist appointment",
          "Practice mindfulness daily"
        ]
      };
    } else {
      return {
        message: "Immediate attention recommended",
        recommendations: [
          "Contact a mental health professional",
          "Reach out to support networks"
        ]
      };
    }
  }
}

module.exports = EvaluationService;