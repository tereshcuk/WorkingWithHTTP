/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */
export default class TicketService {
  constructor() {
    this.addressOfTheServe = "http://localhost:7070";   
  }
  
  list(callback) {
        
    fetch(`${this.addressOfTheServe}/?method=allTickets`)
      .then(res => res.json())
      .then(data => callback(null, data))
      .catch(err => callback(err))
  }

  get(id, callback) {
    console.log(`TicketService ID: ${id}`);
    fetch(`${this.addressOfTheServe}/?method=ticketById&id=${id}`)
      .then(res => res.json())
      .then(data => callback(null, data))
      .catch(err => callback(err));
  }

  create(data, callback) {
    fetch(`${this.addressOfTheServe}/?method=createTicket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(createdTicket => callback(null, createdTicket))
      .catch(err => callback(err));
  }

  update(id, data, callback) {
    fetch(`${this.addressOfTheServe}/?method=updateById&id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(updatedTicket => callback(null, updatedTicket))
      .catch(err => callback(err));
  }

  delete(id, callback) {
    // console.log(`ID: ${id}`);

    fetch(`${this.addressOfTheServe}/?method=deleteById&id=${id}`, {
      method: 'GET', 
    })
      .then(() => callback(null, { message: 'Tiket deleted successfully!' }))
      .catch(err => callback(err));
  }
}
