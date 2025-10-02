#include <WiFi.h>
#include <HTTPClient.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend server (replace with your Node server IP)
String serverURL = "http://10.109.155.89:3000/data";

// TinyGPS++ object
TinyGPSPlus gps;
HardwareSerial SerialGPS(2); // use UART2 (RX2/TX2)

// ESP32 pins for GPS
#define RXD2 16
#define TXD2 17

void setup() {
  Serial.begin(115200);

  // GPS Serial (Neo-6M usually 9600 baud)
  SerialGPS.begin(9600, SERIAL_8N1, RXD2, TXD2);

  // Connect WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ Connected to WiFi!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Read GPS data
  while (SerialGPS.available() > 0) {
    gps.encode(SerialGPS.read());
  }

  // If GPS location is available
  if (gps.location.isUpdated()) {
    double lat = gps.location.lat();
    double lon = gps.location.lng();
    double alt = gps.altitude.meters();   // altitude in meters
    double spd = gps.speed.kmph();        // speed in km/h

    Serial.print("📍 Latitude: ");
    Serial.println(lat, 6);
    Serial.print("📍 Longitude: ");
    Serial.println(lon, 6);
    Serial.print("⛰ Altitude: ");
    Serial.println(alt, 2);
    Serial.print("🚀 Speed: ");
    Serial.println(spd, 2);

    // Send to backend
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverURL);
      http.addHeader("Content-Type", "application/json");

      // ✅ Match backend expected JSON keys: lat, lon, alt, speed
      String jsonData = "{\"lat\":" + String(lat, 6) +
                        ",\"lon\":" + String(lon, 6) +
                        ",\"alt\":" + String(alt, 2) +
                        ",\"speed\":" + String(spd, 2) + "}";

      int httpResponseCode = http.POST(jsonData);

      if (httpResponseCode > 0) {
        Serial.print("✅ POST Response: ");
        Serial.println(httpResponseCode);
        String response = http.getString();
        Serial.println("Server Reply: " + response);
      } else {
        Serial.print("❌ Error on sending POST: ");
        Serial.println(httpResponseCode);
      }

      http.end();
    }

    delay(5000); // send every 5 seconds
  }
}
