#include <WiFi.h>

const char* ssid = "OnePlus Nord CE 3 Lite 5G";
const char* password = "123456780";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected! IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
}
