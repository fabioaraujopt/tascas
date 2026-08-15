(() => {
  const root = document.querySelector("[data-filter-root]");
  if (!root) return;

  const search = root.querySelector("[data-filter-q]");
  const city = root.querySelector("[data-filter-city]");
  const price = root.querySelector("[data-filter-price]");
  const reset = root.querySelector("[data-filter-reset]");
  const count = root.querySelector("[data-filter-count]");
  const empty = root.querySelector("[data-filter-empty]");
  const rows = [...root.querySelectorAll(".tasca-row")];

  const normalize = (value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const apply = () => {
    const query = normalize(search.value.trim());
    const cityValue = city.value;
    const priceValue = price.value;
    let visible = 0;

    for (const row of rows) {
      const haystack = normalize(
        [
          row.dataset.name,
          row.dataset.neighborhood,
          row.dataset.city,
          row.dataset.tags,
          row.textContent,
        ].join(" "),
      );
      const matchQuery = query === "" || haystack.includes(query);
      const matchCity = cityValue === "" || row.dataset.city === cityValue;
      const matchPrice = priceValue === "" || row.dataset.price === priceValue;
      const show = matchQuery && matchCity && matchPrice;
      row.hidden = !show;
      if (show) visible += 1;
    }

    count.textContent = `${visible} ${visible === 1 ? "casa" : "casas"}`;
    empty.hidden = visible !== 0;
  };

  search.addEventListener("input", apply);
  city.addEventListener("change", apply);
  price.addEventListener("change", apply);
  reset.addEventListener("click", () => {
    window.setTimeout(apply, 0);
  });
})();
