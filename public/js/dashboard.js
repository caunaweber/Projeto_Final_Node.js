document.addEventListener("DOMContentLoaded", () => {
  console.log("Script carregado");

  const modal = new bootstrap.Modal(document.getElementById("modalDetalhesProduto"));

  document.querySelectorAll(".btn-details").forEach((btn) => {
    btn.addEventListener("click", () => {
      const rawData = btn.getAttribute("data-produto");
      console.log("Data recebido:", rawData); // Debug

      try {
        const produto = JSON.parse(rawData.replace(/&#39;/g, "'"));

        document.getElementById("produtoNome").textContent = produto.nome || "";
        document.getElementById("produtoDescricao").textContent = produto.descricao || "";
        document.getElementById("produtoCategoria").textContent = produto.categoria || "";
        modal.show();
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
        alert("Erro ao carregar os detalhes do produto.");
      }
    });
  });
});
