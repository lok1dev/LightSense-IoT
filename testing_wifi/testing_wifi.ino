#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

#ifndef STASSID
#define SS_PIN A0
#define LED_PIN D3
#define STASSID "DustHuynh_Google"
#define STAPSK "88883333"
#endif

const char* ssid = STASSID;
const char* password = STAPSK;

String serverName = "http://192.168.193.212:3000/esp/status";

unsigned long lastTime = 0;

unsigned long timerDelay = 1000;

String statusLedEsp = "off";

void setup() {
  Serial.begin(9600);
  pinMode(SS_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);

  // We start by connecting to a WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {

  if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;

      String serverPath = serverName;
      http.begin(client, serverPath.c_str());
      http.addHeader("Content-Type", "application/json");

      //Get data from esp
      int lightEsp = analogRead(SS_PIN);
      
      StaticJsonDocument<200> jsonData;
      jsonData["lightEsp"] = lightEsp;
      jsonData["statusLedEsp"] = statusLedEsp;
      jsonData["option"] = "check";

      //String data = "{\"statusLedEsp\":\"off\",\"lightEsp\":\"80\",\"option\":\"check\"}";
      String data;
      serializeJson(jsonData, data);
      int httpResponseCode = http.POST(data);
      
      if (httpResponseCode>0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();

        statusLedEsp = payload;
        Serial.println(payload);
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }

          if(statusLedEsp == "on"){
          digitalWrite(LED_PIN, HIGH);
        }else{
          digitalWrite(LED_PIN, LOW);
        }
}
