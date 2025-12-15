import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Beaker, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Home", end: true },
  { to: "/lab", icon: Beaker, label: "Lab" },
  { to: "/planner", icon: CalendarDays, label: "Agenda" },
];

const MobileNav = () => {
  const location = useLocation();

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
      <nav className="glass rounded-2xl p-2 flex justify-around">
        {navItems.map((item) => {
          const isActive = item.end 
            ? location.pathname === item.to 
            : location.pathname.startsWith(item.to);
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-primary/20 text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNav;
