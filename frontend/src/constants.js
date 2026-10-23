// Shared external links.
export const APPLICATION_URL = 'https://learn.zone01kisumu.ke/';

// Employer enquiries from the Hire Talent page go straight to the team's
// WhatsApp line, since the site does not have a contact page yet.
export const HIRE_WHATSAPP_URL = 'https://wa.me/254748902779';

export const hireContactUrl = (serviceName) => {
  const message = serviceName
    ? `Hi Zone01, I'd like to hire ${serviceName} talent.`
    : "Hi Zone01, I'd like to talk to an expert about hiring talent.";
  return `${HIRE_WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
};

