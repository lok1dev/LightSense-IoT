//#define SS_PIN A0
//#define LED_PIN D3
//
//void setup() {
//  Serial.begin(9600);
//  pinMode(SS_PIN, INPUT);
//  pinMode(LED_PIN, OUTPUT);
//}
//
//void loop() {
//  int lightLevel = analogRead(SS_PIN);
//
//  if (lightLevel >=890){
//    digitalWrite(LED_PIN, HIGH); 
//    Serial.println("It is dark");
//  }
//  else{
//    Serial.println("It is light");
//    digitalWrite(LED_PIN, LOW);
//  }        
//   
//  
//delay(500);
//}
