import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { getLeaderboard } from "@/services/rankingService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Flame, Star, Medal, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Profile } from "@/hooks/useProfile";

export default function Ranking() {
    const { profile: currentUser } = useProfile();
    const [leaderboard, setLeaderboard] = useState<Partial<Profile>[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getLeaderboard();
                setLeaderboard(data);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const getRankInfo = (index: number) => {
        switch (index) {
            case 0: return { icon: <Trophy className="h-6 w-6 text-yellow-500 fill-yellow-500/20" />, bg: "bg-yellow-500/10 border-yellow-500/30" };
            case 1: return { icon: <Medal className="h-6 w-6 text-slate-400 fill-slate-400/20" />, bg: "bg-slate-400/10 border-slate-400/30" };
            case 2: return { icon: <Medal className="h-6 w-6 text-amber-700 fill-amber-700/20" />, bg: "bg-amber-700/10 border-amber-700/30" };
            default: return { icon: <span className="font-bold text-muted-foreground w-6 text-center">{index + 1}</span>, bg: "bg-card/50 border-white/5" };
        }
    };

    const getDisplayName = (user: Partial<Profile>) => {
        if (user.username) return user.username;
        if (user.full_name) return user.full_name;
        return "Estudante Anônimo";
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Carregando ranking...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                    Ranking dos Estudantes
                </h1>
                <p className="text-muted-foreground">
                    Os maiores destaques do Nexus Study
                </p>
            </div>

            <Card className="glass-strong border-white/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        Classificação Geral
                    </CardTitle>
                    <CardDescription>
                        Baseado em XP Total e Nível
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {leaderboard.length === 0 ? (
                        <div className="text-center py-12 space-y-4">
                            <Sparkles className="h-12 w-12 text-primary mx-auto opacity-50" />
                            <p className="text-muted-foreground">Seja o primeiro a pontuar!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {leaderboard.map((user, index) => {
                                const isCurrentUser = currentUser?.id === user.id;
                                const rankInfo = getRankInfo(index);

                                return (
                                    <div
                                        key={user.id}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-xl transition-all duration-300 border backdrop-blur-sm",
                                            isCurrentUser
                                                ? "bg-primary/20 border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] scale-[1.01] z-10"
                                                : cn("hover:bg-white/5", rankInfo.bg)
                                        )}
                                    >
                                        <div className="flex items-center justify-center w-8 shrink-0">
                                            {rankInfo.icon}
                                        </div>

                                        <Avatar className={cn("h-12 w-12 border-2 shrink-0",
                                            index === 0 ? "border-yellow-500" :
                                                isCurrentUser ? "border-primary" : "border-transparent"
                                        )}>
                                            <AvatarImage src={user.avatar_url || ""} />
                                            <AvatarFallback>{user.full_name?.[0] || "?"}</AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn("font-bold truncate", isCurrentUser ? "text-primary" : "text-foreground")}>
                                                        {getDisplayName(user)}
                                                    </span>
                                                    {user.is_pro && (
                                                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                                            PRO
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/30 text-secondary-foreground border border-secondary/20 font-medium">
                                                        Nível {user.level || 1}
                                                    </span>
                                                    {user.streak_count && user.streak_count > 0 ? (
                                                        <span className="flex items-center gap-1 text-xs text-orange-400">
                                                            <Flame className="h-3 w-3" />
                                                            {user.streak_count} dias
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                                            <span className="text-yellow-400 font-bold font-mono">{user.xp || 0}</span>
                                            <span className="text-xs text-yellow-400/70">XP</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
