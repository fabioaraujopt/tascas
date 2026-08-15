import tascas from "./tascas.json" with { type: "json" };

export default function () {
  const byCity = new Map();

  for (const tasca of tascas) {
    if (!byCity.has(tasca.citySlug)) {
      byCity.set(tasca.citySlug, {
        name: tasca.city,
        slug: tasca.citySlug,
        neighborhoods: new Set(),
        count: 0,
      });
    }

    const city = byCity.get(tasca.citySlug);
    city.count += 1;
    city.neighborhoods.add(tasca.neighborhood);
  }

  return [...byCity.values()]
    .map((city) => ({
      name: city.name,
      slug: city.slug,
      count: city.count,
      neighborhoods: [...city.neighborhoods].sort((a, b) =>
        a.localeCompare(b, "pt"),
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt"));
}
