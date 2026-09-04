import { Suspense } from "react";
import { NewVideoForm } from "./new-video-form";

// Ordering a video runs the createVideoOrderCheckout Server Action, which
// downloads and base64-encodes up to 3 listing photos before handing them to
// Veo. Server Actions inherit their page's maxDuration, and the platform
// default cuts that off part-way — the order row is already inserted by then,
// so it sticks on "processing" until the poller times it out. The form itself
// is a client component, which cannot carry route segment config, so the page
// is a thin server wrapper that can.
export const maxDuration = 60;

export default function NewVideoPage() {
  return (
    <Suspense>
      <NewVideoForm />
    </Suspense>
  );
}
