import Razorpay from 'razorpay';

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { amount, currency, expertId, guestData } = await req.json();

    if (!amount || !currency) {
      return new Response(JSON.stringify({ error: 'Amount and currency are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: amount * 100, // Amount in paise
      currency,
      receipt: `receipt_expert_${expertId}_${Date.now()}`,
      notes: {
        expertId,
        guestName: guestData.name,
        guestEmail: guestData.email,
        problem: guestData.problem,
      }
    };

    const order = await razorpay.orders.create(options);

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return new Response(JSON.stringify({ error: 'Failed to create order' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
