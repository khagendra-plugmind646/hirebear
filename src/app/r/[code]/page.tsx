import { redirect } from "next/navigation";

export default function ReferralRedirect({ params }: { params: { code: string } }) {
  // Deliberately does nothing else — clicks and page views are never counted.
  // The referral only becomes real once /api/auth/signup records it as PENDING,
  // and only counts once the Cashfree webhook verifies a paid order.
  redirect(`/signup?ref=${encodeURIComponent(params.code)}`);
}
