import { desc, eq } from "drizzle-orm";

import { getDb } from "@/db";
import { exams } from "@/db/schema";
import type { ExamPaper, ExamSeries } from "@/types/exams";

type CatalogGroup = ExamSeries & { directPapers: ExamPaper[]; levelMap: Map<string, ExamPaper[]> };

export async function listExamCatalog(query = "") {
  const rows = await getDb().select({ id: exams.id, seriesId: exams.seriesId, title: exams.title, level: exams.level, examYear: exams.examYear, examMonth: exams.examMonth, examRound: exams.examRound, category: exams.category, organization: exams.organization }).from(exams).where(eq(exams.status, "published")).orderBy(desc(exams.examYear), desc(exams.examMonth));
  const groups = new Map<string, CatalogGroup>();
  for (const row of rows) {
    const paper: ExamPaper = { id: row.id, year: row.examYear, ...(row.examMonth ? { month: row.examMonth } : {}), ...(row.examRound ? { round: row.examRound } : {}), status: "available" };
    const group: CatalogGroup = groups.get(row.seriesId) ?? { id: row.seriesId, title: row.title, category: row.category ?? "", organization: row.organization ?? "", description: "등록된 시험을 연도별로 확인할 수 있습니다.", levels: [], directPapers: [], levelMap: new Map<string, ExamPaper[]>() };
    if (row.level?.trim()) {
      const papers = group.levelMap.get(row.level) ?? [];
      papers.push(paper);
      group.levelMap.set(row.level, papers);
    } else group.directPapers.push(paper);
    groups.set(row.seriesId, group);
  }
  const normalized = query.trim().toLowerCase();
  return [...groups.values()].map(({ levelMap, directPapers, ...series }) => ({ ...series, levels: [...levelMap.entries()].map(([label, papers]) => ({ id: `${series.id}-${label}`, label, papers })), ...(directPapers.length ? { papers: directPapers } : {}) })).filter((series) => !normalized || [series.title, series.category, series.organization, ...series.levels.map((level) => level.label), ...series.levels.flatMap((level) => level.papers.flatMap((paper) => [String(paper.year), String(paper.month ?? ""), String(paper.round ?? "")])), ...(series.papers ?? []).flatMap((paper) => [String(paper.year), String(paper.month ?? ""), String(paper.round ?? "")])].some((value) => value.toLowerCase().includes(normalized)));
}
