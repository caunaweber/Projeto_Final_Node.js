async function excluirProduto(id) {
  const { isConfirmed } = await Swal.fire({
    title: 'Tem certeza?',
    text: "Deseja realmente excluir este produto?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#6c63ff',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  });

  if (!isConfirmed) return;

  try {
    const response = await fetch(`/produtos/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      await Swal.fire({
        icon: 'success',
        title: 'Produto excluído!',
        showConfirmButton: false,
        timer: 1500
      });
      location.reload();
    } else {
      const dados = await response.json();
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: dados.message || 'Erro ao excluir produto.'
      });
    }
  } catch (err) {
    console.error(err);
    await Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Erro ao excluir produto.'
    });
  }
}

function preencherModalEditar(produto) {
  document.getElementById("edit-id").value = produto.id;
  document.getElementById("edit-nome").value = produto.nome;
  document.getElementById("edit-descricao").value = produto.descricao;
  document.getElementById("edit-categoria").value = produto.categoria;
}

document
  .getElementById("formEditarProduto")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("edit-id").value;
    const nome = document.getElementById("edit-nome").value;
    const descricao = document.getElementById("edit-descricao").value;
    const categoria = document.getElementById("edit-categoria").value;
    const imagemInput = document.getElementById("edit-imagem");

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("categoria", categoria);

    if (imagemInput.files.length > 0) {
      formData.append("imagem", imagemInput.files[0]);
    }

    try {
      const response = await fetch(`/produtos/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const modalElement = document.getElementById("modalEditar");
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.hide();

        location.reload();
      } else {
        let dados;
        try {
          dados = await response.json();
        } catch {
          throw new Error("Resposta inválida do servidor.");
        }
        alert(dados.message || "Erro ao editar produto.");
      }
    } catch (err) {
      alert("Erro ao editar produto.");
      console.error(err);
    }
  });