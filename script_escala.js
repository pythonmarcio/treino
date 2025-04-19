// script.js

document.addEventListener("DOMContentLoaded", () => {
    const calendarGrid = document.getElementById("calendarGrid");
    const currentMonthYear = document.getElementById("currentMonthYear");
    const prevMonthButton = document.getElementById("prevMonth");
    const nextMonthButton = document.getElementById("nextMonth");

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Função para salvar o estado no localStorage
    function saveState() {
        const cells = document.querySelectorAll(".calendar-grid div:not(.day-header)");
        const state = {};
        cells.forEach(cell => {
            const dayNumberSpan = cell.querySelector("span:last-child");
            if (dayNumberSpan) {
                const dateKey = `${currentYear}-${currentMonth + 1}-${dayNumberSpan.textContent}`;
                if (cell.classList.contains("working") || cell.classList.contains("completed")) {
                    state[dateKey] = cell.classList.contains("completed") ? "completed" : "working";
                }
            }
        });
        localStorage.setItem("calendarState", JSON.stringify(state));
    }

    // Função para carregar o estado do localStorage
    function loadState() {
        const savedState = localStorage.getItem("calendarState");
        return savedState ? JSON.parse(savedState) : {};
    }

    // Função para renderizar o calendário
    function renderCalendar() {
        calendarGrid.innerHTML = "";

        // Carregar o estado salvo
        const state = loadState();

        // Adicionar cabeçalho com os dias da semana
        const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement("div");
            dayHeader.textContent = day;
            dayHeader.classList.add("day-header");
            calendarGrid.appendChild(dayHeader);
        });

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Exibir mês e ano no cabeçalho
        currentMonthYear.textContent = `${new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(currentYear, currentMonth))} ${currentYear}`;

        // Criar células vazias para os dias antes do primeiro dia do mês
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement("div");
            calendarGrid.appendChild(emptyCell);
        }

        // Criar células para cada dia do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement("div");

            // Obter o dia da semana para o dia atual
            const date = new Date(currentYear, currentMonth, day);
            const dayOfWeek = daysOfWeek[date.getDay()];

            // Criar spans para o nome do dia da semana e o número do dia
            const dayOfWeekSpan = document.createElement("span");
            dayOfWeekSpan.textContent = dayOfWeek;

            const dayNumberSpan = document.createElement("span");
            dayNumberSpan.textContent = day;

            // Adicionar spans à célula
            cell.appendChild(dayOfWeekSpan);
            cell.appendChild(dayNumberSpan);

            // Marcar o dia atual
            if (day === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()) {
                cell.classList.add("today");
            }

            // Restaurar o estado salvo
            const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
            if (state[dateKey]) {
                cell.classList.add(state[dateKey]);
            }

            // Adicionar evento de clique para marcar como concluído ou em trabalho
            cell.addEventListener("click", () => {
                if (cell.classList.contains("completed")) {
                    cell.classList.remove("completed");
                } else if (cell.classList.contains("working")) {
                    cell.classList.remove("working");
                    cell.classList.add("completed");
                } else {
                    cell.classList.add("working");
                }
                saveState(); // Salvar o estado após a alteração
            });

            calendarGrid.appendChild(cell);
        }
    }

    // Navegar para o mês anterior
    prevMonthButton.addEventListener("click", () => {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        renderCalendar();
    });

    // Navegar para o próximo mês
    nextMonthButton.addEventListener("click", () => {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        renderCalendar();
    });

    // Renderizar o calendário inicial
    renderCalendar();
});
