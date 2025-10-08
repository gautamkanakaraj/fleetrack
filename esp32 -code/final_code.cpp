#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>

const char* ssid = "*******";
const char* password = "******";

// 🚀 Use your ngrok HTTPS URL here
String serverURL = "https://manuel-li.ngrok-free.dev/data";

TinyGPSPlus gps;
HardwareSerial SerialGPS(2);
#define RXD2 16
#define TXD2 17

WiFiClientSecure client;  // ✅ Secure client

void setup() {
  Serial.begin(115200);
  SerialGPS.begin(9600, SERIAL_8N1, RXD2, TXD2);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ Connected to WiFi");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  client.setInsecure();  // ✅ Ignore SSL certificate validation
}

void loop() {
  while (SerialGPS.available() > 0) gps.encode(SerialGPS.read());

  if (gps.location.isUpdated()) {
    double lat = gps.location.lat();
    double lon = gps.location.lng();
    double alt = gps.altitude.meters();
    double speed = gps.speed.kmph();

    Serial.printf("📍 Lat: %.6f, Lon: %.6f, Alt: %.2f, Speed: %.2f\n", lat, lon, alt, speed);

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(client, serverURL);   // ✅ pass WiFiClientSecure
      http.addHeader("Content-Type", "application/json");

      String jsonData = "{\"lat\": " + String(lat, 6) +
                        ", \"lon\": " + String(lon, 6) +
                        ", \"alt\": " + String(alt, 2) +
                        ", \"speed\": " + String(speed, 2) + "}";

      int httpResponseCode = http.POST(jsonData);

      if (httpResponseCode > 0) {
        Serial.printf("✅ POST Response: %d\n", httpResponseCode);
        Serial.println("Server Reply: " + http.getString());
      } else {
        Serial.printf("❌ Error on sending POST: %d\n", httpResponseCode);
      }

      http.end();
    }

    delay(5000); // every 5 sec
  }
}
