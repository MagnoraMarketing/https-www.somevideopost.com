import { Video, Home, Building, Hotel, Megaphone, type LucideIcon } from "lucide-react";

export type BlogCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  iconBg: string;
  description: string;
  tag?: string;
};

export type ArticleSection = { heading: string; paragraphs: string[] };

export type BlogPost = {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  type?: string;
  /** Hand-authored article body. Falls back to a generic template when omitted. */
  body?: ArticleSection[];
  /** Optional callout linking to a relevant product/pillar page for internal linking. */
  relatedTool?: { href: string; label: string; blurb: string };
};

export const CATEGORIES: BlogCategory[] = [
  {
    id: "feriebolig",
    label: "Feriebolig",
    icon: Home,
    color: "#FF6B4A",
    bg: "bg-orange-50",
    border: "border-orange-200",
    iconBg: "bg-orange-100",
    description: "Tips og tricks til din feriebolig",
  },
  {
    id: "privat-udlejning",
    label: "Privat udlejning",
    icon: Building,
    color: "#1B3F7A",
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    description: "Råd til private udlejere",
  },
  {
    id: "hotel",
    label: "Hotel & Overnatning",
    icon: Hotel,
    color: "#0A66C2",
    bg: "bg-sky-50",
    border: "border-sky-200",
    iconBg: "bg-sky-100",
    description: "Marketing for hoteller og B&B",
  },
  {
    id: "some-opslag",
    label: "SOME Opslag",
    icon: Megaphone,
    color: "#7C3AED",
    bg: "bg-purple-50",
    border: "border-purple-200",
    iconBg: "bg-purple-100",
    description: "AI-genererede sociale medie-opslag",
    tag: "SOME POST",
  },
  {
    id: "video-marketing",
    label: "Video Marketing",
    icon: Video,
    color: "#059669",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconBg: "bg-emerald-100",
    description: "Præsentationsvideoer med AI",
    tag: "VIDEO GEN",
  },
];

