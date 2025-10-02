#include <HardwareSerial.h>

HardwareSerial GPSSerial(2);

void setup() {
  Serial.begin(115200);
  Serial.println("\n--- RAW GPS DATA TEST ---");

  GPSSerial.begin(9600, SERIAL_8N1, 16, 17); // RX=16, TX=17
}

void loop() {
  while (GPSSerial.available() > 0) {
    char c = GPSSerial.read();
    Serial.write(c); // Just echo whatever GPS sends
  }
}
