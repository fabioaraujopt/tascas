import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tascas = JSON.parse(
  readFileSync(join(root, "src/_data/tascas.json"), "utf8"),
);

const REQUIRED = [
  "slug",
  "name",
  "city",
  "citySlug",
  "neighborhood",
  "address",
  "postalCode",
  "price",
  "reservations",
  "payment",
  "hours",
  "tags",
  "order",
  "summary",
  "body",
];

const PRICE = new Set(["€", "€€", "€€€"]);
const RESERVATIONS = new Set(["sem-marcacao", "aconselhada", "obrigatoria"]);
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const errors = [];
const slugs = new Set();

if (!Array.isArray(tascas) || tascas.length === 0) {
  errors.push("tascas.json tem de ser uma lista com pelo menos uma casa.");
}

for (const [index, tasca] of tascas.entries()) {
  const where = tasca.slug || `#${index}`;

  for (const field of REQUIRED) {
    if (tasca[field] == null || tasca[field] === "") {
      errors.push(`${where}: falta o campo «${field}».`);
    }
  }

  if (tasca.slug) {
    if (!SLUG.test(tasca.slug)) {
      errors.push(`${where}: slug inválido.`);
    }
    if (slugs.has(tasca.slug)) {
      errors.push(`${where}: slug repetido.`);
    }
    slugs.add(tasca.slug);
  }

  if (tasca.price && !PRICE.has(tasca.price)) {
    errors.push(`${where}: preço tem de ser €, €€ ou €€€.`);
  }

  if (tasca.reservations && !RESERVATIONS.has(tasca.reservations)) {
    errors.push(`${where}: reservas inválidas.`);
  }

  if (!Array.isArray(tasca.tags) || tasca.tags.length === 0) {
    errors.push(`${where}: tags tem de ser uma lista.`);
  }

  if (!Array.isArray(tasca.order) || tasca.order.length === 0) {
    errors.push(`${where}: «order» tem de ter pelo menos um prato.`);
  }

  if (!Array.isArray(tasca.payment) || tasca.payment.length === 0) {
    errors.push(`${where}: pagamento tem de ser uma lista.`);
  }

  if (tasca.summary && tasca.summary.length > 220) {
    errors.push(`${where}: o resumo passa das 220 caracteres.`);
  }
}

if (errors.length) {
  console.error(`tascas.json: ${errors.length} erro(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`tascas.json: ${tascas.length} casas, tudo certo.`);
