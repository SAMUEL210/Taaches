class Modele {
    constructor() {
        this.taaches = JSON.parse(localStorage.getItem("taaches")) || [];
    }

    _commit(taaches) {
        this.onTaacheListeChanged(taaches);
        localStorage.setItem("taaches", JSON.stringify(taaches));
    }

    ajouterTaache(taacheText) {
        const taache = {
            id: this.taaches.length > 0 ?
                this.taaches[this.taaches.length - 1].id + 1 : 1,
            text: taacheText,
            complete: false,
        };
        this.taaches.push(taache);
    }

    editTaache(id, updateTexte) {
        this.taaches = this.taaches.map((tache) =>
            tache.id === id ? { id: tache.id, text: updateTexte, complete: tache.complete } :
            tache
        );
    }

    effacerTaache(id) {
        this.taaches = this.taaches.filter((todo) => todo.id !== id);

        this._commit(this.taaches);
    }

    toggleTaache(id) {
        this.taaches = this.taaches.map((tache) =>
            tache.id === id ? { id: tache.id, text: tache.text, complete: !tache.complete } :
            tache
        );
    }

    bindTaacheListeChange(callback) {
        this.onTaacheListeChanged = callback;
    }
}

class Vue {
    constructor() {
        this.app = this.getElement("#root");

        this.titre = this.creerElement("h1");
        this.titre.textContent = "Taaches";

        this.form = this.creerElement("form");

        this.input = this.creerElement("input");
        this.input.type = "text";
        this.input.placeholder = "Ajouter taache";
        this.input.name = "taache";

        this.submitBouton = this.creerElement("button");
        this.submitBouton.textContent = "Valider";

        this.taacheListe = this.creerElement("ul", "todo-list");

        this.form.append(this.input, this.submitBouton);

        this.app.append(this.titre, this.form, this.taacheListe);

        this._temporaireTaacheText;
        this._initLocalListeners();
    }

    _initLocalListeners() {
        this.taacheListe.addEventListener("input", (e) => {
            if (e.target.className === "editable") {
                this._temporaireTaacheText = e.target.innerText;
            }
        });
    }

    creerElement(tag, className) {
        const element = document.createElement(tag);
        if (className) element.classList.add(className);

        return element;
    }

    getElement(selector) {
        const element = document.querySelector(selector);

        return element;
    }

    get _taacheTexte() {
        return this.input.value;
    }

    _effacerInput() {
        this.input.value = "";
    }

    afficherTaaches(taaches) {
        while (this.taacheListe.firstChild) {
            this.taacheListe.removeChild(this.taacheListe.firstChild);
        }

        if (taaches.length === 0) {
            const p = this.creerElement("p");
            p.textContent = "Rient a ajouter, Ajouter une Taache !";
            this.taacheListe.append(p);
        } else {
            taaches.forEach((tache) => {
                const li = this.creerElement("li");
                li.id = tache.id;

                const checkbox = this.creerElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = tache.complete;

                const span = this.creerElement("span");
                span.contentEditable = true;
                span.classList.add("editable");

                if (tache.complete) {
                    const strike = this.creerElement("s");
                    strike.textContent = tache.text;
                    span.append(strike);
                } else {
                    span.textContent = tache.text;
                }

                const effacerBouton = this.creerElement("button", "delete");
                effacerBouton.textContent = "Effacer";

                li.append(checkbox, span, effacerBouton);

                this.taacheListe.append(li);
            });
        }
    }

    bindAjouterTaache(handler) {
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();

            if (this._taacheTexte) {
                handler(this._taacheTexte);
                this._effacerInput();
            }
        });
    }

    bindEditTaache(handler) {
        this.taacheListe.addEventListener("focusout", (e) => {
            if (this._temporaireTaacheText) {
                const id = parseInt(e.target.parentElement.id);

                handler(id, this._temporaireTaacheText);
                this._temporaireTaacheText = "";
            }
        });
    }

    bindffacerTaache(handler) {
        this.taacheListe.addEventListener("click", (e) => {
            if (e.target.className === "delete") {
                const id = parseInt(e.target.parentElement.id);

                handler(id);
            }
        });
    }

    bindToggleTaache(handler) {
        this.taacheListe.addEventListener("change", (e) => {
            if (e.target.type === "checkbox") {
                const id = parseInt(e.target.parentElement.id);

                handler(id);
            }
        });
    }
}

class Controller {
    constructor(model, vue) {
        this.model = model;
        this.vue = vue;

        this.onTaacheListeChanged(this.model.taaches);

        this.vue.bindAjouterTaache(this.handleAjouterTaache);
        this.vue.bindEditTaache(this.handleEditTaache);
        this.vue.bindffacerTaache(this.handleDeleteTaache);
        this.vue.bindToggleTaache(this.handleToggleTaache);

        this.model.bindTaacheListeChange(this.onTaacheListeChanged);
    }

    onTaacheListeChanged = (taaches) => {
        this.vue.afficherTaaches(taaches);
    };

    handleAjouterTaache = (taacheTexte) => {
        this.model.ajouterTaache(taacheTexte);
        this.vue.afficherTaaches(this.model.taaches);
    };

    handleEditTaache = (id, taacheTexte) => {
        this.model.editTaache(id, taacheTexte);
    };

    handleDeleteTaache = (id) => {
        this.model.effacerTaache(id);
    };

    handleToggleTaache = (id) => {
        this.model.toggleTaache(id);
        this.vue.afficherTaaches(this.model.taaches);
    };
}

const app = new Controller(new Modele(), new Vue());