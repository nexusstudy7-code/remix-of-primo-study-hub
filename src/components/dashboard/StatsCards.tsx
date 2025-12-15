import { FileText, CheckCircle, XCircle, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  examCount: number;
  questionCount: number;
  correctCount: number;
  wrongCount: number;
}

const StatsCards = ({ examCount, questionCount, correctCount, wrongCount }: StatsCardsProps) => {
  const accuracy = questionCount > 0 ? Math.round((correctCount / questionCount) * 100) : 0;

  const stats = [
    { icon: FileText, label: "Simulados", value: examCount, color: "text-primary" },
    { icon: CheckCircle, label: "Acertos", value: correctCount, color: "text-emerald-400" },
    { icon: XCircle, label: "Erros", value: wrongCount, color: "text-rose-400" },
    { icon: TrendingUp, label: "Precisão", value: `${accuracy}%`, color: "text-amber-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="glass rounded-2xl p-5">
          <stat.icon className={`h-6 w-6 ${stat.color} mb-2`} />
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
