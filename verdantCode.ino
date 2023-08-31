#include <Arduino.h>
#if defined(ESP8266)
#include <ESP8266WiFi.h>
#elif defined(ESP32)
#include <WiFi.h>
#endif
#include <FirebaseESP8266.h>
#include <Wire.h>
#include <DHT.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <FastLED.h>

#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#define WIFI_SSID "Dialog 4G 547"
#define WIFI_PASSWORD "E2330BaF"


#define API_KEY "AIzaSyD3ZmADugMcQ1aSv4bCLWiO_NJWuW1kZ8I"
#define DATABASE_URL "https://verdant-d0978-default-rtdb.asia-southeast1.firebasedatabase.app/"
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
String uid;
// Database main path (to be updated in setup with the user UID)
String databasePath;
// Database child nodes
String tempPath = "/temperature";
String humPath = "/humidity";
String timePath = "/timestamp";
String WLPath = "/waterLevel";
String SMPath = "/soilMoisture";


WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

//pins
#define SoilMoistPin A0
#define DHTPIN D7
#define NUM_LED 30

CRGB leds[NUM_LED];

const int coolingRelayPin = 16;
const int heatingRelayPin = 5;
const int dehumidifierRelayPin = 4;
const int mistMakerRelayPin = 14;
const int waterPumpRelay = 0;
const int fertPumpRelay = 2;
const int fertilizingDuration = 10000;
const int LED_PIN = 12;
const int IRsensor = 15;

//DHT
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

//bools
bool signupOK = false;
bool coolingSystemOn = false;
bool heatingSystemOn = false;
bool humidifierOn = false;
bool dehumidifierOn = false;
bool watering = false;
bool fertilizing = false;

int chk;
float humidity;
float temperature;
unsigned long sendDataPrevMillis = 0;
int MAX_TEMP;
int MIN_TEMP;
int MAX_HU;
int MIN_HU;
int MIN_SO;
int FertFreq;
float TEMP_AVG;
float HU_AVG;
float SO_AVG;
float soilMoisture;
unsigned long wateringStartTime = 0;
int plantedTime = 0;
int turnOnHour;
int turnOnMinute = 0;
int turnOffHour;
int turnOffMinute = 0;
int val;


void cooling(bool &coolingSystemOn, int max, int avg, int temp);
void heating(bool &heatingSystemOn, int MIN_TEMP, float TEMP_AVG, float temperature);
void dehumidifying(bool &dehumidifierOn, int MAX_HU, float HU_AVG, float humidity);
void humidifying(bool &humidifierOn, int MIN_HU, float HU_AVG, float humidity);
void wateringSystem(bool &watering, int MIN_SO, float soilMoisture, unsigned long wateringStartTime);
void checkFertilizingSchedule(unsigned long plantedTime, int FertFreq);


void setup() {
  Serial.begin(9600);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("ok");
    signupOK = true;
  } else {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback;  //see addons/TokenHelper.h

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  databasePath = "/plant";

  FastLED.addLeds<WS2812, LED_PIN, RGB>(leds, NUM_LED);
  FastLED.setMaxPowerInVoltsAndMilliamps(5, 500);
  FastLED.clear();
  FastLED.show();

  dht.begin();

  pinMode(coolingRelayPin, OUTPUT);

  pinMode(heatingRelayPin, OUTPUT);

  pinMode(dehumidifierRelayPin, OUTPUT);

  pinMode(mistMakerRelayPin, OUTPUT);

  pinMode(SoilMoistPin, INPUT);

  pinMode(waterPumpRelay, OUTPUT);

  pinMode(fertPumpRelay, OUTPUT);

  pinMode(LED_PIN, OUTPUT);

  pinMode(IRsensor, INPUT);

  digitalWrite(coolingRelayPin, HIGH);

  digitalWrite(heatingRelayPin, HIGH);

  digitalWrite(mistMakerRelayPin, HIGH);

  digitalWrite(waterPumpRelay, HIGH);

  digitalWrite(fertPumpRelay, HIGH);

  digitalWrite(dehumidifierRelayPin, HIGH);

  // Initialize and synchronize time with NTP server
  timeClient.begin();
  timeClient.setTimeOffset(0);  // Adjust time offset if necessary
  while (!timeClient.update()) {
    timeClient.forceUpdate();
  }
}

