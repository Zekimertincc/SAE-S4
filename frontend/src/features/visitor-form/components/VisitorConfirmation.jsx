import styled, { keyframes, createGlobalStyle } from "styled-components";

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

const Page = styled.div`
  min-height: 100vh;
  display: flex;
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
  padding: 48px 36px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: ${fadeUp} 0.5s ease forwards;
  text-align: center;
`;

const CheckCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  animation: ${scaleIn} 0.5s ease forwards;
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

const Title = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 8px;
  font-family: 'Montserrat', sans-serif;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 32px;
  font-family: 'Montserrat', sans-serif;
`;

const RecapBox = styled.div`
  background: #f9fafb;
  border-radius: 14px;
  padding: 20px 24px;
  text-align: left;
  margin-bottom: 24px;
`;

const RecapTitle = styled.p`
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 14px;
  font-family: 'Montserrat', sans-serif;
`;

const RecapRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child { border-bottom: none; }
`;

const RecapKey = styled.span`
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  font-family: 'Montserrat', sans-serif;
`;

const RecapValue = styled.span`
  font-size: 13px;
  color: #111827;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
`;

const Footer = styled.p`
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.6;
  font-family: 'Montserrat', sans-serif;
`;

export default function VisitorConfirmation({ visitor }) {
  return (
    <>
      <GlobalStyle />
      <Page>
        <Card>
          <CheckCircle>
            <CheckSvg viewBox="0 0 52 52">
              <polyline points="14,27 22,35 38,19" />
            </CheckSvg>
          </CheckCircle>

          <Title>Inscription enregistrée !</Title>
          <Subtitle>Merci pour votre visite à la JPO de l'IUT de Montreuil</Subtitle>

          <RecapBox>
            <RecapTitle>Récapitulatif</RecapTitle>
            <RecapRow>
              <RecapKey>Nom complet</RecapKey>
              <RecapValue>{visitor.first_name} {visitor.last_name}</RecapValue>
            </RecapRow>
            <RecapRow>
              <RecapKey>Email</RecapKey>
              <RecapValue>{visitor.email}</RecapValue>
            </RecapRow>
            <RecapRow>
              <RecapKey>Département visité</RecapKey>
              <RecapValue>{visitor.department}</RecapValue>
            </RecapRow>
            <RecapRow>
              <RecapKey>Bac préparé</RecapKey>
              <RecapValue>{visitor.bac_type}</RecapValue>
            </RecapRow>
            {visitor.etablissement && (
              <RecapRow>
                <RecapKey>Lycée</RecapKey>
                <RecapValue>{visitor.etablissement}</RecapValue>
              </RecapRow>
            )}
            {visitor.immersion && (
              <RecapRow>
                <RecapKey>Immersion</RecapKey>
                <RecapValue>✓ Intéressé(e)</RecapValue>
              </RecapRow>
            )}
          </RecapBox>

          <Footer>
            Vos données seront supprimées après la période Parcoursup conformément au RGPD.
          </Footer>
        </Card>
      </Page>
    </>
  );
}