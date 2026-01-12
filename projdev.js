// Gestion des événements CAN 2025 Maroc
class EventManager {
    constructor() {
        this.events = JSON.parse(localStorage.getItem('can2025_events')) || [];
        this.form = document.getElementById('eventForm');
        this.tableBody = document.getElementById('eventTable');

        // Vérification critique : est-ce que les éléments existent ?
        if (!this.form) {
            console.error("ERREUR : document.getElementById('eventForm') retourne null");
        }
        if (!this.tableBody) {
            console.error("ERREUR : document.getElementById('eventTable') retourne null");
        }

        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        this.displayEvents(); // affichage initial
    }

    saveEvents() {
        localStorage.setItem('can2025_events', JSON.stringify(this.events));
        console.log("Sauvegarde effectuée →", this.events.length, "événements");
    }

    displayEvents() {
        if (!this.tableBody) {
            console.error("Impossible d'afficher : tableBody est null");
            return;
        }

        this.tableBody.innerHTML = '';

        console.log("displayEvents() appelée →", this.events.length, "événements");

        if (this.events.length === 0) {
            this.tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center; padding: 2rem;">
                        Aucun événement enregistré pour le moment...
                    </td>
                </tr>
            `;
            return;
        }

        this.events.forEach((event, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="event-title">${this.escapeHtml(event.title || '(sans titre)')}</td>
                <td>${event.date || '—'}</td>
                <td>${this.escapeHtml(event.location || '—')}</td>
                <td class="actions">
                    <button class="btn-action btn-edit" 
                            onclick="eventManager.editEvent(${index})"
                            title="Modifier">
                        ✏️ Modifier
                    </button>
                    <button class="btn-action btn-delete" 
                            onclick="eventManager.deleteEvent(${index})"
                            title="Supprimer">
                        🗑️ Supprimer
                    </button>
                </td>
            `;
            this.tableBody.appendChild(row);
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.form) return;

        const id = document.getElementById('eventId')?.value || '';
        const title = document.getElementById('title')?.value.trim() || '';
        const date = document.getElementById('date')?.value || '';
        const location = document.getElementById('location')?.value.trim() || '';
        const description = document.getElementById('description')?.value.trim() || '';

        console.log("Soumission → id:", id, "| title:", title, "| date:", date, "| lieu:", location);

        if (!title || !date || !location) {
            alert('Veuillez remplir les champs obligatoires !');
            return;
        }

        const eventData = { title, date, location, description };

        if (id === '') {
            // Ajout
            this.events.push(eventData);
            console.log("→ Ajout d'un nouvel événement");
        } else {
            // Modification
            const index = Number(id);
            if (!isNaN(index) && index >= 0 && index < this.events.length) {
                this.events[index] = eventData;
                console.log("→ Modification de l'événement n°", index);
            } else {
                console.warn("Index invalide pour modification :", id);
            }
        }

        this.saveEvents();
        this.resetForm();
        this.displayEvents();
    }

    editEvent(index) {
        const event = this.events[index];
        if (!event) {
            console.warn("Événement non trouvé à l'index", index);
            return;
        }

        const eventIdInput = document.getElementById('eventId');
        const titleInput = document.getElementById('title');
        const dateInput = document.getElementById('date');
        const locationInput = document.getElementById('location');
        const descInput = document.getElementById('description');

        if (!eventIdInput || !titleInput || !dateInput || !locationInput) {
            console.error("Un ou plusieurs champs du formulaire introuvables");
            return;
        }

        eventIdInput.value = index;
        titleInput.value = event.title;
        dateInput.value = event.date;
        locationInput.value = event.location;
        descInput.value = event.description || '';

        console.log("Édition → index", index);

        document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' });
    }

    deleteEvent(index) {
        if (!confirm('Voulez-vous vraiment supprimer cet événement ?')) return;

        this.events.splice(index, 1);
        this.saveEvents();
        this.displayEvents();
        console.log("Suppression → index", index);
    }

    resetForm() {
        if (this.form) {
            this.form.reset();
        }
        const eventIdInput = document.getElementById('eventId');
        if (eventIdInput) {
            eventIdInput.value = '';
        }
    }

    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Instanciation sécurisée
let eventManager;

document.addEventListener('DOMContentLoaded', () => {
    eventManager = new EventManager();
    window.eventManager = eventManager; // pour les onclick
    console.log("EventManager initialisé");
});
