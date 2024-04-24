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

static const unsigned long deviceId = 1000;
static const char* serverUrl = "https://plant-care-automation-backend.onrender.com"; // IP address of the server
static const int maxSoilReading = 720;
static const int minSoilReading = 150;

// Set the LCD address to 0x27 for a 16 chars and 2 line display
LiquidCrystal_I2C lcd(0x27, 16, 2);

#define soil_moisture_pin A0
#define DHTTYPE DHT11  // Define the sensor type (DHT11)
#define dht_dpin D5   // Pin where the DHT11 sensor is connected

const int RELAY_PIN = D6; // Connect relay to 0 pin
//D1 D2 for led display
//const int pump_led = D8;  // Pump LED connected to d3 pin
//const int server_led = D6; // Turns on when server is down/not connected
//const int wifi_led = D2;
long checkDelayDuration = 60000; //cooldown time between each check
int pumpFlowDuration = 5000; 
int pumpDuration = pumpFlowDuration/1000;
int moisturethreshold=400;
int threshold=0;
bool pumpActivated = false; // Flag to track whether the pump has been activated
unsigned long lastPumpActivationTime = 0; // Timestamp of the last pump activation

DHT dht(dht_dpin, DHTTYPE);
float humidity,temperature;
int soil_moisture;

void scrollTexts(String text1, String text2, int delayTime) {
    int text1Length = text1.length();
    int text2Length = text2.length();
    int displayWidth = 16; // Adjust this value based on your LCD display width

    // Determine the maximum length between the two texts
    int maxLength = max(text1Length, text2Length);

    for (int position = 0; position < maxLength; position++) {
        lcd.clear();

        // Print line 1 text
        lcd.setCursor(0, 0);
        lcd.print(text1.substring(position, position + displayWidth));

        // Print line 2 text
        lcd.setCursor(0, 1);
        lcd.print(text2.substring(position, position + displayWidth));

        delay(delayTime);
    }
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

  if (httpsResponseCode == 404) {
    String line1 = "Please add device in your dashboard";
    String line2 = "Go to Dashboard > + (Add Device)";
    scrollTexts(line1,line2,400);
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Put Device ID:");
    lcd.setCursor(0, 1);
    lcd.print(String(deviceId));
    delay(5000);
    scrollTexts(line1,line2,400);
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Put Device ID:");
    lcd.setCursor(0, 1);
    lcd.print(String(deviceId));
    delay(5000);
  }

  if (httpsResponseCode == 200) {
    // digitalWrite(server_led,LOW); // Connected to server turn off server error led
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
    pumpDuration = doc["data"]["pumpDuration"];
    threshold = doc["data"]["threshold"];

    delay(1000);

    // Update checkDelayDuration and pumpFlowDuration
    checkDelayDuration = (checkIntervals*60000);
    pumpFlowDuration = (pumpDuration*1000);
    moisturethreshold = (float(100-threshold)/100)*(maxSoilReading-minSoilReading)+minSoilReading;//70.703125% =300

    delay(1000);
  } else {
    // digitalWrite(server_led, HIGH); // Not connecting to server, turn on error light
    String err_line = "Error: ";
    err_line += String(httpsResponseCode);
    lcd.print(err_line);
    Serial.print("Error fetching device settings. https response code: ");
    Serial.println(httpsResponseCode);
  }

  https.end();
}

// Function to send sensor data
void sendDataToServer() {
  if (soil_moisture <=500 && soil_moisture>50){
    
    // Create a WiFi Client
    HTTPClient https;
      BearSSL::WiFiClientSecure client; 
      client.setInsecure();
    // Define the path for sensor readings
    const char* path = "/sensor_readings";

    // Combine the server IP, port, and path
    String url =  String(serverUrl)+String(path);

    // Create a JSON payload with deviceId, soil moisture, temperature, and humidity
    String payload = "{\"deviceId\": \"" + String(deviceId) + "\"" +
                    ", \"soilMoisture\": " + String(soil_moisture) +
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
  }else{
    Serial.println("Invalid Reading , Sensor not in soil/n Reading is:"+String(soil_moisture));
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
  if(!pumpActivated && soil_moisture > moisturethreshold  && soil_moisture < 650){
    Serial.println("Water Level:"+String(soil_moisture));
    pumpActivated = true;
    lastPumpActivationTime = millis(); // Record the timestamp of pump activation
    digitalWrite(RELAY_PIN, LOW); // Turn on pump
    // digitalWrite(pump_led, HIGH); // Turn on LED for pump
    Serial.println("Water Level Low! Pumping Water");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Water Level Low!");
    lcd.setCursor(0, 1);
    lcd.print("Pumping Water");
    delay(pumpFlowDuration); // Set value at top of program
    digitalWrite(RELAY_PIN, HIGH); // Turn off pump
    // digitalWrite(pump_led, LOW); // Turn off light
    Serial.println("Water Pump turned off");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Water Pump");
    lcd.setCursor(0, 1);
    lcd.print("Turned Off!");
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
    String requestBody = "{\"deviceId\": " + String(deviceId) + ", \"pumpDuration\": " + String(pumpDuration) +", \"threshold\": "+ String(threshold) + "}";
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

// LCD Display code here
void lcdDisplay(){
  lcd.clear();
  lcd.setCursor(0,0);
  String line1 = "T:" + String(temperature) +"C "+"Hum:"+ String(humidity)+"%";
  lcd.print(line1);

  lcd.setCursor(0, 1);
  String line2 = "Mois:" ;
  line2 += String(((1 - float(soil_moisture - minSoilReading) / (maxSoilReading - minSoilReading)) * 100));
  lcd.print(line2);
}

// First the setup runs then the loop
void setup() {
  dht.begin();

  // initialize the LCD
	lcd.begin();
	// Turn on the blacklight and print a message.
	lcd.backlight();
  
  Serial.begin(9600);
  
  // pinMode(wifi_led, OUTPUT);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connecting");
  lcd.setCursor(0, 1);
  lcd.print("to WiFi...");
  // digitalWrite(wifi_led, LOW); // Turn off wifi led (blue)

  // Create an instance of WiFiManager
  WiFiManager wifiManager;

  // Start the configuration portal
  wifiManager.autoConnect("BloomBuddy");
  
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connected");
  lcd.setCursor(0, 1);
  lcd.print("to WiFi!");

  //digitalWrite(wifi_led, HIGH); // Turn on wifi led (blue)
  Serial.println("Humidity, Temperature, and Soil Moisture Level\n\n");
  
  fetchDeviceSettings();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Fetched Device");
  lcd.setCursor(0, 1);
  lcd.print("Settings!");
  pinMode(RELAY_PIN, OUTPUT);
  //pinMode(pump_led, OUTPUT);
  //pinMode(server_led, OUTPUT);
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

  if(readSoilMoisture() && readTemperatureHumidity()){
    lcdDisplay();
    sendDataToServer(); // Send data to server
    Serial.println("Before control water pump.");
    controlWaterPump();
    delay(1000);
    lcdDisplay();
    Serial.println("After control water pump");
    delay(checkDelayDuration); // Set value at top of programdelay
  }
}