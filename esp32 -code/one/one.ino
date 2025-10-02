#include <TinyGPS++.h>
#include <HardwareSerial.h>

TinyGPSPlus gps;

// Set your RX/TX pins
const int RXPin = 16; // GPS TX → ESP32 RX
const int TXPin = 17; // GPS RX → ESP32 TX (optional)

HardwareSerial GPSSerial(2);

void setup() {
  Serial.begin(115200);
  GPSSerial.begin(4800, SERIAL_8N1, RXPin, TXPin); // Use detected baud
  Serial.println("ESP32 GPS TinyGPS++ Test");
}

void loop() {
  while (GPSSerial.available() > 0) {
    char c = GPSSerial.read();
    gps.encode(c);
  }

  // Print GPS data if available
  if (gps.location.isUpdated()) {
    Serial.print("Latitude: "); Serial.println(gps.location.lat(), 6);
    Serial.print("Longitude: "); Serial.println(gps.location.lng(), 6);
    Serial.print("Satellites: "); Serial.println(gps.satellites.value());
    Serial.print("Altitude: "); Serial.println(gps.altitude.meters());
    Serial.println("-------------------------");
  }
}
