document.querySelectorAll('.btn-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const nome = btn.getAttribute('data-nome');
      const descricao = btn.getAttribute('data-descricao');
      const categoria = btn.getAttribute('data-categoria');
      const imagemSrc = btn.closest('.product-card').querySelector('.product-image').getAttribute('src');

      document.getElementById('modalNomeProduto').textContent = nome;
      document.getElementById('modalDescricaoProduto').textContent = descricao;
      document.getElementById('modalCategoriaProduto').textContent = categoria;
      document.getElementById('modalImagemProduto').setAttribute('src', imagemSrc);
    });
  });