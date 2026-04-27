import { createServerClient } from './supabase/server';

export async function calculateAndUpdateStreak(userId: string) {
  const supabase = await createServerClient();

  // Existing streak calc (kept from last version)
  const { data: logs } = await supabase
    .from('daily_logs')
    .select('log_date')
    .eq('user_id', userId)
    .order('log_date', { ascending: true });

  if (!logs?.length) return { current: 0, longest: 0, multiplier: 1 };

  // ... (same date logic as before)

  let multiplier = 1;
  if (currentStreak >= 30) multiplier = 3;
  else if (currentStreak >= 14) multiplier = 2;
  else if (currentStreak >= 7) multiplier = 1.5;

  // Random variable reward drop (dopamine hit)
  const shouldDropReward = Math.random() < 0.23; // 23% chance every log
  if (shouldDropReward) {
    const rewards = [
      { type: 'legendary_badge', msg: '🔥 LEGENDARY STREAK DROP — +500 leaderboard points' },
      { type: 'multiplier_boost', msg: '💥 TEMP 5x MULTIPLIER FOR 24 HOURS' },
      { type: 'near_miss_escape', msg: '😈 You just dodged #4 by ONE log. Close one.' }
    ];
    const drop = rewards[Math.floor(Math.random() * rewards.length)];
    await supabase.from('reward_drops').insert({
      user_id: userId,
      reward_type: drop.type,
      message: drop.msg
    });
  }

  await supabase.from('streaks').upsert({
    user_id: userId,
    current_streak: currentStreak,
    longest_streak: longestStreak,
    last_log_date: sortedDates[sortedDates.length - 1],
    multiplier
  });

  return { current: currentStreak, longest: longestStreak, multiplier };
}

export function getShameMessage(streak: number, rank: number, totalInZip: number): string {
  if (streak === 0) return "You're fucking invisible. Clients already moved on.";
  if (rank > totalInZip * 0.8) return "Bottom 20%. You're the joke of the zip code.";
  if (streak < 3) return "3 days? Weak as fuck. Log or get laughed at.";
  if (rank <= 3) return "Top 3. The rush feels good, doesn't it?";
  return "Mid pack. Still broke. Still forgettable.";
}
