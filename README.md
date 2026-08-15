# Tascas

Guia estático de tascas portuguesas. Editorial, sem reservas, sem fotografias de prato. Cada casa é uma ficha: morada, horário, o que pedir, se há fila.

## Arranque

```bash
npm install
npm run dev
```

O site fica em `http://localhost:8080`. Para gerar os HTML:

```bash
npm run build
```

A pasta `_site/` é o website estático, pronto para qualquer hospedagem.

## GitHub Pages

O site está em `https://fabioaraujopt.github.io/tascas/`, publicado a partir
do ramo `gh-pages`.

## Acrescentar tascas

Tudo vive em `src/_data/tascas.json`. Uma casa, um objecto. Campos:

| Campo | Obrigatório | Notas |
| --- | --- | --- |
| `slug` | sim | `ze-da-mouraria` |
| `name` | sim | Nome à porta |
| `city` / `citySlug` | sim | `Lisboa` / `lisboa` |
| `neighborhood` | sim | Bairro |
| `address` | sim | Rua e número |
| `postalCode` | sim | |
| `phone` | não | `+351 …` ou `null` |
| `website` | não | URL ou `null` |
| `price` | sim | `€`, `€€` ou `€€€` |
| `reservations` | sim | `sem-marcacao`, `aconselhada` ou `obrigatoria` |
| `payment` | sim | Lista: `dinheiro`, `mb` |
| `hours` | sim | Frase em português |
| `opened` | não | Ano, ou `null` |
| `featured` | não | `true` para a entrada |
| `tags` | sim | Lista de etiquetas |
| `order` | sim | O que pedir, por ordem |
| `summary` | sim | Uma frase, até 220 caracteres |
| `body` | sim | Texto da ficha, parágrafos separados por linha em branco |

Depois:

```bash
npm run validate
npm run build
```

Slugs repetidos, campos em falta ou preços inválidos falham a validação.

## Páginas

- `/` — manifesto e destaques
- `/tascas/` — directório com pesquisa
- `/tascas/<slug>/` — ficha
- `/cidades/` e `/cidades/<cidade>/`
- `/sobre/` — o que é uma tasca e o método do guia

## Notas

Os horários mudam. O guia não substitui a porta. Casas que fechem saem da lista; não se disfarçam de abertas.
