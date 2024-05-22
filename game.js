// Definisjon av klassen GameObject
class GameObject {
    // Konstruktør for å opprette et generelt spillobjekt med posisjon, størrelse og HTML-element
    constructor(x, y, width, height, element) {
        this.x = x; // X-koordinatet til objektet
        this.y = y; // Y-koordinatet til objektet
        this.width = width; // Bredde på objektet
        this.height = height; // Høyde på objektet
        this.element = element; // HTML-elementet som representerer objektet
        this.positionAt(this.x, this.y); // Plasserer objektet på startposisjonen
    }

    // Returnerer rektangelinformasjon om objektet
    rect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    // Setter posisjonen til objektet og oppdaterer HTML-elementets posisjon
    positionAt(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = Math.floor(this.x) + 'px';
        this.element.style.top = Math.floor(this.y) + 'px';
    }
}

// Definisjon av klassen Bird som arver fra GameObject
class Bird extends GameObject {
    // Konstruktør for å opprette en fugl med gitt posisjon, størrelse, og HTML-element
    constructor(x, y, size, element) {
        super(x, y, size, size, element); // Kaller overordnet konstruktør med nødvendig informasjon
        this.gravity = 0.7; // Gravitasjonskraften som påvirker fuglen
        this.lift = -15; // Krafen som får fuglen til å hoppe
        this.velocity = 0; // Fuglens vertikale fart
    }

    // Oppdaterer fuglens posisjon basert på fysikk og input
    update() {
        this.velocity += this.gravity; // Legg til gravitasjon til fart
        this.y += this.velocity; // Oppdater posisjon basert på fart

        // Begrens bevegelsen til å være innenfor spillområdet
        if (this.y > gameHeight - this.height) {
            this.y = gameHeight - this.height;
            this.velocity = 0;
        }

        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }

        this.positionAt(this.x, this.y); // Oppdater HTML-elementets posisjon
    }

    // Får fuglen til å hoppe
    up() {
        this.velocity += this.lift;
    }
}

// Definisjon av klassen Pipe som arver fra GameObject
class Pipe extends GameObject {
    // Konstruktør for å opprette et rør med gitt posisjon, høyde, bredde og hastighet
    constructor(x, topHeight, bottomHeight, width, speed) {
        // Opprett HTML-elementer for topp- og bunnrøret
        const elementTop = document.createElement('div');
        elementTop.classList.add('pipe', 'pipe-top');
        const elementBottom = document.createElement('div');
        elementBottom.classList.add('pipe');

        // Legg til de nye HTML-elementene i spillkonteineren
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.appendChild(elementTop);
        gameContainer.appendChild(elementBottom);

        // Juster startX slik at rørene er plassert tett inntil hverandre
        const startX = x;

        super(startX, 0, width, topHeight, elementTop); // Kaller overordnet konstruktør for topprøret
        this.bottomHeight = bottomHeight; // Høyden til bunnrøret
        this.speed = speed; // Hastigheten til røret
        this.elementBottom = elementBottom; // HTML-elementet for bunnrøret
        this.elementBottom.style.width = `${this.width}px`;
        this.elementBottom.style.height = `${this.bottomHeight}px`;
        this.elementBottom.style.left = `${this.x}px`;
        this.elementBottom.style.top = `${gameHeight - this.bottomHeight}px`;
    }

    // Oppdaterer rørets posisjon og HTML-elementer
    update() {
        this.x -= this.speed; // Beveger røret til venstre basert på hastighet
        this.positionAt(this.x, this.y); // Oppdater posisjonen til topprøret
        this.elementBottom.style.left = `${this.x}px`; // Oppdater posisjonen til bunnrøret
        this.element.style.left = `${this.x}px`; // Oppdater posisjonen til HTML-elementet til røret
        this.element.style.height = `${this.height}px`; // Oppdater høyden til HTML-elementet til røret
    }

    // Sjekker om røret er utenfor skjermen
    offscreen() {
        return this.x < -this.width;
    }

    // Returnerer rektangelinformasjon om bunnen av røret
    rectBottom() {
        return {
            x: this.x,
            y: gameHeight - this.bottomHeight,
            width: this.width,
            height: this.bottomHeight
        };
    }
}

// Definisjon av klassen Coin som arver fra GameObject
class Coin extends GameObject {
    // Konstruktør for å opprette en mynt med gitt posisjon, størrelse, og HTML-element
    constructor(x, y, size, element) {
        super(x, y, size, size, element); // Kaller overordnet konstruktør med nødvendig informasjon
    }

    // Oppdaterer myntens posisjon
    update() {
        this.x -= pipeSpeed; // Beveg mynten til venstre basert på hastigheten til rørene
        this.positionAt(this.x, this.y); // Oppdater posisjonen til mynten
    }

    // Sjekker om mynten er utenfor skjermen
    offscreen() {
        return this.x < -this.width;
    }
}

