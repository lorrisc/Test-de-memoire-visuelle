let level = 0;
let nbMancheEchoue = 0;
let manchePreciseEchoue = 0;

let quelleNote = 0; //note de musique actuelle a jouer
let muteAudio = 0; //l'utilisateur ne veux pas de son

//*DIMENSION TUILE + MARGIN
function dimensionnementGrille(nbTuilesLigne) {
    let grille = document.querySelector("#gameSection__tuilesGrid");
    let grilleLargeur = grille.clientWidth;

    let tuileTotal = grilleLargeur / nbTuilesLigne; //width tuile + margin
    let tuileSansMargin = tuileTotal - (7 / 100) * tuileTotal * 2; //width tuile
    let marginTuile = (tuileTotal - tuileSansMargin) / 2; //width margin tuile

    let tabSizeReturn = [tuileSansMargin, marginTuile];

    return tabSizeReturn;
}

function createGrille() {
    level++;
    //*Supprime les tuiles déjà présentes
    let grille = document.querySelector("#gameSection__tuilesGrid");
    while (grille.firstChild) {
        grille.removeChild(grille.firstChild);
    }

    //*information sur la partie pour le joueur
    let infoJoueur = document.querySelector("#infoGames");
    infoJoueur.classList.add("visibleGameSection"); //info visible
    let compteurLevelUser = document.querySelector("#infoGames__level__var");
    compteurLevelUser.textContent = level; //mis a jour level user

    //*Mis à jour icon vie restante
    if (manchePreciseEchoue === 1) {
        //manche précédente perdue
        if (nbMancheEchoue == 1) {
            let live1 = document.querySelector("#live1");
            live1.style.display = "none";
        } else if (nbMancheEchoue == 2) {
            let live2 = document.querySelector("#live2");
            live2.style.display = "none";
        } else if (nbMancheEchoue == 3) {
            let live3 = document.querySelector("#live3");
            live3.style.display = "none";
        }
    }
    manchePreciseEchoue = 0;

    //initialisation var essentiel
    let nombreTuileLigne = null;
    let nombreTuileATrouve = null;

    //*Recherche tableau - caractéristique manche - nb tuile, nb tuile a trouve selon level
    caracteristique.forEach((element) => {
        if (element.level == level) {
            nombreTuileLigne = element.nombreTuileLigne;
            nombreTuileATrouve = element.nombreTuileATrouve;

            let sizeTuile = dimensionnementGrille(nombreTuileLigne); //return taille des tuiles (tableau)

            let tuileWidth = sizeTuile[0]; //tuile
            let tuileMarginWidth = sizeTuile[1]; //margin

            //*création des tuiles
            for (let i = 0; i < nombreTuileLigne ** 2; i++) {
                let tuile = document.createElement("div");
                tuile.className = "tuile__normal tuile";
                tuile.style.width = tuileWidth + "px";
                tuile.style.height = tuileWidth + "px";
                tuile.style.margin = tuileMarginWidth + "px";
                grille.appendChild(tuile);
            }

            let tuilesATrouve = []; //tableau définissant les tuiles a trouvé

            //*boucle nombre aleatoire + ajout dans le tableau
            for (let i = 0; i < nombreTuileATrouve; i++) {
                let nouvelleTuileATrouve = Math.floor(Math.random() * nombreTuileLigne ** 2); //choisi une tuile random (index)

                let presence = null; //presence = 1 si tuile déjà sélectionné
                for (let j = 0; j < tuilesATrouve.length; j++) {
                    //vérifie si déjà sélectionné
                    if (nouvelleTuileATrouve === tuilesATrouve[j]) {
                        presence = 1;
                        i--; //on annule le tour dans la boucle
                    }
                }
                if (presence != 1) {
                    //tuile non sélectionné précédemment
                    tuilesATrouve.push(nouvelleTuileATrouve);
                }
                presence = null;
            }

            setTimeout(() => {
                tuilesATrouve.forEach((element) => {
                    //*PRÉSENTATION DES TUILES A TROUVÉ
                    let tuiles = grille.childNodes;
                    tuiles[element].classList.toggle("tuile__normal");
                    tuiles[element].classList.toggle("tuile__blanche");
                    tuiles[element].classList.toggle("tuile__ATrouve");
                });

                let note = new Audio(gammeMusique[3].url);
                note.play();
                
                setTimeout(() => {
                    tuilesATrouve.forEach((element) => {
                        //*DISPARITION DES TUILES A TROUVÉ
                        let tuiles = grille.childNodes;
                        tuiles[element].classList.toggle("tuile__normal");
                        tuiles[element].classList.toggle("tuile__blanche");
                    });

                    let nbErrorsManche = 0;
                    let nbTuileTrouve = 0;
                    let gammeMonte = 1; //gammeMonté = 1 alors true sinon si -1 alors descente
                    grille.childNodes.forEach((element) => {
                        element.addEventListener("click", () => {
                            if (element.classList.contains("tuile__ATrouve") == true && nbErrorsManche < 3 && nbTuileTrouve < nombreTuileATrouve && element.classList.contains("tuile__blanche") == false) {
                                //*SI TUILE TROUVÉ
                                element.classList.add("tuile__blanche");
                                nbTuileTrouve++;

                                //*note de musique a jouer
                                if (muteAudio == 0) {
                                    if (gammeMonte == -1) {
                                        //La gamme est en descente
                                        if (quelleNote == -1) {
                                            //a atteind la derniere note (la première ducoup)
                                            gammeMonte = 1;
                                            quelleNote = 1;
                                            let note = new Audio(gammeMusique[quelleNote].url);
                                            note.play();
                                            quelleNote++;
                                        } else if (quelleNote != -1) {
                                            //en cours de descente
                                            let note = new Audio(gammeMusique[quelleNote].url);
                                            note.play();
                                            quelleNote--;
                                        }
                                    } else if (gammeMonte == 1) {
                                        //La gamme est en monté
                                        if (quelleNote < 6) {
                                            //en cours de monté
                                            gammeMonte = 1;
                                            let note = new Audio(gammeMusique[quelleNote].url);
                                            note.play();
                                            quelleNote++;
                                        } else if (quelleNote >= 6) {
                                            //dernière note atteinte
                                            gammeMonte = -1;
                                            let note = new Audio(gammeMusique[quelleNote].url);
                                            note.play();
                                            quelleNote--;
                                        }
                                    }
                                }

                                //*manche fini
                                if (nombreTuileATrouve == nbTuileTrouve) {
                                    let body = document.querySelector("body");
                                    body.classList.toggle("blueApparition");
                                    setTimeout(() => {
                                        quelleNote = 0;
                                        body.classList.toggle("blueApparition");
                                        createGrille();
                                    }, 340);
                                }
                            } else if (element.classList.contains("tuile__ATrouve") == false && nbErrorsManche < 3 && nbTuileTrouve < nombreTuileATrouve && element.classList.contains("tuile__error") == false) {
                                //*SI TUILE NON TROUVÉ
                                element.classList.add("tuile__error");
                                if (muteAudio == 0) {
                                    const errorNote = new Audio("assets/gammePiano/Error.mp3");
                                    errorNote.play();
                                }
                                nbErrorsManche++;

                                if (nbErrorsManche == 3) {
                                    //*manché échoué
                                    nbMancheEchoue++;
                                    if (nbMancheEchoue < 3) {
                                        //*non éliminé
                                        level--;
                                        let body = document.querySelector("body");
                                        body.classList.toggle("redApparition");
                                        setTimeout(() => {
                                            manchePreciseEchoue = 1;
                                            quelleNote = 0;
                                            body.classList.toggle("redApparition");
                                            createGrille();
                                        }, 340);
                                    } else if (nbMancheEchoue >= 3) {
                                        //*éliminé
                                        buttonStartGame.classList.toggle("invisible");

                                        let grille = document.querySelector("#gameSection__tuilesGrid");
                                        grille.classList.toggle("invisible");
                                        grille.classList.toggle("visibleGameSection");

                                        let infoJoueur = document.querySelector("#infoGames");
                                        infoJoueur.classList.remove("visibleGameSection");

                                        level = 0;
                                        nbMancheEchoue = 0;
                                        manchePreciseEchoue = 0;

                                        let live1 = document.querySelector("#live1");
                                        live1.style.display = "block";
                                        let live2 = document.querySelector("#live2");
                                        live2.style.display = "block";
                                        let live3 = document.querySelector("#live3");
                                        live3.style.display = "block";

                                        let sectionSongOption = document.querySelector("#muteSong");
                                        sectionSongOption.classList.toggle("invisible");
                                    }
                                }
                            }
                        });
                    });
                }, 1500);
            }, 900);
        }
    });
}

let buttonStartGame = document.querySelector("#startGame");
buttonStartGame.addEventListener("click", () => {
    buttonStartGame.classList.toggle("invisible");

    let grille = document.querySelector("#gameSection__tuilesGrid");
    grille.classList.toggle("invisible");
    grille.classList.toggle("visibleGameSection");

    let sectionSongOption = document.querySelector("#muteSong");
    sectionSongOption.classList.toggle("invisible");
    createGrille();
});

let songIsActive = document.querySelector("#songIsActive");
let songIsMute = document.querySelector("#songIsMute");
songIsMute.style.display = "none";

songIsActive.addEventListener("click", () => {
    songIsActive.style.display = "none";
    songIsMute.style.display = "block";
    muteAudio = 1;
});
songIsMute.addEventListener("click", () => {
    songIsMute.style.display = "none";
    songIsActive.style.display = "block";
    muteAudio = 0;
});
