import crypto from "crypto";

interface PesapalConfig {
  consumerKey: string;
  consumerSecret: string;
  baseUrl: string;
}

export class PesapalClient {
  private config: PesapalConfig;
  private token: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.config = {
      consumerKey: process.env.PESAPAL_CONSUMER_KEY!,
      consumerSecret: process.env.PESAPAL_CONSUMER_SECRET!,
      baseUrl: process.env.PESAPAL_BASE_URL || "https://cybqa.pesapal.com/pesapalv3",
    };

    if (!this.config.consumerKey || !this.config.consumerSecret) {
      throw new Error("Pesapal credentials not configured");
    }
  }

  private async getToken(): Promise<string> {
    // Return cached token if still valid
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    const response = await fetch(`${this.config.baseUrl}/api/Auth/RequestToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        consumer_key: this.config.consumerKey,
        consumer_secret: this.config.consumerSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get Pesapal token: ${response.statusText}`);
    }

    const data = await response.json();
    this.token = data.token;
    // Token expires in 5 minutes, cache for 4 minutes to be safe
    this.tokenExpiry = Date.now() + 4 * 60 * 1000;

    return this.token;
  }

  async registerIPN(ipnUrl: string, notificationType: "GET" | "POST" = "POST"): Promise<string> {
    const token = await this.getToken();

    const response = await fetch(`${this.config.baseUrl}/api/URLSetup/RegisterIPN`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: ipnUrl,
        ipn_notification_type: notificationType,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to register IPN: ${response.statusText}`);
    }

    const data = await response.json();
    return data.ipn_id;
  }

  async submitOrder(orderData: {
    userId: string;
    amount: number;
    currency: string;
    description: string;
    callbackUrl: string;
    cancellationUrl?: string;
    notificationId: string;
    billingAddress: {
      email_address: string;
      phone_number?: string;
      country_code?: string;
      first_name?: string;
      middle_name?: string;
      last_name?: string;
      line_1?: string;
      line_2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      zip_code?: string;
    };
  }) {
    const token = await this.getToken();

    const merchantReference = `SIG-${Date.now()}-${orderData.userId.substring(0, 8)}`;

    const payload = {
      id: merchantReference,
      currency: orderData.currency,
      amount: orderData.amount,
      description: orderData.description,
      callback_url: orderData.callbackUrl,
      cancellation_url: orderData.cancellationUrl || orderData.callbackUrl,
      notification_id: orderData.notificationId,
      billing_address: orderData.billingAddress,
    };

    const response = await fetch(`${this.config.baseUrl}/api/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to submit order: ${error}`);
    }

    const data = await response.json();
    return {
      orderTrackingId: data.order_tracking_id,
      merchantReference: data.merchant_reference,
      redirectUrl: data.redirect_url,
    };
  }

  async getTransactionStatus(orderTrackingId: string) {
    const token = await this.getToken();

    const response = await fetch(
      `${this.config.baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get transaction status: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      paymentMethod: data.payment_method,
      amount: data.amount,
      currency: data.currency,
      status: data.status_code, // 0 = invalid, 1 = completed, 2 = failed, 3 = reversed
      paymentStatusDescription: data.payment_status_description,
      description: data.description,
      message: data.message,
      confirmationCode: data.confirmation_code,
      merchantReference: data.merchant_reference,
    };
  }
}

export const pesapal = new PesapalClient();
