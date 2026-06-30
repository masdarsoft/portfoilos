import { apiFetch } from './client';

export interface BookingFormData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  event_date?: string;
  event_type?: string;
  notes?: string;
  category?: string; // UUID or slug resolved by API
}

export interface BookingResponse {
  id: string;
  whatsapp_redirect_url: string;
}

export async function createBooking(
  domain: string,
  data: BookingFormData
): Promise<BookingResponse> {
  return apiFetch<BookingResponse>(`/bookings/?domain=${encodeURIComponent(domain)}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
