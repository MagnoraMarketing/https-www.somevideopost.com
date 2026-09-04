import type { LocalisedLegal } from "./types";

const UPDATED = "Senest opdateret 4. september 2026";

export const LEGAL_DA: LocalisedLegal = {
  chrome: {
    contents: "Indhold",
    questionsHeading: "Spørgsmål?",
    questionsBody:
      "Har du spørgsmål til denne politik, eller vil du gøre brug af dine rettigheder, er du altid velkommen til at skrive til os.",
    companyHeading: "Dataansvarlig",
    otherDocs: "Øvrige dokumenter",
  },
  docs: {
    privatlivspolitik: {
      title: "Privatlivspolitik",
      metaTitle: "Privatlivspolitik — somevideopost.com",
      metaDescription:
        "Sådan behandler somevideopost.com dine personoplysninger: hvad vi indsamler, hvorfor, hvem vi deler det med, hvor længe vi gemmer det, og hvilke rettigheder du har efter GDPR.",
      intro:
        "Denne politik beskriver, hvordan vi indsamler og behandler personoplysninger, når du bruger somevideopost.com. Vi holder det så kort og konkret som muligt — du skal kunne se præcis, hvad der sker med dine data.",
      updated: UPDATED,
      sections: [
        {
          heading: "Hvilke oplysninger vi indsamler",
          body: [
            "Vi indsamler kun det, der er nødvendigt for at levere tjenesten. Konkret drejer det sig om:",
          ],
          bullets: [
            "Kontooplysninger: navn og e-mailadresse, som du selv angiver ved oprettelse, samt et krypteret kodeord.",
            "Boligoplysninger: de oplysninger, du indtaster om din bolig, og de data vi henter fra det annoncelink, du indsætter (titel, beskrivelse, billeder, pris, størrelse og beliggenhed).",
            "Indhold du genererer: AI-genererede opslagstekster, billeder og præsentationsvideoer samt de redigeringer, du foretager i dem.",
            "Tilsluttede kanaler: adgangstokens og profilnavne til de sociale konti, du selv vælger at forbinde (Facebook, Instagram, TikTok, LinkedIn, YouTube).",
            "Betalingsoplysninger: abonnementsstatus, købshistorik og kvitteringer. Vi ser aldrig dit fulde kortnummer — det håndteres udelukkende af Stripe.",
            "Tekniske oplysninger: IP-adresse, browsertype, sprogindstilling og hændelser i tjenesten, som bruges til drift, sikkerhed og fejlsøgning.",
            "Statistik: aggregeret brug af hjemmesiden via Google Analytics — kun hvis du har givet samtykke til statistik-cookies.",
          ],
        },
        {
          heading: "Hvorfor vi behandler oplysningerne, og på hvilket grundlag",
          body: [
            "Vi behandler dine oplysninger med et bestemt formål og et retligt grundlag efter databeskyttelsesforordningen (GDPR):",
          ],
          table: {
            headers: ["Formål", "Retligt grundlag"],
            rows: [
              [
                "At oprette og drive din konto og levere de funktioner, du har købt",
                "Opfyldelse af aftale — art. 6, stk. 1, litra b",
              ],
              [
                "At generere opslag, billeder og videoer ud fra dine boligdata",
                "Opfyldelse af aftale — art. 6, stk. 1, litra b",
              ],
              [
                "At publicere til dine tilsluttede sociale kanaler",
                "Opfyldelse af aftale — art. 6, stk. 1, litra b",
              ],
              [
                "At håndtere betaling, fakturering og bogføring",
                "Retlig forpligtelse og aftale — art. 6, stk. 1, litra c og b",
              ],
              [
                "At sikre driftsstabilitet, forebygge misbrug og fejlsøge",
                "Legitim interesse — art. 6, stk. 1, litra f",
              ],
              [
                "At måle brugen af hjemmesiden med statistik-cookies",
                "Samtykke — art. 6, stk. 1, litra a",
              ],
            ],
          },
        },
        {
          heading: "AI-behandling af dit indhold",
          body: [
            "Når du beder om et opslag, et billede eller en video, sender vi de nødvendige boligoplysninger og billeder videre til vores AI-leverandører, som genererer indholdet og returnerer det til os.",
            "Vi bruger Anthropic (Claude) til opslagstekster og Google (Gemini og Veo) til billeder og videoer. Begge leverandører behandler indholdet som databehandlere på vores vegne under betingelser, der ikke tillader dem at bruge dine data til at træne generelle modeller.",
            "Du bør ikke indsætte følsomme personoplysninger — for eksempel oplysninger om helbred, religion eller CPR-numre — i felter, der sendes til AI-generering. Tjenesten er beregnet til markedsføring af boliger, ikke til behandling af følsomme data.",
          ],
        },
        {
          heading: "Hvem vi deler oplysninger med",
          body: [
            "Vi sælger aldrig dine personoplysninger. Vi deler dem udelukkende med de leverandører, der er nødvendige for at drive tjenesten, og kun i det omfang de har brug for dem:",
          ],
          table: {
            headers: ["Leverandør", "Rolle", "Placering"],
            rows: [
              ["Supabase", "Database, filopbevaring og login", "EU"],
              ["Vercel", "Hosting og levering af hjemmesiden", "EU/USA"],
              ["Stripe", "Betalingsbehandling og fakturering", "EU/USA"],
              ["Anthropic", "AI-generering af opslagstekster", "USA"],
              ["Google", "AI-billeder og -video (Gemini/Veo) samt statistik (Analytics)", "EU/USA"],
              ["Meta", "Publicering til Facebook og Instagram", "EU/USA"],
            ],
          },
        },
        {
          heading: "Overførsel til lande uden for EU/EØS",
          body: [
            "Nogle af vores leverandører behandler data i USA. Overførslen sker på grundlag af EU-Kommissionens standardkontraktbestemmelser og, hvor leverandøren er certificeret, EU-U.S. Data Privacy Framework.",
            "Du kan få en kopi af det relevante overførselsgrundlag ved at skrive til os.",
          ],
        },
        {
          heading: "Hvor længe vi gemmer oplysningerne",
          bullets: [
            "Kontooplysninger og indhold gemmes, så længe din konto er aktiv.",
            "Når du sletter din konto, slettes dine boliger, opslag og videoer inden for 30 dage.",
            "Adgangstokens til sociale kanaler slettes straks, når du frakobler kanalen.",
            "Bogføringsmateriale, herunder fakturaer, opbevares i 5 år efter udgangen af det regnskabsår, det vedrører, jf. bogføringsloven.",
            "Logdata til drift og sikkerhed opbevares i op til 12 måneder.",
          ],
        },
        {
          heading: "Sikkerhed",
          body: [
            "Al trafik til og fra tjenesten er krypteret med TLS. Data i vores database er adgangsbegrænset pr. bruger, så du kun kan tilgå dine egne boliger, opslag og videoer, og kodeord opbevares hashet — aldrig i klartekst.",
            "Adgang til produktionssystemer er begrænset til det nødvendige personale. Opdager vi et sikkerhedsbrud, der indebærer en risiko for dine rettigheder, underretter vi Datatilsynet inden 72 timer og dig direkte, hvis risikoen er høj.",
          ],
        },
        {
          heading: "Dine rettigheder",
          body: [
            "Efter databeskyttelsesforordningen har du en række rettigheder, som du altid kan gøre brug af ved at skrive til os. Vi svarer inden for en måned.",
          ],
          bullets: [
            "Indsigt: du kan få at vide, hvilke oplysninger vi behandler om dig, og få en kopi.",
            "Berigtigelse: du kan få rettet forkerte oplysninger.",
            "Sletning: du kan i mange tilfælde få slettet dine oplysninger — du kan også selv slette din konto i indstillingerne.",
            "Begrænsning: du kan bede os om midlertidigt at stoppe behandlingen.",
            "Dataportabilitet: du kan få de oplysninger, du selv har givet os, udleveret i et maskinlæsbart format.",
            "Indsigelse: du kan gøre indsigelse mod behandling, der sker på grundlag af vores legitime interesse.",
            "Tilbagekaldelse af samtykke: har du sagt ja til statistik-cookies, kan du til enhver tid trække det tilbage — det påvirker ikke lovligheden af behandlingen forud for tilbagekaldelsen.",
          ],
        },
        {
          heading: "Klage",
          body: [
            "Er du utilfreds med, hvordan vi behandler dine oplysninger, hører vi det gerne først — men du kan altid klage til Datatilsynet, Carl Jacobsens Vej 35, 2500 Valby, dt@datatilsynet.dk, datatilsynet.dk.",
          ],
        },
        {
          heading: "Ændringer i politikken",
          body: [
            "Vi opdaterer politikken, når tjenesten eller lovgivningen ændrer sig. Datoen øverst viser, hvornår den senest er ændret. Ved væsentlige ændringer giver vi besked på e-mail eller i tjenesten, før de træder i kraft.",
          ],
        },
      ],
    },

    cookiepolitik: {
      title: "Cookiepolitik",
      metaTitle: "Cookiepolitik — somevideopost.com",
      metaDescription:
        "Hvilke cookies somevideopost.com bruger, hvad de gør, hvor længe de gemmes, og hvordan du giver eller trækker dit samtykke tilbage.",
      intro:
        "Vi bruger så få cookies som muligt. De nødvendige sættes altid, fordi tjenesten ikke fungerer uden dem. Statistik-cookies sættes kun, hvis du siger ja.",
      updated: UPDATED,
      sections: [
        {
          heading: "Hvad en cookie er",
          body: [
            "En cookie er en lille tekstfil, som gemmes i din browser, og som hjemmesiden kan læse igen ved næste besøg. Den kan for eksempel huske, at du er logget ind, eller hvilket sprog du har valgt.",
            "Vi bruger reglerne i cookiebekendtgørelsen: nødvendige cookies må sættes uden samtykke, alle andre kræver dit aktive ja.",
          ],
        },
        {
          heading: "Nødvendige cookies",
          body: [
            "Disse sættes altid. Uden dem kan du ikke logge ind, og siden kan ikke huske dine valg.",
          ],
          table: {
            headers: ["Navn", "Formål", "Varighed"],
            rows: [
              ["sb-…-auth-token", "Holder dig logget ind på din konto (Supabase)", "1 år"],
              ["locale", "Husker det sprog, du har valgt", "1 år"],
              ["currency", "Husker om du ser priser i DKK eller EUR", "1 år"],
              ["svp-consent", "Husker dit cookievalg, så du ikke bliver spurgt igen", "1 år"],
            ],
          },
        },
        {
          heading: "Statistik-cookies",
          body: [
            "Disse sættes kun, hvis du trykker ‚Tillad alle’. De hjælper os med at se, hvilke sider der bliver brugt, så vi kan forbedre dem. Vi bruger Google Analytics 4 med IP-anonymisering.",
          ],
          table: {
            headers: ["Navn", "Formål", "Varighed"],
            rows: [
              ["_ga", "Skelner mellem besøgende", "2 år"],
              ["_ga_…", "Holder styr på den enkelte session", "2 år"],
            ],
          },
        },
        {
          heading: "Vi bruger ikke marketing-cookies",
          body: [
            "Vi sætter ikke cookies til annoncering, retargeting eller profilering på tværs af hjemmesider. Skulle det ændre sig, vil du blive spurgt om samtykke først, og denne politik bliver opdateret.",
          ],
        },
        {
          heading: "Sådan ændrer eller trækker du dit samtykke tilbage",
          body: [
            "Du kan til enhver tid ændre dit valg via linket ‚Cookieindstillinger’ nederst på siden. Trækker du samtykket tilbage, stopper vi med at sætte statistik-cookies med det samme.",
            "Du kan også slette cookies direkte i din browser. Sletter du de nødvendige cookies, bliver du logget ud, og dine sprog- og valutavalg nulstilles.",
          ],
        },
      ],
    },

    handelsbetingelser: {
      title: "Handelsbetingelser",
      metaTitle: "Handelsbetingelser — somevideopost.com",
      metaDescription:
        "Vilkår for brug af somevideopost.com: abonnement, betaling for præsentationsvideoer, fortrydelsesret, rettigheder til indhold, ansvar og opsigelse.",
      intro:
        "Disse betingelser gælder, når du opretter en konto på somevideopost.com og køber abonnement eller præsentationsvideoer. Læs dem igennem — de beskriver, hvad du kan forvente af os, og hvad vi forventer af dig.",
      updated: UPDATED,
      sections: [
        {
          heading: "Aftalens parter og indgåelse",
          body: [
            "Aftalen indgås mellem dig som kunde og det selskab, der er angivet nederst på denne side. Aftalen er indgået, når du opretter en konto og accepterer disse betingelser.",
            "Tjenesten henvender sig til udlejere af ferieboliger — både private og erhvervsdrivende. Er du forbruger, gælder de ufravigelige forbrugerregler i tillæg til disse betingelser.",
          ],
        },
        {
          heading: "Hvad tjenesten omfatter",
          body: [
            "somevideopost.com giver dig adgang til at oprette boliger, generere markedsføringsindhold med AI og dele det til dine tilsluttede sociale kanaler.",
            "Tjenesten er en løbende softwaretjeneste. Vi udvikler den fortsat, og enkelte funktioner kan blive ændret, tilføjet eller udfaset. Væsentlige forringelser af det, du betaler for, varsles med mindst 30 dage.",
          ],
        },
        {
          heading: "Priser og betaling",
          bullets: [
            "Studie-adgang faktureres månedligt forud og giver et fast antal AI-opslag hver måned. De aktuelle priser fremgår altid af prissiden.",
            "Præsentationsvideoer betales pr. styk. Betalingen opkræves, når videoen er genereret og klar til dig.",
            "Ubrugte opslag i en måned overføres ikke til den næste.",
            "Alle priser vises inklusive moms for forbrugere. Erhvervskunder faktureres efter gældende regler.",
            "Betaling håndteres af Stripe. Vi opbevarer ikke dine kortoplysninger.",
            "Betales et abonnement ikke, kan vi sætte adgangen til studiet på pause, indtil betalingen er gennemført. Dit indhold slettes ikke af den grund.",
          ],
        },
        {
          heading: "Fortrydelsesret",
          body: [
            "Er du forbruger, har du som udgangspunkt 14 dages fortrydelsesret fra aftalens indgåelse.",
            "For præsentationsvideoer leveres et digitalt produkt, der fremstilles specifikt til dig. Når du bestiller en video, giver du udtrykkeligt samtykke til, at leveringen begynder straks, og du anerkender, at fortrydelsesretten bortfalder, når videoen er genereret. Indtil generering er sat i gang, kan du frit fortryde.",
            "For abonnementet kan du fortryde inden for 14 dage og få det betalte beløb tilbage, forudsat at du ikke har brugt af månedens opslag. Har du brugt en del af dem, modregner vi den forholdsmæssige værdi.",
            "Vil du fortryde, skriver du blot til os på den e-mailadresse, der står nederst på siden.",
          ],
        },
        {
          heading: "Opsigelse",
          body: [
            "Abonnementet er uden binding og kan opsiges når som helst i indstillingerne. Opsigelsen får virkning ved udgangen af den betalte periode — du beholder adgangen indtil da, og vi opkræver ikke igen.",
            "Vi kan opsige aftalen med 30 dages varsel eller uden varsel, hvis du væsentligt misligholder betingelserne, for eksempel ved at bruge tjenesten ulovligt.",
          ],
        },
        {
          heading: "Rettigheder til indhold",
          body: [
            "Du beholder alle rettigheder til de billeder, tekster og boligoplysninger, du selv lægger op.",
            "Det indhold, tjenesten genererer til dig — opslag, billeder og videoer — må du frit bruge kommercielt, herunder efter at dit abonnement er ophørt. Du kan downloade det i fuld opløsning.",
            "Du giver os en tidsbegrænset, ikke-eksklusiv ret til at behandle og lagre dit materiale i det omfang, det er nødvendigt for at levere tjenesten. Vi bruger ikke dit indhold til markedsføring uden at spørge dig først.",
            "Selve platformen, dens design og software tilhører os.",
          ],
        },
        {
          heading: "Dit ansvar for det materiale, du bruger",
          bullets: [
            "Du indestår for, at du har ret til at bruge de billeder og oplysninger, du lægger op eller henter fra et annoncelink.",
            "Du er ansvarlig for, at det færdige indhold overholder markedsføringsloven og reglerne på de platforme, du deler til.",
            "AI-genereret indhold skal altid gennemlæses, før du udgiver det. Det kan indeholde fejl eller unøjagtigheder om din bolig.",
            "Du må ikke bruge tjenesten til ulovligt, vildledende eller krænkende indhold.",
          ],
        },
        {
          heading: "Tilgængelighed og support",
          body: [
            "Vi tilstræber, at tjenesten er tilgængelig døgnet rundt, men garanterer ikke uafbrudt drift. Planlagt vedligeholdelse varsles, når det er praktisk muligt.",
            "Support ydes på e-mail på hverdage. Vi svarer normalt inden for to arbejdsdage.",
            "Generering af videoer afhænger af eksterne AI-leverandører. Mislykkes en generering, opkræver vi ikke for den — og er beløbet allerede trukket, refunderer vi det.",
          ],
        },
        {
          heading: "Ansvar",
          body: [
            "Vi er ansvarlige efter dansk rets almindelige regler, men ikke for indirekte tab, herunder tabt fortjeneste, mistede bookinger eller tab af data hos tredjeparter.",
            "Vores samlede ansvar er begrænset til det beløb, du har betalt til os i de 12 måneder, der går forud for det forhold, kravet vedrører.",
            "Ingen af begrænsningerne gælder ved forsæt, grov uagtsomhed eller i det omfang de strider mod ufravigelige forbrugerregler.",
          ],
        },
        {
          heading: "Ændring af betingelserne",
          body: [
            "Vi kan ændre betingelserne med 30 dages varsel på e-mail eller i tjenesten. Er du ikke enig i ændringen, kan du opsige inden den træder i kraft.",
          ],
        },
        {
          heading: "Klage og lovvalg",
          body: [
            "Er du utilfreds, så skriv til os først — vi vil altid forsøge at finde en løsning.",
            "Er du forbruger, kan du klage til Nævnenes Hus, Toldboden 2, 8800 Viborg, eller via EU-Kommissionens klageportal på ec.europa.eu/consumers/odr.",
            "Aftalen er underlagt dansk ret, og tvister afgøres ved de danske domstole, medmindre ufravigelige regler bestemmer andet.",
          ],
        },
      ],
    },
  },
};
