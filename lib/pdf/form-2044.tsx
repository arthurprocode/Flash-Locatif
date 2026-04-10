import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PropertyData {
  name: string;
  grossRent: number;
  rentChargesRecovered: number;
  mortgageInterest: number;
  propertyManagementFees: number;
  landlordInsurance: number;
  propertyTax: number;
  maintenanceWorks: number;
  condoFees: number;
  accountingFees: number;
  otherDeductible: number;
}

export interface Form2044Data {
  taxYear: number;
  userEmail: string;
  properties: PropertyData[];
  previousDeficits: { year: number; interestPortion: number; otherPortion: number }[];
  // Calculated totals
  totalGrossIncome: number;
  totalDeductibleExpenses: number;
  netFoncierBeforeDeficit: number;
  deficitApplied: number;
  netFoncierFinal: number;
  deficitGeneratedThisYear: number;
  deficitImputableOnRevenuGlobal: number;
  deficitCarriedForward: number;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    padding: 30,
    backgroundColor: "#ffffff",
    color: "#1a1a1a",
  },
  // Header
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#1E5FA8",
  },
  brand: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#1E5FA8",
  },
  formTitle: {
    textAlign: "right",
  },
  formTitleMain: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  formTitleSub: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 2,
  },
  // Section
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    backgroundColor: "#1E5FA8",
    padding: "5 8",
    marginBottom: 0,
  },
  sectionHeaderText: {
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionBody: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderTopWidth: 0,
    padding: "6 8",
  },
  // Table
  table: {
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 4,
    minHeight: 18,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableRowTotal: {
    flexDirection: "row",
    backgroundColor: "#f0f4fb",
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#1E5FA8",
    marginTop: 2,
  },
  tableLabel: {
    flex: 1,
    color: "#374151",
  },
  tableCode: {
    width: 40,
    color: "#9ca3af",
    fontSize: 7.5,
    textAlign: "center",
  },
  tableValue: {
    width: 80,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  tableValueNegative: {
    width: 80,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    color: "#c0392b",
  },
  // Property header
  propertyHeader: {
    backgroundColor: "#EBF3FB",
    padding: "4 8",
    marginBottom: 0,
    borderLeftWidth: 3,
    borderLeftColor: "#1E5FA8",
  },
  propertyHeaderText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#1E5FA8",
  },
  propertyBody: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderTopWidth: 0,
    padding: "4 8",
    marginBottom: 8,
  },
  // Info row
  infoRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  infoLabel: {
    width: 120,
    color: "#6b7280",
  },
  infoValue: {
    flex: 1,
    fontFamily: "Helvetica-Bold",
  },
  // Disclaimer
  disclaimer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#d1d5db",
    fontSize: 7,
    color: "#9ca3af",
    textAlign: "center",
  },
  // Page number
  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: 30,
    fontSize: 7,
    color: "#9ca3af",
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function eur(value: number): string {
  return value.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function Row({
  label,
  code,
  value,
  isTotal = false,
  isLast = false,
  negative = false,
}: {
  label: string;
  code?: string;
  value: number;
  isTotal?: boolean;
  isLast?: boolean;
  negative?: boolean;
}) {
  const rowStyle = isTotal ? styles.tableRowTotal : isLast ? { ...styles.tableRow, ...styles.tableRowLast } : styles.tableRow;
  const valueStyle = negative ? styles.tableValueNegative : styles.tableValue;

  return (
    <View style={rowStyle}>
      <Text style={styles.tableLabel}>{label}</Text>
      {code ? <Text style={styles.tableCode}>{code}</Text> : <View style={{ width: 40 }} />}
      <Text style={valueStyle}>{eur(value)}</Text>
    </View>
  );
}

// ─── Main Document ────────────────────────────────────────────────────────────

export function Form2044Document({ data }: { data: Form2044Data }) {
  const totalInterest = data.properties.reduce((s, p) => s + p.mortgageInterest, 0);

  return (
    <Document
      title={`Formulaire 2044 — Revenus fonciers ${data.taxYear}`}
      author="Flash Locatif"
      subject={`Déclaration revenus fonciers ${data.taxYear}`}
    >
      {/* ── Page 1: Récapitulatif ── */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.brand}>Flash Locatif</Text>
          <View style={styles.formTitle}>
            <Text style={styles.formTitleMain}>FORMULAIRE 2044</Text>
            <Text style={styles.formTitleSub}>Déclaration des revenus fonciers — Année {data.taxYear}</Text>
          </View>
        </View>

        {/* Identification */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Informations déclarant</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Compte :</Text>
              <Text style={styles.infoValue}>{data.userEmail}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{"Année d'imposition :"}</Text>
              <Text style={styles.infoValue}>{data.taxYear}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre de biens :</Text>
              <Text style={styles.infoValue}>{data.properties.length}</Text>
            </View>
          </View>
        </View>

        {/* Global summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Récapitulatif — Régime réel (case 4BA / 4BB / 4BC)</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.table}>
              <Row label="Total des loyers bruts (case 210)" code="210" value={data.totalGrossIncome} />
              <Row label="Total des charges déductibles (case 240)" code="240" value={data.totalDeductibleExpenses} />
              <Row
                label="Revenu net foncier avant déficits antérieurs"
                value={data.netFoncierBeforeDeficit}
                negative={data.netFoncierBeforeDeficit < 0}
              />
              {data.deficitApplied > 0 && (
                <Row label="Déficits antérieurs imputés" value={-data.deficitApplied} negative />
              )}
              <Row
                label={data.netFoncierFinal >= 0 ? "Revenu net foncier imposable (case 4BA)" : "Déficit foncier (case 4BB / 4BC)"}
                code={data.netFoncierFinal >= 0 ? "4BA" : data.deficitImputableOnRevenuGlobal > 0 ? "4BB" : "4BC"}
                value={Math.abs(data.netFoncierFinal)}
                isTotal
                negative={data.netFoncierFinal < 0}
              />
            </View>
          </View>
        </View>

        {/* Deficit details if any */}
        {data.deficitGeneratedThisYear > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Détail du déficit foncier {data.taxYear}</Text>
            </View>
            <View style={styles.sectionBody}>
              <View style={styles.table}>
                <Row label="Déficit total généré" value={data.deficitGeneratedThisYear} />
                <Row label="dont : part intérêts d'emprunt (case 4BC — report uniquement)" value={totalInterest > data.deficitGeneratedThisYear ? data.deficitGeneratedThisYear : totalInterest} />
                {data.deficitImputableOnRevenuGlobal > 0 && (
                  <Row
                    label={`Part imputable sur revenu global ${data.taxYear} (case 4BB — max 10 750 €)`}
                    code="4BB"
                    value={data.deficitImputableOnRevenuGlobal}
                    isTotal
                  />
                )}
                {data.deficitCarriedForward > 0 && (
                  <Row
                    label="Report sur revenus fonciers futurs (10 ans)"
                    code="4BC"
                    value={data.deficitCarriedForward}
                  />
                )}
              </View>
            </View>
          </View>
        )}

        {/* Previous deficits used */}
        {data.deficitApplied > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Déficits antérieurs imputés en {data.taxYear}</Text>
            </View>
            <View style={styles.sectionBody}>
              <Text style={{ fontSize: 8, color: "#6b7280" }}>
                Montant total imputé sur le revenu foncier {data.taxYear} : {eur(data.deficitApplied)}
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.disclaimer}>
          Ce document est généré par Flash Locatif à titre indicatif. Il ne se substitue pas à un conseil fiscal professionnel.
          Vérifiez et reportez les montants sur votre déclaration en ligne sur impots.gouv.fr.
          Flash Locatif — flashlocatif.fr
        </Text>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </Page>

      {/* ── Page 2+: Détail par bien ── */}
      {data.properties.map((property, idx) => {
        const totalCharges =
          property.mortgageInterest +
          property.propertyManagementFees +
          property.landlordInsurance +
          property.propertyTax +
          property.maintenanceWorks +
          property.condoFees +
          property.accountingFees +
          property.otherDeductible;

        const netIncome = property.grossRent - totalCharges;

        return (
          <Page key={idx} size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.brand}>Flash Locatif</Text>
              <View style={styles.formTitle}>
                <Text style={styles.formTitleMain}>FORMULAIRE 2044 — Bien {idx + 1}</Text>
                <Text style={styles.formTitleSub}>Revenus fonciers {data.taxYear}</Text>
              </View>
            </View>

            {/* Property header */}
            <View style={styles.propertyHeader}>
              <Text style={styles.propertyHeaderText}>
                Bien {idx + 1} : {property.name}
              </Text>
            </View>
            <View style={[styles.propertyBody, { marginBottom: 12 }]}>
              {/* Revenus */}
              <View style={styles.section}>
                <View style={{ backgroundColor: "#f9fafb", padding: "4 6", marginBottom: 4 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#374151" }}>
                    A — Revenus bruts
                  </Text>
                </View>
                <View style={styles.table}>
                  <Row label="Loyers bruts perçus (case 210)" code="210" value={property.grossRent} />
                  {property.rentChargesRecovered > 0 && (
                    <Row label="dont charges récupérées sur locataire" value={property.rentChargesRecovered} />
                  )}
                </View>
              </View>

              {/* Charges */}
              <View style={[styles.section, { marginTop: 8 }]}>
                <View style={{ backgroundColor: "#f9fafb", padding: "4 6", marginBottom: 4 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#374151" }}>
                    B — Charges déductibles
                  </Text>
                </View>
                <View style={styles.table}>
                  {property.mortgageInterest > 0 && (
                    <Row label="Intérêts d'emprunt (case 250)" code="250" value={property.mortgageInterest} />
                  )}
                  {property.propertyManagementFees > 0 && (
                    <Row label="Frais de gestion (case 221)" code="221" value={property.propertyManagementFees} />
                  )}
                  {property.landlordInsurance > 0 && (
                    <Row label="Assurance PNO (case 221)" code="221" value={property.landlordInsurance} />
                  )}
                  {property.propertyTax > 0 && (
                    <Row label="Taxe foncière hors TEOM (case 227)" code="227" value={property.propertyTax} />
                  )}
                  {property.maintenanceWorks > 0 && (
                    <Row label="Travaux d'entretien et réparation (case 224)" code="224" value={property.maintenanceWorks} />
                  )}
                  {property.condoFees > 0 && (
                    <Row label="Charges de copropriété (case 229)" code="229" value={property.condoFees} />
                  )}
                  {property.accountingFees > 0 && (
                    <Row label="Frais de comptabilité" value={property.accountingFees} />
                  )}
                  {property.otherDeductible > 0 && (
                    <Row label="Autres charges déductibles" value={property.otherDeductible} isLast />
                  )}
                  <Row label="Total charges déductibles (case 240)" code="240" value={totalCharges} isTotal />
                </View>
              </View>

              {/* Net */}
              <View style={[styles.section, { marginTop: 8 }]}>
                <View style={{ backgroundColor: "#f9fafb", padding: "4 6", marginBottom: 4 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#374151" }}>
                    C — Résultat net
                  </Text>
                </View>
                <View style={styles.table}>
                  <Row
                    label={netIncome >= 0 ? "Revenu net foncier" : "Déficit foncier"}
                    value={Math.abs(netIncome)}
                    isTotal
                    negative={netIncome < 0}
                  />
                </View>
              </View>
            </View>

            <Text style={styles.disclaimer}>
              Flash Locatif — Document indicatif. Vérifiez sur impots.gouv.fr — flashlocatif.fr
            </Text>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            />
          </Page>
        );
      })}
    </Document>
  );
}
