import { useState } from "react";
import { useProfile, Profile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useExamResults } from "@/hooks/useExamResults";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import ProfileEditor from "@/components/dashboard/ProfileEditor";
import StatsCards from "@/components/dashboard/StatsCards";
import EvolutionChart from "@/components/dashboard/EvolutionChart";
import AccuracyChart from "@/components/dashboard/AccuracyChart";
import ErrorNotebook from "@/components/dashboard/ErrorNotebook";
import AddExamModal from "@/components/dashboard/AddExamModal";

const Dashboard = () => {
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { examResults, loading: examsLoading, addExamResult } = useExamResults();
  const { savedQuestions, loading: questionsLoading } = useSavedQuestions();
  const [showAddExam, setShowAddExam] = useState(false);

  const loading = profileLoading || examsLoading || questionsLoading;

  const correctCount = savedQuestions.filter(q => q.is_correct).length;
  const wrongCount = savedQuestions.filter(q => !q.is_correct).length;

  return (
    <div className="space-y-6 slide-up">
      {/* Header with Profile & Streak */}
      <ProfileHeader profile={profile} />

      {/* Profile Editor (Collapsible) */}
      <ProfileEditor profile={profile} updateProfile={updateProfile} />

      {/* Stats Cards */}
      <StatsCards 
        examCount={examResults.length}
        questionCount={savedQuestions.length}
        correctCount={correctCount}
        wrongCount={wrongCount}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EvolutionChart 
          examResults={examResults} 
          onAddExam={() => setShowAddExam(true)} 
        />
        <AccuracyChart correctCount={correctCount} wrongCount={wrongCount} />
      </div>

      {/* Error Notebook */}
      <ErrorNotebook questions={savedQuestions.filter(q => !q.is_correct).slice(0, 5)} />

      {/* Add Exam Modal */}
      <AddExamModal 
        open={showAddExam} 
        onOpenChange={setShowAddExam} 
        onAdd={addExamResult}
      />
    </div>
  );
};

export default Dashboard;
