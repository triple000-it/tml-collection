// Admin configuration
export const ADMIN_EMAILS = [
  'admin@tmlcollect.com',
  'admin@example.com', 
  'info@000-it.com',
  'admin@tmlcollections.com' // Added the missing one from login page
];

// Check if email is admin
export const isAdminEmail = (email: string | undefined | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
