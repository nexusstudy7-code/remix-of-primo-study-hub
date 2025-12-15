import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface AccuracyChartProps {
  correctCount: number;
  wrongCount: number;
}

const AccuracyChart = ({ correctCount, wrongCount }: AccuracyChartProps) => {
  const data = [
    { name: "Acertos", value: correctCount, color: "hsl(160 84% 39%)" },
    { name: "Erros", value: wrongCount, color: "hsl(0 84% 60%)" },
  ];

  const total = correctCount + wrongCount;

  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Precisão nas Questões</h3>
      {total > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend formatter={(value) => <span style={{ color: "hsl(210 40% 98%)" }}>{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Responda questões para ver suas estatísticas
        </div>
      )}
    </div>
  );
};

export default AccuracyChart;
