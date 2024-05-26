// Default -> d'Alembert
let formFilled = false;

// Collect record data
let data = [];

let initialBalance;
let goal;
let initialBet;

let alembertBalance;
let alembertBet;
let balanceOverTime = [];
const betPattern = ["Player", "Banker", "Player", "Player", "Banker", "Banker"];
let betIndex = 0;
const maxCompensation = 6;
let compensationCount = 0;
let bombCounter = 0;

// Recording Data
const recordData = function () {
  const checkboxes = document.querySelectorAll(".btn-check");
  if (formFilled === true) {
    // Record data of each round
    const roundNumber = data.length + 1;
    // Check checkbox value and convert to 1 or 0
    const playerWin = document.getElementById("playerWin").checked ? 1 : 0;
    const bankerWin = document.getElementById("bankerWin").checked ? 1 : 0;
    const tie = document.getElementById("tie").checked ? 1 : 0;
    const halfPayout = document.getElementById("halfPayout").checked ? 1 : 0;
    const playerNaturalWin = document.getElementById("playerNaturalWin").checked
      ? 1
      : 0;
    const bankerNaturalWin = document.getElementById("bankerNaturalWin").checked
      ? 1
      : 0;
    const thirdCardDraw = document.getElementById("3rdCardDraw").checked
      ? 1
      : 0;
    const playerWin3rdCard = document.getElementById("playerWin3rdCardDraw")
      .checked
      ? 1
      : 0;
    const bankerWin3rdCard = document.getElementById("bankerWin3rdCardDraw")
      .checked
      ? 1
      : 0;

    const record = [
      roundNumber,
      playerWin,
      bankerWin,
      tie,
      halfPayout,
      playerNaturalWin,
      bankerNaturalWin,
      thirdCardDraw,
      playerWin3rdCard,
      bankerWin3rdCard,
    ];

    data.push(record);
    // console.log(data);

    // Betting System Logic
    let currentBetPattern = betPattern[betIndex];
    if (currentBetPattern === "Player") {
      if (playerWin) {
        // Player Win
        // Update Balance
        alembertBalance += alembertBet;
        // Update Bet
        alembertBet = Math.max(initialBet, alembertBet - initialBet);
        // Reset Bet pattern & Compensation
        betIndex = 0;
        compensationCount = 0;
      } else if (bankerWin) {
        // Player Lose
        // Update Balance
        alembertBalance -= alembertBet;
        // Update Bet
        alembertBet += initialBet;
        // Update Bet Pattern & Compensation
        // If lose until last pattern, it will reset to the first
        betIndex = (betIndex + 1) % betPattern.length;
        compensationCount += 1;
      } else {
        // Tie
        // You can experiment here to change pattern if tie happens
      }
    } else if (currentBetPattern === "Banker") {
      if (bankerWin) {
        // Banker Win
        // Update Balance
        // Check if banker wins with 6
        if (halfPayout) {
          alembertBalance += alembertBet / 2;
        } else {
          alembertBalance += alembertBet;
        }
        // Update Bet
        alembertBet = Math.max(initialBet, alembertBet - initialBet);
        // Update Bet Pattern & Compensation
        betIndex = 0;
        compensationCount = 0;
      } else if (playerWin) {
        // Banker Lose
        // Update Balance
        alembertBalance -= alembertBet;
        // Update Bet
        alembertBet += initialBet;
        // Update Bet Pattern & Compensation
        // If lose until last pattern, it will reset to the first
        betIndex = (betIndex + 1) % betPattern.length;
        compensationCount += 1;
      } else {
        // Tie
        // You can experiment here to change pattern if tie happens
      }
    }

    balanceOverTime.push(alembertBalance);

    // If Max Compensation reached
    if (compensationCount >= maxCompensation) {
      // Add Bomb Reminder Text
      document.getElementById("bombReminder").classList.remove("hidden");

      bombCounter += 1;
      alembertBet = initialBet;
      betIndex = 0;
      compensationCount = 0;
    } else {
      // Hide Bomb Reminder Text
      document.getElementById("bombReminder").classList.add("hidden");
    }

    // Update UI
    // Sequence & Bet UI
    document.getElementById(
      "sequenceText"
    ).textContent = `${betPattern[betIndex]}`;
    document.getElementById("betText").textContent = `${alembertBet}`;
    // Game Overview
    // Left Container
    let highestBalance = Math.max(...balanceOverTime);
    let lowestBalance = Math.min(...balanceOverTime);
    document.getElementById("highestText").textContent = `${highestBalance}`;
    document.getElementById("lowestText").textContent = `${lowestBalance}`;
    let pnl = alembertBalance - initialBalance;
    document.getElementById("pnlText").textContent = `${pnl}`;
    document.getElementById("balanceText").textContent = `${alembertBalance}`;
    // Right Container
    document.getElementById("bombText").textContent = `${bombCounter}`;
    document.getElementById("remainingText").textContent = `${
      goal - alembertBalance
    }`;
    // Reset Checkbox
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = false;
    });
  } else {
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = false;
    });

    alert(`Input data first!`);
  }
};

