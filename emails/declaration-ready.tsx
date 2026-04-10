import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface DeclarationReadyEmailProps {
  userEmail: string;
  taxYear: number;
  declarationId: string;
  netFoncierFinal: number;
  isDeficit: boolean;
  recommendedRegime: "micro" | "reel";
}

export function DeclarationReadyEmail({
  userEmail,
  taxYear,
  declarationId,
  netFoncierFinal,
  isDeficit,
  recommendedRegime,
}: DeclarationReadyEmailProps) {
  const documentsUrl = `https://flashlocatif.fr/declaration/${declarationId}/documents`;

  const resultLabel = isDeficit
    ? `Déficit foncier de ${Math.abs(netFoncierFinal).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`
    : `Revenu net foncier de ${netFoncierFinal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`;

  const regimeLabel =
    recommendedRegime === "micro" ? "Micro-foncier (30 % d'abattement)" : "Régime réel";

  return (
    <Html lang="fr" dir="ltr">
      <Head />
      <Preview>
        {`Vos documents Flash Locatif ${taxYear} sont prêts — formulaire 2044 et guide disponibles`}
      </Preview>

      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={brandText}>Flash Locatif</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>
              Vos documents {taxYear} sont prêts ✅
            </Heading>

            <Text style={paragraph}>Bonjour,</Text>

            <Text style={paragraph}>
              Votre déclaration de revenus fonciers {taxYear} a été traitée avec
              succès. Vos documents sont disponibles en téléchargement.
            </Text>

            {/* Result summary box */}
            <Section style={summaryBox}>
              <Text style={summaryTitle}>Récapitulatif de votre simulation</Text>
              <Text style={summaryRow}>
                <strong>Régime recommandé :</strong> {regimeLabel}
              </Text>
              <Text style={summaryRow}>
                <strong>Résultat :</strong>{" "}
                <span style={isDeficit ? { color: "#c0392b" } : { color: "#1a7a4a" }}>
                  {resultLabel}
                </span>
              </Text>
            </Section>

            <Section style={ctaSection}>
              <Button style={button} href={documentsUrl}>
                Télécharger mes documents →
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={sectionTitle}>Ce que vous trouverez dans vos documents</Text>

            <Text style={docItem}>
              📄 <strong>Formulaire 2044 pré-rempli</strong> — tous vos revenus
              et charges par bien, avec les cases cerfa correspondantes.
            </Text>
            <Text style={docItem}>
              📘 <strong>Guide de déclaration</strong> — comment reporter vos
              résultats sur impots.gouv.fr, étape par étape.
            </Text>

            <Hr style={hr} />

            <Text style={warningText}>
              ⚠️ <strong>Rappel important :</strong> Flash Locatif est un outil
              d&apos;aide à la déclaration. Vérifiez toujours vos documents avant
              de les reporter sur impots.gouv.fr. En cas de doute, consultez un
              expert-comptable.
            </Text>

            <Hr style={hr} />

            <Section style={ctaSecondary}>
              <Button style={buttonOutline} href="https://www.impots.gouv.fr/particulier/declarer-mes-revenus">
                Aller sur impots.gouv.fr
              </Button>
            </Section>

            <Text style={paragraph}>
              Des questions ? Contactez-nous à{" "}
              <Link href="mailto:contact@flashlocatif.fr" style={link}>
                contact@flashlocatif.fr
              </Link>
            </Text>

            <Text style={paragraph}>
              À bientôt,
              <br />
              L&apos;équipe Flash Locatif
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Flash Locatif — La déclaration foncière simplifiée
            </Text>
            <Text style={footerText}>
              <Link href="https://flashlocatif.fr/mentions-legales" style={footerLink}>
                Mentions légales
              </Link>{" "}
              ·{" "}
              <Link href="https://flashlocatif.fr/cgv" style={footerLink}>
                CGV
              </Link>{" "}
              ·{" "}
              <Link href="https://flashlocatif.fr/confidentialite" style={footerLink}>
                Confidentialité
              </Link>
            </Text>
            <Text style={footerText}>
              Cet email a été envoyé à {userEmail}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const main: React.CSSProperties = {
  backgroundColor: "#f3f4f6",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const header: React.CSSProperties = {
  backgroundColor: "#1E5FA8",
  padding: "24px 32px",
};

const brandText: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "800",
  margin: "0",
};

const content: React.CSSProperties = {
  padding: "32px",
};

const h1: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#111827",
  margin: "0 0 20px",
  lineHeight: "1.3",
};

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  color: "#374151",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#111827",
  margin: "0 0 12px",
};

const summaryBox: React.CSSProperties = {
  backgroundColor: "#EBF3FB",
  borderLeft: "4px solid #1E5FA8",
  borderRadius: "4px",
  padding: "16px 20px",
  margin: "0 0 24px",
};

const summaryTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "700",
  color: "#1E5FA8",
  margin: "0 0 10px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const summaryRow: React.CSSProperties = {
  fontSize: "14px",
  color: "#374151",
  margin: "0 0 6px",
  lineHeight: "1.5",
};

const docItem: React.CSSProperties = {
  fontSize: "14px",
  color: "#374151",
  lineHeight: "1.6",
  margin: "0 0 10px",
};

const warningText: React.CSSProperties = {
  fontSize: "13px",
  color: "#92400e",
  backgroundColor: "#fffbeb",
  border: "1px solid #fde68a",
  borderRadius: "4px",
  padding: "12px 16px",
  margin: "0 0 16px",
  lineHeight: "1.6",
};

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  margin: "28px 0",
};

const ctaSecondary: React.CSSProperties = {
  textAlign: "center",
  margin: "0 0 24px",
};

const button: React.CSSProperties = {
  backgroundColor: "#1E5FA8",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  padding: "13px 28px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
};

const buttonOutline: React.CSSProperties = {
  backgroundColor: "#ffffff",
  color: "#1E5FA8",
  fontSize: "14px",
  fontWeight: "600",
  padding: "10px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
  border: "1.5px solid #1E5FA8",
};

const link: React.CSSProperties = {
  color: "#1E5FA8",
  textDecoration: "underline",
};

const hr: React.CSSProperties = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const footer: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  padding: "20px 32px",
  borderTop: "1px solid #e5e7eb",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "0 0 6px",
  textAlign: "center",
};

const footerLink: React.CSSProperties = {
  color: "#6b7280",
  textDecoration: "underline",
};
