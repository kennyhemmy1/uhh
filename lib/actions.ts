'use server';

import { createServerClient } from './supabase/server';
import { calculateAndUpdateStreak } from './streak';
import { Resend } from 'resend';
import { revalidatePath } from 'next/cache';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function addDailyLog(projectId: string, photoUrls: string[], notes: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Dedupe + timezone proof
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase.from('daily_logs').insert({
    project_id: projectId,
    user_id: user.id,
    log_date: today,
    photo_urls: photoUrls,
    notes
  }).onConflict('project_id,log_date').ignore(); // no double logs

  if (error) throw error;

  const streakData = await calculateAndUpdateStreak(user.id);
  
  // Trigger reward + client reaction
  if (streakData.current >= 7) {
    await triggerClientReaction(user.id, streakData.current);
  }

  revalidatePath('/dashboard');
  revalidatePath(`/projects/${projectId}`);
  return { success: true, streak: streakData };
}

async function triggerClientReaction(userId: string, streak: number) {
  // Fake instant client validation for dopamine
  const reactions = [
    "Client just texted: 'This is why I hired you 🔥'",
    "3 new views on your public proof page",
    "Referral link shared — both of you just got 14-day 3x boost"
  ];
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: 'you@siteproof.app', // in real: user's email
    subject: `🚨 Client just reacted to your log`,
    html: `<h1>${reactions[Math.floor(Math.random()*reactions.length)]}</h1>`
  });
}
