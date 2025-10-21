const express = require('express');
const router = express.Router();

module.exports = (pool, requireAuth) => {

    // 1️⃣ Start Exam
    router.get('/:examId/start', requireAuth, async (req, res) => {
        try {
            const { examId } = req.params;
            const userId = req.session.userId;

            let attemptRes = await pool.query(
                'SELECT * FROM exam_attempts WHERE exam_id=$1 AND user_id=$2 AND status=$3',
                [examId, userId, 'in_progress']
            );

            let attempt;
            if (attemptRes.rows.length > 0) {
                attempt = attemptRes.rows[0];
            } else {
                const newAttempt = await pool.query(
                    'INSERT INTO exam_attempts (exam_id, user_id) VALUES ($1, $2) RETURNING *',
                    [examId, userId]
                );
                attempt = newAttempt.rows[0];
            }

            const questionsRes = await pool.query(
                'SELECT id, type, question_text, choices, marks FROM questions WHERE exam_id=$1 ORDER BY order_index',
                [examId]
            );

            res.json({ attempt_id: attempt.id, questions: questionsRes.rows });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to start exam' });
        }
    });

    // 2️⃣ Submit Answer
    router.post('/:attemptId/answer', requireAuth, async (req, res) => {
        try {
            const { attemptId } = req.params;
            const { question_id, answer_text } = req.body;

            const qRes = await pool.query('SELECT * FROM questions WHERE id=$1', [question_id]);
            if (!qRes.rows.length) return res.status(404).json({ error: 'Question not found' });

            const question = qRes.rows[0];
            let is_correct = false, marks_obtained = 0;

            if (question.type === 'mcq' && question.correct_answer === answer_text) {
                is_correct = true;
                marks_obtained = question.marks;
            }

            await pool.query(`
        INSERT INTO attempt_answers (attempt_id, question_id, answer_text, is_correct, marks_obtained)
        VALUES ($1,$2,$3,$4,$5)
        ON CONFLICT (attempt_id, question_id)
        DO UPDATE SET answer_text=EXCLUDED.answer_text, is_correct=EXCLUDED.is_correct, marks_obtained=EXCLUDED.marks_obtained
      `, [attemptId, question_id, answer_text, is_correct, marks_obtained]);

            res.json({ message: 'Answer saved', is_correct, marks_obtained });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to submit answer' });
        }
    });

    // 3️⃣ Finish Exam
    router.post('/:attemptId/finish', requireAuth, async (req, res) => {
        try {
            const { attemptId } = req.params;

            const scoreRes = await pool.query(
                'SELECT SUM(marks_obtained) as total_score FROM attempt_answers WHERE attempt_id=$1',
                [attemptId]
            );

            const total_score = scoreRes.rows[0].total_score || 0;

            await pool.query(
                'UPDATE exam_attempts SET finished_at=NOW(), total_score=$1, status=$2 WHERE id=$3',
                [total_score, 'completed', attemptId]
            );

            res.json({ message: 'Exam submitted', total_score });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to finish exam' });
        }
    });

    // 4️⃣ Get Attempt Results
    router.get('/:attemptId/results', requireAuth, async (req, res) => {
        try {
            const { attemptId } = req.params;

            const attemptRes = await pool.query('SELECT * FROM exam_attempts WHERE id=$1', [attemptId]);
            if (!attemptRes.rows.length) return res.status(404).json({ error: 'Attempt not found' });

            const answersRes = await pool.query(`
        SELECT a.*, q.question_text, q.type, q.choices, q.correct_answer
        FROM attempt_answers a
        JOIN questions q ON q.id=a.question_id
        WHERE a.attempt_id=$1
      `, [attemptId]);

            res.json({ attempt: attemptRes.rows[0], answers: answersRes.rows });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to get results' });
        }
    });

    return router;
};
