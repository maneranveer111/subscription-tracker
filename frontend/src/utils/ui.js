// Shared Tailwind class strings so every page looks consistent
export const card = "rounded-lg border border-line bg-white p-5";

export const label = "mb-1 block text-sm font-medium text-ink";

export const input =
  "w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/15";

const btn =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-60";

export const btnPrimary = `${btn} bg-ink text-white hover:bg-ink/90`;
export const btnSecondary = `${btn} border border-line bg-white text-ink hover:bg-paper`;
export const btnDanger = `${btn} border border-coral/40 bg-white text-coral hover:bg-coral/10`;