export const POSTS: BlogPost[] = [
  // ── Feriebolig ──
  {
    id: 1,
    category: "feriebolig",
    title: "5 ting gæster kigger efter i en feriebolig-annonce",
    excerpt: "Billeder, beliggenhed, anmeldelser og pris er de fire første ting en potentiel gæst vurderer. Den femte overrasker de fleste udlejere.",
    readTime: "4 min",
    date: "2026-05-18",
  },
  {
    id: 2,
    category: "feriebolig",
    title: "Sådan prissætter du din feriebolig til højsæson",
    excerpt: "Dynamisk prissætning kan øge din omsætning med op til 40 %. Her er en simpel model du kan implementere uden dyrt software.",
    readTime: "6 min",
    date: "2025-07-03",
  },
  {
    id: 3,
    category: "feriebolig",
    title: "De bedste platforme til udlejning af feriebolig i 2024",
    excerpt: "Airbnb, Booking.com, VRBO eller Novasol — vi gennemgår fordele og ulemper ved hver platform og hvilke typer boliger de egner sig til.",
    readTime: "8 min",
    date: "2024-04-11",
  },
  {
    id: 4,
    category: "feriebolig",
    title: "Hvad du skal vide om skat ved udlejning af din feriebolig",
    excerpt: "Bundfradrag, lejeindtægt og hvornår du skal momsregistreres. En praktisk guide til ferieboligudlejers skatteregler i Danmark.",
    readTime: "7 min",
    date: "2023-09-28",
  },

  // ── Privat udlejning ──
  {
    id: 5,
    category: "privat-udlejning",
    title: "Lejekontrakt til privat udlejning: hvad skal den indeholde?",
    excerpt: "En gyldig lejekontrakt beskytter både dig og din lejer. Her er de 8 punkter der altid skal med — og de 3 fejl de fleste laver.",
    readTime: "5 min",
    date: "2026-03-14",
  },
  {
    id: 6,
    category: "privat-udlejning",
    title: "Sådan finder du de rigtige lejere til din bolig",
    excerpt: "Fra opslag til fremvisning og screening — en trin-for-trin guide til at finde pålidelige lejere der passer på din bolig.",
    readTime: "6 min",
    date: "2025-02-20",
  },
  {
    id: 7,
    category: "privat-udlejning",
    title: "Huslejens størrelse: hvad må du opkræve?",
    excerpt: "Lejeloven sætter grænser for huslejen i visse ejendomme. Lær forskellen på fri lejefastsættelse og omkostningsbestemt leje.",
    readTime: "5 min",
    date: "2024-08-07",
  },
  {
    id: 8,
    category: "privat-udlejning",
    title: "Vedligeholdelse af udlejningsbolig: udlejerens pligter",
    excerpt: "Hvem betaler hvad? En klar opdeling af udlejers og lejers vedligeholdelsespligt — og hvad du risikerer hvis du forsømmer den.",
    readTime: "4 min",
    date: "2023-11-15",
  },

  // ── Hotel ──
  {
    id: 9,
    category: "hotel",
    title: "Direkte bookinger vs. OTA: sådan vinder du som lille hotel",
    excerpt: "Booking.com og Expedia tager 15-25 % i provision. Her er strategierne der hjælper uafhængige hoteller med at vinde direkte bookinger.",
    readTime: "7 min",
    date: "2026-04-02",
  },
  {
    id: 10,
    category: "hotel",
    title: "Social proof der virker: anmeldelser og UGC for hotellet",
    excerpt: "Gæsters billeder og anmeldelser er det mest effektive marketingmateriale du har. Sådan indsamler og bruger du dem strategisk.",
    readTime: "5 min",
    date: "2025-10-22",
  },
  {
    id: 11,
    category: "hotel",
    title: "Sæsonudjævning: sådan fylder du hotellet i lavsæson",
    excerpt: "Pakketilbud, lokale partnerskaber og målrettet annoncering er nøglerne til at skabe omsætning hele året — ikke kun i højsæson.",
    readTime: "6 min",
    date: "2024-12-05",
  },
  {
    id: 12,
    category: "hotel",
    title: "Instagram og Facebook for hoteller: hvad virker i dag?",
    excerpt: "Algoritmerne ændrer sig konstant. Vi dykker ned i hvad der faktisk skaber organisk rækkevidde og bookinger fra sociale medier i dag.",
    readTime: "6 min",
    date: "2023-06-19",
  },

  // ── SOME Opslag ──
  {
    id: 13,
    category: "some-opslag",
    title: "Hvorfor AI-genererede opslag konverterer bedre end manuelt skrevne",
    excerpt: "AI analyserer annoncens data og skriver tekst der er optimeret til platformen — med den rette tone, længde og hashtags. Her er tallene der beviser det.",
    readTime: "4 min",
    date: "2026-06-10",
    type: "SOME POST",
  },
  {
    id: 14,
    category: "some-opslag",
    title: "Facebook vs. LinkedIn vs. Instagram: hvilken platform til din bolig?",
    excerpt: "Hver platform har sin tone. Facebook elsker emojis og lokal stemning. LinkedIn vil have professionel investorhistorie. Instagram kræver visuelt fokus og hashtags.",
    readTime: "5 min",
    date: "2025-05-08",
    type: "SOME POST",
  },
  {
    id: 15,
    category: "some-opslag",
    title: "Fra boliglink til færdigt opslag på 30 sekunder",
    excerpt: "Indsæt linket til din Airbnb- eller Booking.com-annonce — AI henter billeder, pris, placering og størrelse og skriver et sælgende opslag til alle platforme.",
    readTime: "3 min",
    date: "2024-11-17",
    type: "SOME POST",
  },
  {
    id: 16,
    category: "some-opslag",
    title: "Hvornår på dagen skal du poste din boligannonce?",
    excerpt: "Tidspunktet kan betyde op til 3x mere rækkevidde. Vi gennemgår de bedste tidspunkter for Facebook, Instagram og LinkedIn baseret på aktuelle data.",
    readTime: "4 min",
    date: "2023-08-30",
    type: "SOME POST",
  },

  // ── Video Marketing ──
  {
    id: 17,
    category: "video-marketing",
    title: "Præsentationsvideoer øger bookinger med op til 80 %",
    excerpt: "Boliger med video i annoncen ses markant længere og har højere klikrate. AI-genererede præsentationsvideoer giver nu alle udlejere adgang til dette format.",
    readTime: "5 min",
    date: "2026-06-25",
    type: "VIDEO GEN",
  },
  {
    id: 18,
    category: "video-marketing",
    title: "Cinematisk video af din bolig: fra billeder til færdig film på 15 min",
    excerpt: "Upload dine boligfotos — AI tilføjer professionelle kamerabevægelser, flydende overgange og musik. Videoen leveres direkte i appen klar til deling.",
    readTime: "4 min",
    date: "2025-09-01",
    type: "VIDEO GEN",
  },
  {
    id: 19,
    category: "video-marketing",
    title: "Del din boligvideo på Facebook, Instagram og YouTube",
    excerpt: "Ét klik deler din præsentationsvideo til alle platforme. Vi viser dig hvordan du optimerer videoen til hvert format og maksimerer din organiske rækkevidde.",
    readTime: "5 min",
    date: "2024-03-14",
    type: "VIDEO GEN",
  },
  {
    id: 20,
    category: "video-marketing",
    title: "Fotoruten der sælger: hvilke rum skal med i din boligvideo?",
    excerpt: "Rækkefølgen af rum i din præsentationsvideo har stor indflydelse på seernes engagement. Her er den optimale fotorute baseret på data fra hundredvis af udlejere.",
    readTime: "4 min",
    date: "2023-04-06",
    type: "VIDEO GEN",
  },

  // ── Feriebolig (fortsat) ──
  {
    id: 21,
    category: "feriebolig",
    title: "Sådan skriver du en boligannonce der konverterer besøgende til bookinger",
    excerpt: "De fleste gæster læser ikke hele annoncen — de skimmer. Sådan strukturerer du teksten, så de vigtigste salgsargumenter rammer i de første tre sekunder.",
    readTime: "6 min",
    date: "2026-02-11",
    body: [
      {
        heading: "Skimning, ikke læsning",
        paragraphs: [
          "Undersøgelser af gæsteadfærd på Airbnb og Booking.com viser, at de fleste besøgende bruger under 8 sekunder på at afgøre, om en annonce er interessant. De læser ikke — de skimmer overskrift, første linje og billeder. Din opgave er derfor ikke at skrive den mest udførlige beskrivelse, men den mest scanbare.",
          "Det betyder: læg dit stærkeste salgsargument i den allerførste sætning, ikke i afsnit tre. Er det havudsigten? Gåafstand til centrum? Den nyrenoverede stue? Sig det med det samme.",
        ],
      },
      {
        heading: "Strukturen der virker",
        paragraphs: [
          "Byg teksten som en omvendt pyramide: start med det unikke, følg op med de konkrete fakta (soveværelser, faciliteter, beliggenhed), og slut med stemningen — hvordan et ophold hos dig føles. Brug korte afsnit og gerne bullet points til faciliteter, så teksten er let at skimme på mobil.",
          "Undgå generiske vendinger som \"hyggeligt hjem\" eller \"perfekt til hele familien\" — de siger intet og bruges i tusindvis af andre annoncer. Vær konkret: \"Gåafstand på 4 minutter til stranden\" slår \"tæt på stranden\" hver gang.",
        ],
      },
      {
        heading: "Lad AI gøre det tunge arbejde",
        paragraphs: [
          "Med somevideopost.com behøver du ikke starte fra et blankt ark. Indsæt linket til din eksisterende annonce, og AI analyserer billeder og fakta og genererer et sælgende opslag tilpasset den platform, du deler det på — med den rette struktur, længde og tone fra start.",
          "Du kan altid style teksten bagefter, men det giver dig et stærkt udgangspunkt på under et minut i stedet for at stirre på et tomt tekstfelt.",
        ],
      },
    ],
  },
  {
    id: 22,
    category: "feriebolig",
    title: "SEO til din feriebolig-annonce: sådan bliver du fundet på Google og Airbnb",
    excerpt: "Airbnb og Google rangerer annoncer forskelligt, men begge belønner opdateret indhold, relevante søgeord og høj svarprocent. Her er de faktorer der faktisk flytter noget.",
    readTime: "7 min",
    date: "2025-11-04",
    body: [
      {
        heading: "To forskellige algoritmer, ét princip",
        paragraphs: [
          "Airbnbs søgealgoritme og Googles er ikke det samme, men de deler et grundprincip: relevans og aktivitet slår statiske annoncer. Airbnb kigger på svarprocent, opdateringsfrekvens, anmeldelser og hvor ofte din kalender er opdateret. Google kigger på nøgleord, struktureret indhold og hvor ofte siden ændrer sig.",
          "Det gode budskab er, at de samme handlinger typisk forbedrer begge: en annonce du plejer aktivt, med præcise og opdaterede oplysninger, klarer sig bedre begge steder.",
        ],
      },
      {
        heading: "Konkrete søgeord der batter",
        paragraphs: [
          "Tænk som en gæst, ikke som en udlejer. I stedet for \"dejlig feriebolig\" — brug de faktiske søgetermer folk taster: byen, bydelen, antal soveværelser, og specifikke faciliteter som \"pool\", \"hund tilladt\" eller \"gåafstand til stranden\". Disse fraser matcher direkte det, folk søger efter.",
          "Hvis du har egen hjemmeside eller landingsside for boligen, så brug samme nøgleord i overskrifter (H1/H2) og i den synlige tekst — ikke kun i metadata, som Google vægter lavere end faktisk indhold.",
        ],
      },
      {
        heading: "Aktivitet er en rangeringsfaktor",
        paragraphs: [
          "Opdater billeder og priser løbende, svar hurtigt på forespørgsler, og hold kalenderen ajour. Platforme straffer inaktive annoncer i søgeresultaterne, uanset hvor god teksten er.",
          "En præsentationsvideo tilføjer også friskt indhold — og videoer har generelt højere engagement end statiske billeder, hvilket kan hjælpe med at holde besøgende længere på siden.",
        ],
      },
    ],
  },
  {
    id: 23,
    category: "feriebolig",
    title: "Fotografering af feriebolig: sådan tager du billeder der sælger — uden professionelt udstyr",
    excerpt: "Du behøver ikke et dyrt kamera for at tage billeder, der konverterer. Lys, vinkler og komposition betyder mere end udstyr — her er reglerne professionelle boligfotografer bruger.",
    readTime: "5 min",
    date: "2025-06-30",
    body: [
      {
        heading: "Lys slår udstyr",
        paragraphs: [
          "Den enkeltvis vigtigste faktor for et godt boligbillede er lys — ikke kameraets megapixel-antal. Fotografer i dagslys, med gardiner trukket fra, og undgå direkte skarpt sollys midt på dagen, som skaber hårde skygger. De bedste tidspunkter er typisk formiddag og sen eftermiddag, det såkaldte \"gyldne lys\".",
          "Sluk alt kunstigt lys, medmindre det er nødvendigt — blandet lyskilde (dagslys + lampe) giver ofte et gulligt, uklart resultat på billeder taget med en telefon.",
        ],
      },
      {
        heading: "Vinkler og komposition",
        paragraphs: [
          "Fotografer rum fra et hjørne, ikke lige fra døråbningen — det giver dybde og viser mere af rummet. Hold kameraet i brysthøjde, ikke i øjenhøjde stående op, da det giver et mere naturligt perspektiv, der matcher, hvordan gæster faktisk oplever rummet.",
          "Ryd op før du fotograferer: fjern ledninger, opvask og personlige genstande. Et minimalistisk rum fotograferer altid bedre end et fyldt et — selv hvis boligen normalt er hyggeligt rodet.",
        ],
      },
      {
        heading: "Fra stillbilleder til levende indhold",
        paragraphs: [
          "Gode stillbilleder er fundamentet, men video konverterer bedre end billeder alene, fordi det giver gæsten en fornemmelse af flow mellem rummene. Du behøver ikke lære videoredigering for at få det: upload dine bedste fotos til somevideopost.com, og AI'en bygger en cinematisk præsentationsvideo med kamerabevægelser og overgange automatisk.",
          "Det betyder, at det samme fotosæt, du allerede har taget, kan genbruges til både din boligannonce og en video til sociale medier.",
        ],
      },
    ],
  },
  {
    id: 24,
    category: "feriebolig",
    title: "Feriebolig om vinteren: sådan holder du bookingerne oppe i lavsæson",
    excerpt: "Lavsæson behøver ikke betyde tom kalender. Prisstrategi, målgruppe-skift og synlighed på de rette platforme kan holde din feriebolig booket hele året.",
    readTime: "6 min",
    date: "2024-01-19",
    body: [
      {
        heading: "Skift målgruppe, ikke kun pris",
        paragraphs: [
          "Den mest almindelige fejl i lavsæson er kun at sænke prisen og håbe på det bedste. Men lavsæson tiltrækker en anden type gæst: fjernarbejdere, weekendpar og lokale, der søger et miljøskifte frem for badeferie. Tilpas din annoncetekst til dem — fremhæv arbejdsplads, hyggelig atmosfære eller nærhed til vinteraktiviteter, ikke havudsigt og pool.",
          "En moderat prisreduktion kombineret med en tydeligt anderledes annoncetekst virker bedre end en stor rabat med samme sommertekst.",
        ],
      },
      {
        heading: "Pakker og mindstevarighed",
        paragraphs: [
          "Overvej at tilbyde ugepakker eller \"workation\"-rabatter i lavsæson. Længere ophold betyder færre skift af gæster og lavere rengøringsomkostninger relativt til indtægten, samtidig med at det appellerer til den type gæster, der rejser om vinteren.",
          "Sænk også din mindste opholdslængde i lavsæson, hvis du normalt kræver en uge — kortere ophold øger antallet af potentielle bookinger markant, når efterspørgslen i forvejen er lavere.",
        ],
      },
      {
        heading: "Bliv ved med at være synlig",
        paragraphs: [
          "Mange udlejere går i dvale på sociale medier om vinteren, netop når konkurrencen om opmærksomhed falder. Det er faktisk en fordel: der er mindre støj, så dine opslag har bedre chance for at blive set. Fortsæt med at poste jævnligt — sæsonbilleder, lokale events eller en opdateret præsentationsvideo holder din bolig top of mind, når gæsterne begynder at planlægge næste sommers ferie.",
        ],
      },
    ],
  },

  // ── Privat udlejning (fortsat) ──
  {
    id: 25,
    category: "privat-udlejning",
    title: "Depositum ved udlejning: regler, størrelse og tilbagebetaling",
    excerpt: "Depositum beskytter dig som udlejer, men reglerne for størrelse og tilbagebetaling er strammere, end mange tror. Her er, hvad du skal vide for at gøre det korrekt.",
    readTime: "5 min",
    date: "2025-12-02",
    body: [
      {
        heading: "Hvor meget må du opkræve?",
        paragraphs: [
          "Ved almindelig boligudlejning i Danmark må depositum typisk maksimalt udgøre 3 måneders leje, og du kan derudover opkræve op til 3 måneders forudbetalt leje — samlet altså op til 6 måneders leje ved indflytning. Reglerne kan variere afhængigt af lejemålets type, så tjek altid den konkrete lejelov, der gælder for din bolig.",
          "Depositum skal fremgå eksplicit af lejekontrakten med beløb og formål — det kan ikke opkræves som et løst, mundtligt aftalt beløb.",
        ],
      },
      {
        heading: "Hvad depositum må dække",
        paragraphs: [
          "Depositum er ikke \"din\" opsparing — det er lejerens penge, som du forvalter, og det må kun bruges til at dække udgifter, lejeren reelt er ansvarlig for: skader ud over almindelig slid, manglende husleje eller udgifter til istandsættelse, som kontrakten berettiger.",
          "Almindelig slitage — som falmede vægge eller lettere slid på gulve — må ikke trækkes fra depositum. Det er en af de hyppigste kilder til tvister mellem udlejer og lejer.",
        ],
      },
      {
        heading: "Tilbagebetaling uden konflikt",
        paragraphs: [
          "Lav altid en indflytningsrapport med billeder ved lejemålets start, og en tilsvarende fraflytningsrapport ved afslutning. Det gør det langt lettere at dokumentere, hvad der er egentlig skade, og hvad der er normal slitage — og reducerer risikoen for en tvist ved Huslejenævnet.",
          "Overhold fristerne for tilbagebetaling eller begrundet tilbageholdelse af depositum, som er fastsat i lejeloven — en forsinket eller udokumenteret afgørelse kan koste dig retten til at tilbageholde beløbet, uanset om kravet i øvrigt var berettiget.",
        ],
      },
    ],
  },
  {
    id: 26,
    category: "privat-udlejning",
    title: "5 klassiske fejl førstegangsudlejere begår — og hvordan du undgår dem",
    excerpt: "De fleste udlejningsproblemer starter, før lejeren overhovedet flytter ind. Her er de fejl der går igen, og hvordan du undgår dem fra start.",
    readTime: "6 min",
    date: "2024-10-08",
    body: [
      {
        heading: "1–2: Manglende screening og mundtlige aftaler",
        paragraphs: [
          "Den hyppigste fejl er at springe screeningen over, fordi en potentiel lejer virker sympatisk ved fremvisningen. Bed altid om referencer, dokumentation for indkomst, og tjek om muligt lejerens historik. Et godt førstehåndsindtryk er ikke en erstatning for due diligence.",
          "Den næsthyppigste fejl er mundtlige aftaler — \"vi finder ud af det\", når det gælder husdyr, fremleje eller varsler. Alt, der betyder noget, skal stå i lejekontrakten. Mundtlige aftaler er svære at bevise og skaber konflikter senere.",
        ],
      },
      {
        heading: "3–4: Uklar vedligeholdelsesfordeling og for lav husleje",
        paragraphs: [
          "Mange nye udlejere glemmer at specificere, hvem der betaler for hvad ved skader, hvidevarer og udvendig vedligeholdelse. Uklarhed her fører næsten altid til konflikt ved fraflytning. Skriv det eksplicit i kontrakten, selv de ting der virker indlysende.",
          "Den fjerde fejl er at sætte huslejen for lavt af frygt for tomgang. Undersøg det lokale marked grundigt — en for lav husleje er svær at hæve senere og kan gøre det svært at dække udgifter, hvis noget uventet opstår.",
        ],
      },
      {
        heading: "5: Ingen strategi for markedsføring",
        paragraphs: [
          "Den sidste fejl er at annoncere boligen ét sted med dårlige billeder og håbe på det bedste. Jo flere kvalificerede ansøgere du har at vælge imellem, desto bedre kan du screene og finde den rette lejer. Del din annonce bredt — inklusiv sociale medier — med gode billeder eller en kort video, der viser boligen tydeligt.",
        ],
      },
    ],
  },
  {
    id: 27,
    category: "privat-udlejning",
    title: "Digital lejekontrakt og MitID-underskrift: er det gyldigt?",
    excerpt: "Ja — en digitalt underskrevet lejekontrakt er lige så gyldig som en på papir, forudsat at underskriften kan verificeres. Her er, hvad du skal være opmærksom på.",
    readTime: "4 min",
    date: "2023-12-27",
    body: [
      {
        heading: "Digital signatur er juridisk bindende",
        paragraphs: [
          "En lejekontrakt underskrevet digitalt med MitID eller en anden anerkendt digital signaturløsning er juridisk bindende på lige fod med en fysisk underskrift i Danmark. Det afgørende er, at underskriften kan spores og verificeres til den rette person — ikke hvilket medie kontrakten er underskrevet i.",
          "De fleste digitale signeringstjenester genererer automatisk et tidsstemplet bevis for, hvem der har underskrevet, og hvornår — hvilket faktisk kan gøre det lettere at dokumentere end en papirkontrakt, hvis der senere opstår tvivl.",
        ],
      },
      {
        heading: "Hvad du stadig skal sikre dig",
        paragraphs: [
          "Uanset underskriftsform skal selve kontraktens indhold overholde lejelovens krav — depositum, opsigelsesvarsler, vedligeholdelsesfordeling og øvrige vilkår skal stadig være korrekt formuleret. En digital signatur løser ikke problemer med et mangelfuldt kontraktindhold.",
          "Gem altid en kopi af den underskrevne kontrakt og eventuelle vedhæftede rapporter (som indflytningsrapport) et sted, du kan finde igen — ikke kun i en e-mail-tråd, der kan blive svær at genfinde år senere.",
        ],
      },
    ],
  },
  {
    id: 28,
    category: "privat-udlejning",
    title: "Fraflytning og synsrapport: sådan undgår du konflikter med din lejer",
    excerpt: "De fleste tvister om depositum handler ikke om reglerne, men om manglende dokumentation. En god synsrapport ved ind- og udflytning løser problemet, før det opstår.",
    readTime: "5 min",
    date: "2023-02-13",
    body: [
      {
        heading: "Hvorfor synsrapporten er dit vigtigste værktøj",
        paragraphs: [
          "En synsrapport er en detaljeret gennemgang af boligens stand, lavet sammen med lejeren — ideelt ved både indflytning og fraflytning. Uden en indflytningsrapport har du intet at sammenligne fraflytningsstanden med, hvilket gør det næsten umuligt at dokumentere, om en skade fandtes i forvejen.",
          "Rapporten bør indeholde billeder af hvert rum, noter om eksisterende skader eller slid, og underskrift fra begge parter. Det er den enkeltvis mest effektive måde at undgå konflikt om depositum på.",
        ],
      },
      {
        heading: "Hvad tæller som normal slitage",
        paragraphs: [
          "Almindeligt slid — falmet maling, lettere ridser i gulvet efter års brug — er lejerens ret og kan ikke kræves erstattet. Det, der kan trækkes fra depositum, er skader ud over normal brug: huller i væggen, ødelagte hvidevarer eller manglende rengøring ved fraflytning.",
          "Vær konkret og objektiv i din vurdering, og undgå at bruge fraflytningssynet som en lejlighed til at opgradere boligen på lejerens regning — det er en af de hyppigste årsager til klager til Huslejenævnet.",
        ],
      },
      {
        heading: "Tidsfrister betyder noget",
        paragraphs: [
          "Selv en velbegrundet tilbageholdelse af depositum kan tabes ved Huslejenævnet, hvis du ikke overholder de lovbestemte frister for at gøre krav gældende over for lejeren efter fraflytning. Sæt en påmindelse i kalenderen, så du aldrig overskrider fristen af ren forglemmelse.",
        ],
      },
    ],
  },

  // ── Hotel (fortsat) ──
  {
    id: 29,
    category: "hotel",
    title: "Revenue management for små hoteller: sådan optimerer du prisen dag for dag",
    excerpt: "Revenue management lyder som noget for kæder med dedikerede afdelinger, men principperne kan implementeres af ethvert lille hotel med et regneark og lidt disciplin.",
    readTime: "7 min",
    date: "2026-01-15",
    body: [
      {
        heading: "Revenue management i sin enkleste form",
        paragraphs: [
          "Kernen i revenue management er ét princip: sælg det rigtige værelse til den rigtige gæst på det rigtige tidspunkt til den rigtige pris. Du behøver ikke avanceret software for at komme i gang — et regneark med belægningshistorik, sæsonmønstre og konkurrenternes priser er nok til at starte.",
          "Se på din belægning 60, 30 og 14 dage frem. Ligger du under sidste års niveau på samme tidspunkt, er det et signal om at justere prisen ned — og omvendt, hvis du ligger foran.",
        ],
      },
      {
        heading: "Dynamisk prissætning uden overkompleksitet",
        paragraphs: [
          "Du behøver ikke ændre priser dagligt for at få effekt. Start med at definere 3-4 prisniveauer baseret på belægningsprocent (fx under 40 %, 40–70 %, 70–90 %, over 90 %) og lad belægningen styre, hvilket niveau du er på. Det giver struktur uden at kræve time-for-time overvågning.",
          "Hold øje med lokale begivenheder — messer, koncerter, helligdage — der kan skabe pludselig efterspørgsel. Disse dage bør prissættes markant anderledes end en gennemsnitlig hverdag.",
        ],
      },
      {
        heading: "Direkte bookinger styrker din marginal",
        paragraphs: [
          "Revenue management giver størst effekt, når det kombineres med en strategi for direkte bookinger, hvor du undgår OTA-provisioner på 15–25 %. En stærk tilstedeværelse på sociale medier med opdateret visuelt materiale — billeder og video — er en af de billigste måder at drive trafik direkte til din egen hjemmeside i stedet for gennem tredjepartsplatforme.",
        ],
      },
    ],
  },
  {
    id: 30,
    category: "hotel",
    title: "Sådan bygger du et loyalitetsprogram uden dyrt software",
    excerpt: "Loyalitetsprogrammer er ikke kun for store kæder. Et simpelt, personligt program kan øge antallet af tilbagevendende gæster markant — uden en stor systeminvestering.",
    readTime: "5 min",
    date: "2025-08-21",
    body: [
      {
        heading: "Start simpelt",
        paragraphs: [
          "Et loyalitetsprogram behøver ikke være et pointsystem med app og dashboard. For et lille hotel er den enkleste og mest effektive model ofte: gæster, der har booket direkte tre gange, får en fast fordel — gratis opgradering, sen udtjekning eller en velkomstgave. Registrer det manuelt i din booking- eller CRM-liste, hvis du ikke har budget til dedikeret software.",
          "Det vigtige er ikke systemet — det er, at gæsten oplever at blive genkendt og værdsat, når de vender tilbage.",
        ],
      },
      {
        heading: "Kommuniker det aktivt",
        paragraphs: [
          "Et loyalitetsprogram virker kun, hvis gæsterne kender til det. Nævn det i bekræftelsesmails, på tjek-ud, og på jeres sociale medier. En kort video, der viser \"sådan bliver du en del af vores stamgæst-fordel\", er langt mere engagerende end en tekstlinje i en e-mail.",
        ],
      },
      {
        heading: "Brug data, du allerede har",
        paragraphs: [
          "De fleste hoteller har allerede den nødvendige data i deres bookingsystem — de mangler bare at handle på den. Identificer gæster, der har booket flere gange, og send dem en personlig besked ved næste sæson med et direkte tilbud. Det er langt billigere end at tiltrække en ny gæst fra bunden, og konverteringsraten er typisk markant højere.",
        ],
      },
    ],
  },
  {
    id: 31,
    category: "hotel",
    title: "Google Hotel Ads: er det pengene værd for uafhængige hoteller?",
    excerpt: "Google Hotel Ads kan give synlighed direkte i søgeresultaterne, men modellen egner sig ikke til alle. Her er, hvornår det giver mening — og hvornår pengene er bedre brugt andre steder.",
    readTime: "6 min",
    date: "2025-03-09",
    body: [
      {
        heading: "Hvordan det fungerer",
        paragraphs: [
          "Google Hotel Ads viser dit hotels priser direkte i Google Søgning og Google Maps, side om side med OTA'er som Booking.com. Du betaler enten pr. klik eller en provision af den bekræftede booking, afhængigt af modellen du vælger — og du konkurrerer i realtid mod de samme OTA'er, der allerede lister din bolig.",
          "Fordelen er synlighed på præcis det tidspunkt, hvor en potentiel gæst allerede søger efter dit hotel eller din by ved navn — en meget varm målgruppe med høj konverteringsrate.",
        ],
      },
      {
        heading: "Hvornår det giver mening",
        paragraphs: [
          "Google Hotel Ads fungerer bedst for hoteller, der allerede har et stærkt bookingflow på egen hjemmeside og en konkurrencedygtig direkte pris. Hvis din direkte pris er højere end OTA'ernes, mister du klik til dem, selvom du betaler for annoncen.",
          "Det er mindre attraktivt for meget små, nystartede hoteller uden historik eller volumen til at retfærdiggøre den løbende optimering, kanalen kræver for at være rentabel.",
        ],
      },
      {
        heading: "Alternativet: organisk synlighed",
        paragraphs: [
          "Før du investerer i betalt annoncering, sørg for at dit organiske fundament er stærkt: opdateret Google Business-profil, aktive sociale medier med jævnligt nyt visuelt indhold, og en hjemmeside der konverterer. Mange uafhængige hoteller får mere værdi ud af konsekvent organisk tilstedeværelse end af en betalt kanal, de ikke har ressourcer til at optimere løbende.",
        ],
      },
    ],
  },
  {
    id: 32,
    category: "hotel",
    title: "Bæredygtighed som konkurrenceparameter: sådan tiltrækker du den bevidste gæst",
    excerpt: "Flere gæster vælger aktivt overnatning ud fra bæredygtighed. Her er, hvordan du kommunikerer dine grønne tiltag troværdigt — uden at det virker som greenwashing.",
    readTime: "5 min",
    date: "2024-05-27",
    body: [
      {
        heading: "Gæster leder aktivt efter det",
        paragraphs: [
          "En stigende andel af rejsende filtrerer aktivt efter bæredygtige overnatningssteder, når de booker — og de er ofte villige til at betale en smule mere for det, hvis det virker troværdigt. Det gælder især for yngre målgrupper og gæster på storbyferier og aktive ferier.",
          "Problemet er, at markedet er fyldt med vage påstande som \"miljøvenligt hotel\" uden konkret substans, hvilket gæster i stigende grad gennemskuer og er skeptiske over for.",
        ],
      },
      {
        heading: "Vær konkret, ikke generisk",
        paragraphs: [
          "Fremhæv specifikke, verificerbare tiltag: lokale leverandører, solceller, genbrug af linned-vand, cykeludlejning i stedet for biludlejning, eller et konkret mærke/certificering. Konkrete detaljer bygger troværdighed langt bedre end brede udsagn.",
          "Vis det visuelt — et kort videoklip af solpanelerne på taget eller det lokale morgenmadsleverandør virker mere overbevisende end en tekstlinje på hjemmesiden.",
        ],
      },
      {
        heading: "Del det, hvor gæsterne allerede er",
        paragraphs: [
          "Sociale medier er det oplagte sted at kommunikere bæredygtighedstiltag løbende — det er en historie, der kan fortælles i flere dele over tid, i modsætning til en statisk sætning på hjemmesiden. Konsekvent indhold om jeres tiltag opbygger et troværdigt billede, som en enkelt kampagne ikke kan.",
        ],
      },
    ],
  },

  // ── SOME Opslag (fortsat) ──
  {
    id: 33,
    category: "some-opslag",
    title: "Hashtags der virker: sådan finder du de rigtige til din boligannonce",
    excerpt: "Populære hashtags giver ikke automatisk rækkevidde. Sådan finder du den rette balance mellem søgevolumen og konkurrence for netop din bolig og lokation.",
    readTime: "4 min",
    date: "2025-04-16",
    type: "SOME POST",
    body: [
      {
        heading: "Store hashtags drukner dit opslag",
        paragraphs: [
          "Det er fristende at bruge de mest populære hashtags som #travel eller #vacation, men de har typisk millioner af opslag konkurrerende om opmærksomhed — dit opslag forsvinder i strømmen på sekunder. Nichehashtags med lavere volumen giver ofte bedre synlighed, fordi konkurrencen er lavere.",
          "En god tommelfingerregel er at blande tre niveauer: 2-3 store, brede tags for potentiel rækkevidde, 4-5 mellemstore niche-tags relateret til din bolig-type, og 2-3 meget specifikke lokale tags.",
        ],
      },
      {
        heading: "Lokale hashtags er undervurderede",
        paragraphs: [
          "Hashtags med bynavn, region eller endda specifikt kvarter (#skagenferie, #vestkystenferie) rammer et publikum, der allerede aktivt overvejer at rejse til netop det område — en langt varmere målgruppe end generiske rejsehashtags.",
          "Kombiner dem med hashtags for boligtype (#feriehusdanmark, #sommerhusudlejning) for at ramme brugere, der søger specifikt efter din type overnatning.",
        ],
      },
      {
        heading: "Lad AI foreslå det relevante sæt",
        paragraphs: [
          "somevideopost.com genererer automatisk relevante hashtags som en del af det opslag, AI'en skaber ud fra din annonce — tilpasset boligtype, beliggenhed og platform. Det sparer dig for gætværk, og du kan altid justere listen, hvis du kender lokale tags, der virker særligt godt for din målgruppe.",
        ],
      },
    ],
  },
  {
    id: 34,
    category: "some-opslag",
    title: "Sådan skriver AI en sælgende opslagstekst — og hvad du selv bør style",
    excerpt: "AI kan skrive et fuldt opslag på sekunder, men de bedste resultater kommer, når du kender de tre elementer, det er værd at finjustere selv.",
    readTime: "5 min",
    date: "2024-07-02",
    type: "SOME POST",
    body: [
      {
        heading: "Hvad AI gør godt",
        paragraphs: [
          "AI er stærk til at analysere strukturerede data — billeder, pris, beliggenhed, størrelse — og omsætte det til en tekst med den rette længde og struktur for platformen. Den følger konsekvent bedste praksis: stærkt åbningsspørgsmål eller -udsagn, konkrete fakta, en klar opfordring til handling.",
          "Det betyder, at du altid får et solidt, brugbart udgangspunkt uden at skulle starte fra et tomt tekstfelt — og uden risiko for at glemme centrale detaljer om boligen.",
        ],
      },
      {
        heading: "Hvad du selv bør style",
        paragraphs: [
          "De tre elementer, der er værd at finjustere manuelt, er: personlige detaljer AI ikke kender (en historie om boligen, en lokal anbefaling), din egen tone (er du formel eller uformel?), og eventuelle aktuelle detaljer som en igangværende kampagne eller sæsontilbud.",
          "Med somevideopost.com kan du redigere og regenerere opslaget direkte i dashboardet, så du hurtigt kan style den AI-genererede tekst uden at skrive den fra bunden.",
        ],
      },
      {
        heading: "Test og lær",
        paragraphs: [
          "Prøv at variere åbningslinjen mellem opslag — et spørgsmål, et konkret tal eller en påstand — og se, hvad der skaber mest engagement for netop din målgruppe over tid. AI giver dig et hurtigt udgangspunkt til at teste flere varianter, i stedet for at bruge al din tid på at skrive én perfekt tekst.",
        ],
      },
    ],
  },
  {
    id: 35,
    category: "some-opslag",
    title: "Fra ét boliglink til fem platforme: sådan tilpasser AI dit opslag automatisk",
    excerpt: "Facebook, Instagram, TikTok, LinkedIn og YouTube har hver deres tone og format. Sådan skaber AI fem forskellige opslag ud fra samme boliglink — uden manuelt arbejde.",
    readTime: "5 min",
    date: "2026-07-08",
    type: "SOME POST",
    relatedTool: {
      href: "/some-ai-video",
      label: "SoMe AI Video",
      blurb: "Se hvordan somevideopost.com skaber AI-video og opslag til alle sociale medier fra ét link.",
    },
    body: [
      {
        heading: "Én kilde, fem tilpasninger",
        paragraphs: [
          "Facebook belønner en varm, lokal tone med lidt længere tekst. Instagram vil have et visuelt fokus med korte, punchy linjer og hashtags. LinkedIn kræver en mere professionel vinkel — tænk investeringspotentiale eller forretningsmulighed. TikTok skal fange på under to sekunder. YouTube-beskrivelser skal være søgeoptimerede og mere udførlige.",
          "At skrive fem forskellige tekster manuelt for hver eneste bolig er urealistisk for de fleste udlejere — men det er præcis den type gentagne, strukturerede opgave, AI løser effektivt.",
        ],
      },
      {
        heading: "Sådan fungerer det i praksis",
        paragraphs: [
          "Du indsætter ét link til din eksisterende annonce. somevideopost.com henter automatisk billeder, pris, beliggenhed og faciliteter, og genererer derefter et opslag tilpasset hver platforms format og tone — samtidig med at en cinematisk præsentationsvideo bygges af de samme billeder, kaldet SoMe AI video.",
          "Det betyder, at du fra ét udgangspunkt kan dække alle dine kanaler på minutter i stedet for at skrive og formatere separat for hver enkelt platform.",
        ],
      },
      {
        heading: "Del direkte eller planlæg",
        paragraphs: [
          "Når indholdet er genereret, kan du dele direkte til dine forbundne kanaler med ét klik, eller planlægge det til det tidspunkt, hvor din målgruppe typisk er mest aktiv på hver platform.",
        ],
      },
    ],
  },
  {
    id: 36,
    category: "some-opslag",
    title: "Content-kalender for udlejere: sådan planlægger du en måneds opslag på en time",
    excerpt: "Konsistens slår perfektion på sociale medier. Sådan bygger du en simpel content-kalender, der holder dig postende regelmæssigt uden daglig planlægning.",
    readTime: "5 min",
    date: "2023-10-11",
    type: "SOME POST",
    body: [
      {
        heading: "Hvorfor konsistens vinder",
        paragraphs: [
          "Algoritmer på sociale medier belønner konti, der poster regelmæssigt, med bedre organisk rækkevidde end konti, der poster sporadisk — selv hvis det sporadiske indhold i sig selv er godt. En simpel kalender med 2-3 opslag om ugen slår som regel en tilfældig strøm af opslag, når du \"lige har tid\".",
        ],
      },
      {
        heading: "Byg kalenderen på en time",
        paragraphs: [
          "Sæt en time af én gang om måneden. Del indholdet i tre spor: boligrelateret (billeder, video, faciliteter), lokalt (events, seværdigheder, sæson), og social proof (anmeldelser, gæstehistorier). Fordel disse tre typer jævnt over ugerne, så din side ikke bliver ensformig.",
          "Planlæg opslagene i dashboardet med det samme, så du ikke skal huske at poste manuelt hver dag — konsistensen sker automatisk, uanset hvor travlt du har.",
        ],
      },
      {
        heading: "Genbrug smart",
        paragraphs: [
          "Din præsentationsvideo eller dit AI-genererede opslag kan genbruges på tværs af flere uger i forskellige formater — et fuldt opslag den ene uge, et kort videoklip den næste, et enkelt billede med et citat fra en anmeldelse ugen efter. Du behøver ikke nyt indhold hver eneste gang for at virke aktiv.",
        ],
      },
    ],
  },

  // ── Video Marketing (fortsat) ──
  {
    id: 37,
    category: "video-marketing",
    title: "AI-video vs. traditionel videoproduktion: pris, tid og kvalitet sammenlignet",
    excerpt: "En professionel videofotograf koster typisk flere tusinde kroner og tager dage at booke. Sådan sammenligner AI-genereret video sig på pris, hastighed og resultat.",
    readTime: "6 min",
    date: "2026-03-30",
    type: "VIDEO GEN",
    relatedTool: {
      href: "/generate-ai-video-free",
      label: "Generate AI Video Free",
      blurb: "Se hvordan du kan generere og forhåndsvise din første AI-video gratis, før du betaler noget.",
    },
    body: [
      {
        heading: "Prisen på traditionel videoproduktion",
        paragraphs: [
          "En professionel boligvideo med fotograf, udstyr og efterredigering koster typisk mellem 3.000 og 15.000 kr., afhængigt af boligens størrelse og hvor avanceret produktionen er — drone, flere klip, professionel lyd. Dertil kommer ventetid: booking af fotograf, selve optagelsen, og typisk 1-2 ugers redigeringstid, før videoen er klar.",
          "For udlejere med én bolig kan det være en fornuftig engangsinvestering. For udlejere med flere boliger, eller som ønsker at opdatere videoen jævnligt, bliver den tilbagevendende omkostning og ventetid hurtigt en barriere.",
        ],
      },
      {
        heading: "Hvad AI-video ændrer",
        paragraphs: [
          "AI-genereret video fjerner både prisen for en fotograf og ventetiden. Du bruger de billeder, du allerede har — eller henter dem automatisk fra din eksisterende annonce — og AI tilføjer kamerabevægelser, overgange og musik. Resultatet er klar på under 15 minutter i stedet for uger.",
          "Kvaliteten er ikke identisk med en professionel dronefilm af en luksusvilla, men til det formål de fleste udlejere har brug for — et engagerende klip til sociale medier og annoncer — er forskellen minimal, mens prisen og ventetiden er markant lavere.",
        ],
      },
      {
        heading: "Prøv det, før du beslutter",
        paragraphs: [
          "Du behøver ikke vælge blindt. Med somevideopost.com kan du generere og forhåndsvise en AI-video af din bolig gratis, og først betale, hvis du vil låse den fulde video op til download og deling — så du kan vurdere kvaliteten mod din egen standard, før du beslutter dig.",
        ],
      },
    ],
  },
  {
    id: 38,
    category: "video-marketing",
    title: "Sådan laver du en gratis AI-video af din bolig — trin for trin",
    excerpt: "Fra boliglink eller fotos til færdig præsentationsvideo — helt gratis at forhåndsvise. Her er den konkrete fremgangsmåde, trin for trin.",
    readTime: "4 min",
    date: "2026-08-01",
    type: "VIDEO GEN",
    relatedTool: {
      href: "/generate-ai-video-free",
      label: "Generate AI Video Free",
      blurb: "Læs den fulde guide til at generere og forhåndsvise din AI-video helt gratis.",
    },
    body: [
      {
        heading: "Trin 1: Opret en gratis konto",
        paragraphs: [
          "Det kræver ikke kreditkort at komme i gang. Opret en konto på somevideopost.com og gå direkte til videogenerering — hele forhåndsvisningen er gratis.",
        ],
      },
      {
        heading: "Trin 2: Indsæt link eller upload billeder",
        paragraphs: [
          "Har du en eksisterende annonce på Airbnb, Booking.com eller lignende, kan du blot indsætte linket — AI henter automatisk billederne og de vigtigste detaljer. Har du ikke en annonce endnu, kan du uploade dine egne fotos direkte.",
        ],
      },
      {
        heading: "Trin 3: Se din video bygge sig selv",
        paragraphs: [
          "AI tilføjer kamerabevægelser, overgange og musik og bygger en cinematisk video ud fra dine billeder, mens du følger fremdriften live i dashboardet. Du kan se en vandmærket forhåndsvisning af den fulde video, helt gratis.",
        ],
      },
      {
        heading: "Trin 4: Lås op, hvis du er tilfreds",
        paragraphs: [
          "Kan du lide resultatet, betaler du kun for at fjerne vandmærket og downloade eller dele videoen. Er du ikke tilfreds, har du ikke brugt en krone — hele forhåndsvisningen har været gratis.",
        ],
      },
    ],
  },
  {
    id: 39,
    category: "video-marketing",
    title: "AI-video til lejlighedsudlejning: sådan sælger du interiøret",
    excerpt: "Lejlighedsannoncer lever og dør på, hvordan planløsningen kommer til udtryk. Sådan bruger AI-video interiørfokus til at gøre din lejlighed mere attraktiv end en almindelig billedkarrusel.",
    readTime: "5 min",
    date: "2025-01-22",
    type: "VIDEO GEN",
    relatedTool: {
      href: "/ai-video-for-apartment",
      label: "AI Video for Apartment",
      blurb: "Se hvordan somevideopost.com laver interiørfokuseret AI-video til lejlighedsudlejning.",
    },
    body: [
      {
        heading: "Planløsning er alt for lejligheder",
        paragraphs: [
          "Hvor en feriebolig ofte sælges på beliggenhed og udsigt, sælges en lejlighed primært på, hvordan rummene hænger sammen. Kan man se fra køkkenet ind i stuen? Er soveværelset roligt placeret væk fra indgangen? Statiske billeder i tilfældig rækkefølge formidler ikke dette flow — video gør.",
          "En video, der bevæger sig naturligt gennem entré, stue, køkken og soveværelser i den rækkefølge, man rent faktisk går gennem boligen, giver potentielle lejere en langt bedre fornemmelse af planløsningen end en billedkarrusel i vilkårlig rækkefølge.",
        ],
      },
      {
        heading: "Fungerer med de billeder, du allerede har",
        paragraphs: [
          "Du behøver ikke professionelt interiørfoto for at få en god AI-video. Upload de billeder, du allerede har af lejligheden — møbleret eller tomt — og AI sekventerer dem i en naturlig rækkefølge med kamerabevægelser og overgange tilpasset interiøret.",
          "Det gør det realistisk at generere en video for hver ledig lejlighed, efterhånden som den bliver tilgængelig, uden en tilbagevendende fotograf-udgift for hver enkelt enhed.",
        ],
      },
      {
        heading: "Skalerer på tværs af flere lejligheder",
        paragraphs: [
          "Har du flere lejligheder eller en hel ejendom, kan du generere en video per enhed efterhånden som de bliver ledige, i stedet for at booke en fotograf hver gang — hvilket holder markedsføringen konsistent uden en stigende omkostning pr. lejlighed.",
        ],
      },
    ],
  },
  {
    id: 40,
    category: "video-marketing",
    title: "Ejendomsmæglere og AI-video: sådan får boliger flere klik med cinematisk video",
    excerpt: "Boliger med video i annoncen ses længere og genererer flere henvendelser. Sådan kan ejendomsmæglere give hver eneste bolig video-kvalitet uden at booke en fotograf per sag.",
    readTime: "6 min",
    date: "2024-09-05",
    type: "VIDEO GEN",
    relatedTool: {
      href: "/ai-video-for-real-estate",
      label: "AI Video for Real Estate",
      blurb: "Se hvordan mæglere og ejendomsselskaber bruger AI-video til at markedsføre hver bolig.",
    },
    body: [
      {
        heading: "Video er ikke længere kun for de dyre sager",
        paragraphs: [
          "Traditionelt har video kun været en del af markedsføringen for de dyreste, mest attraktive boliger, fordi en professionel videofotograf koster det samme uanset boligens pris — og det gør investeringen svær at forsvare på en gennemsnitlig bolig. Det skaber en skæv situation, hvor de fleste boliger sælges udelukkende på stillbilleder.",
          "AI-video ændrer denne økonomi fundamentalt: prisen per video bliver ens uanset boligens værdi, hvilket gør det realistisk at give hver eneste bolig i porteføljen samme kvalitet af markedsføring — ikke kun de dyreste.",
        ],
      },
      {
        heading: "Fra boliglink til video på minutter",
        paragraphs: [
          "En mægler kan indsætte linket til den nye annonce, så snart den går live, og få en cinematisk video klar samme dag — i stedet for at vente på en fotografs kalender. Det betyder, at boligen kan markedsføres med video fra dag ét i stedet for uger senere, når interessen typisk er størst.",
          "Videoen kan tilpasses hver platform: lodret format til Instagram og TikTok til at fange opmærksomhed, og bredformat til hjemmesiden eller boligportalen for et mere traditionelt præsentationsformat.",
        ],
      },
      {
        heading: "Skalerbarhed på tværs af hele porteføljen",
        paragraphs: [
          "For et mæglerkontor med mange sager samtidig betyder det, at video kan blive standard for hele porteføljen frem for en undtagelse — hvilket differentierer kontorets annoncer fra konkurrenter, der stadig kun bruger stillbilleder.",
        ],
      },
    ],
  },
];

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" });
}

