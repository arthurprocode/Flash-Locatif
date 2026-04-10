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

interface WelcomeEmailProps {
  userEmail: string;
}

export function WelcomeEmail({ userEmail }: WelcomeEmailProps) {
  return (
    <Html lang="fr" dir="ltr">
      <Head />
      <Preview>
        Bienvenue sur Flash Locatif — votre outil de déclaration foncière
      </Preview>

      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={brandText}>Flash Locatif</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>Bienvenue sur Flash Locatif 🏠</Heading>

            <Text style={paragraph}>Bonjour,</Text>

            <Text style={paragraph}>
              Votre compte Flash Locatif a bien été créé avec l&apos;adresse{" "}
              <strong>{userEmail}</strong>.
            </Text>

            <Text style={paragraph}>
              Flash Locatif vous permet de simplifier votre déclaration de revenus
              fonciers : calcul automatique du régime optimal (micro-foncier ou
              régime réel), génération de votre formulaire 2044 pré-rempli et
              guide pas à pas pour impots.gouv.fr.
            </Text>

            <Section style={ctaSection}>
              <Button style={button} href="https://flashlocatif.fr/dashboard">
                Commencer ma déclaration →
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={sectionTitle}>Comment ça marche ?</Text>

            <Text style={step}>
              <strong>1. Renseignez vos biens</strong> — adresses et nombre de
              propriétés locatives.
            </Text>
            <Text style={step}>
              <strong>2. Saisissez revenus et charges</strong> — loyers perçus,
              intérêts d&apos;emprunt, taxe foncière, travaux…
            </Text>
            <Text style={step}>
              <strong>3. Visualisez votre simulation</strong> — Flash Locatif
              compare les deux régimes et recommande le plus avantageux.
            </Text>
            <Text style={step}>
              <strong>4. Téléchargez vos documents</strong> — formulaire 2044
              pré-rempli + guide de déclaration PDF.
            </Text>

            <Hr style={hr} />

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
              Vous recevez cet email car vous avez créé un compte sur{" "}
              <Link href="https://flashlocatif.fr" style={footerLink}>
                flashlocatif.fr
              </Link>
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
  letterSpacing: "-0.5px",
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

const step: React.CSSProperties = {
  fontSize: "14px",
  color: "#374151",
  lineHeight: "1.6",
  margin: "0 0 10px",
  paddingLeft: "8px",
};

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  margin: "28px 0",
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
