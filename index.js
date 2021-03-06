const submit = document.getElementById("valider");
const email = document.getElementById("email");
const motdepasse = document.getElementById("mp");
const erreur = document.getElementById("erreur");
const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

submit.addEventListener("click", (e) => {
    e.preventDefault();

    if (email.value == "" || motdepasse.value == "")
        erreur.textContent = "Veuillez renseigner les champs svp!";
    else if (re.test(email.value) == false)
        erreur.textContent = "Veuillez renseigner un email valide svp";
    else {
        const API_URL = "https://api-taaches-smarone.herokuapp.com/login";

        const REQUEST_HEADERS = {
            "Content-Type": "application/json",
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
                if (response.data.error) erreur.textContent = "Identifiant incorrectes";
                if (response.data.id) {
                    localStorage.setItem(
                        "x-access-token",
                        response.headers.authorization
                    );
                    sessionStorage.setItem("utilisateur", response.data.id);
                    window.location.replace(
                        "https://taaches-smarone.netlify.app/accueil/"
                    );
                }
            })
            .catch((error) => console.error(error));
    }
});