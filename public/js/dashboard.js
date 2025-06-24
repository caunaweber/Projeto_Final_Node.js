document.querySelectorAll('.btn-details').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('produtoNome').textContent = btn.dataset.nome;
    document.getElementById('produtoDescricao').textContent = btn.dataset.descricao;
    document.getElementById('produtoCategoria').textContent = btn.dataset.categoria;
  });
});