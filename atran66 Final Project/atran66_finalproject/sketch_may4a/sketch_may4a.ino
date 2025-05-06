const int SW_PIN = 10;           
const int LED_PINS[3] = {3, 4, 5}; 

int lives = 3;

unsigned long lastButtonPressTime = 0;
const unsigned long debounceDelay = 50; 

void setup() {
  Serial.begin(9600);
  pinMode(SW_PIN, INPUT_PULLUP); 

  for (int i = 0; i < 3; i++) {
    pinMode(LED_PINS[i], OUTPUT);
    digitalWrite(LED_PINS[i], HIGH); 
  }
}

void loop() {
  int buttonState = digitalRead(SW_PIN);

  if (buttonState == LOW && (millis() - lastButtonPressTime) > debounceDelay) {
    lastButtonPressTime = millis(); 
    int firePressed = 1; 

    Serial.print("0,0,");
    Serial.println(firePressed);
  } else if (buttonState == HIGH) {
    int firePressed = 0; 
    Serial.print("0,0,");
    Serial.println(firePressed);
  }

  if (Serial.available()) {
    String msg = Serial.readStringUntil('\n');
    msg.trim();

    if (msg == "life" && lives > 0) {
      lives--;
      digitalWrite(LED_PINS[lives], LOW); 
    } 
    else if (msg == "reset") {
      lives = 3;
      for (int i = 0; i < 3; i++) {
        digitalWrite(LED_PINS[i], HIGH); 
      }
    }
  }

  delay(10); 
}