export function getPost(id: number): BlogPost | undefined {
  return POSTS.find((p) => p.id === id);
}

export function getCategory(id: string): BlogCategory | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

/**
 * Build a readable article body from the post metadata. The content is
 * generated deterministically so every post has a full-length, on-brand
 * article without hand-authoring 20 separate texts.
 */
export function articleBody(post: BlogPost): ArticleSection[] {
  if (post.body) return post.body;

  const cat = getCategory(post.category);
  const topic = cat?.label ?? "udlejning";

  return [
    {
      heading: "Introduktion",
      paragraphs: [
        post.excerpt,
        `I denne guide dykker vi ned i emnet og giver dig konkrete, handlingsrettede råd du kan bruge med det samme. Uanset om du er ny udlejer eller har årelang erfaring inden for ${topic.toLowerCase()}, finder du indsigt der kan gøre en målbar forskel for dine bookinger.`,
      ],
    },
    {
      heading: "Hvorfor det betyder noget",
      paragraphs: [
        "Markedet for udlejning er mere konkurrencepræget end nogensinde. Gæster og lejere sammenligner mange annoncer, før de træffer en beslutning — og de bruger i gennemsnit kun få sekunder på hver enkelt. Det gør førstehåndsindtrykket afgørende.",
        "De udlejere der skiller sig ud, er dem der kombinerer stærkt visuelt materiale med en tydelig, sælgende beskrivelse og en professionel tilstedeværelse på de rette platforme. Netop her kan de rigtige værktøjer spare dig for timer af manuelt arbejde.",
      ],
    },
    {
      heading: "Sådan gør du i praksis",
      paragraphs: [
        "Start med at samle dit materiale ét sted: gode billeder, nøgleinformation om boligen og din prissætning. Jo mere komplet dit udgangspunkt er, desto bedre bliver resultatet — både i din annoncetekst og i dine præsentationsvideoer.",
        "Med SOME VIDEO POST kan du indsætte et link til din eksisterende annonce fra Airbnb, Booking.com eller Novasol. AI henter automatisk billeder og information og skaber både et sælgende opslag og en cinematisk præsentationsvideo på under 15 minutter — klar til at dele på Facebook, Instagram og TikTok.",
      ],
    },
    {
      heading: "Kom godt videre",
      paragraphs: [
        "Konsistens er nøglen. De bedste resultater kommer, når du poster regelmæssigt og tilpasser dit indhold til hver platform. Automatisering gør det realistisk at holde et højt niveau uden at det tager al din tid.",
        "Er du klar til at komme i gang? Opret en gratis konto og prøv selv, hvor hurtigt du kan gå fra boliglink til færdigt opslag og video.",
      ],
    },
  ];
}
