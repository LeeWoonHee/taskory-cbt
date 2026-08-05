export type ExamPaper = { id: string; year: number; month?: number; round?: number; status: "available" };
export type CertificationLevel = { id: string; label: string; papers: ExamPaper[] };
export type ExamSeries = { id: string; title: string; category: string; organization: string; description: string; levels: CertificationLevel[]; papers?: ExamPaper[] };

export function formatExamPaperLabel(paper: Pick<ExamPaper, "year" | "month" | "round">) {
  return `${paper.year}년${paper.month ? ` ${paper.month}월` : ""}${paper.round ? ` ${paper.round}회` : ""}`;
}
