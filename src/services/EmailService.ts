export interface EmailService {
  sendPurchaseConfirmation(to: string, name: string, productName: string): Promise<void>;
}

class ConsoleEmailService implements EmailService {
  async sendPurchaseConfirmation(to: string, name: string, productName: string) {
    // Dev stand-in. Swap for a real provider (Resend, SES, Postmark) behind
    // this same interface — never put a permanent file URL in the email body,
    // only a link to /dashboard/databases.
    console.log(`[email] Your HIREBEAR database is ready -> ${to}`);
    console.log(`Hi ${name}, thanks for purchasing ${productName}. Open My Databases: ${process.env.APP_URL}/dashboard/databases`);
  }
}

export function getEmailService(): EmailService {
  return new ConsoleEmailService();
}
