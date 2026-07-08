"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSession, isAuthed, setSession, verifyPassword } from "@/lib/auth";
import { CONNECTORS, NotConfiguredError } from "@/lib/connectors";
import { NATIONAL_FIGURES } from "@/lib/national-figures";
import {
  insertResource,
  upsertLatestMetric,
  verifyResource,
} from "@/lib/db/queries";

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}
function optStr(v: FormDataEntryValue | null): string | null {
  const s = str(v);
  return s === "" ? null : s;
}
function optNum(v: FormDataEntryValue | null): number | null {
  const s = str(v);
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export async function loginAction(formData: FormData): Promise<void> {
  const token = await verifyPassword(str(formData.get("password")));
  if (!token) redirect("/manage?error=1");
  await setSession(token);
  redirect("/manage");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/manage");
}

async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) redirect("/manage");
}

export async function saveMetricAction(formData: FormData): Promise<void> {
  await requireAuth();
  const indicator = str(formData.get("indicator"));
  const valueDisplay = str(formData.get("valueDisplay"));
  const source = str(formData.get("source"));
  const measuredOrModeled = str(formData.get("measuredOrModeled"));
  if (!indicator || !valueDisplay || !source || !measuredOrModeled) {
    redirect("/manage?error=metric");
  }
  await upsertLatestMetric({
    indicator,
    geo: str(formData.get("geo")) || "US",
    valueDisplay,
    valueNumeric: optNum(formData.get("valueNumeric")),
    source,
    measuredOrModeled,
    notes: optStr(formData.get("notes")),
  });
  revalidatePath("/manage");
  redirect("/manage?saved=metric");
}

export async function saveResourceAction(formData: FormData): Promise<void> {
  await requireAuth();
  const type = str(formData.get("type"));
  const name = str(formData.get("name"));
  const source = str(formData.get("source"));
  if (!type || !name || !source) redirect("/manage?error=resource");
  await insertResource({
    type,
    name,
    geo: optStr(formData.get("geo")),
    lat: optNum(formData.get("lat")),
    lng: optNum(formData.get("lng")),
    phone: optStr(formData.get("phone")),
    url: optStr(formData.get("url")),
    notes: optStr(formData.get("notes")),
    source,
  });
  revalidatePath("/manage");
  redirect("/manage?saved=resource");
}

// Run a data connector on demand from the admin (Phase 2B: "show me the
// imported data in the admin"). Idempotent — safe to re-run; a slow run that
// times out can just be clicked again. The outcome summary is passed back via
// the ?ran query so the page can show what happened.
export async function runConnectorAction(formData: FormData): Promise<void> {
  await requireAuth();
  const name = str(formData.get("connector"));
  const connector = CONNECTORS[name];
  if (!connector) redirect("/manage?error=connector");

  let summary: string;
  try {
    const result = await connector.run();
    summary = `${name}: ${result.upserted} rows saved — ${result.notes.join(" | ")}`;
  } catch (err) {
    summary =
      err instanceof NotConfiguredError
        ? `${name}: did not run — ${err.message}`
        : `${name}: failed — ${(err as Error).message}`;
  }
  revalidatePath("/manage");
  revalidatePath("/data");
  redirect(`/manage?ran=${encodeURIComponent(summary.slice(0, 800))}`);
}

// One-click load of the national headline figures (the harm pyramid / scale
// band). Upserts the "latest" US row for each with its exact period-bearing
// tag — no manual typing, and the tags are more precise than the form dropdown
// allows. Idempotent; safe to re-run.
export async function seedNationalAction(): Promise<void> {
  await requireAuth();
  for (const fig of NATIONAL_FIGURES) {
    await upsertLatestMetric(fig);
  }
  revalidatePath("/manage");
  revalidatePath("/risk");
  revalidatePath("/");
  redirect(
    `/manage?ran=${encodeURIComponent(
      `Loaded ${NATIONAL_FIGURES.length} national figures (Sircar 2019): ${NATIONAL_FIGURES.map((f) => `${f.indicator} = ${f.valueDisplay}`).join(" | ")}`,
    )}`,
  );
}

export async function verifyResourceAction(formData: FormData): Promise<void> {
  await requireAuth();
  const id = Number(str(formData.get("id")));
  if (Number.isInteger(id)) await verifyResource(id);
  revalidatePath("/manage");
  redirect("/manage?saved=verified");
}
