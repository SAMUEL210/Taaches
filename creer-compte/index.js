const submit = document.getElementById("valider");
const nom = document.getElementById("nom");
const prenom = document.getElementById("prenom");
const email = document.getElementById("email");
const motdepasse = document.getElementById("mp");
const erreur = document.getElementById("erreur");
const succes = document.getElementById("succes");
const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

submit.addEventListener("click", (e) => {
    e.preventDefault();

    if (
        nom.valuer == "" ||
        prenom.value == "" ||
        email.value == "" ||
        motdepasse.value == ""
    )
        erreur.textContent = "Veuillez renseigner les champs svp!";
    else if (re.test(email.value) == false)
        erreur.textContent = "Veuillez renseigner un email valide svp";
    else {
        const API_URL = "https://api-taaches-smarone.herokuapp.com/signin";

        const REQUEST_HEADERS = {
            "Content-Type": "application/json",
        };

        const donneeUtilisateur = {
            nom: nom.value,
            prenom: prenom.value,
            email: email.value,
            mp: motdepasse.value,
        };
        const formattedData = JSON.stringify(donneeUtilisateur);

        console.log(formattedData);
        axios
            .post(API_URL, formattedData, { headers: REQUEST_HEADERS })
            .then((response) => {
                if (response.data.error)
                    erreur.textContent = "Utilisateur existe déja!";
                if (response.data.succes) {
                    erreur.textContent = "";
                    succes.textContent = "Utilisateur crée !";
                }
            })
            .catch((error) => console.error(error));
    }
});