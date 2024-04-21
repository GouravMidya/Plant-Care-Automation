//online_mode.ino
// Libraries to be installed in Arduino IDE : Adafruit Unified Sensor, ArduinoJson, DHT kxn, WifiManager by tzapu
#include <DHT.h>  // Include the library for DHT11 temperature and humidity sensor
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>  // Include the library for https requests
#include <ArduinoJson.h>
#include <DNSServer.h>
#include <WiFiClientSecureBearSSL.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>

static const unsigned long deviceId = 1000000001;
static const char* serverUrl = "https://plant-care-automation-backend.onrender.com"; // IP address of the server
static const int deviceIDbundle[8] = {101, 102, 103, 104, 105, 106, 107, 108};


// Set the LCD address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27, 16, 2);

#define soil_moisture_pin A0
#define DHTTYPE DHT11  // Define the sensor type (DHT11)
#define dht_dpin D5   // Pin where the DHT11 sensor is connected

const int RELAY_PIN = D6; // Connect relay to 0 pin
//D1 D2 for led display
const int SELECT_1 = D0;
const int SELECT_2 = D3;
const int SELECT_3 = D4;

const int pump_led = D8;  // Pump LED connected to d3 pin
const int server_led = D7; // Turns on when server is down/not connected
const int wifi_led = 3; //RX

long checkDelayDuration = 60000; //cooldown time between each check
int pumpFlowDuration = 5000; 
int moisturethreshold=400;
bool pumpActivated = false; // Flag to track whether the pump has been activated
unsigned long lastPumpActivationTime = 0; // Timestamp of the last pump activation
int sns1, sns2, sns3, sns4, sns5, sns6, sns7, sns8; // value read from the pot
int readingList[8][2]; // 2D array to store binary value and corresponding reading
int listSize = 0;
int threshold=0;

DHT dht(dht_dpin, DHTTYPE);
float humidity,temperature;
int soil_moisture;

//Function to read when mux ON
int readSensor(int select1, int select2, int select3) {
  digitalWrite(SELECT_1, select1);
  digitalWrite(SELECT_2, select2);
  digitalWrite(SELECT_3, select3);
  delay(40);
  int sensorValue = analogRead(A0);
  delay(40);
  return sensorValue;
}

int readAnalogMUX() {
  int listIndex = 0;
  // read the analog in value:
  sns1 = readSensor(0, 0, 0); //select = 0
  sns2 = readSensor(1, 0, 0); //select = 1
  sns3 = readSensor(0, 1, 0); //select = 2
  sns4 = readSensor(1, 1, 0); //select = 3
  sns5 = readSensor(0, 0, 1); //select = 4
  sns6 = readSensor(1, 0, 1); //select = 5
  sns7 = readSensor(0, 1, 1); //select = 6
  sns8 = readSensor(1, 1, 1); //select = 7

  // create a list with binary value and corresponding reading for sensors with readings greater than 100
  if(sns1 > 150) { readingList[listIndex][0] = 0; readingList[listIndex][1] = sns1; listIndex++; }
  if(sns2 > 150) { readingList[listIndex][0] = 1; readingList[listIndex][1] = sns2; listIndex++; }
  if(sns3 > 150) { readingList[listIndex][0] = 2; readingList[listIndex][1] = sns3; listIndex++; }
  if(sns4 > 150) { readingList[listIndex][0] = 3; readingList[listIndex][1] = sns4; listIndex++; }
  if(sns5 > 150) { readingList[listIndex][0] = 4; readingList[listIndex][1] = sns5; listIndex++; }
  if(sns6 > 150) { readingList[listIndex][0] = 5; readingList[listIndex][1] = sns6; listIndex++; }
  if(sns7 > 150) { readingList[listIndex][0] = 6; readingList[listIndex][1] = sns7; listIndex++; }
  if(sns8 > 150) { readingList[listIndex][0] = 7; readingList[listIndex][1] = sns8; listIndex++; }

  return listIndex;
}

