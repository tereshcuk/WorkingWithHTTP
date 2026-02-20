/**
 *  Класс для создания формы создания нового тикета
 * */
// export default class TicketForm {
//     constructor() { }
// }

class TicketForm {
    constructor(onSubmitCallback) {
        this.onSubmitCallback = onSubmitCallback;
        this.formElement = null;
    }

    generateFormHtml() {
        return `
            <form id="ticket-form">
                <label for="title">Название тикета:</label>
                <input type="text" id="title" required /><br/>
                
                <label for="description">Описание:</label>
                <textarea id="description" required></textarea><br/>
                
                <button type="submit">Создать тикет</button>
            </form>
        `;
    }

    bindEvents() {
        const form = document.getElementById('ticket-form');
        form.addEventListener('submit', event => {
            event.preventDefault();
            const title = form.elements['title'].value;
            const description = form.elements['description'].value;
            this.onSubmitCallback({ title, description });
        });
    }

    render() {
        this.formElement = document.createElement('div');
        this.formElement.innerHTML = this.generateFormHtml();
        document.body.appendChild(this.formElement);
        this.bindEvents();
    }
}