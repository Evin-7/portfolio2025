import { notFound } from "next/navigation";
import IntroPreviewClient from "./preview-client";

export const dynamic = "force-dynamic";

export default function IntroPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <IntroPreviewClient />;
}
