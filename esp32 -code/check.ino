#include <TinyGPS++.h>
#include <HardwareSerial.h>

TinyGPSPlus gps;

// Set your ESP32 UART pins
const int RXPin = 16; // GPS TX → ESP32 RX
const int TXPin = 17; // GPS RX → ESP32 TX (optional)

HardwareSerial GPSSerial(2); // Use UART2

void setup() {
  Serial.begin(115200);                 // Serial monitor
  GPSSerial.begin(4800, SERIAL_8N1, RXPin, TXPin); // Use detected baud

  Serial.println("ESP32 GPS Combined Test");
  Serial.println("Printing raw NMEA and parsed GPS data...");
}

void loop() {
  // Read all available bytes from GPS
  while (GPSSerial.available() > 0) {
    char c = GPSSerial.read();

    // 1️⃣ Print raw NMEA
    Serial.write(c);

    // 2️⃣ Feed bytes to TinyGPS++
    gps.encode(c);
  }

  // 3️⃣ Print parsed GPS data if available
  if (gps.location.isValid()) {
    Serial.println("\n--- GPS Fix Acquired ---");
    Serial.print("Latitude: "); Serial.println(gps.location.lat(), 6);
    Serial.print("Longitude: "); Serial.println(gps.location.lng(), 6);
    Serial.print("Altitude: "); Serial.println(gps.altitude.meters());
    Serial.print("Satellites: "); Serial.println(gps.satellites.value());
    Serial.println("------------------------\n");
    delay(1000); // readable output
  } else {
    Serial.println("\nNo GPS fix yet...");
    delay(1000);
  }
}
