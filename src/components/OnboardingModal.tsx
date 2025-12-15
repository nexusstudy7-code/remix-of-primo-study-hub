import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Rocket } from "lucide-react";

const courses = [
  "Medicina",
  "Direito",
  "Engenharia",
  "Administração",
  "Psicologia",
  "Outro",
];

const years = [
  "Ensino Médio - 1º Ano",
  "Ensino Médio - 2º Ano",
  "Ensino Médio - 3º Ano",
  "Cursinho",
  "Graduação",
];

const OnboardingModal = () => {
  const { profile, loading, updateProfile } = useProfile();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [targetCourse, setTargetCourse] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && profile && (!profile.full_name || !profile.target_course)) {
      setOpen(true);
    }
  }, [profile, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !targetCourse) return;

    setIsSubmitting(true);
    const { error } = await updateProfile({
      full_name: fullName,
      target_course: targetCourse,
      current_year: currentYear || null,
    });

    if (!error) {
      setOpen(false);
    }
    setIsSubmitting(false);
  };

  if (loading) return null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="glass border-white/20 sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            Bem-vindo ao Primo!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Vamos personalizar sua experiência de estudos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-muted-foreground">
              Como podemos te chamar?
            </Label>
            <Input
              id="fullName"
              placeholder="Seu nome"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-glass h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">
              Qual é o seu objetivo?
            </Label>
            <Select value={targetCourse} onValueChange={setTargetCourse} required>
              <SelectTrigger className="input-glass h-12">
                <SelectValue placeholder="Selecione seu curso alvo" />
              </SelectTrigger>
              <SelectContent className="glass border-white/20">
                {courses.map((course) => (
                  <SelectItem key={course} value={course} className="focus:bg-white/10">
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">
              Em que fase você está?
            </Label>
            <Select value={currentYear} onValueChange={setCurrentYear}>
              <SelectTrigger className="input-glass h-12">
                <SelectValue placeholder="Selecione sua fase atual" />
              </SelectTrigger>
              <SelectContent className="glass border-white/20">
                {years.map((year) => (
                  <SelectItem key={year} value={year} className="focus:bg-white/10">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !fullName.trim() || !targetCourse}
            className="w-full h-12 btn-primary text-base"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Começar a Estudar 🚀"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
