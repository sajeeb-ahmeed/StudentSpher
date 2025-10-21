const express = require('express');

module.exports = (pool, requireAuth, requireAdmin) => {
  const router = express.Router();

  // List all exams
  router.get('/', requireAuth, async (req, res) => {
    try {
      const result = await pool.query('SELECT id, title, description, duration_minutes FROM exams ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to load exams' });
    }
  });

  // Get specific exam with questions
  router.get('/:examId', requireAuth, async (req, res) => {
    try {
      const { examId } = req.params;
      const examRes = await pool.query('SELECT id, title, description, duration_minutes FROM exams WHERE id=$1', [examId]);
      const exam = examRes.rows[0];
      if (!exam) return res.status(404).json({ error: 'Exam not found' });

      const questionsRes = await pool.query('SELECT id, type, question_text, choices, marks FROM questions WHERE exam_id=$1 ORDER BY order_index', [examId]);
      const questions = questionsRes.rows.map(q => ({
        ...q,
        choices: (typeof q.choices === 'string')
          ? JSON.parse(q.choices)
          : q.choices // already object or null
      }));


      res.json({ ...exam, questions });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch exam' });
    }
  });

  // Submit exam
  router.post('/:examId/submit', requireAuth, async (req, res) => {
    try {
      const { examId } = req.params;
      const userId = req.session.userId;
      const { answers } = req.body; // { questionId: selectedAnswer }

      // Calculate total score for MCQs
      let totalScore = 0;
      const qRes = await pool.query('SELECT id, type, correct_answer, marks FROM questions WHERE exam_id=$1', [examId]);
      qRes.rows.forEach(q => {
        if (q.type === 'mcq' && answers[q.id] && answers[q.id] === q.correct_answer) {
          totalScore += q.marks;
        }
      });

      const result = await pool.query(
        'INSERT INTO exam_results (exam_id, user_id, answers, total_score) VALUES ($1, $2, $3, $4) RETURNING *',
        [examId, userId, answers, totalScore]
      );

      res.json({ message: 'Exam submitted successfully', result: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to submit exam' });
    }
  });

  return router;
};
