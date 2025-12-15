import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Loader2, Clock, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string | null;
  type: string;
  location: string | null;
}

const eventTypes = [
  { value: "study", label: "Estudo", color: "bg-primary/30 border-primary/50" },
  { value: "class", label: "Aula", color: "bg-secondary/30 border-secondary/50" },
  { value: "exam", label: "Prova", color: "bg-rose-500/30 border-rose-500/50" },
];

const Planner = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  useEffect(() => {
    if (user) fetchEvents();
  }, [user, currentDate]);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", user?.id)
      .gte("start_time", monthStart.toISOString())
      .lte("start_time", monthEnd.toISOString());
    setEvents(data || []);
    setLoading(false);
  };

  const addEvent = async (event: { title: string; start_time: string; type: string; location?: string }) => {
    const { error } = await supabase.from("events").insert({ ...event, user_id: user?.id });
    if (error) toast.error("Erro ao criar evento");
    else { toast.success("Evento criado!"); fetchEvents(); }
  };

  const getEventsForDay = (day: Date) => events.filter((e) => isSameDay(new Date(e.start_time), day));

  return (
    <div className="space-y-6 slide-up">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Agenda</h1>
        <Button onClick={() => { setSelectedDate(new Date()); setShowAddModal(true); }} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />Novo Evento
        </Button>
      </div>

      {/* Calendar Header */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 glass rounded-xl glass-hover">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-foreground capitalize">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </h2>
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 glass rounded-xl glass-hover">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
            <div key={d} className="text-center text-sm text-muted-foreground py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array(monthStart.getDay()).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isToday = isSameDay(day, new Date());
            return (
              <button
                key={day.toISOString()}
                onClick={() => { setSelectedDate(day); setShowAddModal(true); }}
                className={`aspect-square p-1 rounded-xl flex flex-col items-center justify-start glass-hover transition-all ${isToday ? "ring-2 ring-primary" : ""}`}
              >
                <span className={`text-sm font-medium ${isToday ? "text-primary" : "text-foreground"}`}>{format(day, "d")}</span>
                <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                  {dayEvents.slice(0, 3).map((e) => {
                    const type = eventTypes.find((t) => t.value === e.type);
                    return <div key={e.id} className={`w-1.5 h-1.5 rounded-full ${type?.color.split(" ")[0]}`} />;
                  })}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      <AddEventModal open={showAddModal} onOpenChange={setShowAddModal} selectedDate={selectedDate} onAdd={addEvent} />
    </div>
  );
};

const AddEventModal = ({ open, onOpenChange, selectedDate, onAdd }: { open: boolean; onOpenChange: (o: boolean) => void; selectedDate: Date | null; onAdd: (e: any) => Promise<void> }) => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [type, setType] = useState("study");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    setSubmitting(true);
    const start = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${time}`);
    await onAdd({ title, start_time: start.toISOString(), type, location: location || undefined });
    setSubmitting(false);
    setTitle(""); setLocation("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/20 sm:max-w-md">
        <DialogHeader><DialogTitle className="text-foreground">Novo Evento</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="input-glass" placeholder="Estudar Física" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Horário</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-glass" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Tipo</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="input-glass"><SelectValue /></SelectTrigger>
                <SelectContent className="glass border-white/20">
                  {eventTypes.map((t) => <SelectItem key={t.value} value={t.value} className="focus:bg-white/10">{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Local (opcional)</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} className="input-glass" placeholder="Sala 101" />
          </div>
          <Button type="submit" disabled={submitting} className="w-full btn-primary">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Evento"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Planner;
