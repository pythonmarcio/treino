async function carregarBiblia() {
    const response = await fetch('bibleData.json');
    const data = await response.json();
    const container = document.getElementById('bibleContainer');

    data.forEach(livro => {
        const livroDiv = document.createElement('div');
        livroDiv.classList.add('book');
        livroDiv.id = `livro-${livro.nome}`;

        // ➕ Subtítulo (se existir no JSON)
        if (livro.subtitulo) {
            const subtitulo = document.createElement('p');
            subtitulo.textContent = livro.subtitulo;
            subtitulo.style.fontWeight = '600';
            subtitulo.style.color = '#3c3c3c';
            subtitulo.style.margin = '5px 0 10px 0';
            livroDiv.appendChild(subtitulo);
        }

        const titulo = document.createElement('h2');
        titulo.textContent = livro.nome;
        livroDiv.appendChild(titulo);

        const capitulosDiv = document.createElement('div');
        capitulosDiv.classList.add('chapter');

        for (let i = 1; i <= livro.capitulos; i++) {
            const capBtn = document.createElement('button');
            capBtn.classList.add('chapter-btn');
            capBtn.textContent = i;

            const dataDiv = document.createElement('div');
            dataDiv.classList.add('chapter-date');
            dataDiv.id = `data-${livro.nome}-${i}`;

            capBtn.addEventListener('click', () => {
                const key = `leitura-${livro.nome}-${i}`;
                const lido = localStorage.getItem(key);

                if (!lido) {
                    const data = new Date();
                    const dataStr = `✅ Lido em: ${data.toLocaleDateString('pt-BR')}`;
                    localStorage.setItem(key, dataStr);
                } else {
                    localStorage.removeItem(key);
                }

                atualizarCapitulo(capBtn, livro.nome, i, dataDiv);
                verificarLivroCompleto(livro.nome, livro.capitulos, livroDiv);
            });

            atualizarCapitulo(capBtn, livro.nome, i, dataDiv);
            capitulosDiv.appendChild(dataDiv);
            capitulosDiv.appendChild(capBtn);
        }

        livroDiv.appendChild(capitulosDiv);
        verificarLivroCompleto(livro.nome, livro.capitulos, livroDiv);
        container.appendChild(livroDiv);
    });
}

function atualizarCapitulo(botao, livro, capitulo, dataDiv) {
    const key = `leitura-${livro}-${capitulo}`;
    const data = localStorage.getItem(key);
    if (data) {
        botao.classList.add('read');
        dataDiv.textContent = data;
        botao.title = data; // ✅ Tooltip com a data
    } else {
        botao.classList.remove('read');
        dataDiv.textContent = '';
        botao.removeAttribute('title');
    }
}

function verificarLivroCompleto(livro, totalCapitulos, livroDiv) {
    let completos = 0;
    for (let i = 1; i <= totalCapitulos; i++) {
        if (localStorage.getItem(`leitura-${livro}-${i}`)) {
            completos++;
        }
    }

    if (completos === totalCapitulos) {
        livroDiv.classList.add('completed');
    } else {
        livroDiv.classList.remove('completed');
    }
}

carregarBiblia();
