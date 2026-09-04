import type { LocalisedLegal } from "./types";

const UPDATED = "Zuletzt aktualisiert am 4. September 2026";

export const LEGAL_DE: LocalisedLegal = {
  chrome: {
    contents: "Inhalt",
    questionsHeading: "Fragen?",
    questionsBody:
      "Wenn du Fragen zu dieser Richtlinie hast oder deine Rechte wahrnehmen möchtest, schreib uns einfach.",
    companyHeading: "Verantwortlicher",
    otherDocs: "Weitere Dokumente",
  },
  docs: {
    privatlivspolitik: {
      title: "Datenschutzerklärung",
      metaTitle: "Datenschutzerklärung — somevideopost.com",
      metaDescription:
        "Wie somevideopost.com deine personenbezogenen Daten verarbeitet: was wir erheben, warum, mit wem wir es teilen, wie lange wir es speichern und welche Rechte du nach der DSGVO hast.",
      intro:
        "Diese Erklärung beschreibt, wie wir personenbezogene Daten erheben und verarbeiten, wenn du somevideopost.com nutzt. Wir halten sie kurz und konkret — du sollst genau sehen können, was mit deinen Daten passiert.",
      updated: UPDATED,
      sections: [
        {
          heading: "Welche Daten wir erheben",
          body: ["Wir erheben nur, was für den Betrieb des Dienstes nötig ist. Konkret:"],
          bullets: [
            "Kontodaten: Name und E-Mail-Adresse, die du bei der Registrierung angibst, sowie ein verschlüsseltes Passwort.",
            "Objektdaten: was du zu deiner Immobilie einträgst, und die Daten, die wir aus dem eingefügten Anzeigenlink abrufen (Titel, Beschreibung, Fotos, Preis, Größe und Lage).",
            "Von dir erzeugte Inhalte: KI-generierte Beitragstexte, Bilder und Präsentationsvideos sowie deine Bearbeitungen daran.",
            "Verbundene Kanäle: Zugriffstokens und Profilnamen der sozialen Konten, die du selbst verbindest (Facebook, Instagram, TikTok, LinkedIn, YouTube).",
            "Zahlungsdaten: Abo-Status, Kaufhistorie und Belege. Deine vollständige Kartennummer sehen wir nie — sie wird ausschließlich von Stripe verarbeitet.",
            "Technische Daten: IP-Adresse, Browsertyp, Spracheinstellung und Ereignisse im Dienst, genutzt für Betrieb, Sicherheit und Fehlersuche.",
            "Statistik: aggregierte Nutzung der Website über Google Analytics — nur wenn du Statistik-Cookies zugestimmt hast.",
          ],
        },
        {
          heading: "Warum wir verarbeiten und auf welcher Grundlage",
          body: [
            "Wir verarbeiten deine Daten zu einem bestimmten Zweck und auf einer Rechtsgrundlage nach der Datenschutz-Grundverordnung (DSGVO):",
          ],
          table: {
            headers: ["Zweck", "Rechtsgrundlage"],
            rows: [
              ["Konto anlegen und betreiben und die gekauften Leistungen erbringen", "Vertragserfüllung — Art. 6 Abs. 1 lit. b"],
              ["Beiträge, Bilder und Videos aus deinen Objektdaten erzeugen", "Vertragserfüllung — Art. 6 Abs. 1 lit. b"],
              ["Veröffentlichung in deinen verbundenen sozialen Kanälen", "Vertragserfüllung — Art. 6 Abs. 1 lit. b"],
              ["Zahlung, Rechnungsstellung und Buchhaltung abwickeln", "Rechtliche Pflicht und Vertrag — Art. 6 Abs. 1 lit. c und b"],
              ["Betriebsstabilität sichern, Missbrauch verhindern, Fehler beheben", "Berechtigtes Interesse — Art. 6 Abs. 1 lit. f"],
              ["Nutzung der Website mit Statistik-Cookies messen", "Einwilligung — Art. 6 Abs. 1 lit. a"],
            ],
          },
        },
        {
          heading: "KI-Verarbeitung deiner Inhalte",
          body: [
            "Wenn du einen Beitrag, ein Bild oder ein Video anforderst, geben wir die erforderlichen Objektdaten und Fotos an unsere KI-Anbieter weiter, die den Inhalt erzeugen und an uns zurückliefern.",
            "Wir nutzen Anthropic (Claude) für Beitragstexte und Google (Gemini und Veo) für Bilder und Video. Beide handeln als Auftragsverarbeiter für uns unter Bedingungen, die es ihnen nicht erlauben, deine Daten zum Training allgemeiner Modelle zu verwenden.",
            "Gib keine sensiblen personenbezogenen Daten — etwa Gesundheitsdaten, religiöse Überzeugungen oder Ausweisnummern — in Felder ein, die zur KI-Generierung übermittelt werden. Der Dienst ist für die Vermarktung von Immobilien gedacht, nicht für sensible Daten.",
          ],
        },
        {
          heading: "Mit wem wir Daten teilen",
          body: [
            "Wir verkaufen deine personenbezogenen Daten nie. Wir teilen sie ausschließlich mit den Anbietern, die für den Betrieb nötig sind, und nur soweit sie sie brauchen:",
          ],
          table: {
            headers: ["Anbieter", "Rolle", "Standort"],
            rows: [
              ["Supabase", "Datenbank, Dateispeicher und Login", "EU"],
              ["Vercel", "Hosting und Auslieferung der Website", "EU/USA"],
              ["Stripe", "Zahlungsabwicklung und Rechnungsstellung", "EU/USA"],
              ["Anthropic", "KI-Erzeugung der Beitragstexte", "USA"],
              ["Google", "KI-Bilder und -Video (Gemini/Veo) sowie Statistik (Analytics)", "EU/USA"],
              ["Meta", "Veröffentlichung auf Facebook und Instagram", "EU/USA"],
            ],
          },
        },
        {
          heading: "Übermittlung außerhalb der EU/des EWR",
          body: [
            "Einige unserer Anbieter verarbeiten Daten in den USA. Diese Übermittlungen stützen sich auf die Standardvertragsklauseln der Europäischen Kommission und, sofern der Anbieter zertifiziert ist, auf das EU-U.S. Data Privacy Framework.",
            "Eine Kopie der jeweiligen Garantien kannst du bei uns anfordern.",
          ],
        },
        {
          heading: "Wie lange wir speichern",
          bullets: [
            "Kontodaten und Inhalte werden gespeichert, solange dein Konto aktiv ist.",
            "Wenn du dein Konto löschst, werden deine Objekte, Beiträge und Videos innerhalb von 30 Tagen gelöscht.",
            "Zugriffstokens für soziale Kanäle werden sofort gelöscht, sobald du den Kanal trennst.",
            "Buchhaltungsunterlagen einschließlich Rechnungen werden nach dänischem Buchführungsrecht 5 Jahre nach Ende des betreffenden Geschäftsjahres aufbewahrt.",
            "Betriebs- und Sicherheitsprotokolle werden bis zu 12 Monate aufbewahrt.",
          ],
        },
        {
          heading: "Sicherheit",
          body: [
            "Der gesamte Datenverkehr zum und vom Dienst ist mit TLS verschlüsselt. Daten in unserer Datenbank sind pro Nutzer zugriffsbeschränkt, sodass du nur deine eigenen Objekte, Beiträge und Videos erreichst; Passwörter werden gehasht gespeichert — nie im Klartext.",
            "Der Zugang zu Produktionssystemen ist auf die notwendigen Mitarbeitenden beschränkt. Entdecken wir eine Verletzung, die ein Risiko für deine Rechte darstellt, melden wir sie der dänischen Datenschutzbehörde binnen 72 Stunden und benachrichtigen dich bei hohem Risiko direkt.",
          ],
        },
        {
          heading: "Deine Rechte",
          body: [
            "Nach der DSGVO stehen dir Rechte zu, die du jederzeit durch eine Nachricht an uns wahrnehmen kannst. Wir antworten innerhalb eines Monats.",
          ],
          bullets: [
            "Auskunft: du kannst erfahren, welche Daten wir über dich verarbeiten, und eine Kopie erhalten.",
            "Berichtigung: du kannst unrichtige Daten korrigieren lassen.",
            "Löschung: in vielen Fällen kannst du deine Daten löschen lassen — dein Konto kannst du auch selbst in den Einstellungen löschen.",
            "Einschränkung: du kannst uns bitten, die Verarbeitung vorübergehend auszusetzen.",
            "Datenübertragbarkeit: du kannst die von dir bereitgestellten Daten in einem maschinenlesbaren Format erhalten.",
            "Widerspruch: du kannst der Verarbeitung auf Grundlage unseres berechtigten Interesses widersprechen.",
            "Widerruf der Einwilligung: hast du Statistik-Cookies zugestimmt, kannst du dies jederzeit widerrufen — die Rechtmäßigkeit der vorherigen Verarbeitung bleibt unberührt.",
          ],
        },
        {
          heading: "Beschwerde",
          body: [
            "Bist du unzufrieden damit, wie wir deine Daten verarbeiten, hören wir das gern zuerst — du kannst dich aber jederzeit bei der dänischen Datenschutzbehörde beschweren: Datatilsynet, Carl Jacobsens Vej 35, 2500 Valby, Dänemark, dt@datatilsynet.dk, datatilsynet.dk. Wohnst du in Deutschland, kannst du dich auch an deine zuständige Landesdatenschutzbehörde wenden.",
          ],
        },
        {
          heading: "Änderungen dieser Erklärung",
          body: [
            "Wir aktualisieren diese Erklärung, wenn sich der Dienst oder die Rechtslage ändert. Das Datum oben zeigt die letzte Änderung. Wesentliche Änderungen teilen wir vorab per E-Mail oder im Dienst mit.",
          ],
        },
      ],
    },

    cookiepolitik: {
      title: "Cookie-Richtlinie",
      metaTitle: "Cookie-Richtlinie — somevideopost.com",
      metaDescription:
        "Welche Cookies somevideopost.com verwendet, wozu sie dienen, wie lange sie gespeichert werden und wie du deine Einwilligung erteilst oder widerrufst.",
      intro:
        "Wir verwenden so wenige Cookies wie möglich. Die notwendigen werden immer gesetzt, weil der Dienst ohne sie nicht funktioniert. Statistik-Cookies werden nur gesetzt, wenn du zustimmst.",
      updated: UPDATED,
      sections: [
        {
          heading: "Was ein Cookie ist",
          body: [
            "Ein Cookie ist eine kleine Textdatei, die in deinem Browser gespeichert wird und die die Website beim nächsten Besuch wieder lesen kann. Sie kann sich zum Beispiel merken, dass du angemeldet bist oder welche Sprache du gewählt hast.",
            "Wir folgen der dänischen Cookie-Verordnung: notwendige Cookies dürfen ohne Einwilligung gesetzt werden, alle anderen erfordern dein aktives Ja.",
          ],
        },
        {
          heading: "Notwendige Cookies",
          body: ["Diese werden immer gesetzt. Ohne sie kannst du dich nicht anmelden, und die Seite kann sich deine Auswahl nicht merken."],
          table: {
            headers: ["Name", "Zweck", "Dauer"],
            rows: [
              ["sb-…-auth-token", "Hält dich in deinem Konto angemeldet (Supabase)", "1 Jahr"],
              ["locale", "Merkt sich die gewählte Sprache", "1 Jahr"],
              ["currency", "Merkt sich, ob du Preise in DKK oder EUR siehst", "1 Jahr"],
              ["svp-consent", "Merkt sich deine Cookie-Auswahl, damit du nicht erneut gefragt wirst", "1 Jahr"],
            ],
          },
        },
        {
          heading: "Statistik-Cookies",
          body: [
            "Diese werden nur gesetzt, wenn du auf „Alle zulassen“ klickst. Sie helfen uns zu sehen, welche Seiten genutzt werden, damit wir sie verbessern können. Wir nutzen Google Analytics 4 mit IP-Anonymisierung.",
          ],
          table: {
            headers: ["Name", "Zweck", "Dauer"],
            rows: [
              ["_ga", "Unterscheidet Besucher", "2 Jahre"],
              ["_ga_…", "Verfolgt die einzelne Sitzung", "2 Jahre"],
            ],
          },
        },
        {
          heading: "Wir verwenden keine Marketing-Cookies",
          body: [
            "Wir setzen keine Cookies für Werbung, Retargeting oder seitenübergreifendes Profiling. Sollte sich das ändern, würdest du zuerst um Einwilligung gebeten und diese Richtlinie würde aktualisiert.",
          ],
        },
        {
          heading: "Einwilligung ändern oder widerrufen",
          body: [
            "Du kannst deine Auswahl jederzeit über den Link „Cookie-Einstellungen“ am Seitenende ändern. Widerrufst du die Einwilligung, setzen wir sofort keine Statistik-Cookies mehr.",
            "Du kannst Cookies auch direkt im Browser löschen. Löschst du die notwendigen, wirst du abgemeldet und deine Sprach- und Währungsauswahl wird zurückgesetzt.",
          ],
        },
      ],
    },

    handelsbetingelser: {
      title: "Allgemeine Geschäftsbedingungen",
      metaTitle: "Allgemeine Geschäftsbedingungen — somevideopost.com",
      metaDescription:
        "Bedingungen für die Nutzung von somevideopost.com: Abonnement, Bezahlung von Präsentationsvideos, Widerrufsrecht, Rechte an Inhalten, Haftung und Kündigung.",
      intro:
        "Diese Bedingungen gelten, wenn du ein Konto bei somevideopost.com anlegst und ein Abonnement oder Präsentationsvideos kaufst. Lies sie durch — sie beschreiben, was du von uns erwarten kannst und was wir von dir erwarten.",
      updated: UPDATED,
      sections: [
        {
          heading: "Vertragsparteien und Vertragsschluss",
          body: [
            "Der Vertrag kommt zwischen dir als Kundin oder Kunde und dem am Ende dieser Seite genannten Unternehmen zustande. Er ist geschlossen, sobald du ein Konto anlegst und diese Bedingungen akzeptierst.",
            "Der Dienst richtet sich an Vermieterinnen und Vermieter von Ferienimmobilien, sowohl privat als auch gewerblich. Bist du Verbraucher, gilt zwingendes Verbraucherrecht ergänzend zu diesen Bedingungen.",
          ],
        },
        {
          heading: "Was der Dienst umfasst",
          body: [
            "Mit somevideopost.com kannst du Immobilien anlegen, Marketinginhalte mit KI erzeugen und sie in deinen verbundenen sozialen Kanälen teilen.",
            "Es handelt sich um einen fortlaufenden Softwaredienst. Wir entwickeln ihn weiter, und einzelne Funktionen können sich ändern, hinzukommen oder eingestellt werden. Wesentliche Verschlechterungen der bezahlten Leistung kündigen wir mindestens 30 Tage vorher an.",
          ],
        },
        {
          heading: "Preise und Zahlung",
          bullets: [
            "Der Studio-Zugang wird monatlich im Voraus abgerechnet und enthält eine feste Anzahl KI-Beiträge pro Monat. Die aktuellen Preise stehen immer auf der Preisseite.",
            "Präsentationsvideos werden pro Stück bezahlt. Die Zahlung wird eingezogen, sobald das Video erzeugt und für dich bereit ist.",
            "Nicht genutzte Beiträge eines Monats werden nicht in den nächsten übertragen.",
            "Alle Preise werden für Verbraucher inklusive Mehrwertsteuer angezeigt. Geschäftskunden werden nach den geltenden Regeln fakturiert.",
            "Die Zahlung wird von Stripe abgewickelt. Wir speichern deine Kartendaten nicht.",
            "Bleibt ein Abonnement unbezahlt, können wir den Studio-Zugang pausieren, bis die Zahlung erfolgt ist. Deine Inhalte werden dadurch nicht gelöscht.",
          ],
        },
        {
          heading: "Widerrufsrecht",
          body: [
            "Als Verbraucher hast du grundsätzlich 14 Tage Widerrufsrecht ab Vertragsschluss.",
            "Ein Präsentationsvideo ist ein digitales Produkt, das speziell für dich erstellt wird. Mit der Bestellung stimmst du ausdrücklich zu, dass die Ausführung sofort beginnt, und erkennst an, dass das Widerrufsrecht erlischt, sobald das Video erzeugt ist. Bis zum Start der Generierung kannst du frei widerrufen.",
            "Beim Abonnement kannst du innerhalb von 14 Tagen widerrufen und den gezahlten Betrag zurückerhalten, sofern du keine Beiträge des Monats genutzt hast. Hast du einen Teil genutzt, rechnen wir den anteiligen Wert an.",
            "Für den Widerruf genügt eine Nachricht an die am Seitenende genannte E-Mail-Adresse.",
          ],
        },
        {
          heading: "Kündigung",
          body: [
            "Das Abonnement hat keine Mindestlaufzeit und kann jederzeit in den Einstellungen gekündigt werden. Die Kündigung wirkt zum Ende des bezahlten Zeitraums — bis dahin behältst du den Zugang, und es wird nicht erneut abgebucht.",
            "Wir können den Vertrag mit einer Frist von 30 Tagen kündigen, oder fristlos, wenn du wesentlich gegen diese Bedingungen verstößt, etwa durch rechtswidrige Nutzung.",
          ],
        },
        {
          heading: "Rechte an Inhalten",
          body: [
            "Du behältst sämtliche Rechte an den Fotos, Texten und Objektdaten, die du hochlädst.",
            "Die vom Dienst für dich erzeugten Inhalte — Beiträge, Bilder und Videos — darfst du frei kommerziell nutzen, auch nach Ende deines Abonnements. Du kannst sie in voller Auflösung herunterladen.",
            "Du räumst uns ein zeitlich begrenztes, nicht ausschließliches Recht ein, dein Material zu verarbeiten und zu speichern, soweit dies zur Erbringung des Dienstes erforderlich ist. Wir nutzen deine Inhalte nicht für unsere eigene Werbung, ohne dich vorher zu fragen.",
            "Die Plattform selbst, ihr Design und ihre Software bleiben unser Eigentum.",
          ],
        },
        {
          heading: "Deine Verantwortung für das verwendete Material",
          bullets: [
            "Du sicherst zu, dass du berechtigt bist, die hochgeladenen oder aus einem Anzeigenlink abgerufenen Fotos und Informationen zu nutzen.",
            "Du bist dafür verantwortlich, dass der fertige Inhalt dem Wettbewerbsrecht und den Regeln der Plattformen entspricht, auf denen du ihn teilst.",
            "Lies KI-generierte Inhalte immer durch, bevor du sie veröffentlichst. Sie können Fehler oder Ungenauigkeiten über deine Immobilie enthalten.",
            "Du darfst den Dienst nicht für rechtswidrige, irreführende oder rechtsverletzende Inhalte nutzen.",
          ],
        },
        {
          heading: "Verfügbarkeit und Support",
          body: [
            "Wir streben eine Verfügbarkeit rund um die Uhr an, garantieren aber keinen unterbrechungsfreien Betrieb. Geplante Wartungen kündigen wir an, soweit praktikabel.",
            "Support erfolgt per E-Mail an Werktagen. Wir antworten in der Regel innerhalb von zwei Arbeitstagen.",
            "Die Videoerzeugung hängt von externen KI-Anbietern ab. Schlägt eine Erzeugung fehl, berechnen wir sie nicht — und wurde der Betrag bereits eingezogen, erstatten wir ihn.",
          ],
        },
        {
          heading: "Haftung",
          body: [
            "Wir haften nach den allgemeinen Regeln des dänischen Rechts, jedoch nicht für mittelbare Schäden, einschließlich entgangenem Gewinn, ausgebliebenen Buchungen oder Datenverlust bei Dritten.",
            "Unsere Gesamthaftung ist auf den Betrag begrenzt, den du uns in den 12 Monaten vor dem anspruchsauslösenden Ereignis gezahlt hast.",
            "Keine dieser Beschränkungen gilt bei Vorsatz, grober Fahrlässigkeit oder soweit sie zwingendem Verbraucherrecht widerspricht.",
          ],
        },
        {
          heading: "Änderung der Bedingungen",
          body: [
            "Wir können diese Bedingungen mit einer Frist von 30 Tagen per E-Mail oder im Dienst ändern. Bist du mit einer Änderung nicht einverstanden, kannst du vor ihrem Inkrafttreten kündigen.",
          ],
        },
        {
          heading: "Beschwerde und Rechtswahl",
          body: [
            "Bist du unzufrieden, schreib uns zuerst — wir versuchen immer, eine Lösung zu finden.",
            "Als Verbraucher kannst du dich an Nævnenes Hus, Toldboden 2, 8800 Viborg, Dänemark, wenden oder die OS-Plattform der Europäischen Kommission unter ec.europa.eu/consumers/odr nutzen.",
            "Es gilt dänisches Recht; Streitigkeiten werden von dänischen Gerichten entschieden, soweit nicht zwingende Vorschriften etwas anderes bestimmen.",
          ],
        },
      ],
    },
  },
};
