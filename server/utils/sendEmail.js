// Mock email sender — in this demo we just log to the console instead of
// integrating a real mail provider (e.g. SendGrid, Nodemailer + SMTP).
export const sendMockEmail = ({ to, subject, text }) => {
  console.log(
    `\n📧 [MOCK EMAIL] → ${to}\n   Subject: ${subject}\n   ${text}\n`
  );
};
