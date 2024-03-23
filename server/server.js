const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const filePath = "./data/data.json";
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

let statusLed = "off";
let isAutoMode = true;

app.post("/esp/status", (req, res) => {
  // statusLedEsp, option,
  const { lightEsp } = req.body;

  const lightLevel = readData()[0].lightLevel;
  // console.log(lightLevel, lightEsp, isAutoMode)

  if (Math.abs(lightLevel - lightEsp) > 100 && isAutoMode) {
    const date = new Date();
    const dataToAdd = {
      date: date.toISOString(),
      lightLevel: lightEsp,
    };

    if (lightEsp >= 900) {
      dataToAdd.ledStatus = "on";
      statusLed = "on";
    } else {
      dataToAdd.ledStatus = "off";
      statusLed = "off";
    }
    // console.log(statusLed)

    saveData(dataToAdd);
  }

  res.send(statusLed);
});

app.post("/app/update-status", (req, res) => {
  if (!isAutoMode) {
    const { statusLedApp } = req.body;
    statusLed = statusLedApp;
    console.log(statusLed);
  }

  const update = readData();
  res.send(update);
});

app.post("/app/update-autoMode-status", (req, res) => {
  const { autoModeStatus } = req.body;

  if (autoModeStatus == "on") {
    isAutoMode = true;
  } else if (autoModeStatus == "off") {
    isAutoMode = false;
    statusLed = readData()[0].ledStatus;
  }
  res.send(readData());
});

app.get("/app/status", (req, res) => {
  const data = readData();
  res.send(data);
});

app.listen(port, () => {
  console.log(`IoT app listening on port ${port}`);
});

function readData() {
  try {
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
  } catch (error) {
    return [];
  }
}

function saveData(newItem) {
  try {
    const data = readData();
    data.unshift(newItem);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    return "Update not completed";
  }
}
