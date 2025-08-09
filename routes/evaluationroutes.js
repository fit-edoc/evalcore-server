const express = require('express');
const { protect } = require('../middleware/protect');
const {
  submitEvaluation,
  getMyEvaluations,
  addReview
} = require('../controller/evaluationConroller');

const router = express.Router();

router.post('/submit', protect, submitEvaluation);
router.get('/all', protect, getMyEvaluations);
router.put('/:id/review', protect, addReview);

module.exports = router;