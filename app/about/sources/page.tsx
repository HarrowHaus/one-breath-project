import { redirect } from "next/navigation";

// "Our sources & methods." Per the sitemap, this reuses /data/methodology
// (titled "Our sources and methods"), which explains Measured vs Modeled and
// why we say "at least." Keep one canonical page rather than duplicate it.
export default function SourcesPage() {
  redirect("/data/methodology");
}
