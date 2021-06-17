const submit = document.getElementById("valider");
const email = document.getElementById("email");
const motdepasse = document.getElementById("mp");
const erreur = document.getElementById("erreur");

submit.addEventListener("click", (e) => {
    e.preventDefault();

    if (email.value == " " || motdepasse.value == "")
        erreur.textContent = "Veuillez renseigner les champs svp!";
    else {
        const API_URL = "http://localhost:3000/login/";

        const REQUEST_HEADERS = {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("x-access-token"),
        };

        const donneeUtilisateur = {
            email: email.value,
            mp: motdepasse.value,
        };
        const formattedData = JSON.stringify(donneeUtilisateur);

        console.log(formattedData);
        axios
            .post(API_URL, formattedData, { headers: REQUEST_HEADERS })
            .then((response) => {
                const donnee = response.data;
                if (donnee.error) erreur.textContent = "Identifiant incorrectes";
                if (donnee.token) {
                    localStorage.setItem("x-access-token", response.token);
                    sessionStorage.setItem("utilisateur", formattedData.email);
                    window.location.replace("http://localhost:5500/accueil/");
                }
            })
            .catch((error) => console.error(error));
    }
});