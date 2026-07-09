import Script from "next/script";

// Privacy-first analytics (Plausible). Loads ONLY when NEXT_PUBLIC_PLAUSIBLE_DOMAIN
// is set, so the site ships analytics-free until you opt in with your own account.
// Plausible is cookieless and collects no personal data — no consent banner, no
// cross-site tracking (docs/02: no dark-pattern consent, clear parity). The shim
// lets us queue custom conversion goals via track() before the script loads.
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;
  return (
    <>
      <Script
        defer
        data-domain={domain}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
      <Script id="plausible-shim" strategy="afterInteractive">
        {`window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}`}
      </Script>
    </>
  );
}
