import TicketForm from "./TicketForm";

export default class HelpDesk {
  constructor(rootContainer, ticketService) {
    this.rootContainer = rootContainer;
    this.container = null;
    this.ticketService = ticketService;
    this.tickets = [];
    this.ticketForms = {};
  }

  /**
   * Инициализирует приложение
   */
  async init() {
    // Загружаем начальный список тикетов
    await this.loadTickets();
    // Создаем шаблон интерфейса
    this.renderUI();
  }

  /**
   * Загружает список тикетов с сервера
   */
  async loadTickets() {
    await this.ticketService.list((err, tickets) => {
      if (err) {
        console.error("Failed to load tickets:", err);
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
    this.container.innerHTML = "";
    this.tickets.forEach((ticket) => {
      const ticketCard = document.createElement("div");
      ticketCard.id = ticket.id;
      ticketCard.classList.add("ticket-card");

      const unifyingBlock = document.createElement("div");
      unifyingBlock.classList.add("unifying-block");

      unifyingBlock.setAttribute("data-action", "view-details");
      unifyingBlock.setAttribute("parent-id", ticket.id);

      const mainBlock = document.createElement("div");
      mainBlock.classList.add("main-block");

      const descriptionBlock = document.createElement("div");
      descriptionBlock.classList.add("description");
      descriptionBlock.classList.add("display-none");
      descriptionBlock.setAttribute("descrip-id", ticket.id);

      const ticketName = document.createElement("div");
      ticketName.classList.add("item");
      ticketName.classList.add("text");
      ticketName.textContent = ticket.name;

      const ticketData = document.createElement("div");
      ticketData.classList.add("item");
      ticketData.classList.add("date");
      ticketData.textContent = this.getDataFormat(ticket.created);

      const ticketBtn = this.createBtnd("done", ticket.status);
      ticketBtn.setAttribute("parent-id", ticket.id);
      ticketBtn.setAttribute("data-action", "done");
      ticketCard.append(ticketBtn);

      mainBlock.append(ticketName);
      mainBlock.append(ticketData);

      unifyingBlock.append(mainBlock);
      unifyingBlock.append(descriptionBlock);

      ticketCard.append(unifyingBlock);

      // Кнопки удалить и редактировать
      const divBtn = document.createElement("div");
      divBtn.classList.add("divBtn");
      // divBtn.id = ticket.id;
      const ticketEdBtn = this.createBtnd("edit");
      ticketEdBtn.setAttribute("parent-id", ticket.id);
      ticketEdBtn.setAttribute("data-action", "change");

      const ticketDelBtn = this.createBtnd("delete");
      ticketDelBtn.setAttribute("parent-id", ticket.id);
      ticketDelBtn.setAttribute("data-action", "delete");

      divBtn.append(ticketEdBtn);
      divBtn.append(ticketDelBtn);
      ticketCard.append(divBtn);

      this.container.append(ticketCard);
    });

    // Назначаем обработчики событий для кнопок
    this.attachEventHandlers();
  }

  getDataFormat(fDate) {
    const today = new Date(fDate);
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
    const year = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  createBtnd(action, status = false) {
    const ticketDivBtn = document.createElement("div");
    ticketDivBtn.classList.add("item");

    const Button = document.createElement("button");

    if (status) {
      Button.classList.add("round-button-done");
    } else {
      Button.classList.add("round-button");
    }

    switch (action) {
      case "edit": {
        Button.classList.add("round-button-edit");
        break;
      }
      case "delete": {
        Button.classList.add("round-button-delete");
        break;
      }
      default:
        break;
    }

    ticketDivBtn.append(Button);

    return ticketDivBtn;
  }

  /**
   * Присоединяет обработчики событий к элементам страниц
   */
  attachEventHandlers() {
    this.container.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action]");
      if (!target) return;

      console.log(`attachEventHandlers: ${target.dataset.action}`);

      switch (target.dataset.action) {
        case "view-details":
          this.viewDetails(target.getAttribute("parent-id"));
          break;
        case "change":
          this.editTicket(target.getAttribute("parent-id"));
          break;
        case "delete":
          this.deleteTicket(target.getAttribute("parent-id"));
          break;
        case "done":
          this.doneTicket(target.getAttribute("parent-id"));
          break;
        default: {
          break;
        }
      }
    });
  }

  /**
     * Просматривает описания тикета
    
     */
  async viewDetails(id) {
    await this.ticketService.get(id, (err, ticket) => {
      if (err) {
        console.error("Failed to retrieve details:", err);
      } else {
        // Отображаем описания тикета

        const element = document.querySelector(`[descrip-id="${id}"]`);
        if (element.classList.contains("display-none")) {
          element.textContent = ticket.description;
          element.classList.remove("display-none");
        } else {
          element.classList.add("display-none");
          element.textContent = "";
        }
      }
    });
  }

  /**
     *      * Редактирует тикет
     
     */
  async editTicket(id) {
    const ticketForm = new TicketForm("change", (data) => {
      this.ticketService.update(id, data, (err, updatedTicket) => {
        if (err) {
          console.error("Update failed:", err);
        } else {
          location.reload(true);
        }
      });
    });

    await this.ticketService.get(id, (err, ticket) => {
      if (err) {
        console.error("Failed to retrieve details:", err);
      } else {
        document.querySelector("#title_change").value = ticket.name;
        document.querySelector("#description_change").value =
          ticket.description;
      }
    });

    ticketForm.showForm();
  }

  /**
     * Удаляет тикет
    
     */
  async deleteTicket(id) {
    const ticketForm = new TicketForm("delete", (data) => {
      this.ticketService.delete(id, (err) => {
        if (err) {
          console.error("Delete failed:", err);
        } else {
          location.reload(true);
        }
      });
    });

    ticketForm.showForm();
  }

  /**
   * Создает новый тикет
   */
  async createTicket() {
    const ticketForm = new TicketForm("add", (data) => {
      this.ticketService.create(data, (err, createdTicket) => {
        if (err) {
          console.error("Create failed:", err);
        } else {
          location.reload(true);
        }
      });
    });

    ticketForm.showForm();
  }

  async doneTicket(id) {
    const ticket = this.tickets.find((t) => t.id === id);
    if (ticket) {
      const data = { status: !ticket.status };

      this.ticketService.update(id, data, (err, doneTicket) => {
        if (err) {
          console.error("Update failed:", err);
        } else {
          location.reload(true);
        }
      });
    }
  }

  /**
   * Рендерит общую структуру UI
   */
  renderUI() {
    const btnDiv = document.createElement("div");
    const btnAddTicket = document.createElement("button");
    btnAddTicket.textContent = "Добавить тикет";
    btnAddTicket.classList.add("add-ticket-button");
    btnAddTicket.addEventListener("click", () => this.createTicket());
    btnDiv.append(btnAddTicket);
    this.rootContainer.append(btnDiv);
    this.container = document.createElement("div");
    this.container.classList.add("ticket-all");
    this.rootContainer.append(this.container);
  }
}
