// Fire a privacy-first analytics event (Plausible custom goal). No-ops unless
// analytics is configured (NEXT_PUBLIC_PLAUSIBLE_DOMAIN set) and the script has
// loaded. Plausible is cookieless and stores no personal data, so there's no
// consent banner — honest analytics with clear accept/decline parity (docs/02).
export function track(
  event: string,
  props?: Record<string, string | number | boolean>,
): void {
  if (typeof window === "undefined") return;
  const p = (window as unknown as { plausible?: (e: string, o?: unknown) => void })
    .plausible;
  if (typeof p === "function") p(event, props ? { props } : undefined);
}
