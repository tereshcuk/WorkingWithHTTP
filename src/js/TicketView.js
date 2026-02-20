/**
 *  Класс для отображения тикетов на странице.
 *  Он содержит методы для генерации разметки тикета.
 * */


class TicketView {
  constructor(container, ticket) {
    this.container = container;
    this.ticket = ticket;
    this.element = null;
  }

  generateTicketHtml() {
    return `
            <div class="ticket-item">
                <h3>${this.ticket.title}</h3>
                <p>${this.ticket.description}</p>
                <small>Статус: ${this.ticket.status}</small>
                <button class="delete-btn">Удалить</button>
                <button class="edit-btn">Редактировать</button>
            </div>
        `;
  }

  bindEvents() {
    const deleteBtn = this.element.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      alert(`Удалить тикет "${this.ticket.title}"?`);
    });

    const editBtn = this.element.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
      alert(`Редактировать тикет "${this.ticket.title}"`);
    });
  }

  render() {
    this.element = document.createElement('div');
    this.element.innerHTML = this.generateTicketHtml();
    this.container.append(this.element);
    this.bindEvents();
  }
}
