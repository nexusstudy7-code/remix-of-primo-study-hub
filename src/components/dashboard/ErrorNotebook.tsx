import { SavedQuestion } from "@/hooks/useSavedQuestions";
import { AlertCircle } from "lucide-react";

interface ErrorNotebookProps {
  questions: SavedQuestion[];
}

const ErrorNotebook = ({ questions }: ErrorNotebookProps) => {
  return (
    <div className="glass rounded-3xl p-6 border-rose-500/20">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-rose-400" />
        <h3 className="text-lg font-semibold text-foreground">Caderno de Erros</h3>
      </div>
      {questions.length > 0 ? (
        <div className="space-y-3">
          {questions.map((q) => (
            <div key={q.id} className="glass-subtle rounded-xl p-4 border-l-2 border-rose-500/50">
              <p className="text-sm text-muted-foreground mb-1">{q.subject} {q.topic && `• ${q.topic}`}</p>
              <p className="text-foreground line-clamp-2">{q.content.question}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">Nenhum erro registrado ainda. Continue praticando!</p>
      )}
    </div>
  );
};

export default ErrorNotebook;
