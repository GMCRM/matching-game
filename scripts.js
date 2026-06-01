document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("gameBoard");
  const restartButton = document.getElementById("restartButton");
  const winNotification = document.getElementById("winNotification");
  const matchCountEl = document.getElementById("matchCount");
  const totalPairsEl = document.getElementById("totalPairs");
  const matchProgressBar = document.getElementById("matchProgressBar");
  const attemptCountEl = document.getElementById("attemptCount");
  const attemptsProgressBar = document.getElementById("attemptsProgressBar");
  const fruitsAndVeggies = [
    "🍎",
    "🍌",
    "🍇",
    "🍉",
    "🍓",
    "🍒",
    "🍍",
    "🥥",
    "🥭",
    "🥑",
    "🥕",
    "🍅",
    "🍆",
    "🥦",
    "🥒",
    "🌽",
    "🥬",
    "🍈",
  ];

  let cardArray = [...fruitsAndVeggies, ...fruitsAndVeggies];
  let hasFlippedCard = false;
  let firstCard, secondCard;
  let lockBoard = false;
  let matches = 0;
  let attempts = 0;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function createBoard() {
    shuffle(cardArray);
    gameBoard.innerHTML = "";
    cardArray.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `;
      card.addEventListener("click", flipCard);
      gameBoard.appendChild(card);
    });
    matches = 0;
    attempts = 0;
    matchCountEl.textContent = 0;
    totalPairsEl.textContent = cardArray.length / 2;
    matchProgressBar.style.height = "0%";
    attemptCountEl.textContent = 0;
    attemptsProgressBar.style.height = "0%";
    winNotification.style.display = "none"; // Hide win notification on restart
  }

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    attempts++;
    attemptCountEl.textContent = attempts;
    const maxAttempts = 120;
    const pct = Math.min((attempts / maxAttempts) * 100, 100);
    attemptsProgressBar.style.height = pct + "%";
    attemptCountEl.classList.remove("pop");
    void attemptCountEl.offsetWidth;
    attemptCountEl.classList.add("pop");

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    checkForMatch();
  }

  function checkForMatch() {
    let isMatch = firstCard.innerHTML === secondCard.innerHTML;
    isMatch ? disableCards() : unflipCards();
  }

  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    matches += 2; // Two cards are matched
    matchCountEl.textContent = matches / 2;
    matchProgressBar.style.height = (matches / cardArray.length) * 100 + "%";
    matchCountEl.classList.remove("pop");
    void matchCountEl.offsetWidth; // reflow to restart animation
    matchCountEl.classList.add("pop");

    if (matches === cardArray.length) {
      winNotification.style.display = "block"; // Show win notification
    }

    resetBoard();
  }

  function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");

      resetBoard();
    }, 1500);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  restartButton.addEventListener("click", createBoard);

  createBoard();
});
