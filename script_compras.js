let produtos = JSON.parse(localStorage.getItem('produtos')) || {
    "Arroz": 5.50,
    "Feijão": 7.80,
    "Sabão em Pó": 12.30
};

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let gerenciarVisivel = false;
let total = 0;

function salvarDados() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function atualizarDatalist() {
    const datalist = document.getElementById('produtos-lista');
    datalist.innerHTML = '';
    for (let nome in produtos) {
        const option = document.createElement('option');
        option.value = nome;
        option.label = `R$ ${produtos[nome].toFixed(2)}`;
        datalist.appendChild(option);
    }
}

function renderizarCarrinho() {
    const lista = document.getElementById('lista-itens');
    lista.innerHTML = '';
    total = 0;

    carrinho.forEach((item, index) => {
        const precoAtual = produtos[item.nome] || item.preco;
        const subtotal = precoAtual * item.qtd;
        total += subtotal;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `${item.qtd} × ${item.nome} (R$ ${precoAtual.toFixed(2)}) = R$ ${subtotal.toFixed(2)}
          <button class="btn btn-sm btn-outline-danger" onclick="removerDoCarrinho(${index})">Remover</button>`;
        lista.appendChild(li);
    });

    document.getElementById('total').textContent = total.toFixed(2);
    salvarDados();
}

function adicionarAoCarrinho() {
    const nome = document.getElementById('produto').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);

    if (!produtos[nome]) {
        alert("Produto não encontrado na lista.");
        return;
    }

    carrinho.push({ nome, qtd: quantidade, preco: produtos[nome] });
    renderizarCarrinho();

    document.getElementById('produto').value = "";
    document.getElementById('quantidade').value = 1;
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    renderizarCarrinho();
}

function resetarCarrinho() {
    if (confirm("Tem certeza que deseja limpar o carrinho?")) {
        carrinho = [];
        renderizarCarrinho();
    }
}

function adicionarProduto() {
    const nome = document.getElementById('novo-nome').value.trim();
    const preco = parseFloat(document.getElementById('novo-preco').value);
    if (!nome || isNaN(preco) || preco <= 0) {
        alert("Preencha corretamente o nome e o preço.");
        return;
    }
    produtos[nome] = preco;
    atualizarDatalist();
    salvarDados();
    document.getElementById('novo-nome').value = "";
    document.getElementById('novo-preco').value = "";
}

function removerProduto() {
    const nome = document.getElementById('remover-nome').value.trim();
    if (!produtos[nome]) {
        alert("Produto não encontrado na lista.");
        return;
    }
    delete produtos[nome];
    atualizarDatalist();
    salvarDados();
    renderizarCarrinho();
    document.getElementById('remover-nome').value = "";
}

function atualizarProduto() {
    const nome = document.getElementById('atualizar-nome').value.trim();
    const novoPreco = parseFloat(document.getElementById('atualizar-preco').value);

    if (!produtos[nome]) {
        alert("Produto não encontrado na lista.");
        return;
    }

    if (isNaN(novoPreco) || novoPreco <= 0) {
        alert("Informe um preço válido.");
        return;
    }

    produtos[nome] = novoPreco;
    atualizarDatalist();
    salvarDados();
    alert(`Preço de "${nome}" atualizado para R$ ${novoPreco.toFixed(2)}`);
    renderizarCarrinho();

    document.getElementById('atualizar-nome').value = "";
    document.getElementById('atualizar-preco').value = "";
}

function toggleGerenciarProdutos() {
    const div = document.getElementById('gerenciar-produtos');
    const btn = document.getElementById('toggle-btn');
    gerenciarVisivel = !gerenciarVisivel;
    div.style.display = gerenciarVisivel ? 'block' : 'none';
    btn.textContent = gerenciarVisivel ? 'Minimizar' : 'Maximizar';
}

// Inicialização
atualizarDatalist();
renderizarCarrinho();
document.getElementById('gerenciar-produtos').style.display = 'none';
document.getElementById('toggle-btn').textContent = 'Maximizar';

// Envio de Whatsapp

function enviarParaWhatsApp() {
  if (carrinho.length === 0) {
    alert("O carrinho está vazio.");
    return;
  }

  const data = new Date();
  const dataFormatada = data.toLocaleString("pt-BR");

  let mensagem = `🛒 *Registro de Compras* - ${dataFormatada}\n\n`;

  carrinho.forEach(item => {
    const precoAtual = produtos[item.nome] || item.preco;
    const subtotal = precoAtual * item.qtd;
    mensagem += `• ${item.qtd} x ${item.nome} (R$ ${precoAtual.toFixed(2)}) = R$ ${subtotal.toFixed(2)}\n`;
  });

  mensagem += `\n💰 *Total:* R$ ${total.toFixed(2)}`;

  const encodedMessage = encodeURIComponent(mensagem);
  const whatsappLink = `https://wa.me/?text=${encodedMessage}`;
  window.open(whatsappLink, '_blank');
}
