async function carregarTreino() {
    const url = "https://raw.githubusercontent.com/pythonmarcio/treino/refs/heads/main/treino.json"; // substitua aqui depois
    const response = await fetch(url);
    const treino = await response.json();
    const container = document.getElementById("treino");

    for (const dia in treino) {
        const divDia = document.createElement("div");
        divDia.className = "dia";

        const titulo = document.createElement("h2");
        titulo.textContent = dia;
        divDia.appendChild(titulo);

        const lista = document.createElement("ul");

        treino[dia].forEach(exercicio => {
            const item = document.createElement("li");

            const label = document.createElement("label");
            label.textContent = `${exercicio.nome} (${exercicio.series})`;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = exercicio.concluido;
            checkbox.addEventListener("change", () => {
                label.className = checkbox.checked ? "concluido" : "";
            });

            item.appendChild(label);
            item.appendChild(checkbox);
            lista.appendChild(item);
        });

        divDia.appendChild(lista);
        container.appendChild(divDia);
    }
}

carregarTreino();