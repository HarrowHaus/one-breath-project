"use server";

import { redirect } from "next/navigation";
import { insertPledge } from "@/lib/db/queries";

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

// The pledge. Honest opt-in: `updates` is only true if the reader checked the
// (unchecked-by-default) box. On success we land on /thank-you. A storage error
// still lands them on /thank-you rather than dead-ending — but we log it.
export async function pledgeAction(formData: FormData): Promise<void> {
  const name = str(formData.get("name"));
  const email = str(formData.get("email"));
  const wantsUpdates = str(formData.get("updates")) === "yes";

  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    redirect("/act?error=pledge");
  }

  try {
    await insertPledge({ name, email, wantsUpdates });
  } catch (err) {
    console.error("pledge failed:", (err as Error)?.message);
  }
  redirect("/thank-you");
}
