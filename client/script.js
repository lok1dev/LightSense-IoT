const ledSwitch = document.getElementById("ledSwitch");
const ledSwitchContainer = document.getElementsByClassName("switch-led")[0];
const autoModeSwitch = document.getElementsByClassName("switch-autoMode")[0];
const ledStatus = document.getElementById("ledStatus");
const lightNum = document.getElementById("lightNum");
const logTable = document.getElementById("logTable");
const logsContainer = document.getElementById("logsContainer");
const toggleLogsButton = document.getElementById("toggleLogs");

let isLedOn = false;
let logsVisible = true;
let switchLedVisible = false;
let lightLevel = 0;
const serverName = 'http://192.168.193.212:3000'

// Function to update LED status
function updateLedStatus(position) {
  if (ledSwitch.checked) {
    ledStatus.textContent = "LED is on";
    isLedOn = true;
  } else {
    ledStatus.textContent = "LED is off";
    isLedOn = false;
  }

  if (position === "clients") {
    // Send a POST request to update the LED status on the server
    fetch(`${serverName}/app/update-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ statusLedApp: isLedOn ? "on" : "off" }),
    });
  }

  lightNum.textContent = lightLevel;
}

// Function to fetch data from the server and update the logs
function fetchAndDisplayData() {
  if (!switchLedVisible) {
    // Fetch data from the server
    fetch(`${serverName}/app/status`)
      .then((response) => response.json())
      .then((data) => {
        // Update LED status switch
        const latestData = data.slice(0)[0];
        //   console.log(latestData);
        if (latestData.ledStatus === "on") {
          ledSwitch.checked = true;
        } else {
          ledSwitch.checked = false;
        }

        //Update Light Level
        lightLevel = latestData.lightLevel;

        // Update LED status text
        updateLedStatus("server");

        // Clear the existing rows in the table
        //   console.log(logTable.)
        logTable.innerHTML = "";

        // Update the logs table with all the data
        data.forEach((log) => {
          const newRow = logTable.insertRow();
          const dateCell = newRow.insertCell(0);
          const statusLedCell = newRow.insertCell(1);
          const lightLevelCell = newRow.insertCell(2);

          dateCell.textContent = new Date(log.date).toLocaleString();
          statusLedCell.textContent = log.ledStatus;
          lightLevelCell.textContent = log.lightLevel;
        });
      });
  }
}

// Function to toggle Logs visibility
function toggleLogs() {
  logsVisible = !logsVisible;
  logsContainer.classList.toggle("active", logsVisible);
}

function updateAutoMode() {
  fetch(`${serverName}/app/update-autoMode-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ autoModeStatus: switchLedVisible ? "off" : "on" }),
  });
}

// Event listener for LED switch change
ledSwitch.addEventListener("change", function (event) {
  event.preventDefault();
  updateLedStatus("clients");
});

// Event listener for autoMode switch change
autoModeSwitch.addEventListener("change", function (event) {
  event.preventDefault();
  switchLedVisible = !switchLedVisible;
  ledSwitchContainer.classList.toggle("active", switchLedVisible);
  updateAutoMode();
});

// Event listener for Toggle Logs button
toggleLogsButton.addEventListener("click", toggleLogs);

// Fetch and display data on page load
document.addEventListener("DOMContentLoaded", function () {
  fetchAndDisplayData();
  updateAutoMode();
});

// Poll the server every 10 seconds to update the data
setInterval(fetchAndDisplayData, 1000);
