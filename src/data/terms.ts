import type { Locale } from '@/types';

export type TermsSection = {
  t: string;
  p: string[];
  list?: string[];
};

export type TermsContent = {
  title: string;
  sections: TermsSection[];
};

// Condiciones de uso del apartamento turístico (página /[locale]/terminos).
// Idioma del contenido: el del visitante (TermsContent por locale).
export const TERMS: Record<Locale, TermsContent> = {
  es: {
    title: 'Términos y Condiciones',
    sections: [
      {
        t: '1. Objeto',
        p: [
          'Estas condiciones regulan el uso del sitio web de Esencia Sevilla (en adelante, «la web») y la información publicada sobre el apartamento turístico. El uso de la web implica la aceptación de estas condiciones.',
        ],
      },
      {
        t: '2. Reservas',
        p: [
          'Las reservas del alojamiento se gestionan exclusivamente a través de Booking.com. Esta web no realiza ventas directas ni cobra importes: el contrato de alojamiento, los precios, las condiciones de cancelación y el pago se rigen por lo que se indique en la plataforma en el momento de la reserva.',
        ],
      },
      {
        t: '3. Precios e impuestos',
        p: [
          'Los precios que puedan aparecer en la web son orientativos y por noche. El precio vinculante es el mostrado en Booking.com. La tasa turística de Andalucía y cualquier impuesto aplicable se liquidan según la normativa vigente y las condiciones de la reserva.',
        ],
      },
      {
        t: '4. Uso de la web',
        p: ['Al utilizar la web te comprometes a:'],
        list: [
          'No usarla con fines ilícitos ni que perjudiquen a terceros.',
          'No introducir virus, malware ni ningún código que dañe su funcionamiento.',
          'Respetar la propiedad intelectual de sus contenidos, textos, fotografías y diseños, que no pueden reproducirse sin autorización.',
        ],
      },
      {
        t: '5. Enlaces externos e información de terceros',
        p: [
          'La web incluye enlaces a sitios de terceros (monumentos, restaurantes, eventos, transporte) y datos orientativos de horarios y precios que pueden cambiar sin previo aviso. No controlamos ni respondemos por el contenido, la disponibilidad ni la exactitud de esos sitios.',
        ],
      },
      {
        t: '6. Responsabilidad',
        p: [
          'Esencia Sevilla se esfuerza por mantener la información actualizada y el sitio disponible, pero no garantiza la ausencia de errores ni la continuidad ininterrumpida del servicio.',
        ],
      },
      {
        t: '7. Legislación aplicable',
        p: [
          'Estas condiciones se rigen por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales de Sevilla, salvo que la normativa de consumo establezca otro fuero.',
        ],
      },
    ],
  },
  en: {
    title: 'Terms and Conditions',
    sections: [
      {
        t: '1. Purpose',
        p: [
          'These terms govern the use of the Esencia Sevilla website (hereinafter «the website») and the information published about the tourist apartment. Use of the website implies acceptance of these terms.',
        ],
      },
      {
        t: '2. Bookings',
        p: [
          'Accommodation bookings are managed exclusively through Booking.com. This website does not sell directly or take payments: the accommodation contract, prices, cancellation policy and payment are governed by what the platform states at the time of booking.',
        ],
      },
      {
        t: '3. Prices and taxes',
        p: [
          'Prices that may appear on the website are indicative and per night. The binding price is the one shown on Booking.com. The Andalusian tourist tax and any applicable taxes are settled according to current regulations and the booking conditions.',
        ],
      },
      {
        t: '4. Use of the website',
        p: ['By using the website you agree to:'],
        list: [
          'Not use it for unlawful purposes or in a way that harms third parties.',
          'Not upload viruses, malware or any code that damages its operation.',
          'Respect the intellectual property of its contents, texts, photographs and designs, which may not be reproduced without permission.',
        ],
      },
      {
        t: '5. External links and third-party information',
        p: [
          'The website includes links to third-party sites (monuments, restaurants, events, transport) and indicative opening times and prices that may change without notice. We do not control or accept liability for the content, availability or accuracy of those sites.',
        ],
      },
      {
        t: '6. Liability',
        p: [
          'Esencia Sevilla strives to keep the information up to date and the site available, but does not guarantee the absence of errors or uninterrupted continuity of the service.',
        ],
      },
      {
        t: '7. Governing law',
        p: [
          'These terms are governed by Spanish law. Any dispute shall be subject to the courts and tribunals of Seville, unless consumer regulations provide otherwise.',
        ],
      },
    ],
  },
  fr: {
    title: 'Conditions générales',
    sections: [
      {
        t: '1. Objet',
        p: [
          'Les présentes conditions régissent l’utilisation du site web d’Esencia Sevilla (ci-après « le site ») et les informations publiées sur l’appartement touristique. L’utilisation du site implique l’acceptation de ces conditions.',
        ],
      },
      {
        t: '2. Réservations',
        p: [
          'Les réservations de l’hébergement sont gérées exclusivement via Booking.com. Ce site ne vend pas directement et ne perçoit aucun paiement : le contrat d’hébergement, les prix, les conditions d’annulation et le paiement sont régis par ce que la plateforme indique au moment de la réservation.',
        ],
      },
      {
        t: '3. Prix et taxes',
        p: [
          'Les prix susceptibles d’apparaître sur le site sont indicatifs et par nuit. Le prix ferme est celui affiché sur Booking.com. La taxe de séjour d’Andalousie et toute taxe applicable sont réglées selon la réglementation en vigueur et les conditions de la réservation.',
        ],
      },
      {
        t: '4. Utilisation du site',
        p: ['En utilisant le site, vous vous engagez à :'],
        list: [
          'Ne pas l’utiliser à des fins illicites ni préjudiciables à des tiers.',
          'Ne pas introduire de virus, de logiciels malveillants ni de code susceptible d’altérer son fonctionnement.',
          'Respecter la propriété intellectuelle de ses contenus, textes, photographies et designs, qui ne peuvent être reproduits sans autorisation.',
        ],
      },
      {
        t: '5. Liens externes et informations de tiers',
        p: [
          'Le site comprend des liens vers des sites tiers (monuments, restaurants, événements, transports) et des horaires et prix indicatifs susceptibles de changer sans préavis. Nous ne contrôlons ni ne répondons du contenu, de la disponibilité ou de l’exactitude de ces sites.',
        ],
      },
      {
        t: '6. Responsabilité',
        p: [
          'Esencia Sevilla s’efforce de maintenir les informations à jour et le site disponible, mais ne garantit pas l’absence d’erreurs ni la continuité ininterrompue du service.',
        ],
      },
      {
        t: '7. Droit applicable',
        p: [
          'Les présentes conditions sont régies par le droit espagnol. Tout litige relèvera des tribunaux de Séville, sauf si la réglementation de la consommation prévoit une autre juridiction.',
        ],
      },
    ],
  },
  de: {
    title: 'Allgemeine Geschäftsbedingungen',
    sections: [
      {
        t: '1. Zweck',
        p: [
          'Diese Bedingungen regeln die Nutzung der Website von Esencia Sevilla (nachfolgend «die Website») und der veröffentlichten Informationen über die Ferienwohnung. Mit der Nutzung der Website werden diese Bedingungen akzeptiert.',
        ],
      },
      {
        t: '2. Buchungen',
        p: [
          'Buchungen der Unterkunft erfolgen ausschließlich über Booking.com. Diese Website verkauft nicht direkt und nimmt keine Zahlungen entgegen: Unterkunftsvertrag, Preise, Stornobedingungen und Zahlung richten sich nach den Angaben der Plattform zum Zeitpunkt der Buchung.',
        ],
      },
      {
        t: '3. Preise und Steuern',
        p: [
          'Preise auf der Website sind Richtwerte pro Nacht. Verbindlich ist der auf Booking.com angezeigte Preis. Die andalusische Touristensteuer und etwaige Steuern werden nach der geltenden Regelung und den Buchungsbedingungen abgerechnet.',
        ],
      },
      {
        t: '4. Nutzung der Website',
        p: ['Mit der Nutzung der Website verpflichten Sie sich:'],
        list: [
          'Sie nicht für rechtswidrige Zwecke oder zum Schaden Dritter zu nutzen.',
          'Keine Viren, Malware oder Code einzuschleusen, der ihren Betrieb beeinträchtigt.',
          'Das geistige Eigentum ihrer Inhalte, Texte, Fotos und Designs zu respektieren; eine Vervielfältigung bedarf der Genehmigung.',
        ],
      },
      {
        t: '5. Externe Links und Informationen Dritter',
        p: [
          'Die Website enthält Links zu Websites Dritter (Denkmäler, Restaurants, Veranstaltungen, Verkehr) sowie Richtwerte zu Öffnungszeiten und Preisen, die sich ohne Vorankündigung ändern können. Wir haben keinen Einfluss auf und übernehmen keine Haftung für Inhalte, Verfügbarkeit oder Richtigkeit dieser Websites.',
        ],
      },
      {
        t: '6. Haftung',
        p: [
          'Esencia Sevilla bemüht sich um aktuelle Informationen und eine verfügbare Website, garantiert aber weder Fehlerfreiheit noch eine ununterbrochene Erreichbarkeit des Dienstes.',
        ],
      },
      {
        t: '7. Anwendbares Recht',
        p: [
          'Diese Bedingungen unterliegen dem spanischen Recht. Streitigkeiten werden vor den Gerichten von Sevilla verhandelt, sofern das Verbraucherrecht keinen anderen Gerichtsstand vorsieht.',
        ],
      },
    ],
  },
  it: {
    title: 'Termini e Condizioni',
    sections: [
      {
        t: '1. Oggetto',
        p: [
          'Queste condizioni regolano l’uso del sito web di Esencia Sevilla (di seguito «il sito») e le informazioni pubblicate sull’appartamento turistico. L’uso del sito implica l’accettazione di queste condizioni.',
        ],
      },
      {
        t: '2. Prenotazioni',
        p: [
          'Le prenotazioni dell’alloggio sono gestite esclusivamente tramite Booking.com. Questo sito non vende direttamente né incassa importi: il contratto di alloggio, i prezzi, le condizioni di cancellazione e il pagamento sono regolati da quanto indicato dalla piattaforma al momento della prenotazione.',
        ],
      },
      {
        t: '3. Prezzi e tasse',
        p: [
          'I prezzi che possono comparire sul sito sono indicativi e per notte. Il prezzo vincolante è quello mostrato su Booking.com. La tassa di soggiorno andalusa e le eventuali tasse applicabili si liquidano secondo la normativa vigente e le condizioni della prenotazione.',
        ],
      },
      {
        t: '4. Uso del sito',
        p: ['Utilizzando il sito ti impegni a:'],
        list: [
          'Non usarlo per fini illeciti o dannosi per terzi.',
          'Non introdurre virus, malware o codici che ne danneggino il funzionamento.',
          'Rispettare la proprietà intellettuale di contenuti, testi, fotografie e design, che non possono essere riprodotti senza autorizzazione.',
        ],
      },
      {
        t: '5. Link esterni e informazioni di terzi',
        p: [
          'Il sito include link a siti di terzi (monumenti, ristoranti, eventi, trasporti) e orari e prezzi indicativi che possono cambiare senza preavviso. Non controlliamo né rispondiamo del contenuto, della disponibilità o dell’esattezza di tali siti.',
        ],
      },
      {
        t: '6. Responsabilità',
        p: [
          'Esencia Sevilla si impegna a mantenere le informazioni aggiornate e il sito disponibile, ma non garantisce l’assenza di errori né la continuità ininterrotta del servizio.',
        ],
      },
      {
        t: '7. Legislazione applicabile',
        p: [
          'Queste condizioni sono regolate dalla legislazione spagnola. Per qualsiasi controversia saranno competenti i tribunali di Siviglia, salvo che la normativa sui consumatori preveda un altro foro.',
        ],
      },
    ],
  },
  pt: {
    title: 'Termos e Condições',
    sections: [
      {
        t: '1. Objeto',
        p: [
          'Estas condições regulam a utilização do site do Esencia Sevilla (em diante, «o site») e as informações publicadas sobre o apartamento turístico. A utilização do site implica a aceitação destas condições.',
        ],
      },
      {
        t: '2. Reservas',
        p: [
          'As reservas do alojamento são geridas exclusivamente através do Booking.com. Este site não vende diretamente nem cobra montantes: o contrato de alojamento, os preços, as condições de cancelamento e o pagamento regem-se pelo que a plataforma indicar no momento da reserva.',
        ],
      },
      {
        t: '3. Preços e impostos',
        p: [
          'Os preços que possam aparecer no site são indicativos e por noite. O preço vinculativo é o apresentado no Booking.com. A taxa turística da Andaluzia e quaisquer impostos aplicáveis são liquidados de acordo com a legislação em vigor e as condições da reserva.',
        ],
      },
      {
        t: '4. Utilização do site',
        p: ['Ao utilizar o site, compromete-se a:'],
        list: [
          'Não o utilizar para fins ilícitos nem prejudiciais a terceiros.',
          'Não introduzir vírus, malware nem código que prejudique o seu funcionamento.',
          'Respeitar a propriedade intelectual dos seus conteúdos, textos, fotografias e desenhos, que não podem ser reproduzidos sem autorização.',
        ],
      },
      {
        t: '5. Ligações externas e informações de terceiros',
        p: [
          'O site inclui ligações a sites de terceiros (monumentos, restaurantes, eventos, transportes) e horários e preços indicativos que podem mudar sem aviso prévio. Não controlamos nem respondemos pelo conteúdo, disponibilidade ou exatidão desses sites.',
        ],
      },
      {
        t: '6. Responsabilidade',
        p: [
          'O Esencia Sevilla esforça-se por manter as informações atualizadas e o site disponível, mas não garante a ausência de erros nem a continuidade ininterrupta do serviço.',
        ],
      },
      {
        t: '7. Legislação aplicável',
        p: [
          'Estas condições regem-se pela legislação espanhola. Qualquer litígio será da competência dos tribunais de Sevilha, salvo se a normativa de consumo estabelecer outro foro.',
        ],
      },
    ],
  },
};
