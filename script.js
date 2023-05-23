// Sélection des éléments du DOM
const newGameButton = document.querySelector('#new-game'); // Bouton "Nouvelle partie"
const rollDiceButton = document.querySelector('#roll-dice'); // Bouton "Lancer le dé"
const holdButton = document.querySelector('#hold'); // Bouton "Conserver le score"
const scoreTotalOneElement = document.querySelector('.score-total-j1 h2'); // Élément du score total du joueur 1
const scoreTotalTwoElement = document.querySelector('.score-total-j2 h2'); // Élément du score total du joueur 2
const scoreCourantOneElement = document.querySelector('#score-courant-j1-value'); // Élément du score courant du joueur 1
const scoreCourantTwoElement = document.querySelector('#score-courant-j2-value'); // Élément du score courant du joueur 2
const playerTurnOneElement = document.querySelector('.player-turn-one'); // Élément du tour du joueur 1
const playerTurnTwoElement = document.querySelector('.player-turn-two'); // Élément du tour du joueur 2
const diceImages = document.querySelectorAll('.de'); // Images des dés
const rulesButton = document.querySelector('.container-bloc-one button'); // Bouton pour afficher les règles
rulesButton.addEventListener('click', showRules);

// Variables pour la logique du jeu
let scores, roundScore, activePlayer, gamePlaying, currentScore, winningScore;

// Afficher les règles du jeu
function showRules() {
  const rulesModal = document.getElementById('rules-modal'); // Modal des règles
  const closeButton = document.querySelector('#rules-modal .btn-close'); // Bouton de fermeture de la modal

  // Afficher la modal des règles
  rulesModal.style.display = 'block';

  // Fermer la modal lorsque le bouton de fermeture est cliqué
  closeButton.addEventListener('click', function() {
    rulesModal.style.display = 'none';
  });

  // Fermer la modal lorsque l'utilisateur clique en dehors de la modal
  window.addEventListener('click', function(event) {
    if (event.target === rulesModal) {
      rulesModal.style.display = 'none';
    }
  });
}

// Fonction pour initialiser le jeu
function init() {
  scores = [0, 0]; // Scores totaux des joueurs
  roundScore = 0; // Score courant du joueur actif
  activePlayer = 0; // Joueur actif (0 pour joueur 1, 1 pour joueur 2)
  gamePlaying = true; // Variable de contrôle du jeu
  currentScore = 0; // Score courant (non utilisé dans ce code, peut être supprimé)
  winningScore = 100; // Score requis pour gagner le jeu

  // Initialiser les scores et le score courant à zéro
  scoreTotalOneElement.textContent = '0';
  scoreTotalTwoElement.textContent = '0';
  scoreCourantOneElement.textContent = '0';
  scoreCourantTwoElement.textContent = '0';

  // Masquer toutes les images de dés
  diceImages.forEach(dice => {
    dice.style.display = 'none';
  });

  // Afficher le dé numéro 1 pour le joueur 1 par défaut
  document.querySelector('#dice-1').style.display = 'initial';

  // Afficher le tour du joueur 1 et masquer le tour du joueur 2
  playerTurnOneElement.style.display = 'block';
  playerTurnTwoElement.style.display = 'initial';

  // Activer les boutons "Lancer le dé" et "Conserver le score"
  rollDiceButton.disabled = false;
  holdButton.disabled = false;

  // Changer le point de tour du joueur actif (affichage visuel)
  togglePlayerTurnDot(activePlayer);

  // Texte des éléments du tour des joueurs
  playerTurnOneElement.textContent = 'PLAYER 1';
  playerTurnTwoElement.textContent = 'PLAYER 2';
  }

// Fonction pour changer le point de tour entre les joueurs
function togglePlayerTurnDot(player) {
  const dot1 = document.getElementById('dot-1'); // Point de tour pour le joueur 1
  const dot2 = document.getElementById('dot-2'); // Point de tour pour le joueur 2

  // Afficher ou masquer le point de tour en fonction du joueur actif
  if (player === 0) {
    dot1.style.display = 'block';
    dot2.style.display = 'none';
  } else {
    dot1.style.display = 'none';
    dot2.style.display = 'block';
  }
}

// Fonction pour lancer le dé
function rollDice() {
  // Vérifier si le jeu est en cours
  if (gamePlaying) {
     // Générer un nombre aléatoire entre 1 et 6 pour le dé
    const dice = Math.floor(Math.random() * 6) + 1;

    // Masquer toutes les images de dés
    diceImages.forEach(diceImage => {
      diceImage.style.display = 'none';
    });

    // Afficher l'image correspondante du dé
    const diceImage = document.querySelector(`#dice-${dice}`);
    diceImage.style.display = 'initial';

    // Mettre à jour le score courant du joueur actif
    if (dice !== 1) {
    // Ajouter le score du dé au score courant du joueur actif
      roundScore += dice;
      document.querySelector(`#score-courant-j${activePlayer + 1}-value`).textContent = roundScore;
    } else {
      // Passer au joueur suivant si un 1 est obtenu
      switchPlayer();
    }
  }
}

// Fonction pour passer au joueur suivant
function switchPlayer() {
  const playerTurnElement = document.querySelector('.player-turn');

  // Changer la classe CSS pour afficher le point de tour correct pour le joueur suivant
   playerTurnElement.classList.toggle('player-turn-one');
  playerTurnElement.classList.toggle('player-turn-two');

  // Réinitialiser le score courant et l'afficher à zéro pour le joueur actif
  document.getElementById(`score-courant-j${activePlayer + 1}-value`).textContent = '0';
  roundScore = 0;

  // Passer au joueur suivant (changement de l'indice du joueur actif)
  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);

  // Mettre à jour le point de tour visuel pour le joueur suivant
  togglePlayerTurnDot(activePlayer);
}

// Fonction pour mettre à jour le score total du joueur actif
function updateGlobalScore() {
  if (roundScore > 0) {
    // Ajouter le score courant au score total du joueur actif
    scores[activePlayer] += roundScore;

    // Mettre à jour l'affichage du score total du joueur actif
    document.querySelector(`.score-total-j${activePlayer + 1} h2`).textContent = scores[activePlayer];

    // Réinitialiser le score courant et l'afficher à zéro pour le joueur actif
    roundScore = 0;
    document.querySelector(`#score-courant-j${activePlayer + 1}-value`).textContent = '0';

    // Vérifier si le joueur actif a atteint le score requis pour gagner
    if (scores[activePlayer] >= winningScore) {
      // Afficher le message de victoire du joueur actif
      playerTurnOneElement.textContent = `Player ${activePlayer + 1} wins!`;

      // Désactiver les boutons "Lancer le dé" et "Conserver le score"
      document.getElementById('roll-dice').disabled = true;
      document.getElementById('hold').disabled = true;
    } else {
      // Passer au joueur suivant
      switchPlayer();
    }
  }
}

// Gestionnaire d'événement pour le bouton "Nouvelle partie"
newGameButton.addEventListener('click', init);

// Gestionnaire d'événement pour le bouton "Lancer le dé"
rollDiceButton.addEventListener('click', rollDice);

// Gestionnaire d'événement pour le bouton "Conserver le score"
holdButton.addEventListener('click', updateGlobalScore);

// Initialiser le jeu au chargement de la page
init();

