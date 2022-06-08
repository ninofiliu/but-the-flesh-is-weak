void setup() {
  Serial.begin(9600);
  pinMode(7, INPUT);
}
void loop() {
  Serial.print(digitalRead(7));
  Serial.print(",");
  Serial.println(analogRead(A0));
  delay(1000);
}