// Copy Data
const copyData = function () {
  // Convert data array into JSON string
  let dataString = JSON.stringify(data);

  // Temporary text area to hold the data
  let tempTextArea = document.createElement("textarea");
  tempTextArea.value = dataString;
  document.body.appendChild(tempTextArea);

  // Select the text
  tempTextArea.select();
  tempTextArea.setSelectionRange(0, 99999); // For mobile device

  // Copy the text to clipboard
  document.execCommand("copy");

  // Remove the temporary textarea
  document.body.removeChild(tempTextArea);

  // Alert the user that data has been copied
  alert("Data copied to clipboard!");
};

// Form Section (Input Data)
const inputData = function () {
  if (formFilled === false) {
    // Get the value
    initialBalance = parseInt(document.getElementById("initialBalance").value);
    goal = parseInt(document.getElementById("goal").value);
    initialBet = parseInt(document.getElementById("initialBet").value);
    // Alert if NaN
    if (isNaN(initialBalance) || isNaN(goal) || isNaN(initialBet)) {
      alert(`Insert valid numbers in all fields!`);
      return;
    }

    balanceOverTime.push(initialBalance);

    // Initialize Value
    alembertBalance = initialBalance;
    alembertBet = initialBet;

    formFilled = true;

    // Update UI
    // Initialize Sequence & Bet
    document.getElementById("sequenceText").textContent = "Player";
    document.getElementById("betText").textContent = `${initialBet}`;
    // Game Overview
    // Left Container
    document.getElementById("highestText").textContent = `${initialBalance}`;
    document.getElementById("lowestText").textContent = `${initialBalance}`;
    document.getElementById("pnlText").textContent = `0`;
    document.getElementById("balanceText").textContent = `${initialBalance}`;
    // Right Container
    document.getElementById("bombText").textContent = `${bombCounter}`;
    document.getElementById(
      "initBalanceText"
    ).textContent = `${initialBalance}`;
    document.getElementById("goalText").textContent = `${goal}`;
    document.getElementById("remainingText").textContent = `${
      goal - initialBalance
    }`;

    // Closing Modal
    const modal = document.getElementById("exampleModal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
  } else {
    alert(`Please refresh the website`);
  }
};

// Unchecked missclick radio button
const radios = document.querySelectorAll('input[type="radio"]');
radios.forEach((radio) => {
  radio.addEventListener("click", (event) => {
    if (radio.wasChecked) {
      radio.checked = false;
      radio.wasChecked = false;
    } else {
      radio.wasChecked = true;
    }
  });
  radio.addEventListener("change", (event) => {
    radios.forEach((otherRadio) => {
      if (otherRadio !== radio) {
        otherRadio.wasChecked = false;
      }
    });
  });
});
