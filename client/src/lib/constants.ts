export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

export const CHART_COLORS = {
  primary: '#0078d4',
  secondary: '#2b88d8',
  tertiary: '#57a2e6',
  quaternary: '#83bdee',
  background: 'rgba(0, 120, 212, 0.1)'
};

export const DEFAULT_CURRENCY_FORMAT: Intl.NumberFormatOptions = {
  style: 'currency' as const,
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
};