void loop() {

  CRGB color = CRGB(255, 255, 255);
  int brightnessValue = 128;


  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 15000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    Firebase.RTDB.setFloat(&fbdo, databasePath + tempPath, temperature);
    Firebase.RTDB.setFloat(&fbdo, databasePath + humPath, humidity);
    Firebase.RTDB.setFloat(&fbdo, databasePath + SMPath, soilMoisture);
    Firebase.RTDB.setFloat(&fbdo, databasePath + WLPath, val);

    if (Firebase.RTDB.getInt(&fbdo, "/plant/turnOnHour")) {
      if (fbdo.dataType() == "int") {
        turnOnHour = fbdo.intData();
        Serial.print("turnOnHour: ");
        Serial.println(turnOnHour);
      }
    } else {
      Serial.print("Firebase Error: ");
      Serial.println(fbdo.errorReason());
    }
    if (Firebase.RTDB.getInt(&fbdo, "/plant/turnOffHour")) {
      if (fbdo.dataType() == "int") {
        turnOffHour = fbdo.intData();
        Serial.print("turnOffHour: ");
        Serial.println(turnOffHour);
      }
    } else {
      Serial.print("Firebase Error: ");
      Serial.println(fbdo.errorReason());
    }
    timeClient.update();

    int currentHour = timeClient.getHours();
    int currentMinute = timeClient.getMinutes();

    // Check if it's time to turn on the LED strip
    if (currentHour >= turnOnHour && currentMinute >= turnOnMinute) {
      for (int i = 0; i < NUM_LED; i++) {
        leds[i] = color;
        FastLED.setBrightness(brightnessValue);
      }
      FastLED.show();

      // Check if it's time to turn off the LED strip
      if (currentHour == turnOffHour && currentMinute == turnOffMinute) {
        FastLED.clear();  // Turn off the LED strip
      }


      fetchFirebaseData();
      cooling(coolingSystemOn, MAX_TEMP, TEMP_AVG, temperature);
      heating(heatingSystemOn, MIN_TEMP, TEMP_AVG, temperature);
      dehumidifying(dehumidifierOn, MAX_HU, HU_AVG, humidity);
      humidifying(humidifierOn, MIN_HU, HU_AVG, humidity);
      wateringSystem(watering, MIN_SO, soilMoisture, wateringStartTime);
      checkFertilizingSchedule(plantedTime, FertFreq);
    }
    delay(10000);
  }
}

