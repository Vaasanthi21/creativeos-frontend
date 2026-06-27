import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Shared state for in-flight image/video generation jobs.
// Mount <GenerationJobsProvider> ABOVE your <Routes>/router in App.jsx so it does
// NOT unmount when the user navigates between Image Studio, Video Studio, etc.
// Each studio page calls useGenerationJobs() instead of keeping isPolling /
// pollingStatus / stageStartedAt as local useState - that's the only structural
// change needed for generation to survive navigating away and back.

const GenerationJobsContext = createContext(null);
const STORAGE_KEY = 'creativeos_active_jobs_v1';

const loadPersisted = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export function GenerationJobsProvider({ children }) {
  const [jobs, setJobs] = useState(loadPersisted);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch {
      // ignore - non-fatal if localStorage is unavailable
    }
  }, [jobs]);

  const setJob = useCallback((type, patch) => {
    setJobs((prev) => ({
      ...prev,
      [type]: patch === null ? null : { ...(prev[type] || {}), ...patch },
    }));
  }, []);

  const clearJob = useCallback((type) => {
    setJobs((prev) => ({ ...prev, [type]: null }));
  }, []);

  const getJob = useCallback((type) => jobs[type] || null, [jobs]);

  return (
    <GenerationJobsContext.Provider value={{ jobs, setJob, clearJob, getJob }}>
      {children}
    </GenerationJobsContext.Provider>
  );
}

export function useGenerationJobs() {
  const ctx = useContext(GenerationJobsContext);
  if (!ctx) {
    throw new Error('useGenerationJobs must be used within a GenerationJobsProvider');
  }
  return ctx;
}