export type ParsedQuestion = {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswers: string[];
  answerType: 'SINGLE' | 'MULTIPLE';
  explanation?: string;
};

function normalizeQuestionText(value: string) {
  return value
    .replace(/^Question\s*\d*\s*[:.-]?\s*/i, '')
    .replace(/^Q\s*\d*\s*[:.-]?\s*/i, '')
    .replace(/^\d+[\.)]\s*/, '')
    .trim();
}

function extractLetters(raw: string) {
  return Array.from(
    new Set(
      raw
        .split(/[\s,;|]+/)
        .map((part) => part.trim().toUpperCase())
        .filter((part) => /^[A-D]$/.test(part)),
    ),
  );
}

export function parseQuestionDump(rawDump: string): ParsedQuestion[] {
  const normalizedDump = rawDump.replace(/\r/g, '').trim();

  if (!normalizedDump) {
    return [];
  }

  const blocks = normalizedDump
    .split(/\n\s*\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.flatMap((block) => {
    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const questionTextParts: string[] = [];
    const options: Record<string, string> = {};
    let correctAnswers: string[] = [];
    let explanation: string | undefined;

    for (const line of lines) {
      const prefixMatch = line.match(/^(?:Question|Q)\s*\d*\s*[:.-]?\s*(.*)$/i);
      if (prefixMatch) {
        questionTextParts.push(prefixMatch[1].trim());
        continue;
      }

      const answerMatch = line.match(/^(?:Correct Answer|Answer|Answers)\s*[:.-]?\s*(.+)$/i);
      if (answerMatch) {
        correctAnswers = extractLetters(answerMatch[1]);
        continue;
      }

      const optionMatch = line.match(/^([A-D])\s*[\.)-]?\s*(.+)$/i);
      if (optionMatch && !/^(?:Correct|Answer|Answers)/i.test(line)) {
        options[optionMatch[1].toUpperCase()] = optionMatch[2].trim();
        continue;
      }

      const explanationMatch = line.match(/^Explanation\s*[:.-]?\s*(.+)$/i);
      if (explanationMatch) {
        explanation = explanationMatch[1].trim();
        continue;
      }

      questionTextParts.push(line);
    }

    if (!questionTextParts.length || !options.A || !options.B || !options.C || !options.D) {
      return [];
    }

    const finalQuestionText = questionTextParts.join(' ').trim();

    return [
      {
        questionText: normalizeQuestionText(finalQuestionText),
        optionA: options.A,
        optionB: options.B,
        optionC: options.C,
        optionD: options.D,
        correctAnswers: correctAnswers.length > 0 ? correctAnswers : ['A'],
        answerType: correctAnswers.length > 1 ? 'MULTIPLE' : 'SINGLE',
        explanation,
      },
    ];
  });
}
