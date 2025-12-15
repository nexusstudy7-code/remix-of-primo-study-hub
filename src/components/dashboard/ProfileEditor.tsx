import { useState } from "react";
import { Profile } from "@/hooks/useProfile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, Settings, Loader2 } from "lucide-react";

const courses = ["Medicina", "Direito", "Engenharia", "Administração", "Psicologia", "Outro"];
const years = ["Ensino Médio - 1º Ano", "Ensino Médio - 2º Ano", "Ensino Médio - 3º Ano", "Cursinho", "Graduação"];

interface ProfileEditorProps {
  profile: Profile | null;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const ProfileEditor = ({ profile, updateProfile }: ProfileEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [targetCourse, setTargetCourse] = useState(profile?.target_course || "");
  const [currentYear, setCurrentYear] = useState(profile?.current_year || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    await updateProfile({
      full_name: fullName,
      target_course: targetCourse,
      current_year: currentYear,
    });
    setIsSubmitting(false);
    setIsOpen(false);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="glass rounded-2xl w-full p-4 flex items-center justify-between glass-hover">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Editar Perfil</span>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="glass rounded-2xl p-6 space-y-4 fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Nome</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-glass"
                placeholder="Seu nome"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Curso Alvo</Label>
              <Select value={targetCourse} onValueChange={setTargetCourse}>
                <SelectTrigger className="input-glass">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="glass border-white/20">
                  {courses.map((c) => (
                    <SelectItem key={c} value={c} className="focus:bg-white/10">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Fase Atual</Label>
              <Select value={currentYear} onValueChange={setCurrentYear}>
                <SelectTrigger className="input-glass">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="glass border-white/20">
                  {years.map((y) => (
                    <SelectItem key={y} value={y} className="focus:bg-white/10">{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Alterações"}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ProfileEditor;
