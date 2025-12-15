import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ExamResult {
  id: string;
  user_id: string;
  title: string;
  date: string;
  total_score: number;
  max_score: number;
  created_at: string;
}

export function useExamResults() {
  const { user } = useAuth();
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExamResults = async () => {
    if (!user) {
      setExamResults([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("exam_results")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (error) throw error;
      setExamResults(data || []);
    } catch (error) {
      console.error("Error fetching exam results:", error);
    } finally {
      setLoading(false);
    }
  };

  const addExamResult = async (exam: { title: string; date: string; total_score: number; max_score?: number }) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { data, error } = await supabase
        .from("exam_results")
        .insert({
          user_id: user.id,
          title: exam.title,
          date: exam.date,
          total_score: exam.total_score,
          max_score: exam.max_score || 100,
        })
        .select()
        .single();

      if (error) throw error;

      setExamResults((prev) => [...prev, data].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ));
      toast.success("Resultado adicionado!");
      return { error: null };
    } catch (error) {
      console.error("Error adding exam result:", error);
      toast.error("Erro ao adicionar resultado");
      return { error: error as Error };
    }
  };

  useEffect(() => {
    fetchExamResults();
  }, [user]);

  return { examResults, loading, addExamResult, refetch: fetchExamResults };
}
