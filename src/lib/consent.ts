import type { Locale } from "./i18n";

/**
 * Cookie-consent state.
 *
 * Only two categories exist: the necessary cookies the service cannot run
 * without (auth, language, currency, and this choice itself), and statistics
 * cookies for Google Analytics. Necessary cookies are always set and are not
 * represented here — there is nothing to consent to.
 */
export type ConsentChoice = "all" | "necessary";

export const CONSENT_COOKIE = "svp-consent";
/** One year, matching what the cookie policy states. */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

export function isConsentChoice(value: unknown): value is ConsentChoice {
  return value === "all" || value === "necessary";
}

/** Whether statistics cookies (GA4) may be set for this visitor. */
export function allowsStatistics(value: unknown): boolean {
  return value === "all";
}

/** Fired on `window` when the visitor asks to review their choice again. */
export const OPEN_CONSENT_EVENT = "svp:open-cookie-settings";
/** Fired on `window` when the stored choice changes, so gated scripts react. */
export const CONSENT_CHANGED_EVENT = "svp:consent-changed";

export type ConsentT = {
  title: string;
  body: string;
  /** Sentence linking to the cookie policy; {link} is replaced by the link. */
  readMore: string;
  policyLabel: string;
  acceptAll: string;
  necessaryOnly: string;
  settingsLabel: string;
  /** Screen-reader label for the banner region. */
  regionLabel: string;
  necessaryTitle: string;
  necessaryDesc: string;
  statisticsTitle: string;
  statisticsDesc: string;
  alwaysOn: string;
};

export const CONSENT: Record<Locale, ConsentT> = {
  da: {
    title: "Vi bruger cookies",
    body:
      "Nødvendige cookies holder dig logget ind og husker dit sprog. Statistik-cookies hjælper os med at se, hvilke sider der bliver brugt — dem sætter vi kun, hvis du siger ja.",
    readMore: "Læs mere i vores {link}.",
    policyLabel: "cookiepolitik",
    acceptAll: "Tillad alle",
    necessaryOnly: "Kun nødvendige",
    settingsLabel: "Cookieindstillinger",
    regionLabel: "Cookiesamtykke",
    necessaryTitle: "Nødvendige",
    necessaryDesc: "Login, sprog, valuta og dit cookievalg. Tjenesten virker ikke uden.",
    statisticsTitle: "Statistik",
    statisticsDesc: "Google Analytics med anonymiseret IP. Bruges kun til at forbedre siden.",
    alwaysOn: "Altid slået til",
  },
  en: {
    title: "We use cookies",
    body:
      "Necessary cookies keep you signed in and remember your language. Statistics cookies help us see which pages get used — we set those only if you say yes.",
    readMore: "Read more in our {link}.",
    policyLabel: "cookie policy",
    acceptAll: "Allow all",
    necessaryOnly: "Necessary only",
    settingsLabel: "Cookie settings",
    regionLabel: "Cookie consent",
    necessaryTitle: "Necessary",
    necessaryDesc: "Login, language, currency and your cookie choice. The service does not work without them.",
    statisticsTitle: "Statistics",
    statisticsDesc: "Google Analytics with anonymised IP. Used only to improve the site.",
    alwaysOn: "Always on",
  },
  es: {
    title: "Usamos cookies",
    body:
      "Las cookies necesarias mantienen tu sesión y recuerdan tu idioma. Las estadísticas nos ayudan a ver qué páginas se usan; esas solo se instalan si aceptas.",
    readMore: "Más información en nuestra {link}.",
    policyLabel: "política de cookies",
    acceptAll: "Permitir todas",
    necessaryOnly: "Solo necesarias",
    settingsLabel: "Configuración de cookies",
    regionLabel: "Consentimiento de cookies",
    necessaryTitle: "Necesarias",
    necessaryDesc: "Inicio de sesión, idioma, moneda y tu elección de cookies. El servicio no funciona sin ellas.",
    statisticsTitle: "Estadísticas",
    statisticsDesc: "Google Analytics con IP anonimizada. Solo se usa para mejorar el sitio.",
    alwaysOn: "Siempre activas",
  },
  de: {
    title: "Wir verwenden Cookies",
    body:
      "Notwendige Cookies halten dich angemeldet und merken sich deine Sprache. Statistik-Cookies zeigen uns, welche Seiten genutzt werden — die setzen wir nur mit deiner Zustimmung.",
    readMore: "Mehr dazu in unserer {link}.",
    policyLabel: "Cookie-Richtlinie",
    acceptAll: "Alle zulassen",
    necessaryOnly: "Nur notwendige",
    settingsLabel: "Cookie-Einstellungen",
    regionLabel: "Cookie-Einwilligung",
    necessaryTitle: "Notwendig",
    necessaryDesc: "Login, Sprache, Währung und deine Cookie-Auswahl. Ohne sie funktioniert der Dienst nicht.",
    statisticsTitle: "Statistik",
    statisticsDesc: "Google Analytics mit anonymisierter IP. Wird nur zur Verbesserung der Seite genutzt.",
    alwaysOn: "Immer aktiv",
  },
};
