import { AuthForm } from "@/components/auth/auth-form";
import { signInAction } from "@/services/auth";

/**
 * Messages the confirmation callback (and the signup form) send people here
 * with. Without them a failed or already-used email link lands on a login page
 * that says nothing about why the user is looking at it.
 */
const BANNERS: Record<string, { tone: "info" | "error"; text: string }> = {
  confirmed: {
    tone: "info",
    text: "Din email er bekræftet. Log ind med din adgangskode for at komme i gang.",
  },
  registered: {
    tone: "info",
    text: "Din konto er oprettet. Bekræft linket i mailen, og log derefter ind her.",
  },
  confirmation: {
    tone: "error",
    text: "Bekræftelseslinket er udløbet eller allerede brugt. Log ind — eller opret kontoen igen, hvis den ikke findes.",
  },
  missing_code: {
    tone: "error",
    text: "Linket manglede sin bekræftelseskode. Åbn linket fra mailen igen, eller log ind, hvis du allerede har bekræftet.",
  },
  config: {
    tone: "error",
    text: "Bekræftelsen kunne ikke gennemføres på serveren. Prøv igen om lidt, eller kontakt support.",
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; confirmed?: string; registered?: string }>;
}) {
  const params = await searchParams;
  const key = params.error ?? (params.confirmed ? "confirmed" : params.registered ? "registered" : undefined);
  const banner = key ? BANNERS[key] : undefined;

  return (
    <AuthForm
      action={signInAction}
      submitLabel="Log ind"
      pendingLabel="Logger ind…"
      title="Velkommen tilbage"
      description="Log ind for at styre dine boliger, opslag og videoer."
      banner={banner}
      footer={{
        text: "Har du ikke en konto?",
        linkLabel: "Opret konto",
        href: "/signup",
      }}
    />
  );
}
