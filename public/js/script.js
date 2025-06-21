async function excluirProduto(id) {
    const confirmado = confirm("Deseja realmente excluir?");
    if (!confirmado) return;

    try {
      const respose = await fetch(`/produtos/${id}`, {
        method: 'DELETE'
      });

      if (respose.ok) {
        location.reload();
      } else {

        const dados = await respose.json();
        alert(dados.message || "Erro ao excluir produto.");
      }
    } catch (err) {
      alert("Erro ao excluir produto.");
      console.error(err);
    }
  }

  function preencherModalEditar(produto) {
    document.getElementById('edit-id').value = produto.id;
    document.getElementById('edit-nome').value = produto.nome;
    document.getElementById('edit-descricao').value = produto.descricao;
    document.getElementById('edit-categoria').value = produto.categoria;
  }

  document.getElementById('formEditarProduto').addEventListener('submit', async function (event) {
    event.preventDefault();

    const id = document.getElementById('edit-id').value;
    const nome = document.getElementById('edit-nome').value;
    const descricao = document.getElementById('edit-descricao').value;
    const categoria = document.getElementById('edit-categoria').value;

    try {
      const response = await fetch(`/produtos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, descricao, categoria })
      });

      if (response.ok) {
        const modalElement = document.getElementById('modalEditar');
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.hide();

        location.reload();
      } else {
        const dados = await response.json();
        alert(dados.message || "Erro ao editar produto.");
      }
    } catch (err) {
      alert("Erro ao editar produto.");
      console.error(err);
    }
  });