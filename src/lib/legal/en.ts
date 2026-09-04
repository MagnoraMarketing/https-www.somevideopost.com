import type { LocalisedLegal } from "./types";

const UPDATED = "Last updated 4 September 2026";

export const LEGAL_EN: LocalisedLegal = {
  chrome: {
    contents: "Contents",
    questionsHeading: "Questions?",
    questionsBody:
      "If you have questions about this policy, or want to exercise any of your rights, just write to us.",
    companyHeading: "Data controller",
    otherDocs: "Other documents",
  },
  docs: {
    privatlivspolitik: {
      title: "Privacy policy",
      metaTitle: "Privacy policy — somevideopost.com",
      metaDescription:
        "How somevideopost.com handles your personal data: what we collect, why, who we share it with, how long we keep it, and what rights you have under the GDPR.",
      intro:
        "This policy explains how we collect and process personal data when you use somevideopost.com. We keep it short and concrete — you should be able to see exactly what happens to your data.",
      updated: UPDATED,
      sections: [
        {
          heading: "What we collect",
          body: ["We collect only what is needed to run the service. Specifically:"],
          bullets: [
            "Account details: the name and email address you provide at signup, plus an encrypted password.",
            "Property details: what you enter about your property, and the data we fetch from the listing link you paste (title, description, photos, price, size and location).",
            "Content you generate: AI-generated post copy, images and presentation videos, along with any edits you make to them.",
            "Connected channels: access tokens and profile names for the social accounts you choose to connect (Facebook, Instagram, TikTok, LinkedIn, YouTube).",
            "Payment details: subscription status, purchase history and receipts. We never see your full card number — that is handled solely by Stripe.",
            "Technical data: IP address, browser type, language preference and service events, used for operations, security and troubleshooting.",
            "Statistics: aggregated site usage via Google Analytics — only if you have consented to statistics cookies.",
          ],
        },
        {
          heading: "Why we process it, and on what basis",
          body: [
            "We process your data for a specific purpose and on a legal basis under the General Data Protection Regulation (GDPR):",
          ],
          table: {
            headers: ["Purpose", "Legal basis"],
            rows: [
              ["Creating and running your account and delivering what you bought", "Performance of a contract — art. 6(1)(b)"],
              ["Generating posts, images and videos from your property data", "Performance of a contract — art. 6(1)(b)"],
              ["Publishing to your connected social channels", "Performance of a contract — art. 6(1)(b)"],
              ["Handling payment, invoicing and bookkeeping", "Legal obligation and contract — art. 6(1)(c) and (b)"],
              ["Keeping the service stable, preventing abuse and debugging", "Legitimate interest — art. 6(1)(f)"],
              ["Measuring site usage with statistics cookies", "Consent — art. 6(1)(a)"],
            ],
          },
        },
        {
          heading: "AI processing of your content",
          body: [
            "When you request a post, an image or a video, we pass the necessary property data and photos to our AI providers, which generate the content and return it to us.",
            "We use Anthropic (Claude) for post copy and Google (Gemini and Veo) for images and video. Both act as processors on our behalf under terms that do not permit them to use your data to train general-purpose models.",
            "You should not enter sensitive personal data — such as health information, religious beliefs or national ID numbers — into fields that are sent for AI generation. The service is built for marketing properties, not for handling sensitive data.",
          ],
        },
        {
          heading: "Who we share data with",
          body: [
            "We never sell your personal data. We share it only with the providers needed to run the service, and only to the extent they need it:",
          ],
          table: {
            headers: ["Provider", "Role", "Location"],
            rows: [
              ["Supabase", "Database, file storage and login", "EU"],
              ["Vercel", "Hosting and site delivery", "EU/US"],
              ["Stripe", "Payment processing and invoicing", "EU/US"],
              ["Anthropic", "AI generation of post copy", "US"],
              ["Google", "AI images and video (Gemini/Veo) and statistics (Analytics)", "EU/US"],
              ["Meta", "Publishing to Facebook and Instagram", "EU/US"],
            ],
          },
        },
        {
          heading: "Transfers outside the EU/EEA",
          body: [
            "Some of our providers process data in the United States. Those transfers rely on the European Commission's Standard Contractual Clauses and, where the provider is certified, the EU-U.S. Data Privacy Framework.",
            "You can request a copy of the relevant transfer safeguards by writing to us.",
          ],
        },
        {
          heading: "How long we keep it",
          bullets: [
            "Account data and content are kept for as long as your account is active.",
            "When you delete your account, your properties, posts and videos are deleted within 30 days.",
            "Access tokens for social channels are deleted immediately when you disconnect the channel.",
            "Accounting records, including invoices, are kept for 5 years after the end of the financial year they relate to, as required by Danish bookkeeping law.",
            "Operational and security logs are kept for up to 12 months.",
          ],
        },
        {
          heading: "Security",
          body: [
            "All traffic to and from the service is encrypted with TLS. Data in our database is access-restricted per user, so you can only reach your own properties, posts and videos, and passwords are stored hashed — never in plain text.",
            "Access to production systems is limited to the staff who need it. If we discover a breach that poses a risk to your rights, we notify the Danish Data Protection Agency within 72 hours, and you directly where the risk is high.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "Under the GDPR you have a set of rights you can exercise at any time by writing to us. We respond within one month.",
          ],
          bullets: [
            "Access: you can find out what data we hold about you and get a copy.",
            "Rectification: you can have inaccurate data corrected.",
            "Erasure: in many cases you can have your data deleted — you can also delete your account yourself in settings.",
            "Restriction: you can ask us to pause processing temporarily.",
            "Portability: you can receive the data you provided in a machine-readable format.",
            "Objection: you can object to processing based on our legitimate interest.",
            "Withdrawing consent: if you accepted statistics cookies, you can withdraw that at any time — it does not affect the lawfulness of processing before the withdrawal.",
          ],
        },
        {
          heading: "Complaints",
          body: [
            "If you are unhappy with how we handle your data we would like to hear it first — but you can always complain to the Danish Data Protection Agency (Datatilsynet), Carl Jacobsens Vej 35, 2500 Valby, Denmark, dt@datatilsynet.dk, datatilsynet.dk.",
          ],
        },
        {
          heading: "Changes to this policy",
          body: [
            "We update this policy as the service or the law changes. The date at the top shows when it was last revised. For material changes we notify you by email or in the service before they take effect.",
          ],
        },
      ],
    },

    cookiepolitik: {
      title: "Cookie policy",
      metaTitle: "Cookie policy — somevideopost.com",
      metaDescription:
        "Which cookies somevideopost.com uses, what they do, how long they last, and how to give or withdraw your consent.",
      intro:
        "We use as few cookies as possible. The necessary ones are always set, because the service does not work without them. Statistics cookies are set only if you say yes.",
      updated: UPDATED,
      sections: [
        {
          heading: "What a cookie is",
          body: [
            "A cookie is a small text file stored in your browser that the site can read again on your next visit. It can remember that you are logged in, or which language you chose.",
            "We follow the Danish cookie order: necessary cookies may be set without consent, everything else requires your active yes.",
          ],
        },
        {
          heading: "Necessary cookies",
          body: ["These are always set. Without them you cannot log in, and the site cannot remember your choices."],
          table: {
            headers: ["Name", "Purpose", "Duration"],
            rows: [
              ["sb-…-auth-token", "Keeps you signed in to your account (Supabase)", "1 year"],
              ["locale", "Remembers the language you chose", "1 year"],
              ["currency", "Remembers whether you see prices in DKK or EUR", "1 year"],
              ["svp-consent", "Remembers your cookie choice so you are not asked again", "1 year"],
            ],
          },
        },
        {
          heading: "Statistics cookies",
          body: [
            "These are set only if you click “Allow all”. They help us see which pages get used so we can improve them. We use Google Analytics 4 with IP anonymisation.",
          ],
          table: {
            headers: ["Name", "Purpose", "Duration"],
            rows: [
              ["_ga", "Distinguishes between visitors", "2 years"],
              ["_ga_…", "Tracks the individual session", "2 years"],
            ],
          },
        },
        {
          heading: "We do not use marketing cookies",
          body: [
            "We set no cookies for advertising, retargeting or cross-site profiling. Should that change, you would be asked for consent first and this policy would be updated.",
          ],
        },
        {
          heading: "Changing or withdrawing your consent",
          body: [
            "You can change your choice at any time via the “Cookie settings” link at the bottom of any page. Withdraw consent and we stop setting statistics cookies immediately.",
            "You can also delete cookies directly in your browser. Deleting the necessary ones logs you out and resets your language and currency choices.",
          ],
        },
      ],
    },

    handelsbetingelser: {
      title: "Terms of service",
      metaTitle: "Terms of service — somevideopost.com",
      metaDescription:
        "Terms for using somevideopost.com: subscription, paying for presentation videos, right of withdrawal, content rights, liability and cancellation.",
      intro:
        "These terms apply when you create an account on somevideopost.com and buy a subscription or presentation videos. Please read them — they set out what you can expect from us and what we expect from you.",
      updated: UPDATED,
      sections: [
        {
          heading: "Parties and formation of the agreement",
          body: [
            "The agreement is between you as the customer and the company identified at the bottom of this page. It is formed when you create an account and accept these terms.",
            "The service is aimed at people renting out holiday properties, both private individuals and businesses. If you are a consumer, mandatory consumer law applies in addition to these terms.",
          ],
        },
        {
          heading: "What the service covers",
          body: [
            "somevideopost.com lets you add properties, generate marketing content with AI and share it to your connected social channels.",
            "This is an ongoing software service. We keep developing it, and individual features may change, be added or be retired. Material reductions in what you pay for are announced at least 30 days in advance.",
          ],
        },
        {
          heading: "Prices and payment",
          bullets: [
            "Studio access is billed monthly in advance and includes a set number of AI posts each month. Current prices are always shown on the pricing page.",
            "Presentation videos are paid for per video. Payment is taken once the video has been generated and is ready for you.",
            "Unused posts in a month do not carry over to the next.",
            "All prices are shown including VAT for consumers. Business customers are invoiced under the applicable rules.",
            "Payment is handled by Stripe. We do not store your card details.",
            "If a subscription goes unpaid we may pause studio access until payment goes through. Your content is not deleted because of this.",
          ],
        },
        {
          heading: "Right of withdrawal",
          body: [
            "If you are a consumer you generally have 14 days to withdraw from the agreement.",
            "A presentation video is a digital product made specifically for you. When you order one, you expressly consent to delivery beginning immediately and acknowledge that the right of withdrawal lapses once the video has been generated. Until generation starts you can withdraw freely.",
            "For the subscription you can withdraw within 14 days and get your money back, provided you have not used any of the month's posts. If you used some, we deduct their proportionate value.",
            "To withdraw, simply write to us at the email address shown at the bottom of this page.",
          ],
        },
        {
          heading: "Cancellation",
          body: [
            "The subscription has no lock-in and can be cancelled at any time in settings. Cancellation takes effect at the end of the paid period — you keep access until then and we do not charge again.",
            "We may terminate the agreement on 30 days' notice, or without notice if you materially breach these terms, for example by using the service unlawfully.",
          ],
        },
        {
          heading: "Rights to content",
          body: [
            "You keep all rights to the photos, text and property details you upload.",
            "The content the service generates for you — posts, images and videos — is yours to use commercially, including after your subscription ends. You can download it in full resolution.",
            "You grant us a time-limited, non-exclusive right to process and store your material to the extent needed to deliver the service. We do not use your content in our own marketing without asking you first.",
            "The platform itself, its design and its software remain ours.",
          ],
        },
        {
          heading: "Your responsibility for the material you use",
          bullets: [
            "You warrant that you have the right to use the photos and information you upload or fetch from a listing link.",
            "You are responsible for the finished content complying with marketing law and the rules of the platforms you share to.",
            "Always read AI-generated content before you publish it. It can contain errors or inaccuracies about your property.",
            "You must not use the service for unlawful, misleading or infringing content.",
          ],
        },
        {
          heading: "Availability and support",
          body: [
            "We aim to keep the service available around the clock but do not guarantee uninterrupted operation. Planned maintenance is announced where practical.",
            "Support is provided by email on weekdays. We normally reply within two business days.",
            "Video generation depends on external AI providers. If a generation fails we do not charge for it — and if the amount was already taken, we refund it.",
          ],
        },
        {
          heading: "Liability",
          body: [
            "We are liable under the general rules of Danish law, but not for indirect losses, including lost profit, lost bookings or third-party data loss.",
            "Our total liability is limited to the amount you paid us in the 12 months preceding the matter the claim concerns.",
            "None of these limitations apply in cases of intent, gross negligence, or to the extent they conflict with mandatory consumer law.",
          ],
        },
        {
          heading: "Changes to these terms",
          body: [
            "We may change these terms on 30 days' notice by email or in the service. If you disagree with a change you can cancel before it takes effect.",
          ],
        },
        {
          heading: "Complaints and governing law",
          body: [
            "If you are unhappy, write to us first — we will always try to find a solution.",
            "If you are a consumer you can complain to Nævnenes Hus, Toldboden 2, 8800 Viborg, Denmark, or via the European Commission's ODR platform at ec.europa.eu/consumers/odr.",
            "The agreement is governed by Danish law and disputes are settled by the Danish courts, unless mandatory rules provide otherwise.",
          ],
        },
      ],
    },
  },
};
