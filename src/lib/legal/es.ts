import type { LocalisedLegal } from "./types";

const UPDATED = "Última actualización: 4 de septiembre de 2026";

export const LEGAL_ES: LocalisedLegal = {
  chrome: {
    contents: "Contenido",
    questionsHeading: "¿Preguntas?",
    questionsBody:
      "Si tienes dudas sobre esta política o quieres ejercer tus derechos, escríbenos sin más.",
    companyHeading: "Responsable del tratamiento",
    otherDocs: "Otros documentos",
  },
  docs: {
    privatlivspolitik: {
      title: "Política de privacidad",
      metaTitle: "Política de privacidad — somevideopost.com",
      metaDescription:
        "Cómo trata somevideopost.com tus datos personales: qué recogemos, por qué, con quién lo compartimos, cuánto tiempo lo conservamos y qué derechos tienes según el RGPD.",
      intro:
        "Esta política explica cómo recogemos y tratamos datos personales cuando usas somevideopost.com. La mantenemos breve y concreta: debes poder ver exactamente qué ocurre con tus datos.",
      updated: UPDATED,
      sections: [
        {
          heading: "Qué datos recogemos",
          body: ["Solo recogemos lo necesario para prestar el servicio. En concreto:"],
          bullets: [
            "Datos de cuenta: el nombre y el correo electrónico que facilitas al registrarte, más una contraseña cifrada.",
            "Datos de la propiedad: lo que introduces sobre tu propiedad y los datos que obtenemos del enlace del anuncio que pegas (título, descripción, fotos, precio, tamaño y ubicación).",
            "Contenido que generas: textos de publicaciones, imágenes y vídeos de presentación generados por IA, junto con las ediciones que hagas.",
            "Canales conectados: tokens de acceso y nombres de perfil de las cuentas sociales que decidas conectar (Facebook, Instagram, TikTok, LinkedIn, YouTube).",
            "Datos de pago: estado de la suscripción, historial de compras y recibos. Nunca vemos el número completo de tu tarjeta: lo gestiona únicamente Stripe.",
            "Datos técnicos: dirección IP, tipo de navegador, preferencia de idioma y eventos del servicio, usados para operación, seguridad y depuración.",
            "Estadísticas: uso agregado del sitio mediante Google Analytics, solo si has consentido las cookies estadísticas.",
          ],
        },
        {
          heading: "Por qué tratamos los datos y con qué base",
          body: [
            "Tratamos tus datos con una finalidad concreta y una base jurídica conforme al Reglamento General de Protección de Datos (RGPD):",
          ],
          table: {
            headers: ["Finalidad", "Base jurídica"],
            rows: [
              ["Crear y mantener tu cuenta y prestar lo que has contratado", "Ejecución de un contrato — art. 6.1.b"],
              ["Generar publicaciones, imágenes y vídeos a partir de tus datos", "Ejecución de un contrato — art. 6.1.b"],
              ["Publicar en tus canales sociales conectados", "Ejecución de un contrato — art. 6.1.b"],
              ["Gestionar el pago, la facturación y la contabilidad", "Obligación legal y contrato — art. 6.1.c y b"],
              ["Mantener la estabilidad del servicio, prevenir abusos y depurar", "Interés legítimo — art. 6.1.f"],
              ["Medir el uso del sitio con cookies estadísticas", "Consentimiento — art. 6.1.a"],
            ],
          },
        },
        {
          heading: "Tratamiento del contenido por IA",
          body: [
            "Cuando pides una publicación, una imagen o un vídeo, enviamos los datos e imágenes necesarios a nuestros proveedores de IA, que generan el contenido y nos lo devuelven.",
            "Usamos Anthropic (Claude) para los textos y Google (Gemini y Veo) para imágenes y vídeo. Ambos actúan como encargados del tratamiento por cuenta nuestra, bajo condiciones que no les permiten usar tus datos para entrenar modelos de propósito general.",
            "No introduzcas datos personales sensibles —como información de salud, creencias religiosas o números de identificación— en campos que se envían a generación por IA. El servicio está pensado para comercializar propiedades, no para tratar datos sensibles.",
          ],
        },
        {
          heading: "Con quién compartimos los datos",
          body: [
            "Nunca vendemos tus datos personales. Solo los compartimos con los proveedores necesarios para prestar el servicio, y únicamente en la medida en que los necesitan:",
          ],
          table: {
            headers: ["Proveedor", "Función", "Ubicación"],
            rows: [
              ["Supabase", "Base de datos, almacenamiento de archivos e inicio de sesión", "UE"],
              ["Vercel", "Alojamiento y entrega del sitio", "UE/EE. UU."],
              ["Stripe", "Procesamiento de pagos y facturación", "UE/EE. UU."],
              ["Anthropic", "Generación por IA de los textos", "EE. UU."],
              ["Google", "Imágenes y vídeo por IA (Gemini/Veo) y estadísticas (Analytics)", "UE/EE. UU."],
              ["Meta", "Publicación en Facebook e Instagram", "UE/EE. UU."],
            ],
          },
        },
        {
          heading: "Transferencias fuera de la UE/EEE",
          body: [
            "Algunos proveedores tratan datos en Estados Unidos. Esas transferencias se amparan en las Cláusulas Contractuales Tipo de la Comisión Europea y, cuando el proveedor está certificado, en el Marco de Privacidad de Datos UE-EE. UU.",
            "Puedes solicitarnos una copia de las garantías aplicables escribiéndonos.",
          ],
        },
        {
          heading: "Cuánto tiempo conservamos los datos",
          bullets: [
            "Los datos de cuenta y el contenido se conservan mientras tu cuenta esté activa.",
            "Cuando eliminas tu cuenta, tus propiedades, publicaciones y vídeos se borran en un plazo de 30 días.",
            "Los tokens de acceso de los canales sociales se borran de inmediato al desconectar el canal.",
            "La documentación contable, incluidas las facturas, se conserva 5 años desde el cierre del ejercicio al que corresponde, según la ley contable danesa.",
            "Los registros de operación y seguridad se conservan hasta 12 meses.",
          ],
        },
        {
          heading: "Seguridad",
          body: [
            "Todo el tráfico hacia y desde el servicio va cifrado con TLS. Los datos de nuestra base están restringidos por usuario, de modo que solo puedes acceder a tus propias propiedades, publicaciones y vídeos, y las contraseñas se guardan con hash, nunca en texto plano.",
            "El acceso a los sistemas de producción se limita al personal que lo necesita. Si detectamos una brecha que suponga un riesgo para tus derechos, lo notificamos a la autoridad danesa de protección de datos en 72 horas, y a ti directamente cuando el riesgo sea alto.",
          ],
        },
        {
          heading: "Tus derechos",
          body: [
            "El RGPD te reconoce una serie de derechos que puedes ejercer en cualquier momento escribiéndonos. Respondemos en el plazo de un mes.",
          ],
          bullets: [
            "Acceso: puedes saber qué datos tenemos sobre ti y obtener una copia.",
            "Rectificación: puedes hacer corregir datos inexactos.",
            "Supresión: en muchos casos puedes hacer borrar tus datos; también puedes eliminar tu cuenta desde los ajustes.",
            "Limitación: puedes pedirnos que pausemos el tratamiento temporalmente.",
            "Portabilidad: puedes recibir en formato legible por máquina los datos que nos facilitaste.",
            "Oposición: puedes oponerte al tratamiento basado en nuestro interés legítimo.",
            "Retirada del consentimiento: si aceptaste las cookies estadísticas, puedes retirarlo cuando quieras; ello no afecta a la licitud del tratamiento anterior.",
          ],
        },
        {
          heading: "Reclamaciones",
          body: [
            "Si no estás conforme con cómo tratamos tus datos nos gustaría saberlo primero, pero siempre puedes reclamar ante la autoridad danesa de protección de datos (Datatilsynet), Carl Jacobsens Vej 35, 2500 Valby, Dinamarca, dt@datatilsynet.dk, datatilsynet.dk. Si resides en España, también puedes acudir a la Agencia Española de Protección de Datos.",
          ],
        },
        {
          heading: "Cambios en esta política",
          body: [
            "Actualizamos esta política cuando cambia el servicio o la normativa. La fecha superior indica la última revisión. Los cambios sustanciales se comunican por correo o dentro del servicio antes de que surtan efecto.",
          ],
        },
      ],
    },

    cookiepolitik: {
      title: "Política de cookies",
      metaTitle: "Política de cookies — somevideopost.com",
      metaDescription:
        "Qué cookies usa somevideopost.com, para qué sirven, cuánto duran y cómo dar o retirar tu consentimiento.",
      intro:
        "Usamos las mínimas cookies posibles. Las necesarias se instalan siempre, porque el servicio no funciona sin ellas. Las estadísticas solo se instalan si dices que sí.",
      updated: UPDATED,
      sections: [
        {
          heading: "Qué es una cookie",
          body: [
            "Una cookie es un pequeño archivo de texto que se guarda en tu navegador y que el sitio puede volver a leer en tu próxima visita. Puede recordar que has iniciado sesión o qué idioma elegiste.",
            "Seguimos la normativa danesa de cookies: las necesarias pueden instalarse sin consentimiento, el resto requiere tu sí activo.",
          ],
        },
        {
          heading: "Cookies necesarias",
          body: ["Se instalan siempre. Sin ellas no puedes iniciar sesión y el sitio no recuerda tus elecciones."],
          table: {
            headers: ["Nombre", "Finalidad", "Duración"],
            rows: [
              ["sb-…-auth-token", "Mantiene la sesión iniciada en tu cuenta (Supabase)", "1 año"],
              ["locale", "Recuerda el idioma que elegiste", "1 año"],
              ["currency", "Recuerda si ves los precios en DKK o EUR", "1 año"],
              ["svp-consent", "Recuerda tu elección de cookies para no volver a preguntarte", "1 año"],
            ],
          },
        },
        {
          heading: "Cookies estadísticas",
          body: [
            "Solo se instalan si pulsas «Permitir todas». Nos ayudan a ver qué páginas se usan para poder mejorarlas. Usamos Google Analytics 4 con anonimización de IP.",
          ],
          table: {
            headers: ["Nombre", "Finalidad", "Duración"],
            rows: [
              ["_ga", "Distingue entre visitantes", "2 años"],
              ["_ga_…", "Controla la sesión concreta", "2 años"],
            ],
          },
        },
        {
          heading: "No usamos cookies de marketing",
          body: [
            "No instalamos cookies de publicidad, retargeting ni perfilado entre sitios. Si eso cambiara, se te pediría consentimiento primero y esta política se actualizaría.",
          ],
        },
        {
          heading: "Cómo cambiar o retirar tu consentimiento",
          body: [
            "Puedes cambiar tu elección en cualquier momento con el enlace «Configuración de cookies» al pie de cualquier página. Si retiras el consentimiento, dejamos de instalar cookies estadísticas de inmediato.",
            "También puedes borrar las cookies desde tu navegador. Si borras las necesarias, se cerrará tu sesión y se restablecerán tus preferencias de idioma y moneda.",
          ],
        },
      ],
    },

    handelsbetingelser: {
      title: "Condiciones de servicio",
      metaTitle: "Condiciones de servicio — somevideopost.com",
      metaDescription:
        "Condiciones de uso de somevideopost.com: suscripción, pago de vídeos de presentación, derecho de desistimiento, derechos sobre el contenido, responsabilidad y cancelación.",
      intro:
        "Estas condiciones se aplican cuando creas una cuenta en somevideopost.com y contratas una suscripción o vídeos de presentación. Léelas: describen qué puedes esperar de nosotros y qué esperamos de ti.",
      updated: UPDATED,
      sections: [
        {
          heading: "Partes y formalización del contrato",
          body: [
            "El contrato se celebra entre tú como cliente y la empresa identificada al final de esta página. Queda formalizado cuando creas una cuenta y aceptas estas condiciones.",
            "El servicio se dirige a quienes alquilan propiedades vacacionales, tanto particulares como empresas. Si eres consumidor, la normativa imperativa de consumo se aplica además de estas condiciones.",
          ],
        },
        {
          heading: "Qué incluye el servicio",
          body: [
            "somevideopost.com te permite añadir propiedades, generar contenido de marketing con IA y compartirlo en tus canales sociales conectados.",
            "Es un servicio de software continuo. Seguimos desarrollándolo, y algunas funciones pueden cambiar, añadirse o retirarse. Las reducciones sustanciales de lo que pagas se anuncian con al menos 30 días de antelación.",
          ],
        },
        {
          heading: "Precios y pago",
          bullets: [
            "El acceso al estudio se factura mensualmente por adelantado e incluye un número fijo de publicaciones IA al mes. Los precios vigentes figuran siempre en la página de precios.",
            "Los vídeos de presentación se pagan por unidad. El cobro se realiza cuando el vídeo está generado y listo para ti.",
            "Las publicaciones no usadas en un mes no se acumulan para el siguiente.",
            "Todos los precios se muestran con IVA incluido para consumidores. A las empresas se les factura según la normativa aplicable.",
            "El pago lo gestiona Stripe. No almacenamos los datos de tu tarjeta.",
            "Si una suscripción queda impagada podemos pausar el acceso al estudio hasta que se complete el pago. Tu contenido no se borra por ello.",
          ],
        },
        {
          heading: "Derecho de desistimiento",
          body: [
            "Si eres consumidor, por regla general dispones de 14 días para desistir del contrato.",
            "Un vídeo de presentación es un producto digital elaborado específicamente para ti. Al pedirlo, consientes expresamente que la ejecución comience de inmediato y reconoces que el derecho de desistimiento decae una vez generado el vídeo. Hasta que comience la generación puedes desistir libremente.",
            "En cuanto a la suscripción, puedes desistir en 14 días y recuperar el importe, siempre que no hayas usado ninguna de las publicaciones del mes. Si has usado alguna, descontamos su valor proporcional.",
            "Para desistir, basta con escribirnos a la dirección de correo que figura al final de esta página.",
          ],
        },
        {
          heading: "Cancelación",
          body: [
            "La suscripción no tiene permanencia y puede cancelarse cuando quieras desde los ajustes. La cancelación surte efecto al final del periodo pagado: conservas el acceso hasta entonces y no volvemos a cobrar.",
            "Podemos resolver el contrato con 30 días de preaviso, o sin preaviso si incumples gravemente estas condiciones, por ejemplo usando el servicio de forma ilícita.",
          ],
        },
        {
          heading: "Derechos sobre el contenido",
          body: [
            "Conservas todos los derechos sobre las fotos, textos y datos de la propiedad que subas.",
            "El contenido que el servicio genera para ti —publicaciones, imágenes y vídeos— puedes usarlo comercialmente sin restricción, incluso después de terminar tu suscripción. Puedes descargarlo en resolución completa.",
            "Nos concedes un derecho temporal y no exclusivo para tratar y almacenar tu material en la medida necesaria para prestar el servicio. No usamos tu contenido en nuestra propia publicidad sin preguntarte antes.",
            "La plataforma en sí, su diseño y su software siguen siendo nuestros.",
          ],
        },
        {
          heading: "Tu responsabilidad sobre el material que utilizas",
          bullets: [
            "Garantizas que tienes derecho a usar las fotos e información que subes u obtienes de un enlace de anuncio.",
            "Eres responsable de que el contenido final cumpla la normativa de publicidad y las reglas de las plataformas donde lo compartes.",
            "Revisa siempre el contenido generado por IA antes de publicarlo. Puede contener errores o imprecisiones sobre tu propiedad.",
            "No puedes usar el servicio para contenido ilícito, engañoso o que infrinja derechos de terceros.",
          ],
        },
        {
          heading: "Disponibilidad y soporte",
          body: [
            "Procuramos que el servicio esté disponible las 24 horas, pero no garantizamos un funcionamiento ininterrumpido. El mantenimiento programado se anuncia cuando es posible.",
            "El soporte se presta por correo electrónico en días laborables. Solemos responder en un plazo de dos días hábiles.",
            "La generación de vídeo depende de proveedores de IA externos. Si una generación falla no la cobramos, y si el importe ya se había cargado, lo devolvemos.",
          ],
        },
        {
          heading: "Responsabilidad",
          body: [
            "Respondemos conforme a las normas generales del Derecho danés, pero no por daños indirectos, incluidos el lucro cesante, las reservas perdidas o la pérdida de datos en terceros.",
            "Nuestra responsabilidad total se limita al importe que nos hayas pagado en los 12 meses anteriores al hecho que motiva la reclamación.",
            "Ninguna de estas limitaciones se aplica en casos de dolo o culpa grave, ni en la medida en que contravengan normas imperativas de consumo.",
          ],
        },
        {
          heading: "Modificación de las condiciones",
          body: [
            "Podemos modificar estas condiciones con 30 días de preaviso por correo o dentro del servicio. Si no estás de acuerdo con un cambio, puedes cancelar antes de que entre en vigor.",
          ],
        },
        {
          heading: "Reclamaciones y ley aplicable",
          body: [
            "Si algo no te convence, escríbenos primero: siempre intentaremos encontrar una solución.",
            "Si eres consumidor puedes reclamar ante Nævnenes Hus, Toldboden 2, 8800 Viborg, Dinamarca, o a través de la plataforma de resolución de litigios en línea de la Comisión Europea en ec.europa.eu/consumers/odr.",
            "El contrato se rige por el Derecho danés y los litigios se someten a los tribunales daneses, salvo que normas imperativas dispongan otra cosa.",
          ],
        },
      ],
    },
  },
};
