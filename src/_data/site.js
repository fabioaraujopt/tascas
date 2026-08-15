export default {
  name: "Tascas",
  tagline: "O guia das tascas portuguesas",
  description:
    "Guia editorial de tascas, casas de pasto e tabernas em Portugal. Moradas, horários, o que pedir — sem reservas no TheFork e sem encenação.",
  url: (process.env.SITE_URL || "http://localhost:8080").replace(/\/$/, ""),
  locale: "pt_PT",
  lang: "pt",
  author: "Tascas",
  updated: "2026-08-15",
  priceLegend: [
    { symbol: "€", label: "Prato do dia até cerca de 12€" },
    { symbol: "€€", label: "Refeição entre 12€ e 25€" },
    { symbol: "€€€", label: "Acima de 25€" },
  ],
};
