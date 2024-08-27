document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("background-music");
    const toggleButton = document.getElementById("toggle-music");

    const playMusic = () => {
        audio.play().catch((error) => {
            console.log(
                "Autoplay is blocked. Try turning on the music manually."
            );
        });
    };

    const toggleMusic = () => {
        if (audio.paused) {
            audio.play().catch((error) => {
                console.log("Error ", error);
            });
            toggleButton.textContent = "Mute";
        } else {
            audio.pause();
            toggleButton.textContent = "Unmute";
        }
    };

    playMusic();

    toggleButton.addEventListener("click", toggleMusic);

    const cards = Array.from(document.querySelectorAll(".card"));
    const gameBoard = document.querySelector(".cards");

    let currentPlayer = 1;
    let playerScores = [0, 0];
    let flippedCards = [];
    let matchedPairs = 0;
    let currentCardIndex = 0;

    function shuffleBoard() {
        const shuffledCards = shuffle(cards);
        shuffledCards.forEach((card) => gameBoard.appendChild(card));
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function updateScoreboard() {
        const scoreboard = document.getElementById("scoreboard");
        scoreboard.innerHTML = `
            <span class="${currentPlayer === 1 ? "active" : ""}">Player 1: ${
            playerScores[0]
        }</span> - 
            <span class="${currentPlayer === 2 ? "active" : ""}">Player 2: ${
            playerScores[1]
        }</span>
        `;
    }

    function checkForMatch() {
        if (flippedCards.length === 2) {
            const [card1, card2] = flippedCards;
            const img1 = card1.querySelector(".second-image").src;
            const img2 = card2.querySelector(".second-image").src;

            if (img1 === img2) {
                playerScores[currentPlayer - 1]++;
                matchedPairs++;
                flippedCards = [];

                if (matchedPairs === cards.length / 2) {
                    setTimeout(() => {
                        alert(
                            `Game over! Player 1:  ${playerScores[0]}, Player 2:  ${playerScores[1]}`
                        );
                    }, 500);
                }
            } else {
                setTimeout(() => {
                    card1.classList.remove("flipped");
                    card2.classList.remove("flipped");
                    flippedCards = [];
                    currentPlayer = currentPlayer === 1 ? 2 : 1;
                    updateScoreboard();
                }, 1000);
            }
        }
    }

    cards.forEach((card, index) => {
        card.setAttribute("tabindex", "0");
        card.addEventListener("click", () => {
            if (
                !card.classList.contains("flipped") &&
                flippedCards.length < 2
            ) {
                card.classList.add("flipped");
                flippedCards.push(card);
                checkForMatch();
            }
        });
    });

    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowRight":
                currentCardIndex = (currentCardIndex + 1) % cards.length;
                break;
            case "ArrowLeft":
                currentCardIndex =
                    (currentCardIndex - 1 + cards.length) % cards.length;
                break;
            case "ArrowDown":
                currentCardIndex = (currentCardIndex + 4) % cards.length;
                break;
            case "ArrowUp":
                currentCardIndex =
                    (currentCardIndex - 4 + cards.length) % cards.length;
                break;
            case "Enter":
            case " ":
                if (
                    !cards[currentCardIndex].classList.contains("flipped") &&
                    flippedCards.length < 2
                ) {
                    cards[currentCardIndex].classList.add("flipped");
                    flippedCards.push(cards[currentCardIndex]);
                    checkForMatch();
                }
                break;
            default:
                break;
        }
        cards[currentCardIndex].focus();
    });

    shuffleBoard();
    updateScoreboard();
    cards[currentCardIndex].focus();
});