// Function to update check delay and pump flow
void fetchDeviceSettings() {

  HTTPClient https;
  BearSSL::WiFiClientSecure client; 
  client.setInsecure();
  // Define the path for fetching device settings
  const char* path = "/api/user_devices/settings";

  // Combine the server IP, port, and path
  String url = String(serverUrl) + String(path);

  // Create the JSON payload with the device ID
  String requestBody = "{\"deviceId\":\"" + String(deviceId) + "\"}";

  https.begin(client, url);
  https.addHeader("Content-Type", "application/json");

  int httpsResponseCode = https.POST(requestBody);

  if (httpsResponseCode == 200) {
    digitalWrite(server_led,LOW); // Connected to server turn off server error led
    String response = https.getString();
    Serial.println("Received device settings:");
    Serial.println(response);
    // Parse the JSON response
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, response);
    if (error) {
      Serial.print("Failed to parse JSON: ");
      Serial.println(error.c_str());
      return;
      }

    // Extract checkIntervals and pumpDuration from the JSON
    long checkIntervals = doc["data"]["checkIntervals"];
    long pumpDuration = doc["data"]["pumpDuration"];
    threshold = doc["data"]["threshold"];

    delay(1000);

    // Update checkDelayDuration and pumpFlowDuration
    checkDelayDuration = (checkIntervals*60000);
    pumpFlowDuration = (pumpDuration*1000);
    moisturethreshold = (1024-((threshold*1024)/100));//70.703125% =300

    delay(1000); 
    
    Serial.print("\nDELAY DURATION:");
    Serial.println(checkDelayDuration);
    Serial.print("\nPump flow DURATION:");
    Serial.println(pumpFlowDuration);
    Serial.print("\nMOISTURE threshold:");
    Serial.println(moisturethreshold);
  } else {
    digitalWrite(server_led, HIGH); // Not connecting to server, turn on error light
    Serial.print("Error fetching device settings. https response code: ");
    Serial.println(httpsResponseCode);
  }

  https.end();
}

// Function to send sensor data
void sendDataToServer() {
    for (int i = 0; i < listSize; i++) {
        int deviceIdIndex = readingList[i][0];
        int soilMoisture = readingList[i][1];
        if (soilMoisture <= 750 && soilMoisture > 50) {
            // Create a WiFi Client
            HTTPClient https;
            BearSSL::WiFiClientSecure client;
            client.setInsecure();

            // Define the path for sensor readings
            const char* path = "/sensor_readings";

            // Combine the server IP, port, and path
            String url = String(serverUrl) + String(path);

            // Create a JSON payload with deviceId, soil moisture, temperature, and humidity
            String payload = "{\"deviceId\": \"" + String(deviceIDbundle[deviceIdIndex]) + "\"" +
                             ", \"soilMoisture\": " + String(soilMoisture) +
                             ", \"temperature\": " + String(temperature) +
                             ", \"humidity\": " + String(humidity) + "}";

            // Start the https connection
            https.begin(client, url);
            https.addHeader("Content-Type", "application/json");

            // Send the POST request with the JSON payload
            int httpsResponseCode = https.POST(payload);

            // Check for successful https response
            if (httpsResponseCode > 0) {
                Serial.print("https Response code: ");
                Serial.println(httpsResponseCode);
            } else {
                Serial.print("Error sending data to server. https Response code: ");
                Serial.println(httpsResponseCode);
            }
            Serial.print("Sent data to server.");

            // End the https connection
            https.end();
        } else {
            Serial.println("Invalid Reading, Sensor not in soil\nReading is:" + String(soilMoisture));
        }
    }
}

// Function to read soil moisture
int readSoilMoisture() {
  soil_moisture = analogRead(soil_moisture_pin);
  if(isnan(soil_moisture)){
    return 0;
  }
  return 1;
}

