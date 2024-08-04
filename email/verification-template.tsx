import * as React from 'react';
import { 
  Html, 
  Head, 
  Body, 
  Container, 
  Section, 
  Text, 
  Heading, 
  Hr, 
  Img 
} from '@react-email/components';
import { appData } from '@/constants/app-data';

interface VerificationTemplateProps {
  code: string;
}

export const VerificationTemplate: React.FC<Readonly<VerificationTemplateProps>> = ({
  code,
}) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src={appData.emailLogoUrl}
              width={appData.emailLogoWidth}
              height={appData.emailLogoHeight}
              alt={`${appData.appName} Logo`}
              style={logoStyle}
            />
          </Section>
          <Heading style={h1}>Verify Your Email Address</Heading>
          <Text style={text}>Hello,</Text>
          <Text style={text}>
            Thank you for signing up! To complete your registration, please use the following One-Time Password (OTP) to verify your email address:
          </Text>
          <Section style={otpContainer}>
            <Text style={otp}>{code}</Text>
          </Section>
          <Text style={text}>
            Enter this code on our website to confirm your email address. This code will expire in {appData.otpExpirationTime}.
          </Text>
          <Text style={text}>
            If you didn't create an account with us, you can safely ignore this email.
          </Text>
          <Text style={text}>
            Best regards,<br/>{appData.appName} Team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            This email was sent by {appData.appName}. Please do not reply to this email.
          </Text>
          {appData.companyAddress && appData.companyAddress != '' && (
            <Text style={footer}>{appData.companyAddress}</Text>
          )}
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '20px',
  width: '100%',
};
const logoStyle = {
  margin: '0 auto',
  display: 'block',
};


const h1 = {
  color: '#444',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
};

const otpContainer = {
  margin: '20px 0',
};

const otp = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  letterSpacing: '5px',
  padding: '10px',
  backgroundColor: '#e9e9e9',
  borderRadius: '5px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};

export default VerificationTemplate;