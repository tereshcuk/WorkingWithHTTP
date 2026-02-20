import TicketForm from "./TicketForm";

export default class HelpDesk {
    constructor(rootContainer, ticketService) {
        this.rootContainer = rootContainer;
        this.container = null;
        this.ticketService = ticketService;
        this.tickets = [];
        this.ticketForms = {};

        // Инициализация приложения
        this.renderUI();
        //this.init();
    }

    /**
     * Инициализирует приложение
     */
    async init() {
        // Загружаем начальный список тикетов        
        await this.loadTickets();
        // Создаем шаблон интерфейса
        //  this.renderUI();
    }

    /**
     * Загружает список тикетов с сервера
     */
    async loadTickets() {
        this.ticketService.list((err, tickets) => {
            if (err) {
                console.error('Failed to load tickets:', err);
            } else {
                this.tickets = tickets;
                this.renderTickets();
            }
        });
    }

    /**
     * Рендерит карточки тикетов на странице
     */
    renderTickets() {


        //     const ticketElements = this.tickets.map(ticket => `<div class="ticket-card">
        //   <h3>${ticket.name}</h3>
        //   <p>${ticket.description}</p>
        //   <button data-action="view-details" data-id="${ticket.id}">Детали</button>
        //   <button data-action="edit" data-id="${ticket.id}">Редактировать</button>
        //   <button data-action="delete" data-id="${ticket.id}">Удалить</button>
        // </div>`).join('');


        this.tickets.forEach(ticket => {
            const ticketCard = document.createElement('div');
            // ticketCard.innerHTML = ticket.name;
            ticketCard.classList.add("ticket-card");
            this.container.append(ticketCard);

            const ticketName = document.createElement('div')
            ticketName.classList.add("item");
            ticketName.innerHTML = ticket.name;

            const ticketBtn = document.createElement('div')
            ticketBtn.classList.add("item");
            
            const roundButton = document.createElement('button')
            roundButton.classList.add("round-button");
            ticketBtn.append(roundButton);

            ticketCard.append(ticketBtn);            
            ticketCard.append(ticketName);

            
            this.container.append(ticketCard);
           
           

        });






        //this.container.innerHTML = ticketElements;

        // Назначаем обработчики событий для кнопок
        this.attachEventHandlers();
    }

    /**
     * Присоединяет обработчики событий к элементам страниц
     */
    attachEventHandlers() {
        this.container.addEventListener('click', event => {
            const target = event.target.closest('[data-action]');
            if (!target) return;

            switch (target.dataset.action) {
                case 'view-details':
                    this.viewDetails(target.dataset.id);
                    break;
                case 'edit':
                    this.editTicket(target.dataset.id);
                    break;
                case 'delete':
                    this.deleteTicket(target.dataset.id);
                    break;
            }
        });
    }

    /**
     * Просматривает детали тикета
    
     */
    async viewDetails(id) {
        this.ticketService.get(id, (err, ticket) => {
            if (err) {
                console.error('Failed to retrieve details:', err);
            } else {
                // Отображаем подробности тикета
                alert(JSON.stringify(ticket, null, 2)); // Просто пример, замените на реальный рендер
            }
        });
    }

    /**
     * Редактирует тикет
     
     */
    async editTicket(id) {
        // Здесь нужно создать и отобразить форму редактирования
        const ticketForm = new TicketForm(id, (data) => {
            this.ticketService.update(id, data, (err, updatedTicket) => {
                if (err) {
                    console.error('Update failed:', err);
                } else {
                    this.loadTickets(); // Обновляем список тикетов
                }
            });
        });

        ticketForm.show();
    }

    /**
     * Удаляет тикет
    
     */
    async deleteTicket(id) {
        if (confirm('Вы уверены, что хотите удалить тикет?')) {
            this.ticketService.delete(id, (err) => {
                if (err) {
                    console.error('Delete failed:', err);
                } else {
                    this.loadTickets(); // Обновляем список тикетов
                }
            });
        }
    }

    /**
     * Создает новый тикет
     */
    async createTicket() {
        const ticketForm = new TicketForm(null, (data) => {
            this.ticketService.create(data, (err, createdTicket) => {
                if (err) {
                    console.error('Create failed:', err);
                } else {
                    this.loadTickets(); // Обновляем список тикетов
                }
            });
        });

        ticketForm.show();
    }

    /**
     * Рендерит общую структуру UI
     */
    renderUI() {

        const btnDiv = document.createElement('div');
        const btnAddTicket = document.createElement('button');
        btnAddTicket.textContent = 'Добавить тикет';
        btnAddTicket.classList.add("add-ticket-button");
        btnAddTicket.addEventListener('click', () => this.createTicket());
        btnDiv.append(btnAddTicket);
        this.rootContainer.append(btnDiv);
        this.container = document.createElement('div');
        this.container.classList.add("ticket-all");
        this.rootContainer.append(this.container);

    }
}