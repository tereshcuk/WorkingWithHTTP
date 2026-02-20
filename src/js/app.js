import HelpDesk from './HelpDesk';
import TicketService from './TicketService';


document.addEventListener("DOMContentLoaded", () => {

    const root = document.getElementById('root');

    const ticketService = new TicketService();
    const app = new HelpDesk(root, ticketService);
    app.init();
    
});

