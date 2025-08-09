const EvaluationService = require('../services/evalutionServices');

exports.submitEvaluation = async (req, res) => {
  try {
    const evaluation = await EvaluationService.createEvaluation(
      req.user.userId, 
      req.body.responses
    );
    
    const report = await EvaluationService.getEvaluationReport(evaluation.score);
    
    res.status(201).json({
      success: true,
      data: {
        evaluation,
        report
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.getMyEvaluations = async (req, res) => {
  try {
    let evaluations;
    if (req.user.role === 'patient') {
      evaluations = await EvaluationService.getPatientEvaluations(req.user.userId);
    } else if (req.user.role === 'doctor') {
      evaluations = await EvaluationService.getPendingEvaluations();
    }
    
    res.json({
      success: true,
      data: evaluations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.addReview = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        error: 'Only doctors can review evaluations'
      });
    }

    const evaluation = await EvaluationService.addDoctorReview(
      req.params.id,
      req.user.userId,
      req.body.notes
    );

    res.json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};