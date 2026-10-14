const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The email check shared by the screens, with the messages from the SignIn README. */
export function emailError(email: string) {
  if (!email.trim()) return 'Enter your email address';
  if (!emailPattern.test(email.trim())) return 'Enter a valid email, like name@company.com';
  return undefined;
}
