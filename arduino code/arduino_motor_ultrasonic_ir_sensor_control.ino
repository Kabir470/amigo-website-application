#include <AFMotor.h>
#include <NewPing.h>

// Ultrasonic
#define TRIGGER_PIN A0
#define ECHO_PIN A1
#define max_distance 50

// IR sensors (0 = BLACK, 1 = WHITE)
#define irLeft A3
#define irRight A2
#define irmiddle A4

// Switch, buzzer & NodeMCU Communication
#define switchPin A5
#define buzzerPin 9
#define rfidStopPin 2 // Connects to NodeMCU D4 (DO NOT use Pin 0 or 1 - those are RX/TX Serial pins!)

NewPing sonar(TRIGGER_PIN, ECHO_PIN, max_distance);

// Motors
AF_DCMotor motor1(1);
AF_DCMotor motor2(2);
AF_DCMotor motor3(3);
AF_DCMotor motor4(4);

int distance = 0;

void setup() {
  Serial.begin(9600);

  pinMode(irLeft, INPUT);
  pinMode(irRight, INPUT);
  pinMode(irmiddle, INPUT);
  pinMode(switchPin, INPUT_PULLUP);
  pinMode(rfidStopPin, INPUT);

  pinMode(buzzerPin, OUTPUT);

  motor1.setSpeed(200);
  motor2.setSpeed(200);
  motor3.setSpeed(200);
  motor4.setSpeed(200);

  Serial.println("Robot Ready");
}

void loop() {

  // 🔘 SWITCH OFF
  if (digitalRead(switchPin) == HIGH) {
    Stop();
    digitalWrite(buzzerPin, LOW);
    return;
  }

  // 🏷️ RFID STOP CHECK (From NodeMCU)
  if (digitalRead(rfidStopPin) == HIGH) {
    Stop();
    digitalWrite(buzzerPin, HIGH);
    Serial.println("STOP - RFID SCANNED (Dispensing...)");
    delay(3000); // Wait for 3 seconds
    digitalWrite(buzzerPin, LOW);
    return; // 🚨 NO LINE FOLLOWING WHILE STOPPED
  }

  // 📏 OBSTACLE CHECK (STRONG)
  distance = getDistance();

  Serial.print("Distance: ");
  Serial.println(distance);

  if (distance > 0 && distance <= 15) {
    Stop();
    digitalWrite(buzzerPin, HIGH);
    Serial.println("STOP - OBSTACLE");
    delay(100); // small delay for stability
    return;     // 🚨 NO LINE FOLLOWING
  } else {
    digitalWrite(buzzerPin, LOW);
  }

  // 📡 IR READ
  int left = digitalRead(irLeft);
  int middle = digitalRead(irmiddle);
  int right = digitalRead(irRight);

  Serial.print("L:");
  Serial.print(left);
  Serial.print(" M:");
  Serial.print(middle);
  Serial.print(" R:");
  Serial.println(right);

  // 🚗 PERFECT LINE FOLLOWING (YOUR LOGIC)

  // ✅ Straight
  if (middle == 0 && left == 1 && right == 1) {
    moveForward();
  }

  // ↩️ Slight left correction
  else if (left == 0 && middle == 1) {
    moveLeft();
  }

  // ↪️ Slight right correction
  else if (right == 0 && middle == 1) {
    moveRight();
  }

  // 🔁 Curve left
  else if (left == 0 && middle == 0) {
    moveLeft();
  }

  // 🔁 Curve right
  else if (right == 0 && middle == 0) {
    moveRight();
  }

  // ❌ No line → stop
  else {
    Stop();
  }
}

// 📏 Distance Function (FIXED)
int getDistance() {
  delay(30); // important for stable reading
  int cm = sonar.ping_cm();

  if (cm == 0) {
    cm = 100; // treat as no object
  }

  return cm;
}

// 🚗 Movement
void moveForward() {
  motor1.run(FORWARD);
  motor2.run(FORWARD);
  motor3.run(FORWARD);
  motor4.run(FORWARD);
}

void moveLeft() {
  motor1.run(FORWARD);
  motor2.run(FORWARD);
  motor3.run(BACKWARD);
  motor4.run(BACKWARD);
}

void moveRight() {
  motor1.run(BACKWARD);
  motor2.run(BACKWARD);
  motor3.run(FORWARD);
  motor4.run(FORWARD);
}

void Stop() {
  motor1.run(RELEASE);
  motor2.run(RELEASE);
  motor3.run(RELEASE);
  motor4.run(RELEASE);
}