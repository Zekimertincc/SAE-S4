import { useState } from "react";
import axios from "axios";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import VisitorConfirmation from "./VisitorConfirmation";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Montserrat', sans-serif; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5986 100%);
  padding: 24px;
  font-family: 'Montserrat', sans-serif;
`;

const Card = styled.div`
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-radius: 24px;
  padding: 40px 36px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: ${fadeUp} 0.5s ease forwards;

  @media (max-width: 480px) {
    padding: 28px 20px;
    border-radius: 16px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Logo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #f0f4f8;
  border-radius: 12px;
  padding: 10px 20px;
  margin-bottom: 16px;
`;

const LogoText = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #1e3a5f;
  font-family: 'Montserrat', sans-serif;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 6px;
  font-family: 'Montserrat', sans-serif;
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  font-family: 'Montserrat', sans-serif;
`;

const Field = styled.div`
  margin-bottom: 16px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  font-family: 'Montserrat', sans-serif;
`;

const Input = styled.input`
  width: 100%;
  padding: 13px 14px;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  color: #111827;
  font-size: 15px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  outline: none;
  transition: all 0.2s;

  &::placeholder { color: #9ca3af; font-weight: 400; }

  &:focus {
    border-color: #1e3a5f;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.08);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 13px 14px;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  color: #111827;
  font-size: 15px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;

  &:focus {
    border-color: #1e3a5f;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.08);
  }
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  font-family: 'Montserrat', sans-serif;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #1e3a5f;
    cursor: pointer;
    flex-shrink: 0;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #f3f4f6;
  margin: 20px 0;
`;

const SectionTitle = styled.p`
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 14px;
  font-family: 'Montserrat', sans-serif;
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 12px 14px;
  color: #dc2626;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;
  font-family: 'Montserrat', sans-serif;
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  background: #1e3a5f;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 54px;
  margin-top: 8px;

  &:hover:not(:disabled) {
    background: #162d4a;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(30, 58, 95, 0.3);
  }

  &:active:not(:disabled) { transform: scale(0.98); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const RGPDText = styled.p`
  font-size: 11px;
  color: #9ca3af;
  text-align: center;
  margin-top: 16px;
  line-height: 1.6;
  font-family: 'Montserrat', sans-serif;
`;

const DEPARTMENTS = ["Informatique", "GEII", "TC", "GEA", "MMI", "CS"];
const BAC_TYPES = ["Général", "STI2D", "STMG", "ST2S", "Pro", "Autre"];
const SPECIALITES = [
  "Mathématiques", "NSI", "Physique-Chimie", "SVT", "SES",
  "Histoire-Géo", "Arts", "LLCE", "HLP", "Autre"
];

export default function VisitorForm() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    bac_type: "",
    department: "",
    etablissement: "",
    ville: "",
    specialite_1: "",
    specialite_2: "",
    reorientation: false,
    immersion: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedVisitor, setSubmittedVisitor] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/api/visitors`, form);
      setSubmittedVisitor(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (submittedVisitor) {
    return <VisitorConfirmation visitor={submittedVisitor} />;
  }

  return (
    <>
      <GlobalStyle />
      <Page>
        <Card>
          <Header>
            <Logo>
              <LogoText>🎓 IUT de Montreuil — JPO 2026</LogoText>
            </Logo>
            <Title>Bienvenue !</Title>
            <Subtitle>Enregistrez votre visite en quelques secondes</Subtitle>
          </Header>

          <form onSubmit={handleSubmit}>

            <Row>
              <Field>
                <Label>Prénom *</Label>
                <Input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="Alice"
                  required
                />
              </Field>
              <Field>
                <Label>Nom *</Label>
                <Input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Martin"
                  required
                />
              </Field>
            </Row>

            <Field>
              <Label>Email *</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="alice@mail.com"
                required
              />
            </Field>

            <Divider />
            <SectionTitle>Votre parcours</SectionTitle>

            <Row>
              <Field>
                <Label>Bac préparé *</Label>
                <Select
                  name="bac_type"
                  value={form.bac_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choisir...</option>
                  {BAC_TYPES.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label>Département visité *</Label>
                <Select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choisir...</option>
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </Select>
              </Field>
            </Row>

            {form.bac_type === "Général" && (
              <Row>
                <Field>
                  <Label>Spécialité 1</Label>
                  <Select name="specialite_1" value={form.specialite_1} onChange={handleChange}>
                    <option value="">Choisir...</option>
                    {SPECIALITES.map(s => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </Field>
                <Field>
                  <Label>Spécialité 2</Label>
                  <Select name="specialite_2" value={form.specialite_2} onChange={handleChange}>
                    <option value="">Choisir...</option>
                    {SPECIALITES.map(s => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </Field>
              </Row>
            )}

            <Row>
              <Field>
                <Label>Lycée</Label>
                <Input
                  type="text"
                  name="etablissement"
                  value={form.etablissement}
                  onChange={handleChange}
                  placeholder="Lycée Henri IV"
                />
              </Field>
              <Field>
                <Label>Ville</Label>
                <Input
                  type="text"
                  name="ville"
                  value={form.ville}
                  onChange={handleChange}
                  placeholder="Paris"
                />
              </Field>
            </Row>

            <Divider />

            <CheckboxRow>
              <input
                type="checkbox"
                name="reorientation"
                checked={form.reorientation}
                onChange={handleChange}
              />
              Je suis en réorientation
            </CheckboxRow>

            <CheckboxRow>
              <input
                type="checkbox"
                name="immersion"
                checked={form.immersion}
                onChange={handleChange}
              />
              Je suis intéressé(e) par une immersion
            </CheckboxRow>

            {error && <ErrorBox>⚠ {error}</ErrorBox>}

            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "S'inscrire →"}
            </Button>
          </form>

          <RGPDText>
            Vos données sont collectées uniquement dans le cadre de la JPO et seront supprimées après la période Parcoursup. Conformément au RGPD.
          </RGPDText>
        </Card>
      </Page>
    </>
  );
}