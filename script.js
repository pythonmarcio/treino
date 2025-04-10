const url = "https://raw.githubusercontent.com/pythonmarcio/treino/refs/heads/main/treino.json"; // coloque seu link aqui

const salvarEstado = (estado) => {
    localStorage.setItem("estadoTreino", JSON.stringify(estado));
};

const carregarEstado = () => {
    const dados = localStorage.getItem("estadoTreino");
    return dados ? JSON.parse(dados) : {};
};

const resetarProgresso = () => {
    if (confirm("Tem certeza que deseja resetar todos os exercícios?")) {
        localStorage.removeItem("estadoTreino");
        location.reload();
    }
};

const exportarProgresso = () => {
    const dados = localStorage.getItem("estadoTreino") || "{}";
    const blob = new Blob([dados], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "progresso_treino.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const dadosImportados = JSON.parse(e.target.result);
            localStorage.setItem("estadoTreino", JSON.stringify(dadosImportados));
            alert("Progresso importado com sucesso!");
            location.reload();
        } catch (error) {
            alert("Erro ao importar o arquivo. Verifique se é um JSON válido.");
        }
    };
    reader.readAsText(file);
});

const estadoAtual = carregarEstado();

fetch(url)
    .then(res => res.json())
    .then(treino => {
        const container = document.getElementById("treino-container");

        Object.entries(treino).forEach(([dia, exercicios]) => {
            const diaDiv = document.createElement("div");
            diaDiv.className = "dia";

            const titulo = document.createElement("h2");
            titulo.textContent = dia;
            diaDiv.appendChild(titulo);

            exercicios.forEach(ex => {
                const exercicioDiv = document.createElement("div");
                exercicioDiv.className = "exercicio";

                const label = document.createElement("label");
                const key = `${dia}-${ex.id}`;

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = estadoAtual[key] || false;

                const texto = document.createElement("span");
                texto.textContent = `${ex.nome} (${ex.series})`;
                if (checkbox.checked) texto.classList.add("concluido");

                checkbox.addEventListener("change", () => {
                    estadoAtual[key] = checkbox.checked;
                    salvarEstado(estadoAtual);
                    texto.classList.toggle("concluido", checkbox.checked);
                });

                label.appendChild(checkbox);
                label.appendChild(texto);

                exercicioDiv.appendChild(label);
                diaDiv.appendChild(exercicioDiv);
            });

            container.appendChild(diaDiv);
        });
    });
