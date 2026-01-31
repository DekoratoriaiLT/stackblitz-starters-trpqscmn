import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is missing in environment variables");
}

// Remove the problematic API version or use a stable one
const stripe = new Stripe(secretKey, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "eur", payment_method_id, customerDetails } =
      await request.json();

    // Minimum amount for Stripe is 0.50 EUR = 50 cents
    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum charge is €0.50." },
        { status: 400 }
      );
    }

    const baseUrl = "https://besserappliances.co.uk";
    const successUrl = `${baseUrl}/payment-success`;
    const cancelUrl = `${baseUrl}/payment-cancelled`;

    const metadata: Record<string, string> = {};
    if (customerDetails) {
      if (customerDetails.name) metadata.customerName = customerDetails.name;
      if (customerDetails.email) metadata.customerEmail = customerDetails.email;
      if (customerDetails.phone) metadata.customerPhone = customerDetails.phone;
    }

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount,
      currency,
      metadata,
    };

    if (customerDetails?.email) {
      paymentIntentParams.receipt_email = customerDetails.email;
    }

    if (customerDetails?.address) {
      const { line_1, line_2, city, postal_code, country } =
        customerDetails.address;

      paymentIntentParams.shipping = {
        name: customerDetails.name || "",
        phone: customerDetails.phone || "",
        address: {
          line1: line_1 || "",
          line2: line_2 || "",
          city: city || "",
          postal_code: postal_code || "",
          country: country || "LT",
        },
      };
    }

    if (payment_method_id) {
      paymentIntentParams.payment_method = payment_method_id;
      paymentIntentParams.confirm = true;
      paymentIntentParams.payment_method_types = ["card"];
      paymentIntentParams.return_url = successUrl;
    } else {
      paymentIntentParams.automatic_payment_methods = { enabled: true };
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    return NextResponse.json({
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
      successUrl,
      cancelUrl,
    });
  } catch (error: unknown) {
    console.error("Stripe Payment Error:", error);

    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      "type" in error
    ) {
      return NextResponse.json(
        {
          error: (error as any).message,
          type: (error as any).type,
          code: (error as any).code,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}