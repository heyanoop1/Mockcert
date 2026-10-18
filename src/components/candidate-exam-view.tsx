'use client';

import { useMemo, useState } from 'react';

type QuestionItem = {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswers: string[];
  answerType: 'SINGLE' | 'MULTIPLE';
};

export function CandidateExamView({ questions }: { questions: QuestionItem[] }) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalQuestions = questions.length;

  const score = useMemo(() => {
    return questions.reduce((result, question) => {
      const selected = answers[question.id] ?? [];
      const isCorrect =
        question.answerType === 'MULTIPLE'
          ? JSON.stringify([...selected].sort()) === JSON.stringify([...question.correctAnswers].sort())
          : selected.length === 1 && question.correctAnswers.includes(selected[0]);

      return isCorrect ? result + 1 : result;
    }, 0);
  }, [answers, questions]);

  const handleSelection = (questionId: string, option: string) => {
    setSubmitted(false);
    setAnswers((current) => {
      const existing = current[questionId] ?? [];
      const next = existing.includes(option)
        ? existing.filter((value) => value !== option)
        : [...existing, option];

      return {
        ...current,
        [questionId]: next,
      };
    });
  };

  const submitExam = () => {
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Exam</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Candidate review</h1>
        </div>
        <div className="rounded-full bg-brand-100 px-3 py-2 text-sm font-semibold text-brand-700">
          {questions.length} questions
        </div>
      </div>

      {questions.map((question, index) => {
        const selected = answers[question.id] ?? [];

        return (
          <div key={question.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.16em] text-slate-500">Question {index + 1}</p>
            <h2 className="text-xl font-semibold text-slate-900">{question.questionText}</h2>

            <div className="mt-5 space-y-3">
              {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                const value = question[`option${letter}` as keyof QuestionItem] as string;
                const isSelected = selected.includes(letter);

                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => handleSelection(question.id, letter)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-200'
                    }`}
                  >
                    <span className="font-semibold">{letter}</span>
                    <span className="flex-1 px-3">{value}</span>
                  </button>
                );
              })}
            </div>

            {submitted && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                Correct answer: {question.correctAnswers.join(', ')}
              </div>
            )}
          </div>
        );
      })}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            {submitted ? `You scored ${score} / ${totalQuestions}` : `Answered ${Object.keys(answers).length} / ${totalQuestions}`}
          </div>
          <button
            type="button"
            onClick={submitExam}
            className="rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white"
          >
            {submitted ? 'Submitted' : 'Submit answers'}
          </button>
        </div>
      </div>
    </div>
  );
}
