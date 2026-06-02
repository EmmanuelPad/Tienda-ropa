<<<<<<< HEAD
import { NextResponse } from "next/server";
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(req: Request) {
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe no está configurado. Agrega STRIPE_SECRET_KEY." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2026-05-27.dahlia",
  });

  const body = await req.json();
  const items = Array.isArray(body?.items) ? body.items : [];

  if (items.length === 0) {
    return NextResponse.json(
      { error: "El carrito está vacío." },
      { status: 400 }
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map((item: any) => ({
=======
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import Stripe from "stripe";

type CheckoutItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
};

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  }
  return new Stripe(secretKey, {
    apiVersion: "2026-05-27.dahlia",
  });
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 },
      );
    }

    const origin = req.headers.get("origin") || "";

    const line_items = (items as CheckoutItem[]).map((item) => ({
>>>>>>> d2e0c15cc20cf43ffac1d92f0083a1fc957dcb3b
      price_data: {
        currency: "mxn",
        product_data: {
          name: item.name,
          description: item.description || undefined,
        },
        unit_amount: Math.round(item.price * 100),
      },
<<<<<<< HEAD
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${origin}/carrito?success=1`,
    cancel_url: `${origin}/carrito?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
=======
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${origin}/carrito?success=true`,
      cancel_url: `${origin}/carrito?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "No se pudo crear la sesión de pago" },
      { status: 500 },
    );
  }
>>>>>>> d2e0c15cc20cf43ffac1d92f0083a1fc957dcb3b
}