void fetchFirebaseData() {

  humidity = dht.readHumidity();
  temperature = dht.readTemperature();
  soilMoisture = analogRead(SoilMoistPin);
  Serial.print("Humidity: ");
  Serial.println(humidity);
  Serial.print("Temperature: ");
  Serial.println(temperature);
  Serial.print("Soil Moisture: ");
  Serial.println(soilMoisture);

  FirebaseData fbdo;


  // Fetch MAX_TEMP
  if (Firebase.RTDB.getInt(&fbdo, "/plant/MAX_TEMP")) {
    if (fbdo.dataType() == "int") {
      MAX_TEMP = fbdo.intData();
      Serial.print("MAX_TEMP: ");
      Serial.println(MAX_TEMP);
    }
  } else {
    Serial.print("Firebase Error: ");
    Serial.println(fbdo.errorReason());
  }

  // Fetch MIN_TEMP
  if (Firebase.RTDB.getInt(&fbdo, "/plant/MIN_TEMP")) {
    if (fbdo.dataType() == "int") {
      MIN_TEMP = fbdo.intData();
      Serial.print("MIN_TEMP: ");
      Serial.println(MIN_TEMP);
    }
  } else {
    Serial.print("Firebase Error: ");
    Serial.println(fbdo.errorReason());
  }

  // Calculate TEMP_AVG
  TEMP_AVG = (MAX_TEMP + MIN_TEMP) / 2.0;
  Serial.print("TEMP_AVG: ");
  Serial.println(TEMP_AVG);

  // Fetch MAX_HU
  if (Firebase.RTDB.getInt(&fbdo, "/plant/MAX_HU")) {
    if (fbdo.dataType() == "int") {
      MAX_HU = fbdo.intData();
      Serial.print("MAX_HU: ");
      Serial.println(MAX_HU);
    }
  } else {
    Serial.print("Firebase Error: ");
    Serial.println(fbdo.errorReason());
  }

  // Fetch MIN_HU
  if (Firebase.RTDB.getInt(&fbdo, "/plant/MIN_HU")) {
    if (fbdo.dataType() == "int") {
      MIN_HU = fbdo.intData();
      Serial.print("MIN_HU: ");
      Serial.println(MIN_HU);
    }
  } else {
    Serial.print("Firebase Error: ");
    Serial.println(fbdo.errorReason());
  }

  // Calculate HU_AVG
  HU_AVG = (MAX_HU + MIN_HU) / 2.0;
  Serial.print("HU_AVG: ");
  Serial.println(HU_AVG);

  // Fetch MIN_SO
  if (Firebase.RTDB.getInt(&fbdo, "/plant/MIN_SO")) {
    if (fbdo.dataType() == "int") {
      MIN_SO = fbdo.intData();
      Serial.print("MIN_SO: ");
      Serial.println(MIN_SO);
    }
  } else {
    Serial.print("Firebase Error: ");
    Serial.println(fbdo.errorReason());
  }

  // Fetch FertFreq
  if (Firebase.RTDB.getInt(&fbdo, "/plant/FertFreq")) {
    if (fbdo.dataType() == "int") {
      FertFreq = fbdo.intData();
      Serial.print("FertFreq: ");
      Serial.println(FertFreq);
    }
  } else {
    Serial.print("Firebase Error: ");
    Serial.println(fbdo.errorReason());
  }

  // Fetch PlantedTime
  if (Firebase.RTDB.getInt(&fbdo, "/plant/PlantedTime")) {
    if (fbdo.dataType() == "long") {
      plantedTime = fbdo.intData();
      Serial.print("PlantedTime: ");
      Serial.println(plantedTime);
    }
  } else {
    Serial.print("Firebase Error: ");
    Serial.println(fbdo.errorReason());
  }
}
void cooling(bool &coolingSystemOn, int MAX_TEMP, int TEMP_AVG, float temperature) {
  if (temperature > MAX_TEMP && coolingSystemOn == false) {
    while (TEMP_AVG <= temperature) {
      digitalWrite(coolingRelayPin, LOW);
      digitalWrite(dehumidifierRelayPin, LOW);
      Serial.println("Cooling system on");
      temperature = dht.readTemperature();
      Firebase.RTDB.setFloat(&fbdo, databasePath + tempPath, temperature);
      fetchFirebaseData();
      delay(5000);
    }
    digitalWrite(coolingRelayPin, HIGH);
    digitalWrite(dehumidifierRelayPin, HIGH);
    coolingSystemOn = false;
    Serial.println("Cooling system off");
  }
}
void heating(bool &heatingSystemOn, int MIN_TEMP, float TEMP_AVG, float temperature) {
  if (temperature < MIN_TEMP && heatingSystemOn == false) {
    while (TEMP_AVG >= temperature) {
      digitalWrite(heatingRelayPin, LOW);
      heatingSystemOn = true;
      Serial.println("Heating system on");
      temperature = dht.readTemperature();
      Firebase.RTDB.setFloat(&fbdo, databasePath + tempPath, temperature);
      fetchFirebaseData();
      delay(5000);
    }
    digitalWrite(heatingRelayPin, HIGH);
    heatingSystemOn = false;
    Serial.println("Heating system off");
  }
}
void dehumidifying(bool &dehumidifierOn, int MAX_HU, float HU_AVG, float humidity) {
  if (humidity > MAX_HU && dehumidifierOn == false) {
    while (HU_AVG <= humidity) {
      digitalWrite(coolingRelayPin, LOW);
      dehumidifierOn = true;
      Serial.println("Dehumidifier On");
      humidity = dht.readHumidity();
      Firebase.RTDB.setFloat(&fbdo, databasePath + humPath, humidity);
      fetchFirebaseData();
    }
    digitalWrite(coolingRelayPin, HIGH);
    dehumidifierOn = false;
    Serial.println("Dehumidifier off");
  }
}
void humidifying(bool &humidifierOn, int MIN_HU, float HU_AVG, float humidity) {
  if (humidity < MIN_HU && humidifierOn == false) {
    while (HU_AVG >= humidity) {
      digitalWrite(mistMakerRelayPin, HIGH);
      humidifierOn = true;
      Serial.println("Humidifier On");
      humidity = dht.readHumidity();
      Firebase.RTDB.setFloat(&fbdo, databasePath + humPath, humidity);
      fetchFirebaseData();
    }
    digitalWrite(mistMakerRelayPin, LOW);
    humidifierOn = false;
    Serial.println("Humidifier Off");
  }
}
void wateringSystem(bool &watering, int MIN_SO, float soilMoisture, unsigned long wateringStartTime) {
  if (soilMoisture < MIN_SO && watering == false) {
    digitalWrite(waterPumpRelay, LOW);
    watering = true;
    wateringStartTime = millis();
    Serial.println("Watering System on");

    while (millis() - wateringStartTime < 10000) {
      if (soilMoisture < MIN_SO) {
        Serial.println("Soil moisture still below minimum, continue watering...");
        fetchFirebaseData();
        delay(1000);
      } else {
        break;
      }
    }
    digitalWrite(waterPumpRelay, HIGH);
    watering = false;
    Serial.println("Watering System off");
  }
}
void checkFertilizingSchedule(unsigned long plantedTime, int FertFreq) {
  // Calculate the number of days since the plant was selected
  unsigned long currentTime = millis();
  unsigned long elapsedTime = currentTime - plantedTime;
  unsigned long elapsedDays = elapsedTime / (1000UL * 60UL * 60UL * 24UL);  // milliseconds to days

  // Check if the required number of days has passed for fertilizing
  if (elapsedDays >= FertFreq) {
    // Activate the fertilizing pump for 10 seconds
    digitalWrite(fertPumpRelay, HIGH);  // Turn on the fertilizing pump
    delay(15000);                       // Wait for 10 seconds
    digitalWrite(fertPumpRelay, LOW);   // Turn off the fertilizing pump

    // Update the plantedTime to the current time
    plantedTime = currentTime;

    // Update the "PlantedTime" value in the Firebase RTDB
    Firebase.RTDB.setInt(&fbdo, databasePath + "/PlantedTime", plantedTime);

    // Print a message indicating that fertilizing has been performed
    Serial.println("Fertilizing performed!");
    fetchFirebaseData();

    // Reset the elapsed days counter
    elapsedDays = 0;
  }

  // Print the remaining days until the next fertilizing
  unsigned long daysRemaining = FertFreq - elapsedDays;
  Serial.print("Days remaining until next fertilizing: ");
  Serial.println(daysRemaining);
}
