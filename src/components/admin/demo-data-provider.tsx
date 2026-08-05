"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { initialDemoSnapshot } from "@/data/demo-admin-data";
import { createDemoAdminService, getExamDisplayStatus } from "@/services/admin-service";
import type {
  DemoSnapshot,
  Exam,
  ExamDisplayStatus,
  ExamDraftInput,
  ListResult,
  Member,
  MemberStatus,
  MutationResult,
} from "@/types/admin";

const STORAGE_KEY = "taskory-admin-demo-v1";

interface DemoDataContextValue {
  hydrated: boolean;
  listMembers: (input: { query?: string; status?: MemberStatus | "ALL" }) => ListResult<Member>;
  getMember: (id: string) => Member | null;
  changeMemberStatus: (input: {
    id: string;
    fromStatus: MemberStatus;
    toStatus: MemberStatus;
    reason?: string;
  }) => MutationResult<Member>;
  listExams: (input: { query?: string; displayStatus?: ExamDisplayStatus | "ALL" }) => ListResult<Exam>;
  getExam: (id: string) => Exam | null;
  createExamDraft: (input: ExamDraftInput) => MutationResult<Exam>;
  getDisplayStatus: (exam: Exam) => ExamDisplayStatus;
  resetDemo: () => void;
}

const DemoDataContext = createContext<DemoDataContextValue | null>(null);

function readStoredSnapshot(): DemoSnapshot | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoSnapshot;
    if (!Array.isArray(parsed.members) || !Array.isArray(parsed.exams)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<DemoSnapshot>(initialDemoSnapshot);
  const [hydrated, setHydrated] = useState(false);
  const snapshotRef = useRef(snapshot);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const stored = readStoredSnapshot();
      if (stored) {
        snapshotRef.current = stored;
        setSnapshot(stored);
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const persist = useCallback((next: DemoSnapshot) => {
    snapshotRef.current = next;
    setSnapshot(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const service = useMemo(() => createDemoAdminService(snapshot), [snapshot]);

  const changeMemberStatus = useCallback<DemoDataContextValue["changeMemberStatus"]>((input) => {
    const mutable = createDemoAdminService(snapshotRef.current);
    const result = mutable.changeMemberStatus(input);
    if (result.ok) persist(mutable.snapshot());
    return result;
  }, [persist]);

  const createExamDraft = useCallback<DemoDataContextValue["createExamDraft"]>((input) => {
    const mutable = createDemoAdminService(snapshotRef.current);
    const result = mutable.createExamDraft(input);
    if (result.ok) persist(mutable.snapshot());
    return result;
  }, [persist]);

  const resetDemo = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    persist(structuredClone(initialDemoSnapshot));
  }, [persist]);

  const value = useMemo<DemoDataContextValue>(() => ({
    hydrated,
    listMembers: (input) => service.listMembers(input),
    getMember: (id) => service.getMember(id),
    changeMemberStatus,
    listExams: (input) => service.listExams(input),
    getExam: (id) => service.getExam(id),
    createExamDraft,
    getDisplayStatus: getExamDisplayStatus,
    resetDemo,
  }), [hydrated, service, changeMemberStatus, createExamDraft, resetDemo]);

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData() {
  const context = useContext(DemoDataContext);
  if (!context) throw new Error("useDemoData는 DemoDataProvider 안에서 사용해야 합니다.");
  return context;
}
