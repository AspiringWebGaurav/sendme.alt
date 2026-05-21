const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export const legalConfig = {
  effectiveDate: currentDate,
  lastUpdated: currentDate,
  companyName: "Sendme.alt",
};
