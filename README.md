# StudentSpher - Exam Integration

This project adds a complete **Online Exam** feature for the "Web Design & JavaScript Final Exam".

## What I added
- `routes/exam.js` - Express route handlers for exams (start, fetch questions, submit, admin grading).
- `migrations/create_exams_tables.sql` - DB migration to create exam tables.
- `public/exams/take_exam.html` - Frontend exam page (per-question 2-minute timer for MCQs).
- `seed/exam_questions.json` - Exam content based on your syllabus.
- `scripts/load_exam.js` - Script to load exam and questions into the database.
- `Web_Design_JS_Final_Exam_Student.pdf` and `Web_Design_JS_Final_Exam_Teacher.pdf`

## Setup (Run locally)

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and set `DATABASE_URL` and `SESSION_SECRET`. Example `.env`:
```
DATABASE_URL=postgres://user:pass@localhost:5432/yourdb
SESSION_SECRET=change_me
PORT=5000
NODE_ENV=development
```

3. Run DB migration:
Apply `migrations/create_exams_tables.sql` to your Postgres database. For example:
```bash
psql $DATABASE_URL -f migrations/create_exams_tables.sql
```

4. Start the server:
```bash
node server.js
```

5. Load exam questions:
```bash
node scripts/load_exam.js
```

6. Open the exam page (after login as a student):  
```
http://localhost:5000/public/exams/take_exam.html?examId=1
```

## Notes
- The exam routes require authentication (`req.session.userId`). Use the existing login/register flows in the app.
- Admin endpoints require the `requireAdmin` middleware (provided in `server.js`).
- AI grading is not enabled by default. If you want AI suggestions, provide `OPENAI_API_KEY` and I can add helper endpoints.

