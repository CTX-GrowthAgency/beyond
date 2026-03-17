export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,20}$/;
  return phoneRegex.test(phone);
}

export function validateObjectId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,50}$/.test(id);
}

export function validateAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount > 0 && amount <= 1000000;
}

export function sanitizeBookingData(data: any): any {
  return {
    ...data,
    customerName: sanitizeString(data.customerName || '', 100),
    customerEmail: validateEmail(data.customerEmail) ? data.customerEmail : '',
    customerPhone: validatePhone(data.customerPhone) ? data.customerPhone : '',
    notes: sanitizeString(data.notes || '', 500),
  };
}
