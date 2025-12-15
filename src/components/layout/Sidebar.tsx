import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Beaker, 
  CalendarDays, 
  LogOut,
  BookOpen,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/lab", icon: Beaker, label: "Laboratório" },
  { to: "/planner", icon: CalendarDays, label: "Agenda" },
];

const Sidebar = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { profile } = useProfile();

  return (
    <div className="glass h-full w-60 rounded-3xl p-5 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Primo</h1>
          <p className="text-xs text-muted-foreground">Estude com IA</p>
        </div>
      </div>

      {/* Streak Badge */}
      {profile && profile.streak_count !== undefined && profile.streak_count > 0 && (
        <div className="streak-badge mb-6 justify-center">
          <Flame className="h-5 w-5" />
          <span>{profile.streak_count} dias</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = item.end 
            ? location.pathname === item.to 
            : location.pathname.startsWith(item.to);
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "nav-item",
                isActive && "nav-item-active"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center">
            <span className="text-sm font-medium text-foreground">
              {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {profile?.full_name || "Estudante"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {profile?.target_course || "Configure seu perfil"}
            </p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="nav-item w-full text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
