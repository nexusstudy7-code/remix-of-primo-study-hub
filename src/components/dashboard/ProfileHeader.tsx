import { Profile } from "@/hooks/useProfile";
import { Flame, Target, GraduationCap } from "lucide-react";

interface ProfileHeaderProps {
  profile: Profile | null;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  return (
    <div className="glass rounded-3xl p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center text-3xl font-bold text-foreground">
            {profile?.full_name?.[0]?.toUpperCase() || "?"}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Olá, {profile?.full_name?.split(" ")[0] || "Estudante"}! 👋
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {profile?.target_course && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Target className="h-4 w-4 text-primary" />
                  {profile.target_course}
                </span>
              )}
              {profile?.current_year && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4 text-secondary" />
                  {profile.current_year}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats: Streak & XP */}
        <div className="grid grid-cols-3 gap-2">

          {/* Level Display */}
          <div className="glass-strong rounded-2xl p-2 md:p-6 text-center min-w-0">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-6 h-6 md:w-10 md:h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                <span className="text-[10px] md:text-xs font-bold text-secondary">Lvl</span>
              </div>
            </div>
            <p className="text-lg md:text-4xl font-bold text-foreground truncate">
              {profile?.level || 1}
            </p>
            <p className="text-[10px] md:text-sm text-muted-foreground uppercase truncate">Nível</p>
          </div>

          {/* XP Display */}
          <div className="glass-strong rounded-2xl p-2 md:p-6 text-center min-w-0">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-6 h-6 md:w-10 md:h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                <span className="text-[10px] md:text-xs font-bold text-primary/80">XP</span>
              </div>
            </div>
            <p className="text-lg md:text-4xl font-bold text-foreground truncate">
              {profile?.xp || 0}
            </p>
            <p className="text-[10px] md:text-sm text-muted-foreground uppercase truncate">XP Total</p>
          </div>

          {/* On Fire Streak */}
          <div className="glass-strong rounded-2xl p-2 md:p-6 text-center min-w-0">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Flame className="h-5 w-5 md:h-8 md:w-8 text-orange-400" />
            </div>
            <p className="text-lg md:text-4xl font-bold text-foreground truncate">
              {profile?.streak_count || 0}
            </p>
            <p className="text-[10px] md:text-sm text-muted-foreground uppercase truncate">On Fire</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
