
export function isValidPhoneNumber(phoneNumber: string): boolean {
  // Basic phone number validation
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phoneNumber.replace(/\s+/g, ""))
}
