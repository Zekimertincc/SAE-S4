import { useState } from "react";
import axios from "axios";
import styled, { keyframes, createGlobalStyle } from "styled-components";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Montserrat', sans-serif; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
`;

const drawCheck = keyframes`
  0%   { stroke-dashoffset: 100; }
  100% { stroke-dashoffset: 0; }
`;

const successPulse = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  70%  { box-shadow: 0 0 0 20px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
`;

const fadeOut = keyframes`
  0%   { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.95); }
`;


const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4f8;
  padding: 24px;
  font-family: 'Montserrat', sans-serif;
`;

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 20px;
  padding: 48px 40px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
  animation: ${({ success }) => success ? fadeOut : fadeUp} 0.5s ease forwards;

  @media (max-width: 480px) {
    padding: 32px 20px;
  }
`;

const SuccessCard = styled.div`
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 20px;
  padding: 48px 40px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${fadeUp} 0.4s ease forwards;
`;

const CheckCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  animation: ${scaleIn} 0.5s ease forwards, ${successPulse} 1s ease 0.5s;
`;

const CheckSvg = styled.svg`
  width: 40px;
  height: 40px;

  polyline {
    stroke: white;
    stroke-width: 4;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: ${drawCheck} 0.4s ease 0.3s forwards;
  }
`;

const SuccessTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
  font-family: 'Montserrat', sans-serif;
`;

const SuccessText = styled.p`
  font-size: 14px;
  color: #6b7280;
  font-family: 'Montserrat', sans-serif;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 36px;
`;

const Logo = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: #1e3a5f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 auto 20px;
  letter-spacing: -1px;
  font-family: 'Montserrat', sans-serif;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
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
  margin-bottom: 18px;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-family: 'Montserrat', sans-serif;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  color: #111827;
  font-size: 15px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  outline: none;
  transition: all 0.2s;

  &::placeholder { color: #9ca3af; font-weight: 400; }

  &:focus {
    border-color: #1e3a5f;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.08);
  }
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 12px 16px;
  color: #dc2626;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;
  font-family: 'Montserrat', sans-serif;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 12px;
  background: #1e3a5f;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 52px;
  margin-top: 8px;

  &:hover:not(:disabled) {
    background: #162d4a;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(30, 58, 95, 0.25);
  }

  &:active:not(:disabled) { transform: scale(0.98); }

  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f3f4f6;
  margin: 24px 0;
`;

const Footer = styled.p`
  text-align: center;
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.3px;
`;

export default function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/api/auth`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.email);

      setSuccess(true);
      setTimeout(() => {
        onLogin(res.data.token);
      }, 1800);

    } catch (err) {
      setError(err.response?.data?.error || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <GlobalStyle />
        <Page>
          <SuccessCard>
            <CheckCircle>
              <CheckSvg viewBox="0 0 52 52">
                <polyline points="14,27 22,35 38,19" />
              </CheckSvg>
            </CheckCircle>
            <SuccessTitle>Connexion réussie !</SuccessTitle>
            <SuccessText>Bienvenue dans l'espace gestionnaire</SuccessText>
          </SuccessCard>
        </Page>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Page>
        <Card>
          <Header>
            <Logo>JPO</Logo>
            <Title>Espace Gestionnaire</Title>
            <Subtitle>IUT de Montreuil — Journée Portes Ouvertes</Subtitle>
          </Header>

          <form onSubmit={handleSubmit}>
            <Field>
              <Label>Adresse email</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@iut-montreuil.fr"
                required
                autoComplete="email"
              />
            </Field>

            <Field>
              <Label>Mot de passe</Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </Field>

            {error && <ErrorBox>⚠ {error}</ErrorBox>}

            <Button type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter →"}
            </Button>
          </form>

          <Divider />
          <Footer>Accès réservé au personnel autorisé — IUT de Montreuil</Footer>
        </Card>
      </Page>
    </>
  );
}