// ==UserScript==
// @name         Battle Royale Streak Counter (Automated)
// @include      /^(https?)?(\:)?(\/\/)?([^\/]*\.)?geoguessr\.com($|\/.*)/
// @description  Adds a win streak counter to the GeoGuessr website
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        GM_addStyle
// ==/UserScript==

let wins = parseInt(sessionStorage.getItem("Wins"), 10);
let pb = parseInt(sessionStorage.getItem("PB"), 10);

let once = false;

if(sessionStorage.getItem("Wins") == null) {
    sessionStorage.setItem("Wins", 0);
    wins = 0;
};

if(sessionStorage.getItem("PB") == null) {
    sessionStorage.setItem("PB", 0);
    pb = 0;
};

update();

function updateStreak(newWins) {
    wins = newWins;
    if (wins > pb) pb = wins;

    if(document.getElementById("win-streak") != null) {
        document.getElementById("win-streak").innerHTML = `<a class="label-1"><p id="win-streak" class="label-1">Wins ${wins} : PB ${pb}</p></a>`;
    };

    if(document.getElementsByClassName("win-streak2")[0] != null) {
        if (document.getElementsByClassName("win-streak2")[0].firstElementChild.id == "win-id") document.getElementsByClassName("win-streak2")[0].innerHTML = `<p class="popup-view__header" id="win-id">Win Streak: ${wins}</p>`;
    };
    if(document.getElementsByClassName("pb")[0] != null) {
        document.getElementsByClassName("pb")[0].innerHTML = `<p class="popup-view__header" id="best-id">Best Streak: ${pb}</p>`;
    };
};

function addCounter(newDiv0) {
    if(document.getElementsByClassName("header__item").length == 6) {
        newDiv0 = document.createElement("div");
        newDiv0.className = 'header__item';
        document.getElementsByClassName("header__items")[0].insertBefore(newDiv0, document.getElementsByClassName("header__item header__item--nick")[0].nextSibling);
        newDiv0.innerHTML = `<a class="label-1"><p id="win-streak" class="label-1">Wins ${wins} : PB ${pb}</p></a>`;
    };
};

function addCounterOnRefresh() {
    setTimeout(function(){
        addCounter();
    },50);
    setTimeout(function(){
        addCounter();
    },300);
};

function addStreak1(newDiv1, pbDiv) {
    const lowerTextElement = document.getElementsByClassName("popup__layer popup__layer--layer-1")[0];
    newDiv1 = document.createElement("div");
    newDiv1.className = "win-streak2";

    pbDiv = document.createElement("div");
    pbDiv.className = "pb";

    if(lowerTextElement != null && document.getElementsByClassName("win-streak2")[0] == null){
        const imageText = document.getElementsByClassName("popup-view__image")[0].getElementsByTagName("img")[0].alt;
        const headerText = document.getElementsByClassName("popup-view__header")[0].textContent;

        if (headerText == "Congratulations, you won!") {
            lowerTextElement.insertBefore(pbDiv, document.getElementsByClassName("popup-view__header")[0].nextSibling);
            pbDiv.innerHTML = `<p class="popup-view__header" id="best-id">Best Streak: ${pb}</p>`;

            lowerTextElement.insertBefore(newDiv1, document.getElementsByClassName("pb")[0]);
            newDiv1.innerHTML = `<p class="popup-view__header" id="win-id">Win Streak: ${wins}</p>`;
        } else if(imageText == "You were knocked out") {
            lowerTextElement.appendChild(newDiv1);
            newDiv1.innerHTML = `<p class="popup-view__header" id="lose-id">You got ${wins} wins in a row!</p>`;

            lowerTextElement.appendChild(pbDiv);
            pbDiv.innerHTML = `<p class="popup-view__header" id="best-id">Best Streak: ${pb}</p>`;
        };
    };
};

function checkStreak() {
    if(document.getElementsByClassName("popup-view__image")[0] != null) {
        const imageText = document.getElementsByClassName("popup-view__image")[0].getElementsByTagName("img")[0].alt;
        const headerText = document.getElementsByClassName("popup-view__header")[0].textContent;

        if(imageText == "You were knocked out") {
            if(!once) {
                once = true;
                resetWins();
            };
        } else if(headerText == "Congratulations, you won!") {
            if(!once) {
                once = true;
                addWins(1);
            };

            const lowerTextElement = document.getElementsByClassName("popup__layer popup__layer--layer-1")[0];
            const pbDiv = document.getElementsByClassName("pb")[0];
            const winStreakDiv = document.getElementsByClassName("win-streak2")[0];

            lowerTextElement.insertBefore(pbDiv, document.getElementsByClassName("popup-view__header")[0].nextSibling);
            lowerTextElement.insertBefore(winStreakDiv, document.getElementsByClassName("pb")[0]);
        };
    } else {
        once = false
        const win2 = document.getElementsByClassName("win-streak2")[0];
        if (win2) win2.remove();
    };
};

function update() {
    if(document.getElementsByClassName("game-status").length == 0) addCounter();
    addStreak1();
    checkStreak();
    setTimeout(update, 250);
};

function addWins(factor) {
    updateStreak(wins + factor);
    sessionStorage.setItem("Wins", wins);
    sessionStorage.setItem("PB", pb);
};

function resetWins() {
    updateStreak(0);
    sessionStorage.setItem("Wins", 0);
};

function resetPB() {
    pb = 0;

    updateStreak(wins);
    sessionStorage.setItem("PB", pb);
};

////// CHANGE KEYBINDINGS HERE //////
document.addEventListener('keypress', (e) => {
    switch (e.key) {
        case '1': // <---- yes, here
            addWins(1);
            break;
        case '2':
            addWins(-1);
            break;
        case '0':
            resetWins();
            break;
        case '9':
            resetPB();
            break;
    };
});

document.addEventListener('load', addCounterOnRefresh(), false);
