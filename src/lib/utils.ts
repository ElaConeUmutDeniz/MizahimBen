
import React from 'react';

export const SafeMailto: React.FC<{ email: string; children: React.ReactNode }> = ({ email, children }) => {
  const [user, domain] = email.split('@');
  const href = `mailto:${user}@${domain}`;
  
  return React.createElement('a', { href, className: "text-[color:var(--accent-color)] hover:underline" }, children);
};