import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWeeklyClientDigest(userEmail: string, streak: number, rank: number) {
  const subject = streak < 3 
    ? `🚨 Your contractor missed proof again — rank #${rank}` 
    : `✅ ${streak}-day streak 🔥 Your contractor is crushing it`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: userEmail,
    subject,
    html: `<h1>Weekly SiteProof Update</h1><p>${getShameMessage(streak, rank, 100)}</p>`
  });
}

export async function sendProContractorReport(userEmail: string, data: any) {
  // Full shame + reward summary
  await resend.emails.send({ /* ... full template with multipliers, near-misses, referral bombs */ });
}
