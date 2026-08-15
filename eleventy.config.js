import tascas from "./src/_data/tascas.json" with { type: "json" };

const TAG_LABELS = {
  almoco: "almoço",
  jantar: "jantar",
  "doses-grandes": "doses grandes",
  familiar: "familiar",
  fila: "fila",
  "so-almoco": "só almoço",
  grelhados: "grelhados",
  "prato-do-dia": "prato do dia",
  contemporanea: "contemporânea",
  marcacao: "marcação",
  vinho: "vinho",
  petiscos: "petiscos",
  classica: "clássica",
  peixe: "peixe",
  "loja-com-historia": "loja com história",
  fado: "fado",
  bifanas: "bifanas",
  cozido: "cozido",
  sandes: "sandes",
  pernil: "pernil",
  balcao: "balcão",
  cachorrinhos: "cachorrinhos",
  presunto: "presunto",
  ossos: "ossos",
  cervejaria: "cervejaria",
};

const RESERVATION_LABELS = {
  "sem-marcacao": "Não aceita marcações. Chega cedo.",
  aconselhada: "Marcação aconselhada.",
  obrigatoria: "Marcação obrigatória.",
};

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/assets": "assets",
    "src/.nojekyll": ".nojekyll",
  });

  eleventyConfig.addFilter("tascasByCity", (list, citySlug) =>
    list.filter((tasca) => tasca.citySlug === citySlug),
  );

  eleventyConfig.addFilter("tascasByNeighborhood", (list, neighborhood) =>
    list.filter((tasca) => tasca.neighborhood === neighborhood),
  );

  eleventyConfig.addFilter("relatedTascas", (list, tasca, limit = 3) =>
    list
      .filter(
        (other) =>
          other.slug !== tasca.slug &&
          (other.neighborhood === tasca.neighborhood ||
            other.citySlug === tasca.citySlug),
      )
      .sort((a, b) => {
        const sameHoodA = a.neighborhood === tasca.neighborhood ? 0 : 1;
        const sameHoodB = b.neighborhood === tasca.neighborhood ? 0 : 1;
        return sameHoodA - sameHoodB;
      })
      .slice(0, limit),
  );

  eleventyConfig.addFilter("featured", (list) =>
    list.filter((tasca) => tasca.featured),
  );

  eleventyConfig.addFilter("sortByName", (list) =>
    [...list].sort((a, b) => a.name.localeCompare(b.name, "pt")),
  );

  eleventyConfig.addFilter("sortByCityThenName", (list) =>
    [...list].sort((a, b) => {
      const city = a.city.localeCompare(b.city, "pt");
      return city !== 0 ? city : a.name.localeCompare(b.name, "pt");
    }),
  );

  eleventyConfig.addFilter("osmUrl", (tasca) => {
    const query = encodeURIComponent(
      `${tasca.address}, ${tasca.postalCode} ${tasca.city}, Portugal`,
    );
    return `https://www.openstreetmap.org/search?query=${query}`;
  });

  eleventyConfig.addFilter("telHref", (phone) =>
    `tel:${phone.replace(/\s+/g, "")}`,
  );

  eleventyConfig.addFilter("tagLabel", (tag) => TAG_LABELS[tag] || tag);

  eleventyConfig.addFilter(
    "reservationLabel",
    (value) => RESERVATION_LABELS[value] || value,
  );

  eleventyConfig.addFilter("displayUrl", (url) =>
    url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
  );

  eleventyConfig.addFilter("paragraphs", (text) =>
    text.split(/\n\n+/).map((part) => part.trim()).filter(Boolean),
  );

  eleventyConfig.addFilter("jsonLd", (tasca, site) => {
    if (!tasca?.slug) return "";
    const data = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: tasca.name,
      description: tasca.summary,
      servesCuisine: "Portuguese",
      priceRange: tasca.price,
      url: `${site.url}/tascas/${tasca.slug}/`,
      address: {
        "@type": "PostalAddress",
        streetAddress: tasca.address,
        addressLocality: tasca.city,
        postalCode: tasca.postalCode,
        addressCountry: "PT",
      },
    };
    if (tasca.phone) data.telephone = tasca.phone;
    return JSON.stringify(data);
  });

  eleventyConfig.addGlobalData("eleventyComputed", {
    jsonLd: (data) => {
      if (!data.tasca) return "";
      const tasca = data.tasca;
      const site = data.site;
      const payload = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        name: tasca.name,
        description: tasca.summary,
        servesCuisine: "Portuguese",
        priceRange: tasca.price,
        url: `${site.url}/tascas/${tasca.slug}/`,
        address: {
          "@type": "PostalAddress",
          streetAddress: tasca.address,
          addressLocality: tasca.city,
          postalCode: tasca.postalCode,
          addressCountry: "PT",
        },
      };
      if (tasca.phone) payload.telephone = tasca.phone;
      return JSON.stringify(payload);
    },
  });

  eleventyConfig.addFilter("isoDate", (value) =>
    new Date(value).toISOString().slice(0, 10),
  );

  eleventyConfig.addFilter("withBase", (path) => {
    const prefix = normalizePathPrefix(process.env.PATH_PREFIX);
    if (!path) return prefix === "/" ? "/" : prefix;
    if (path.startsWith("#") || /^[a-z]+:/i.test(path)) return path;
    const p = path.startsWith("/") ? path : `/${path}`;
    if (prefix === "/") return p;
    return `${prefix.replace(/\/$/, "")}${p}`;
  });

  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  eleventyConfig.addGlobalData("tascaCount", tascas.length);

  eleventyConfig.setServerOptions({
    showAllHosts: true,
  });

  const pathPrefix = normalizePathPrefix(process.env.PATH_PREFIX);

  return {
    pathPrefix,
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}

function normalizePathPrefix(value) {
  if (!value || value === "/") return "/";
  return `/${value.replace(/^\/|\/$/g, "")}/`;
}
