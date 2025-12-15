import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AddExamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (exam: { title: string; date: string; total_score: number }) => Promise<{ error: Error | null }>;
}

const AddExamModal = ({ open, onOpenChange, onAdd }: AddExamModalProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [score, setScore] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onAdd({ title, date, total_score: Number(score) });
    setIsSubmitting(false);
    setTitle("");
    setScore("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/20 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Adicionar Resultado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Título do Simulado</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="input-glass" placeholder="ENEM 2024" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Data</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-glass" required />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Nota (0-100)</Label>
              <Input type="number" min="0" max="100" value={score} onChange={(e) => setScore(e.target.value)} className="input-glass" required />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full btn-primary">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExamModal;
