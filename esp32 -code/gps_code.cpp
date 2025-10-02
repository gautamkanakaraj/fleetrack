// ESP32 GPS Data Flow and Parsing Debug - MODIFIED FOR TINYGPS++
#include <TinyGPS++.h>

#define GPS_BAUDRATE 9600 // Confirmed working baud rate
#define LED_PIN 2         // LED to blink on data reception (GPIO2)

// Global objects
TinyGPSPlus gps;           // The GPS object to handle parsing
HardwareSerial gpsSerial(2); // UART2 on ESP32 (RX=GPIO16, TX=GPIO17)

void setup() {
  Serial.begin(115200); // Serial Monitor at 115200 baud
  // Start the GPS hardware serial port
  // Note: Ensure the baud rate matches the GPS module's configuration
  gpsSerial.begin(GPS_BAUDRATE, SERIAL_8N1, 16, 17); // RX=16, TX=17

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  Serial.println("--- ESP32 TinyGPS++ Parsing Active ---");
  Serial.println("GPS Baud Rate: " + String(GPS_BAUDRATE));
  Serial.println("Waiting for NMEA data...");
  Serial.println("LED on GPIO2 blinks briefly upon receiving data.");
  Serial.println("Latitude and Longitude will be printed when available.");
  delay(2000); // Stabilize serial connection
}

void loop() {
  static unsigned long lastLedOff = 0;
  static unsigned long lastReport = 0;
  
  // 1. Data Reading and Encoding
  while (gpsSerial.available() > 0) {
    digitalWrite(LED_PIN, HIGH); // LED on: data received
    char c = gpsSerial.read();
    
    // TinyGPS++ handles all the NMEA sentence parsing and buffering
    // The UBX binary data will be silently ignored (as it should be)
    gps.encode(c);
  }

  // 2. LED Control
  // Turn off LED after 200ms
  if (digitalRead(LED_PIN) == HIGH && millis() - lastLedOff >= 200) {
    digitalWrite(LED_PIN, LOW);
    lastLedOff = millis();
  }

  // 3. Location Reporting
  // Check if a new, complete NMEA sentence has been processed (e.g., once per second)
  // And print the location data if it is valid (i.e., we have a satellite lock)
  if (millis() - lastReport > 1000) {
    lastReport = millis();

    Serial.print("Status: ");
    
    if (gps.location.isValid()) {
      Serial.print("Valid Lock. ");
      Serial.printf("Satellites: %d. ", gps.satellites.value());
      Serial.printf("HDOP: %.2f\n", gps.hdop.isValid() ? gps.hdop.value() / 100.0 : 99.99);

      Serial.print("  > Location (Lat/Lon): ");
      Serial.print(gps.location.lat(), 6);
      Serial.print(", ");
      Serial.println(gps.location.lng(), 6);
      
      if (gps.altitude.isValid()) {
          Serial.printf("  > Altitude (m): %.2f\n", gps.altitude.meters());
      }
      
    } else if (gps.charsProcessed() > 0) {
      // Data is being received, but coordinates are not yet valid
      Serial.print("No valid lock yet. ");
      Serial.printf("Total chars: %lu. ", gps.charsProcessed());
      
      // If the module is sending UBX or garbled data, this will help confirm if any NMEA is passing through
      if (gps.sentencesWithFix() == 0) {
         Serial.println("No GPS fix sentences received.");
      } else {
         Serial.println("Waiting for valid coordinates...");
      }

    } else {
      // No data being received at all
      Serial.println("No data received from GPS module. Check wiring/baudrate.");
    }
  }

  delay(100); // Small delay to avoid hammering the loop
}