import { describe, expect, it } from 'vitest';

import { parseQuestionDump } from './question-dump';

describe('parseQuestionDump', () => {
  it('extracts a single-choice question and its correct answer', () => {
    const text = `
Question 1: What is the capital of France?
A. Berlin
B. Madrid
C. Paris
D. Rome
Correct Answer: C

Question 2: Which cloud provider is this project focused on?
A. AWS
B. Azure
C. GCP
D. Oracle
Answer: A
`;

    const parsed = parseQuestionDump(text);

    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toMatchObject({
      questionText: 'What is the capital of France?',
      optionA: 'Berlin',
      optionB: 'Madrid',
      optionC: 'Paris',
      optionD: 'Rome',
      correctAnswers: ['C'],
      answerType: 'SINGLE',
    });
    expect(parsed[1].correctAnswers).toEqual(['A']);
  });

  it('supports multi-answer dumps when the answer key contains multiple letters', () => {
    const text = `
Q1: Which options are valid in a mock exam?
A. Question text
B. Correct answers list
C. A working database
D. A finished UI
Correct Answer: B, C
`;

    const parsed = parseQuestionDump(text);

    expect(parsed[0].correctAnswers).toEqual(['B', 'C']);
    expect(parsed[0].answerType).toBe('MULTIPLE');
  });
});
