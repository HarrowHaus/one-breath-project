"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/lib/track";

// A Next link that fires an analytics goal on click. Used where a click-through
// is itself a conversion (e.g. landlord → installer finder).
export function TrackLink({
  href,
  event,
  className,
  children,
}: {
  href: string;
  event: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => track(event)}>
      {children}
    </Link>
  );
}
