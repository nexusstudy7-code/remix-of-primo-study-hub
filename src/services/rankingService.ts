import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/hooks/useProfile";

export async function getLeaderboard(limit = 50) {
    const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, streak_count, xp, level, is_pro, username")
        .order("xp", { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data as Partial<Profile>[];
}
