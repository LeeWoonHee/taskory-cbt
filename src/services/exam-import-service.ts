import { read, utils } from "xlsx";

export type ImportedQuestion = {
  questionType: "objective" | "subjective";
  prompt: string;
  context: string | null;
  options: string[] | null;
  correctAnswer: string;
  explanation: string | null;
};

export type ImportResult = { questions: ImportedQuestion[]; errors: string[] };

function text(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeHeader(value: unknown) {
  return text(value).toLowerCase().replace(/[\s_-]/g, "");
}

function getValue(row: unknown[], headers: Map<string, number>, names: string[]) {
  const index = names.map(normalizeHeader).map((name) => headers.get(name)).find((value) => value !== undefined);
  return index === undefined ? "" : text(row[index]);
}

export async function parseExamSpreadsheet(file: File): Promise<ImportResult> {
  const workbook = read(await file.arrayBuffer(), { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) return { questions: [], errors: ["엑셀 파일에 첫 번째 시트가 없습니다."] };

  const rows = utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", raw: false });
  if (!rows.length) return { questions: [], errors: ["엑셀 파일에 데이터가 없습니다."] };
  const headers = new Map<string, number>();
  rows[0].forEach((value, index) => headers.set(normalizeHeader(value), index));
  const requiredHeaders = [["문제내용", "문제", "prompt"], ["정답", "answer"]];
  const missingHeaders = requiredHeaders.filter((names) => !names.some((name) => headers.has(normalizeHeader(name)))).map((names) => names[0]);
  if (missingHeaders.length) return { questions: [], errors: [`필수 컬럼이 없습니다: ${missingHeaders.join(", ")}`] };

  const questions: ImportedQuestion[] = [];
  const errors: string[] = [];
  rows.slice(1).forEach((row, rowIndex) => {
    const line = rowIndex + 2;
    const prompt = getValue(row, headers, ["문제내용", "문제 내용", "문제", "prompt"]);
    const context = getValue(row, headers, ["지문/예시", "지문", "예시", "context"]);
    const typeValue = getValue(row, headers, ["타입", "type"]).toLowerCase();
    const answer = getValue(row, headers, ["정답", "answer"]);
    const explanation = getValue(row, headers, ["해설", "explanation"]);
    const optionNames = (number: number) => [`선택지${number}`, `선택지 ${number}`, `객관식${number}`, `객관식 ${number}`, `option${number}`];
    if (!prompt && !typeValue && !answer) return;
    if (!prompt) errors.push(`${line}행: 문제내용은 필수입니다.`);
    const options = [1, 2, 3, 4, 5].map((number) => getValue(row, headers, optionNames(number))).filter(Boolean);
    const questionType = ["객관식", "객관", "objective", "option"].includes(typeValue) ? "objective" : ["주관식", "주관", "subjective", "short"].includes(typeValue) ? "subjective" : !typeValue && options.length >= 4 ? "objective" : !typeValue && options.length === 0 ? "subjective" : null;
    if (!questionType) errors.push(`${line}행: 타입은 객관식 또는 주관식이어야 합니다.`);
    if (questionType === "objective") {
      if (options.length < 4) errors.push(`${line}행: 객관식은 선택지 1~4가 필요합니다.`);
      const answerNumber = Number(answer);
      if (!Number.isInteger(answerNumber) || answerNumber < 1 || answerNumber > options.length) errors.push(`${line}행: 객관식 정답은 1~${options.length || 5} 중 하나여야 합니다.`);
    }
    if (questionType === "subjective" && !answer) errors.push(`${line}행: 주관식 정답은 필수입니다.`);
    if (questionType && prompt && answer && (questionType === "subjective" || options.length >= 4) && !(questionType === "objective" && (!Number.isInteger(Number(answer)) || Number(answer) < 1 || Number(answer) > options.length))) questions.push({ questionType, prompt, context: context || null, options: questionType === "objective" ? options : null, correctAnswer: questionType === "objective" ? String(Number(answer) - 1) : answer, explanation: explanation || null });
  });
  return { questions, errors };
}