// Funksjon for å legge til et nytt rør i spillet
function addPipe() {
    // Beregn tilfeldige høyder for topp- og bunnrøret
    const topHeight = Math.random() * (gameHeight - pipeGap - minPipeHeight) + minPipeHeight;
    const bottomHeight = gameHeight - topHeight - pipeGap;

    // Oppretter et nytt Pipe-objekt
    const newPipe = new Pipe(gameWidth, topHeight, bottomHeight, pipeWidth, pipeSpeed);

    // Legg til det nye røret i listen over rør
    pipes.push(newPipe);
}


// Funksjon for å legge til en mynt i spillet
function addCoin() {
    const coinSize = 30; // Størrelsen på mynten
    const coinElement = document.createElement('div'); // Oppretter et HTML-element for mynten
    coinElement.classList.add('coin'); // Legger til CSS-klassen 'coin' til myntelementet

    const gameContainer = document.getElementById('gameContainer'); // Henter spillkontaineren
    gameContainer.appendChild(coinElement); // Legger til myntelementet i spillkontaineren

    // Beregner en tilfeldig X-posisjon for mynten mellom 500 og 1000 piksler utenfor skjermen
    const x = gameContainer.offsetWidth + Math.random() * 500 + 500;
    // Beregner en tilfeldig Y-posisjon for mynten innenfor spillhøyden minus 60 piksler for å unngå at mynten er helt nederst
    const y = Math.random() * (gameHeight - 60);

    // Oppretter et Coin-objekt med de beregnede posisjonene, størrelsen og HTML-elementet
    const coin = new Coin(x, y, coinSize, coinElement);
    coins.push(coin); // Legger til mynten i listen over mynter
}

// Funksjon for å sjekke om to rektangler kolliderer
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
}

// Funksjon for å sjekke kollisjon mellom fuglen og rørene
function checkPipeCollision() {
    const birdRect = bird.rect(); // Henter rektangulær representasjon av fuglen

    for (let i = 0; i < pipes.length; i++) {
        const topPipeRect = pipes[i].rect(); // Henter rektangulær representasjon av øverste rør
        const bottomPipeRect = pipes[i].rectBottom(); // Henter rektangulær representasjon av nederste rør

        // Sjekker om fuglen kolliderer med øverste eller nederste rør
        if (isColliding(birdRect, topPipeRect) || isColliding(birdRect, bottomPipeRect)) {
            gameOver = true; // Setter spillet til slutt
            showGameOverMessage(); // Viser spillavslutningsmelding
            return;
        } else if (pipes[i].x + pipeWidth < bird.x && !pipes[i].scored) {
            pipes[i].scored = true; // Merker røret som scoret
            score++; // Øker poengsummen
            updateScoreDisplay(); // Oppdaterer poengvisning

            // Legger til mynt for hvert 5. poeng
            if (score % 5 === 0) {
                const coinX = pipes[i].x + pipeWidth + 100; // X-posisjonen for mynten
                let coinY; // Y-posisjonen for mynten

                // Sørger for at mynten ikke plasseres i et område nær rørene
                do {
                    coinY = Math.random() * (gameHeight - 60);
                } while (coinY > gameHeight - pipes[i].bottomHeight - 60 && coinY < pipes[i].height + pipeGap - 60);

                addCoin(coinX, coinY); // Legger til mynten på den beregnede posisjonen
            }
        }
    }
}

// Funksjon for å sjekke kollisjon mellom fuglen og mynter
function checkCoinCollision() {
    const birdRect = bird.rect(); // Henter rektangulær representasjon av fuglen

    for (let i = 0; i < coins.length; i++) {
        const coinRect = coins[i].rect(); // Henter rektangulær representasjon av mynten

        // Sjekker om fuglen kolliderer med mynten
        if (isColliding(birdRect, coinRect)) {
            coins[i].element.remove(); // Fjerner myntens HTML-element fra DOM
            coins.splice(i, 1); // Fjerner mynten fra listen over mynter
            score++; // Øker poengsummen
            updateScoreDisplay(); // Oppdaterer poengvisning
            break;
        }
    }
}

// Funksjon for å oppdatere poengvisningen i HTML
function updateScoreDisplay() {
    const scoreElement = document.getElementById('score'); // Henter HTML-elementet for poengvisning
    scoreElement.textContent = `${score}`; // Oppdaterer poengsummen

    // Oppdaterer høyeste poengsum i HTML og i lokal lagring hvis nødvendig
    if (score > highscore) {
        highscore = score;
        localStorage.setItem('highscore', highscore);
    }

    const highscoreElement = document.getElementById('highscore'); // Henter HTML-elementet for høyeste poengsum
    highscoreElement.textContent = `Highscore: ${highscore}`; // Oppdaterer høyeste poengsum
}

