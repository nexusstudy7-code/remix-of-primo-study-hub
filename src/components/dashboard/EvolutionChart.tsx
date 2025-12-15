import { ExamResult } from "@/hooks/useExamResults";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EvolutionChartProps {
  examResults: ExamResult[];
  onAddExam: () => void;
}

const EvolutionChart = ({ examResults, onAddExam }: EvolutionChartProps) => {
  const data = examResults.map((exam) => ({
    date: format(new Date(exam.date), "dd/MM", { locale: ptBR }),
    score: Number(exam.total_score),
    name: exam.title,
  }));

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Evolução de Notas</h3>
        <button onClick={onAddExam} className="btn-glass text-sm flex items-center gap-2 px-4 py-2">
          <Plus className="h-4 w-4" /> Novo Simulado
        </button>
      </div>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="hsl(215 20% 65%)" fontSize={12} />
            <YAxis stroke="hsl(215 20% 65%)" fontSize={12} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: "hsl(220 40% 13%)", border: "1px solid hsl(220 30% 25%)", borderRadius: "12px" }} />
            <Line type="monotone" dataKey="score" stroke="hsl(160 84% 39%)" strokeWidth={3} dot={{ fill: "hsl(160 84% 39%)", strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Adicione seu primeiro simulado para ver o gráfico
        </div>
      )}
    </div>
  );
};

export default EvolutionChart;
