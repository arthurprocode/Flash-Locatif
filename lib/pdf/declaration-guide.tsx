import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Form2044Data } from "./form-2044";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    padding: 40,
    backgroundColor: "#ffffff",
    color: "#1a1a1a",
    lineHeight: 1.5,
  },
  // Cover
  coverPage: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    padding: 40,
    backgroundColor: "#1E5FA8",
    color: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  coverBrand: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  coverTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#EBF3FB",
    textAlign: "center",
    marginBottom: 6,
  },
  coverSubtitle: {
    fontSize: 11,
    color: "#93c5fd",
    textAlign: "center",
    marginBottom: 40,
  },
  coverBox: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 6,
    padding: "16 24",
    width: "80%",
    textAlign: "center",
  },
  coverBoxText: {
    color: "#ffffff",
    fontSize: 10,
    lineHeight: 1.6,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerBrand: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1E5FA8",
  },
  headerMeta: {
    fontSize: 8,
    color: "#9ca3af",
  },
  // Step
  stepContainer: {
    marginBottom: 20,
  },
  stepBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  stepNumber: {
    backgroundColor: "#1E5FA8",
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    textAlign: "center",
    paddingTop: 5,
    marginRight: 8,
  },
  stepTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  stepBody: {
    marginLeft: 30,
  },
  stepText: {
    color: "#374151",
    marginBottom: 4,
  },
  stepHighlight: {
    backgroundColor: "#EBF3FB",
    borderLeftWidth: 3,
    borderLeftColor: "#1E5FA8",
    padding: "6 10",
    marginVertical: 6,
    borderRadius: 2,
  },
  stepHighlightText: {
    color: "#1E5FA8",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  stepHighlightSub: {
    color: "#1E5FA8",
    fontSize: 8.5,
    marginTop: 2,
  },
  // Warning box
  warningBox: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    padding: "6 10",
    marginVertical: 6,
    borderRadius: 2,
  },
  warningText: {
    color: "#92400e",
    fontSize: 8.5,
  },
  // Bullet
  bullet: {
    flexDirection: "row",
    marginBottom: 3,
    marginLeft: 4,
  },
  bulletDot: {
    width: 12,
    color: "#1E5FA8",
    fontFamily: "Helvetica-Bold",
  },
  bulletText: {
    flex: 1,
    color: "#374151",
    fontSize: 9,
  },
  // Summary table
  summaryRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 5,
  },
  summaryLabel: {
    flex: 1,
    color: "#374151",
  },
  summaryValue: {
    width: 100,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  summaryValueNeg: {
    width: 100,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    color: "#c0392b",
  },
  summaryRowTotal: {
    flexDirection: "row",
    backgroundColor: "#EBF3FB",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderTopWidth: 1.5,
    borderTopColor: "#1E5FA8",
    marginTop: 2,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: "#e5e7eb",
    paddingTop: 6,
    fontSize: 7,
    color: "#9ca3af",
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function eur(v: number): string {
  return v.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

function Footer({ taxYear }: { taxYear: number }) {
  return (
    <View style={styles.footer} fixed>
      <Text>Flash Locatif — Guide de déclaration {taxYear}</Text>
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
    </View>
  );
}

// ─── Guide Document ────────────────────────────────────────────────────────────

export function DeclarationGuideDocument({ data }: { data: Form2044Data }) {
  const isDeficit = data.netFoncierFinal < 0;
  const caseToFill = isDeficit
    ? data.deficitImputableOnRevenuGlobal > 0
      ? "4BB et/ou 4BC"
      : "4BC"
    : "4BA";

  return (
    <Document
      title={`Guide de déclaration — Revenus fonciers ${data.taxYear}`}
      author="Flash Locatif"
    >
      {/* ── Cover ── */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverBrand}>Flash Locatif</Text>
        <Text style={styles.coverTitle}>Guide de déclaration{"\n"}Revenus fonciers {data.taxYear}</Text>
        <Text style={styles.coverSubtitle}>
          Comment reporter vos résultats sur impots.gouv.fr
        </Text>
        <View style={styles.coverBox}>
          <Text style={styles.coverBoxText}>
            Ce guide vous accompagne étape par étape dans la saisie de votre déclaration de revenus fonciers {data.taxYear} sur le site des impôts.
            {"\n\n"}
            Votre formulaire 2044 pré-rempli est joint à ce document.
          </Text>
        </View>
      </Page>

      {/* ── Page 2: Vos chiffres clés ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerBrand}>Flash Locatif</Text>
          <Text style={styles.headerMeta}>Revenus fonciers {data.taxYear}</Text>
        </View>

        <View style={styles.stepContainer}>
          <Text style={{ fontSize: 13, fontFamily: "Helvetica-Bold", marginBottom: 10 }}>
            Vos chiffres clés — Récapitulatif
          </Text>

          {/* Summary table */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total loyers bruts perçus</Text>
            <Text style={styles.summaryValue}>{eur(data.totalGrossIncome)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total charges déductibles</Text>
            <Text style={styles.summaryValue}>{eur(data.totalDeductibleExpenses)}</Text>
          </View>
          {data.deficitApplied > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Déficits antérieurs imputés</Text>
              <Text style={styles.summaryValue}>{eur(data.deficitApplied)}</Text>
            </View>
          )}
          <View style={styles.summaryRowTotal}>
            <Text style={{ flex: 1, fontFamily: "Helvetica-Bold" }}>
              {isDeficit ? "Déficit foncier net" : "Revenu net foncier imposable"}
            </Text>
            <Text style={isDeficit ? styles.summaryValueNeg : styles.summaryValue}>
              {eur(Math.abs(data.netFoncierFinal))}
            </Text>
          </View>

          {/* What to report */}
          <View style={[styles.stepHighlight, { marginTop: 12 }]}>
            <Text style={styles.stepHighlightText}>
              → Ce que vous devez reporter sur impots.gouv.fr
            </Text>
            <Text style={styles.stepHighlightSub}>
              Case {caseToFill} : {eur(Math.abs(data.netFoncierFinal))}
              {data.deficitImputableOnRevenuGlobal > 0 &&
                `\nCase 4BB (revenu global) : ${eur(data.deficitImputableOnRevenuGlobal)}`}
              {data.deficitCarriedForward > 0 &&
                `\nCase 4BC (report futur) : ${eur(data.deficitCarriedForward)}`}
            </Text>
          </View>
        </View>

        <Footer taxYear={data.taxYear} />
      </Page>

      {/* ── Page 3: Guide étape par étape ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerBrand}>Flash Locatif</Text>
          <Text style={styles.headerMeta}>Guide pas à pas — impots.gouv.fr</Text>
        </View>

        {/* Step 1 */}
        <View style={styles.stepContainer}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepTitle}>Accédez à votre espace particulier</Text>
          </View>
          <View style={styles.stepBody}>
            <Text style={styles.stepText}>Rendez-vous sur impots.gouv.fr et connectez-vous à votre espace particulier.</Text>
            <Bullet text="Si vous n'avez pas de compte, créez-en un avec votre numéro fiscal (figurant sur vos avis d'imposition)." />
            <Bullet text="Cliquez sur « Déclarer mes revenus » dans le menu principal." />
          </View>
        </View>

        {/* Step 2 */}
        <View style={styles.stepContainer}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepTitle}>Choisissez la déclaration pour {data.taxYear}</Text>
          </View>
          <View style={styles.stepBody}>
            <Text style={styles.stepText}>
              {`Sélectionnez la déclaration de revenus pour l'année ${data.taxYear} (campagne ${data.taxYear + 1}).`}
            </Text>
            <Bullet text="Si une déclaration pré-remplie vous est proposée, cliquez sur « Commencer »." />
            <Bullet text="Vérifiez que vos informations personnelles (adresse, situation familiale) sont correctes." />
          </View>
        </View>

        {/* Step 3 */}
        <View style={styles.stepContainer}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepTitle}>Activez la déclaration des revenus fonciers</Text>
          </View>
          <View style={styles.stepBody}>
            <Text style={styles.stepText}>
              Dans la section « Revenus », cochez la case permettant de déclarer des revenus fonciers.
            </Text>
            <Bullet text='Cherchez la rubrique "Revenus fonciers" ou "Revenus de la propriété".' />
            <Bullet text="Cochez « Je perçois des revenus fonciers » pour faire apparaître le formulaire 2044." />
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ Si vous relevez du micro-foncier (loyers bruts &lt; 15 000 €), vous pouvez opter pour ce régime simplifié. Flash Locatif vous a indiqué le régime le plus avantageux dans votre simulation.
              </Text>
            </View>
          </View>
        </View>

        {/* Step 4 */}
        <View style={styles.stepContainer}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepTitle}>Saisissez vos revenus et charges (régime réel)</Text>
          </View>
          <View style={styles.stepBody}>
            <Text style={styles.stepText}>
              Dans le formulaire 2044, renseignez chaque bien immobilier séparément.
            </Text>
            <Bullet text={`Case 210 — Loyers bruts : ${eur(data.totalGrossIncome)} (total tous biens)`} />
            <Bullet text={`Case 240 — Total charges déductibles : ${eur(data.totalDeductibleExpenses)}`} />
            {data.properties.map((p, i) => (
              <Bullet
                key={i}
                text={`Bien ${i + 1} "${p.name}" : ${eur(p.grossRent)} de loyers, ${eur(
                  p.mortgageInterest + p.propertyManagementFees + p.landlordInsurance +
                  p.propertyTax + p.maintenanceWorks + p.condoFees + p.accountingFees + p.otherDeductible
                )} de charges`}
              />
            ))}
          </View>
        </View>

        <Footer taxYear={data.taxYear} />
      </Page>

      {/* ── Page 4: Reporter le résultat + conseils ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerBrand}>Flash Locatif</Text>
          <Text style={styles.headerMeta}>Reporter le résultat — Conseils</Text>
        </View>

        {/* Step 5 */}
        <View style={styles.stepContainer}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepNumber}>5</Text>
            <Text style={styles.stepTitle}>Reportez le résultat net</Text>
          </View>
          <View style={styles.stepBody}>
            {!isDeficit ? (
              <>
                <Text style={styles.stepText}>
                  Votre revenu net foncier est positif. Reportez-le en case 4BA.
                </Text>
                <View style={styles.stepHighlight}>
                  <Text style={styles.stepHighlightText}>Case 4BA — Revenu net foncier</Text>
                  <Text style={styles.stepHighlightSub}>{eur(data.netFoncierFinal)}</Text>
                </View>
                <Text style={styles.stepText}>
                  {"Ce montant s'ajoutera à vos autres revenus pour le calcul de l'impôt sur le revenu. Il sera également soumis aux prélèvements sociaux (17,2 %)."}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.stepText}>
                  Votre résultat est déficitaire. Voici comment le reporter :
                </Text>
                {data.deficitImputableOnRevenuGlobal > 0 && (
                  <View style={styles.stepHighlight}>
                    <Text style={styles.stepHighlightText}>Case 4BB — Déficit imputable sur revenu global</Text>
                    <Text style={styles.stepHighlightSub}>{eur(data.deficitImputableOnRevenuGlobal)}</Text>
                  </View>
                )}
                {data.deficitCarriedForward > 0 && (
                  <View style={styles.stepHighlight}>
                    <Text style={styles.stepHighlightText}>Case 4BC — Déficit à reporter (revenus fonciers futurs)</Text>
                    <Text style={styles.stepHighlightSub}>{eur(data.deficitCarriedForward)}</Text>
                  </View>
                )}
                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>
                    {"⚠️ La part du déficit liée aux intérêts d'emprunt ne peut s'imputer que sur vos revenus fonciers futurs (case 4BC), jamais sur le revenu global."}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Step 6 */}
        <View style={styles.stepContainer}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepNumber}>6</Text>
            <Text style={styles.stepTitle}>Vérifiez et validez votre déclaration</Text>
          </View>
          <View style={styles.stepBody}>
            <Bullet text="Vérifiez le récapitulatif proposé par impots.gouv.fr avant de valider." />
            <Bullet text="Comparez le montant repris avec votre formulaire 2044 Flash Locatif." />
            <Bullet text="Validez et signez électroniquement votre déclaration." />
            <Bullet text="Conservez le numéro de confirmation et votre formulaire 2044 Flash Locatif pendant 3 ans." />
          </View>
        </View>

        {/* Final note */}
        <View style={[styles.warningBox, { marginTop: 8 }]}>
          <Text style={[styles.warningText, { fontFamily: "Helvetica-Bold", marginBottom: 3 }]}>
            Important — Limites de ce document
          </Text>
          <Text style={styles.warningText}>
            {"Flash Locatif est un outil d'aide à la déclaration, non un cabinet comptable agréé. Les montants calculés sont basés sur les données que vous avez saisies. En cas de situation complexe (SCI, LMNP, démembrement de propriété, plus-value immobilière), consultez un expert-comptable ou le service des impôts."}
          </Text>
        </View>

        <Footer taxYear={data.taxYear} />
      </Page>
    </Document>
  );
}
