interface CashfreeOrderStatus {
  order_id: string;
  order_amount: number;
  order_currency: string;
  order_status: 'PAID' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  payment_session_id: string;
  created_at: string;
  expires_at: string;
  updated_at: string;
}

export async function checkCashfreeOrderStatus(orderId: string): Promise<CashfreeOrderStatus | null> {
  const appId = process.env.CASHFREE_APP_ID;
  const secret = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secret) {
    throw new Error('Cashfree credentials not configured');
  }

  const baseUrl = process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg/orders"
    : "https://sandbox.cashfree.com/pg/orders";

  try {
    const response = await fetch(`${baseUrl}/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": appId,
        "x-client-secret": secret,
      },
    });

    if (!response.ok) {
      console.error(`Cashfree API error: ${response.status} for order ${orderId}`);
      return null;
    }

    const data = await response.json();
    return data as CashfreeOrderStatus;
  } catch (error) {
    console.error('Error checking Cashfree order status:', error);
    return null;
  }
}

export async function updateBookingFromCashfreeStatus(
  bookingId: string,
  cashfreeStatus: CashfreeOrderStatus
): Promise<boolean> {
  try {
    const { getAdminDb } = await import('@/lib/firebase/admin');
    const { FieldValue } = await import('firebase-admin/firestore');
    const db = getAdminDb();
    const bookingRef = db.collection('bookings').doc(bookingId);

    // Update booking based on Cashfree status
    const updateData: any = {
      paymentStatus: cashfreeStatus.order_status === 'PAID' ? 'completed' : 
                   cashfreeStatus.order_status === 'CANCELLED' ? 'cancelled' : 
                   cashfreeStatus.order_status === 'EXPIRED' ? 'expired' : 'pending_payment',
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Add payment completion details if paid
    if (cashfreeStatus.order_status === 'PAID') {
      updateData.paidAt = FieldValue.serverTimestamp();
      updateData.ticketStatus = 'confirmed';
    }

    await bookingRef.update(updateData);
    console.log(`Updated booking ${bookingId} to status: ${updateData.paymentStatus}`);
    return true;
  } catch (error) {
    console.error('Error updating booking from Cashfree status:', error);
    return false;
  }
}
