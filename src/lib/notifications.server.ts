import nodemailer from "nodemailer";

// Helper to send SMS via TextBee or Twilio with mock fallback
export async function sendSMS(to: string, message: string): Promise<{ success: boolean; isMock: boolean; gatewayError?: string }> {
  const textbeeApiKey = process.env.TEXTBEE_API_KEY;
  const textbeeDeviceId = process.env.TEXTBEE_DEVICE_ID;
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  let smsSent = false;
  let smsError = "";

  // Make sure the recipient has a "+" prefix if not present (TextBee/Twilio standard E.164 formatting)
  const formattedTo = to.startsWith("+") ? to : `+${to}`;

  // 1. Try sending via TextBee if keys are present
  if (textbeeApiKey && textbeeDeviceId) {
    try {
      const response = await fetch(`https://api.textbee.dev/api/v1/gateway/devices/${textbeeDeviceId}/send-sms`, {
        method: "POST",
        headers: {
          "x-api-key": textbeeApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients: [formattedTo],
          message,
        }),
      });

      if (response.ok) {
        smsSent = true;
        console.log(`[TextBee SMS] Sent message to ${formattedTo}`);
      } else {
        const errData = await response.json().catch(() => ({}));
        smsError = errData.message || "TextBee API failure";
        console.error("[TextBee SMS Error]:", errData);
      }
    } catch (err: any) {
      smsError = err.message || "Failed to call TextBee API";
      console.error("[TextBee SMS Exception]:", err);
    }
  }

  // 2. Try sending via Twilio if TextBee wasn't used/successful and Twilio keys are present
  if (!smsSent && twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
    try {
      const auth = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString("base64");
      const body = new URLSearchParams({
        To: formattedTo,
        From: twilioPhoneNumber,
        Body: message,
      });

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (response.ok) {
        smsSent = true;
        console.log(`[Twilio SMS] Sent message to ${formattedTo}`);
      } else {
        const errData = await response.json().catch(() => ({}));
        smsError = errData.message || "Twilio API failure";
        console.error("[Twilio SMS Error]:", errData);
      }
    } catch (err: any) {
      smsError = err.message || "Failed to call Twilio API";
      console.error("[Twilio SMS Exception]:", err);
    }
  }

  const hasKeys = (textbeeApiKey && textbeeDeviceId) || (twilioAccountSid && twilioAuthToken && twilioPhoneNumber);

  if (smsSent) {
    return { success: true, isMock: false };
  } else {
    if (hasKeys) {
      console.warn(`[SMS Gateway Failed] Falling back to Mock Mode. Error: ${smsError}`);
    } else {
      console.log(`[SMS Mock Mode] To: ${formattedTo}, Message: "${message}"`);
    }
    return { success: false, isMock: true, gatewayError: smsError };
  }
}

// Helper to send Email via nodemailer SMTP with mock fallback
export async function sendEmail(
  to: string, 
  subject: string, 
  text: string, 
  html?: string
): Promise<{ success: boolean; isMock: boolean; error?: string }> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || "587"),
        secure: smtpPort === "465", // true for 465, false for other ports (like 587)
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: `"Hermosa Luxe" <${smtpUser}>`,
        to,
        subject,
        text,
        html: html || text.replace(/\n/g, "<br>"),
      });

      console.log(`[SMTP Email Success] Sent email to ${to}. Message ID: ${info.messageId}`);
      return { success: true, isMock: false };
    } catch (err: any) {
      console.error("[SMTP Email Error]:", err);
      return { success: false, isMock: false, error: err.message || "SMTP failed" };
    }
  }

  // Mock Mode fallback
  console.log(`[Email Mock Mode] To: ${to}\nSubject: ${subject}\nBody: ${text}`);
  return { success: true, isMock: true };
}

// Helper to send Telegram message alerts (100% Free)
export async function sendTelegram(message: string): Promise<{ success: boolean; isMock: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      if (response.ok) {
        console.log("[Telegram Alert Success] Sent notification message.");
        return { success: true, isMock: false };
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error("[Telegram Alert Error]:", errData);
        return { success: false, isMock: false, error: errData.description || "Telegram API failure" };
      }
    } catch (err: any) {
      console.error("[Telegram Alert Exception]:", err);
      return { success: false, isMock: false, error: err.message || "Failed to call Telegram API" };
    }
  }

  console.log(`[Telegram Mock Mode] Alert message: "${message}"`);
  return { success: true, isMock: true };
}

