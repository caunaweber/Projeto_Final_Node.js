document.addEventListener('DOMContentLoaded', () => {

    const modalDetalhes = document.getElementById('modalDetalhesProduto');
    if (!modalDetalhes) {
        return;
    }

    const modalNome = document.getElementById('modalNomeProduto');
    const modalDescricao = document.getElementById('modalDescricaoProduto');
    const modalCategoria = document.getElementById('modalCategoriaProduto');
    const modalImagem = document.getElementById('modalImagemProduto');

    const formAvaliacao = document.getElementById('formAvaliacao');
    const produtoIdInput = document.getElementById('produtoIdAvaliacao');
    const notaInput = document.getElementById('notaAvaliacao');
    const estrelasContainer = document.getElementById('estrelasAvaliacao');
    const estrelas = estrelasContainer.querySelectorAll('i');
    const comentarioInput = document.getElementById('comentarioAvaliacao');
    const mensagemAvaliacao = document.getElementById('mensagemAvaliacao');
    const msgJaAvaliou = document.getElementById('mensagemJaAvaliou');
    const outrasAvaliacoesContainer = document.getElementById('listaOutrasAvaliacoes');

    let notaSelecionada = 0;

    modalDetalhes.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;

        modalNome.textContent = button.getAttribute('data-nome');
        modalDescricao.textContent = button.getAttribute('data-descricao');
        modalCategoria.textContent = button.getAttribute('data-categoria');
        modalImagem.src = button.getAttribute('data-imagem');
        
        const produtoId = button.getAttribute('data-produto-id');
        produtoIdInput.value = produtoId;

        resetarFormulario();

        verificarAvaliacaoExistente(produtoId);
        carregarOutrasAvaliacoes(produtoId);
    });


    function resetarFormulario() {
        formAvaliacao.reset();
        notaSelecionada = 0;
        notaInput.value = '';
        estrelas.forEach(estrela => estrela.className = 'bi bi-star');
        mensagemAvaliacao.innerHTML = '';
        formAvaliacao.style.display = 'none'; 
        msgJaAvaliou.style.display = 'none';
    }

    function verificarAvaliacaoExistente(produtoId) {
        fetch(`/myReview/${produtoId}`, { credentials: 'include' })
            .then(response => {
                if (response.ok) {
                    msgJaAvaliou.style.display = 'block';
                } else {
                    formAvaliacao.style.display = 'block';
                }
            })
            .catch(err => {
                console.error("Erro ao verificar avaliação:", err);
                formAvaliacao.style.display = 'block';
            });
    }

    function carregarOutrasAvaliacoes(produtoId) {
        outrasAvaliacoesContainer.innerHTML = '<p class="text-muted">Carregando avaliações...</p>';
        fetch(`/review/${produtoId}`, { credentials: 'include' })
            .then(response => {
                if (!response.ok) throw new Error('Erro na resposta da rede ao buscar avaliações.');
                return response.json();
            })
            .then(avaliacoes => {
                if (avaliacoes && avaliacoes.length > 0) {
                    outrasAvaliacoesContainer.innerHTML = '';
                    avaliacoes.forEach(av => {
                        const username = av.usuario ? av.usuario.username : 'Usuário anônimo';
                        outrasAvaliacoesContainer.innerHTML += `
                            <div class="mb-3 border-bottom pb-2">
                                <strong>${username}</strong>
                                <span class="ms-2 text-warning">${'★'.repeat(av.avaliacao)}${'☆'.repeat(5 - av.avaliacao)}</span>
                                <p class="mb-0 text-muted">${av.comentario || ''}</p>
                            </div>`;
                    });
                } else {
                    outrasAvaliacoesContainer.innerHTML = '<p class="text-muted">Nenhuma avaliação ainda. Seja o primeiro!</p>';
                }
            })
            .catch(err => {
                console.error("Erro ao carregar avaliações:", err);
                outrasAvaliacoesContainer.innerHTML = '<p class="text-danger">Não foi possível carregar as avaliações.</p>';
            });
    }

    estrelas.forEach(estrela => {
        estrela.addEventListener('mouseover', () => {
            const valor = parseInt(estrela.getAttribute('data-valor'));
            for (let i = 0; i < 5; i++) {
                estrelas[i].className = i < valor ? 'bi bi-star-fill text-warning' : 'bi bi-star';
            }
        });
        estrela.addEventListener('mouseout', () => {
            for (let i = 0; i < 5; i++) {
                estrelas[i].className = i < notaSelecionada ? 'bi bi-star-fill text-warning' : 'bi bi-star';
            }
        });
        estrela.addEventListener('click', () => {
            notaSelecionada = parseInt(estrela.getAttribute('data-valor'));
            notaInput.value = notaSelecionada;
        });
    });

    formAvaliacao.addEventListener('submit', async function (event) {
        event.preventDefault();
        const produtoId = produtoIdInput.value;
        const avaliacao = notaInput.value;
        const comentario = comentarioInput.value;

        if (!avaliacao || avaliacao < 1) {
            mensagemAvaliacao.innerHTML = '<div class="alert alert-danger">Por favor, selecione uma nota de 1 a 5.</div>';
            return;
        }
        
        const rotaDeCriacao = `/review/${produtoId}`;

        try {
            const response = await fetch(rotaDeCriacao, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ avaliacao, comentario }),
                credentials: 'include'
            });
            const result = await response.json();
            if (response.ok) {
                window.location.reload()
            } else {
                mensagemAvaliacao.innerHTML = `<div class="alert alert-danger">${result.message || 'Ocorreu um erro ao enviar.'}</div>`;
            }
        } catch (error) {
            console.error("Erro no fetch de submit:", error);
            mensagemAvaliacao.innerHTML = '<div class="alert alert-danger">Erro de conexão. Tente novamente.</div>';
        }
    });
});