// Funksjon for å vise spillavslutningsmeldingen
function showGameOverMessage() {
    const gameContainer = document.getElementById('gameContainer'); // Henter spillkontaineren
    const gameOverMessage = document.createElement('div'); // Oppretter HTML-element for spillavslutningsmelding
    gameOverMessage.innerHTML = `
        <div>GAME OVER!</div>
        <div>Score: ${score}</div>
        <div>Highscore: ${highscore}</div>
        <div>Press space to try again</div>
    `; // Setter innholdet i spillavslutningsmeldingen

    gameOverMessage.classList.add('game-over-message'); // Legger til CSS-klassen 'game-over-message'
    gameContainer.appendChild(gameOverMessage); // Legger til spillavslutningsmeldingen i spillkontaineren

    // Lytter etter tastetrykk for å starte på nytt når mellomromstasten trykkes
    document.addEventListener('keydown', function restart(e) {
        if (e.key === ' ') {
            location.reload(); // Last inn siden på nytt
        }
    });
}
// Funksjon for å initialisere spillet
function initializeGame() {
    const gameContainer = document.getElementById('gameContainer'); // Henter spillkontaineren fra DOM

    bird.update(); // Oppdaterer fuglens posisjon

    // Legger til nytt rør med jevne mellomrom hvis spillet ikke er over og rammenummeret er delelig med 74
    if (!gameOver && frames % 74 === 0) { // Endret frekvensen av rørtillegg
        addPipe();
    }

    // Oppdaterer og fjerner rør
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update(); // Oppdaterer rørets posisjon

        // Fjerner røret hvis det er utenfor skjermen
        if (pipes[i].offscreen()) {
            pipes[i].element.remove(); // Fjerner rørets HTML-element fra DOM
            pipes[i].elementBottom.remove(); // Fjerner rørets HTML-element fra DOM
            pipes.splice(i, 1); // Fjerner røret fra listen over rør
        }
    }

    // Legger til ny mynt hvis det ikke finnes mynter eller hvis siste mynt har passert en viss avstand fra høyre kant av skjermen
    if (coins.length === 0 || coins[coins.length - 1].x < gameContainer.offsetWidth - 500) {
        addCoin();
    }

    // Oppdaterer og fjerner mynter
    for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].update(); // Oppdaterer myntens posisjon

        // Fjerner mynten hvis den er utenfor skjermen
        if (coins[i].offscreen()) {
            coins[i].element.remove(); // Fjerner myntens HTML-element fra DOM
            coins.splice(i, 1); // Fjerner mynten fra listen over mynter
        }
    }

    // Sjekker for kollisjoner hvis spillet ikke er over
    if (!gameOver) {
        checkPipeCollision(); // Sjekker kollisjoner mellom fuglen og rør
        checkCoinCollision(); // Sjekker kollisjoner mellom fuglen og mynter
        frames++; // Øker rammenummeret
        requestAnimationFrame(initializeGame); // Tegner neste frame
    } else {
        showGameOverMessage(); // Viser spillavslutningsmelding
    }
}

// Lytter etter tastetrykk for å fly oppover med fuglen når mellomromstasten trykkes
document.addEventListener('keydown', function (e) {
    if (e.key === ' ') {
        bird.up(); // Fuglen flyr oppover
    }
});

// Konstanter for spillparametere
const birdSize = 30; // Størrelsen på fuglen
const pipeWidth = 50; // Bredden på rørene
const pipeSpacing = 50; // Avstand mellom rørene
const pipeSpeed = 3; // Endret hastigheten på rørbevegelsen
const pipeGap = 250; // Avstanden mellom øvre og nedre rør
const gameHeight = 500; // Spillets høyde
const gameWidth = 700; // Spillets bredde
const minPipeHeight = 50; // Minimumshøyden på et rør
let score = 0; // Spillerens poengsum
let highscore = localStorage.getItem('highscore') || 0; // Høyeste poengsum lagret i lokal lagring

// Oppretter HTML-element for fuglen og legger den til i spillkontaineren
const birdElement = document.createElement('div');
birdElement.classList.add('bird'); // Legger til CSS-klassen 'bird' til fuglelementet
document.getElementById('gameContainer').appendChild(birdElement);

// Oppretter fugl-objektet med startposisjon, størrelse og HTML-element
let bird = new Bird(64, 250, birdSize, birdElement);
let pipes = []; // Array for lagring av rør
let coins = []; // Array for lagring av mynter
let frames = 0; // Rammenummer for animasjon
let gameOver = false; // Variabel for å sjekke om spillet er over
let coinSpawned = false; // Variabel for å sjekke om mynten er lagt til

// Lytter etter når HTML-dokumentet er lastet for å starte spillet
document.addEventListener("DOMContentLoaded", function () {
    updateScoreDisplay(); // Oppdaterer poengvisningen
    initializeGame(); // Starter tegnefunksjonen
});

