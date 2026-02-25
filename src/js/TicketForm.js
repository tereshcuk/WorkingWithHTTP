/**
 *  Класс для создания формы создания нового тикета
 * */


export default class TicketForm {
    constructor(action, onSubmitCallback) {
        this.onSubmitCallback = onSubmitCallback;
        this.formElement = null;
        this.action = action;   
           
    }

    generateFormHtml() {
        console.log("generateFormHtml ОК");
        const form = document.createElement("form");
        form.id = "ticket-form";     

        switch (this.action) {
            case "add": { 
                this.addElementsFrorm(form); 
                break;  
                     }
            case "change": {
                this.addElementsFrorm(form);
                break;
                }
            case "delete": {
                break;                               
            }
            default:
                break;
        }

        const окBtn = document.createElement("button");
        окBtn.classList.add("button-form");
        окBtn.textContent = "ОК";
        окBtn.type = "submit";

        const closeBtn = document.createElement("button");
        closeBtn.classList.add("button-form");
        closeBtn.textContent = "Отмена";
        closeBtn.type = "button";

        // Настраиваем элементы
        // Собираем структуру формы

        const groupBtn = document.createElement("div");
        groupBtn.classList.add("group-btn");
        groupBtn.append(окBtn);
        groupBtn.append(closeBtn);
        
        form.append(groupBtn);

        closeBtn.addEventListener("click", () => {
            document.body.removeChild(this.formElement);
        });
        return form;
    }

    addElementsFrorm(form) {

        const inputName = document.createElement("input");
        inputName.id = `title_${this.action}`;
        inputName.classList.add("field");
        
        const labelName = document.createElement("label");
        labelName.classList.add("form-group");
        labelName.setAttribute("for", `title_${this.action}`);
        labelName.textContent = "Краткое описание";

        const descriptionArea = document.createElement("textarea");
        descriptionArea.id = `description_${this.action}`;
        descriptionArea.classList.add("field");
        
        const labelArea = document.createElement("label");
        labelArea.classList.add("form-group");
        labelArea.setAttribute("for", `description_${this.action}`);
        labelArea.textContent = "Подробное описание";

        form.append(labelName);
        form.append(inputName);
        form.append(labelArea);
        form.append(descriptionArea);    }

    bindEvents() {
        const form = document.getElementById('ticket-form');
        form.addEventListener('submit', event => {
            event.preventDefault();
            console.log(`bindEvents action: ${this.action}`);
            switch (this.action) {
                case "add": {
                    const createData = {
                        name: `${form.elements[`title_${this.action}`].value}`,
                        description: form.elements[`description_${this.action}`].value
                    }
                    this.onSubmitCallback(createData);
                    break;

                }
                case "change": {
                    const createData = {
                        name: `${form.elements[`title_${this.action}`].value}`,
                        description: form.elements[`description_${this.action}`].value
                    }
                    this.onSubmitCallback(createData);
                    break;

                }
                case "delete": {
                    this.onSubmitCallback(null);
                    break;
                }

                default: {
                    break;
                }

            }
        });
    }

    render() {
        
        this.formElement = document.createElement('div');
        this.formElement.classList.add("ticket-form");        
        const titleForm = document.createElement("div");
        titleForm.classList.add("title-form");

        switch (this.action) {
            case "add": {
                titleForm.innerHTML = "Добавить тикет";                
                break;
            }
            case "change": {
                titleForm.innerHTML = "Изменить тикет";               
                break;
            }
            case "delete": {
                titleForm.innerHTML = "Удалить тикет";
                const divFormText = document.createElement("div");
                divFormText.innerHTML = "Вы уверены, что хотите удалить тикет? Это действие не обратимою.";
                divFormText.classList.add("div-form-text");
                
                titleForm.append(divFormText);                
                break;
            }

            default: {
                console.log("Неизвестное действие: ", this.action);
            }


        }
        this.formElement.append(titleForm);
        this.formElement.append(this.generateFormHtml());
        document.body.append(this.formElement);
        this.bindEvents();
    }

    showForm() {
        const carrenrForm = document.getElementById("ticket-form");
        if (!carrenrForm) {
            this.render();
        } 
        
    }
}