// Function to control water pump
void controlWaterPump() {
  if(!pumpActivated && soil_moisture > moisturethreshold  && soil_moisture < 950){
    Serial.println("Water Level:"+String(soil_moisture));
    pumpActivated = true;
    lastPumpActivationTime = millis(); // Record the timestamp of pump activation
    digitalWrite(RELAY_PIN, LOW); // Turn on pump
    digitalWrite(pump_led, HIGH); // Turn on LED for pump
    Serial.println("Water Level Low! Pumping Water");
    delay(pumpFlowDuration); // Set value at top of program
    digitalWrite(RELAY_PIN, HIGH); // Turn off pump
    digitalWrite(pump_led, LOW); // Turn off light
    Serial.println("Water Pump turned off");

    // Send pump activation data to the server
          
    HTTPClient https;
      BearSSL::WiFiClientSecure client; 
      client.setInsecure();
    String url = String(serverUrl) + "/pump"; // Adjust URL to match your server's endpoint

    // Create a WiFiClient object

    // Start the https connection
    https.begin(client, url);
    https.addHeader("Content-Type", "application/json");
    String requestBody = "{\"deviceId\": " + String(deviceId) + ", \"pumpDuration\": " + String(pumpFlowDuration) + ", \"threshold\": "+String(threshold) +"}";
    int httpsResponseCode = https.POST(requestBody);
    if (httpsResponseCode > 0) {
      Serial.print("Pump activation data sent to server. https Response code: ");
      Serial.println(httpsResponseCode);
    } else {
      Serial.print("Error sending pump activation data to server. https Response code: ");
      Serial.println(httpsResponseCode);
    }
    https.end();
  }
}

// Function to read temperature and humidity
int readTemperatureHumidity() {
  humidity = dht.readHumidity();
  temperature = dht.readTemperature();

  // Check if read successfully
  if(isnan(temperature) || isnan(humidity)){
    Serial.println("Failed to read from DHT sensor!");
    return 0;
  }else{
    Serial.print("Current humidity = ");
    Serial.print(humidity);
    Serial.print("% ");
    Serial.print("Temperature = ");
    Serial.print(temperature);
    Serial.print("°C ");
    Serial.print("Current Soil Moisture = ");
    Serial.println(soil_moisture);
  }
  return 1;
}

void lcdDisplay(){
  lcd.clear();
  lcd.setCursor(0,0);
  String line1 = "T:" + String(temperature) +"C "+"Hum:"+ String(humidity)+"%";
  lcd.print(line1);

  lcd.setCursor(0, 1);
  String line2 = "Mois:" ;
  for (int i = 0; i < listSize; i++) {
    // line2 += ("[");
    // line2 += String(readingList[i][0]);
    // line2 += (",");
    line2 += ((1.00 - readingList[i][1] / 1024.00) * 100);
    // line2 += ("]");
    line2 += (" ");
  }
  lcd.print(line2);
}

void setup() {
  dht.begin();

  //Selection Lines
  pinMode(SELECT_2, OUTPUT);
  pinMode(SELECT_3, OUTPUT);
  pinMode(SELECT_1, OUTPUT);

  // initialize the LCD
	lcd.begin();
	// Turn on the blacklight and print a message.
	lcd.backlight();

  // pinMode(wifi_led, OUTPUT);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connecting");
  lcd.setCursor(0, 1);
  lcd.print("to WiFi...");
  // digitalWrite(wifi_led, LOW); // Turn off wifi led (blue)
  Serial.begin(9600);
  
  // Create an instance of WiFiManager
  WiFiManager wifiManager;

  // Start the configuration portal
  wifiManager.autoConnect("ESP8266_AP");
  
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connected");
  lcd.setCursor(0, 1);
  lcd.print("to WiFi!");

  digitalWrite(wifi_led, HIGH); // Turn on wifi led (blue)
  Serial.println("Humidity, Temperature, and Soil Moisture Level\n\n");
  
  fetchDeviceSettings();

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Fetched Device");
  lcd.setCursor(0, 1);
  lcd.print("Settings!");
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(pump_led, OUTPUT);
  pinMode(server_led, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Turn off pump
  
}

// Main code here, to run repeatedly:
void loop() {
  Serial.println("Humidity, Temperature, and Soil Moisture Level\n\n");
  fetchDeviceSettings();
  unsigned long currentTime = millis(); // Get the current time

  if (currentTime - lastPumpActivationTime >= 10800000) { // 3600000 = 1hour
    // 900000 If 15 minutes have elapsed since last pump activation
    pumpActivated = false; // Reset the pump activation flag
  }


  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Taking Moisture");
  lcd.setCursor(0, 1);
  lcd.print("Readings");
  delay(1000);
  listSize = readAnalogMUX();
  

  if(readTemperatureHumidity()){
    //Print on lcd
    lcdDisplay();
    sendDataToServer(); // Send data to server
    controlWaterPump();
    delay(checkDelayDuration); // Set value at top of programdelay
  }
}
