"use client";
import { useState } from "react";

export default function ReferralPanel({
  referralLink, successfulReferrals, requiredReferrals, unlocked, alreadyOwns,
}: {
  referralLink: string; successfulReferrals: number; requiredReferrals: number; unlocked: boolean; alreadyOwns?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const remaining = Math.max(requiredReferrals - successfulReferrals, 0);
  const pct = Math.min((successfulReferrals / requiredReferrals) * 100, 100);

  const shareText =
    `Found HIREBEAR — recruiter databases for job seekers 👀\n\n` +
    `I'm using it to find recruiter contacts for companies I'm targeting.\n\n` +
    `Use my link:\n${referralLink}\n\n` +
    `If 5 people purchase through my link, I unlock my package for free.`;

  async function handleCopy() {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // user cancelled — no action needed
      }
    } else {
      handleCopy();
    }
  }

  return (
    <div className="card">
      {unlocked ? (
        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          🎉 You unlocked your reward! {alreadyOwns && <span style={{ fontSize: 14, fontWeight: 400, color: "var(--sub)" }}>(already owned)</span>}
        </p>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontWeight: 700 }}>{successfulReferrals} / {requiredReferrals}</span>
          </div>
          <div style={{ height: 8, background: "var(--line)", borderRadius: 99, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", borderRadius: 99 }} />
          </div>
          <p style={{ color: "var(--sub)", fontSize: 14, marginBottom: 24 }}>
            {remaining} more purchase{remaining === 1 ? "" : "s"} to unlock your reward.
          </p>
        </>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input className="input" readOnly value={referralLink} style={{ flex: 1, fontSize: 13.5 }} />
        <button className="btn btn-outline" onClick={handleCopy}>{copied ? "Copied" : "Copy Link"}</button>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={handleShare}>Share</button>
        <a className="btn btn-outline" href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank">WhatsApp</a>
        <a className="btn btn-outline" href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`} target="_blank">Telegram</a>
        <a className="btn btn-outline" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`} target="_blank">LinkedIn</a>
        <a className="btn btn-outline" href={`mailto:?subject=Check out HIREBEAR&body=${encodeURIComponent(shareText)}`}>Email</a>
      </div>
    </div>
  );
}
