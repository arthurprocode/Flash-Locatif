export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date string
  readingTime: number; // minutes
  content: string; // HTML string
}

export const ARTICLES: BlogArticle[] = [
  {
    slug: "micro-foncier-ou-regime-reel",
    title: "Micro-foncier ou régime réel : comment choisir ?",
    description:
      "Propriétaire bailleur, vous hésitez entre micro-foncier et régime réel ? Découvrez comment choisir le régime fiscal le plus avantageux pour votre situation.",
    date: "2025-03-15",
    readingTime: 6,
    content: `
<h2>Qu'est-ce que le micro-foncier ?</h2>
<p>Le régime micro-foncier est le régime simplifié de déclaration des revenus fonciers. Il s'applique automatiquement si vos loyers bruts annuels ne dépassent pas <strong>15 000 €</strong>. Son principe est simple : l'administration fiscale applique un abattement forfaitaire de <strong>30 %</strong> sur vos revenus bruts, et vous êtes imposé sur les 70 % restants.</p>
<p>Exemple : vous percevez 10 000 € de loyers. Avec le micro-foncier, votre revenu imposable est de 7 000 € (10 000 × 70 %). Vous n'avez aucune charge à justifier.</p>

<h2>Qu'est-ce que le régime réel ?</h2>
<p>Le régime réel (ou régime normal) vous permet de déduire vos charges <strong>réelles et justifiées</strong> de vos revenus locatifs bruts. Les principales charges déductibles sont :</p>
<ul>
  <li>Les <strong>intérêts d'emprunt</strong> (uniquement la part intérêts, pas le capital)</li>
  <li>La <strong>taxe foncière</strong> (hors taxe d'enlèvement des ordures ménagères)</li>
  <li>Les <strong>primes d'assurance PNO</strong> (propriétaire non-occupant)</li>
  <li>Les <strong>travaux d'entretien et de réparation</strong> (pas les travaux d'amélioration)</li>
  <li>Les <strong>frais de gestion</strong> (honoraires d'agence)</li>
  <li>Les <strong>charges de copropriété</strong> non récupérables sur le locataire</li>
</ul>
<p>Si vos charges dépassent 30 % de vos loyers bruts, le régime réel est plus avantageux que le micro-foncier.</p>

<h2>Comment choisir entre les deux régimes ?</h2>
<p>La règle de base est la suivante : si vos charges réelles représentent <strong>plus de 30 %</strong> de vos loyers bruts, le régime réel est plus intéressant. Dans le cas contraire, le micro-foncier est souvent suffisant.</p>
<p>Prenons un exemple concret. Vous percevez 12 000 € de loyers annuels et vos charges s'élèvent à :</p>
<ul>
  <li>Taxe foncière : 1 200 €</li>
  <li>Intérêts d'emprunt : 2 500 €</li>
  <li>Assurance PNO : 300 €</li>
  <li>Travaux : 800 €</li>
</ul>
<p>Total charges : 4 800 €, soit 40 % de vos loyers. Dans ce cas, le régime réel vous permet de déduire 4 800 € contre seulement 3 600 € (30 % de 12 000 €) en micro-foncier. Vous êtes imposé sur 7 200 € au lieu de 8 400 €.</p>

<h2>Le cas particulier du déficit foncier</h2>
<p>Avec le régime réel, si vos charges sont supérieures à vos revenus, vous créez un <strong>déficit foncier</strong>. Ce déficit (dans la limite de 10 750 € par an) est imputable sur votre revenu global, ce qui peut significativement réduire votre impôt sur le revenu total. C'est l'un des grands avantages du régime réel.</p>

<h2>Peut-on changer de régime chaque année ?</h2>
<p>Non. Si vous optez pour le régime réel, vous vous engagez pour une durée minimale de <strong>3 ans</strong>. Passé ce délai, vous pouvez revenir au micro-foncier. En revanche, si vous relevez du micro-foncier, vous pouvez opter librement pour le régime réel chaque année.</p>

<h2>Comment Flash Locatif vous aide à choisir</h2>
<p>Flash Locatif calcule automatiquement les deux régimes avec vos données réelles et vous recommande celui qui minimise votre imposition. En moins de 10 minutes, vous savez exactement combien vous économisez en choisissant le bon régime — et vous obtenez votre formulaire 2044 pré-rempli.</p>
    `.trim(),
  },
  {
    slug: "remplir-formulaire-2044",
    title: "Comment remplir le formulaire 2044 étape par étape",
    description:
      "Le formulaire 2044 effraie de nombreux propriétaires bailleurs. Voici un guide complet pour le remplir correctement et éviter les erreurs courantes.",
    date: "2025-03-22",
    readingTime: 8,
    content: `
<h2>Qu'est-ce que le formulaire 2044 ?</h2>
<p>Le formulaire 2044 est la déclaration officielle des revenus fonciers au régime réel. Il permet de détailler, bien par bien, l'ensemble de vos revenus locatifs et de vos charges déductibles pour l'année fiscale écoulée. Le résultat net (revenu ou déficit foncier) est ensuite reporté sur votre déclaration de revenus principale (formulaire 2042).</p>

<h2>Qui doit remplir le formulaire 2044 ?</h2>
<p>Tous les propriétaires bailleurs relevant du <strong>régime réel</strong> doivent remplir le formulaire 2044. C'est obligatoire si vos loyers bruts dépassent 15 000 € par an, ou si vous avez opté volontairement pour le régime réel en dessous de ce seuil.</p>

<h2>Structure du formulaire 2044</h2>
<p>Le formulaire 2044 est organisé en plusieurs sections :</p>
<ul>
  <li><strong>Cadre I :</strong> Identification du propriétaire</li>
  <li><strong>Cadre II :</strong> Revenus bruts (case 210 et suivantes)</li>
  <li><strong>Cadre III :</strong> Charges déductibles (cases 220 à 260)</li>
  <li><strong>Cadre IV :</strong> Résultats (cases 400 à 440)</li>
  <li><strong>Cadre VI :</strong> Report des déficits antérieurs</li>
</ul>

<h2>Les revenus bruts (Cadre II)</h2>
<p>Renseignez ici vos <strong>loyers bruts perçus</strong> pour chaque bien (case 210). Attention : incluez les loyers encaissés mais pas les provisions pour charges récupérables si vous les refacturez au locataire. Si votre locataire paie des charges en sus, ne les incluez pas dans vos revenus bruts.</p>

<h2>Les charges déductibles (Cadre III)</h2>
<p>C'est la partie la plus complexe du formulaire. Voici les principales cases :</p>
<ul>
  <li><strong>Case 221 :</strong> Frais de gestion, d'administration et assurances</li>
  <li><strong>Case 224 :</strong> Travaux de réparation et d'entretien</li>
  <li><strong>Case 227 :</strong> Autres frais de gestion (taxe foncière hors TEOM)</li>
  <li><strong>Case 229 :</strong> Provisions sur charges de copropriété</li>
  <li><strong>Case 250 :</strong> Intérêts des emprunts</li>
</ul>
<p><strong>Attention :</strong> les travaux d'amélioration ne sont pas déductibles (agrandissement, construction d'une véranda, etc.). Seuls les travaux visant à maintenir ou remettre en état le bien sont acceptés.</p>

<h2>Le calcul du résultat net (Cadre IV)</h2>
<p>Le résultat net est la différence entre vos revenus bruts et vos charges déductibles :</p>
<ul>
  <li>Si le résultat est <strong>positif</strong> : c'est votre revenu foncier imposable, à reporter case 4BA de votre déclaration principale.</li>
  <li>Si le résultat est <strong>négatif</strong> : c'est un déficit foncier. La part non liée aux intérêts (jusqu'à 10 750 €) va en case 4BB (déductible du revenu global). Le reste va en case 4BC (report sur revenus fonciers futurs).</li>
</ul>

<h2>Erreurs courantes à éviter</h2>
<ul>
  <li>Oublier de déduire la TEOM de la taxe foncière (elle est récupérable sur le locataire)</li>
  <li>Déduire des travaux d'amélioration au lieu d'entretien</li>
  <li>Inclure le capital remboursé dans les intérêts d'emprunt</li>
  <li>Oublier de reporter les déficits antérieurs</li>
</ul>

<h2>Simplifiez-vous la vie avec Flash Locatif</h2>
<p>Flash Locatif génère automatiquement votre formulaire 2044 pré-rempli avec toutes les bonnes cases. Il vous suffit de saisir vos données une fois, et le logiciel s'occupe du reste : calcul du résultat, gestion du déficit foncier, et guide pour reporter le tout sur impots.gouv.fr.</p>
    `.trim(),
  },
  {
    slug: "deficit-foncier",
    title: "Déficit foncier : comment ça marche et comment l'optimiser",
    description:
      "Le déficit foncier est un puissant levier fiscal pour les propriétaires bailleurs. Comprendre ses règles vous permet de réduire significativement votre impôt.",
    date: "2025-04-01",
    readingTime: 7,
    content: `
<h2>Qu'est-ce que le déficit foncier ?</h2>
<p>Le déficit foncier apparaît lorsque vos charges déductibles dépassent vos revenus locatifs bruts. Par exemple, si vous percevez 8 000 € de loyers et que vous avez 11 000 € de charges déductibles (travaux, intérêts, taxe foncière…), votre déficit foncier est de 3 000 €.</p>
<p>Le déficit foncier est une réalité courante dans l'investissement locatif, notamment les premières années quand les travaux sont importants ou quand les intérêts d'emprunt sont élevés.</p>

<h2>Les deux composantes du déficit foncier</h2>
<p>La règle fiscale distingue deux parties dans le déficit foncier :</p>

<h3>1. La part attribuable aux intérêts d'emprunt</h3>
<p>Cette fraction du déficit correspond aux intérêts de votre crédit immobilier. Elle <strong>ne peut pas s'imputer sur votre revenu global</strong>. Elle est uniquement reportable sur vos revenus fonciers des 10 années suivantes.</p>

<h3>2. La part attribuable aux autres charges</h3>
<p>Cette fraction correspond à toutes les autres charges déductibles (travaux, taxe foncière, assurance, etc.). Elle peut s'imputer sur votre <strong>revenu global</strong>, dans la limite de <strong>10 750 € par an</strong>. L'excédent est reporté sur 10 ans sur les revenus fonciers.</p>

<h2>Exemple chiffré</h2>
<p>Imaginons la situation suivante :</p>
<ul>
  <li>Loyers bruts : 8 000 €</li>
  <li>Intérêts d'emprunt : 4 000 €</li>
  <li>Autres charges (travaux, taxe foncière, etc.) : 7 000 €</li>
  <li>Total charges : 11 000 €</li>
</ul>
<p>Résultat avant intérêts : 8 000 - 7 000 = +1 000 € → Les intérêts viennent réduire ce solde.</p>
<p>Résultat final : 1 000 - 4 000 = -3 000 € (déficit foncier)</p>
<p>Dans ce cas :</p>
<ul>
  <li>Part intérêts dans le déficit : 3 000 € (reportable sur revenus fonciers futurs uniquement)</li>
  <li>Part autres charges : 0 € (le solde avant intérêts était positif)</li>
</ul>

<h2>Autre exemple avec un déficit lié aux travaux</h2>
<ul>
  <li>Loyers bruts : 8 000 €</li>
  <li>Intérêts d'emprunt : 1 000 €</li>
  <li>Travaux importants + autres charges : 15 000 €</li>
  <li>Total charges : 16 000 €</li>
</ul>
<p>Résultat avant intérêts : 8 000 - 15 000 = -7 000 €</p>
<p>Part des autres charges imputable sur revenu global : 7 000 € (dans la limite des 10 750 €)</p>
<p>Déficit final incluant intérêts : 7 000 + 1 000 = 8 000 €. La part intérêts (1 000 €) est reportable sur 10 ans.</p>

<h2>Le report du déficit sur 10 ans</h2>
<p>Les déficits non imputés se reportent automatiquement sur les revenus fonciers des <strong>10 années suivantes</strong>, dans l'ordre chronologique. Si vous avez des déficits des années N-3, N-2, N-1, ils s'imputent d'abord les plus anciens.</p>
<p>Attention : si vous vendez le bien dans les 3 ans suivant la création d'un déficit imputé sur le revenu global, l'avantage fiscal peut être remis en cause par l'administration fiscale.</p>

<h2>Comment optimiser son déficit foncier ?</h2>
<ul>
  <li><strong>Regrouper les travaux :</strong> concentrer les gros travaux sur une ou deux années maximise l'impact fiscal.</li>
  <li><strong>Bien classer les travaux :</strong> seuls les travaux d'entretien et de réparation sont déductibles, pas les améliorations.</li>
  <li><strong>Gérer le timing des charges :</strong> une charge payée en décembre est déductible de l'année en cours.</li>
</ul>

<h2>Flash Locatif calcule tout pour vous</h2>
<p>Flash Locatif gère automatiquement toutes les règles du déficit foncier : distinction intérêts/autres charges, plafond de 10 750 €, report des déficits antérieurs. Il vous indique précisément ce que vous pouvez déduire de votre revenu global et ce qui sera reporté.</p>
    `.trim(),
  },
  {
    slug: "charges-deductibles-location-nue",
    title: "Quelles charges sont déductibles en location nue ?",
    description:
      "Guide complet des charges déductibles de vos revenus fonciers en location nue. Taxe foncière, travaux, intérêts d'emprunt : ce que vous pouvez déduire et comment.",
    date: "2025-04-10",
    readingTime: 7,
    content: `
<h2>Introduction : location nue et régime réel</h2>
<p>En location nue (non meublée), les propriétaires bailleurs peuvent déduire leurs charges réelles de leurs revenus locatifs sous le <strong>régime réel</strong>. Contrairement au régime micro-foncier (abattement forfaitaire de 30 %), le régime réel permet de déduire précisément chaque charge supportée dans l'année.</p>
<p>Voici la liste exhaustive des charges déductibles, telle que définie par l'article 31 du Code Général des Impôts.</p>

<h2>1. Les intérêts d'emprunt (case 250)</h2>
<p>Vous pouvez déduire les <strong>intérêts</strong> de votre prêt immobilier, mais <strong>pas le capital</strong> remboursé. Consultez votre tableau d'amortissement pour connaître la part intérêts de chaque mensualité. Sont également déductibles :</p>
<ul>
  <li>Les frais de dossier du prêt (proratisés sur la durée)</li>
  <li>Les frais de garantie (cautionnement ou hypothèque)</li>
  <li>Les primes d'assurance emprunteur</li>
</ul>

<h2>2. Les frais de gestion et d'administration (case 221)</h2>
<p>Si vous avez délégué la gestion de votre bien à une agence immobilière, vous pouvez déduire ses <strong>honoraires de gestion</strong> (généralement 7 à 10 % des loyers). Sont inclus dans cette catégorie :</p>
<ul>
  <li>Honoraires d'agence pour la gestion locative</li>
  <li>Frais de rédaction des baux</li>
  <li>Frais de procédure (avocat, huissier) en cas de litige avec le locataire</li>
</ul>

<h2>3. L'assurance propriétaire non-occupant (case 221)</h2>
<p>La <strong>prime d'assurance PNO</strong> (Propriétaire Non-Occupant) est intégralement déductible. Cette assurance couvre les dommages au logement quand il est occupé par un locataire. Elle est d'ailleurs rendue obligatoire depuis la loi ALUR pour les copropriétés.</p>

<h2>4. La taxe foncière hors TEOM (case 227)</h2>
<p>Vous pouvez déduire la <strong>taxe foncière</strong> que vous payez pour le bien loué, mais uniquement la partie correspondant à la taxe foncière elle-même. La <strong>Taxe d'Enlèvement des Ordures Ménagères (TEOM)</strong> est à exclure car elle est récupérable sur le locataire.</p>
<p>Sur votre avis de taxe foncière, la TEOM figure séparément — veillez à la déduire du montant total avant de renseigner la case 227.</p>

<h2>5. Les travaux d'entretien et de réparation (case 224)</h2>
<p>C'est la catégorie la plus subtile. Sont déductibles les travaux qui visent à <strong>maintenir ou remettre en état</strong> le bien sans en changer la nature ni le standing :</p>
<ul>
  <li>Remplacement d'une chaudière à l'identique</li>
  <li>Ravalement de façade</li>
  <li>Réfection de toiture (à l'identique)</li>
  <li>Travaux de peinture, parquet, plomberie</li>
  <li>Remplacement de fenêtres (si la superficie n'augmente pas)</li>
</ul>
<p>En revanche, sont <strong>exclus</strong> les travaux d'amélioration, d'agrandissement ou de construction :</p>
<ul>
  <li>Construction d'une extension ou d'une véranda</li>
  <li>Installation d'un ascenseur là où il n'y en avait pas</li>
  <li>Transformation de combles en pièce habitable</li>
</ul>

<h2>6. Les charges de copropriété (case 229)</h2>
<p>Si le bien est en copropriété, vous pouvez déduire la <strong>part des charges non récupérables</strong> sur le locataire. Les charges récupérables (eau, chauffage collectif, entretien des parties communes, etc.) ne sont pas déductibles car vous les refacturez au locataire.</p>
<p>En pratique, les charges de copropriété sont déductibles l'année de leur <strong>paiement effectif</strong> (pas des provisions versées l'année précédente, sauf régularisation).</p>

<h2>7. Les frais de comptabilité</h2>
<p>Si vous faites appel à un expert-comptable pour établir votre déclaration foncière, ses honoraires sont déductibles. Cette charge est rare pour les propriétaires individuels mais peut s'avérer pertinente pour des patrimoines complexes.</p>

<h2>Ce qui n'est PAS déductible</h2>
<p>Pour éviter les erreurs, voici les dépenses fréquemment confondues avec des charges déductibles :</p>
<ul>
  <li>Le capital remboursé sur votre prêt immobilier</li>
  <li>La TEOM (incluse dans la taxe foncière)</li>
  <li>Les charges locatives récupérées sur le locataire</li>
  <li>Les travaux d'amélioration ou d'agrandissement</li>
  <li>La taxe d'habitation (supprimée mais à ne pas confondre)</li>
</ul>

<h2>Flash Locatif : chaque charge à la bonne case</h2>
<p>Flash Locatif vous guide charge par charge avec des explications et des tooltips pour chaque catégorie. Plus de risque de confusion entre travaux d'entretien et d'amélioration, ou entre taxe foncière et TEOM. Votre formulaire 2044 est généré avec les bonnes cases automatiquement remplies.</p>
    `.trim(),
  },
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getAllSlugs(): string[] {
  return ARTICLES.map((a) => a.slug);
}
