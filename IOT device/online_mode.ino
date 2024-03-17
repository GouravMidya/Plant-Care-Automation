// Libraries to be installed in Arduino IDE : Adafruit Unified Sensor, ArduinoJson, DHT kxn, WifiManager by tzapu
#include <DHT.h>  // Include the library for DHT11 temperature and humidity sensor
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>  // Include the library for https requests
#include <ArduinoJson.h>
#include <DNSServer.h>
#include <WiFiClientSecureBearSSL.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>

static const unsigned long deviceId = 1000000000;
static const char* serverUrl = "https://backend-server-lg5msmrrza-el.a.run.app"; // IP address of the server

#define soil_moisture_pin A0
#define DHTTYPE DHT11  // Define the sensor type (DHT11)
#define dht_dpin D2   // Pin where the DHT11 sensor is connected

const int RELAY_PIN = D1; // Connect relay to D1 pin
const int pump_led = D8;  // Pump LED connected to d3 pin
const int server_led = D6; // Turns on when server is down/not connected
const int wifi_led = D4;
int checkDelayDuration = 5000; //cooldown time between each check
int pumpFlowDuration = 5000; 

bool pumpActivated = false; // Flag to track whether the pump has been activated
unsigned long lastPumpActivationTime = 0; // Timestamp of the last pump activation

DHT dht(dht_dpin, DHTTYPE);
float humidity,temperature;
int soil_moisture;

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
    long checkIntervals = doc["checkIntervals"];
    long pumpDuration = doc["pumpDuration"];

    // Update checkDelayDuration and pumpFlowDuration
    checkDelayDuration = checkIntervals;
    pumpFlowDuration = pumpDuration;
  } else {
    digitalWrite(server_led, HIGH); // Not connecting to server, turn on error light
    Serial.print("Error fetching device settings. https response code: ");
    Serial.println(httpsResponseCode);
  }

  https.end();
}

// Function to send sensor data
void sendDataToServer() {
  if (soil_moisture <=750 && soil_moisture>150){
    
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
  if(!pumpActivated && soil_moisture > 450  && soil_moisture < 750){
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
    String requestBody = "{\"deviceId\": " + String(deviceId) + ", \"pumpDuration\": " + String(pumpFlowDuration) + "}";
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

void setup() {
  // Put your setup code here, to run once:
  
  Serial.println("Humidity, Temperature, and Soil Moisture Level\n\n");
  dht.begin();

  pinMode(wifi_led, OUTPUT);
  digitalWrite(wifi_led, LOW); // Turn off wifi led (blue)
  Serial.begin(9600);
  delay(600000); // Delay for 10 minutes to ensure accurate data ****************CHANGE THIS WHEN DEMONSTRATING *************************
  
  // Create an instance of WiFiManager
  WiFiManager wifiManager;

  // Start the configuration portal
  wifiManager.autoConnect("ESP8266_AP");
  
  digitalWrite(wifi_led, HIGH); // Turn on wifi led (blue)
  Serial.println("Humidity, Temperature, and Soil Moisture Level\n\n");
  
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(pump_led, OUTPUT);
  pinMode(server_led, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Turn off pump
  
  fetchDeviceSettings();
  delay(700);
}

// Main code here, to run repeatedly:
void loop() {
  Serial.println("Humidity, Temperature, and Soil Moisture Level\n\n");
  fetchDeviceSettings();

  unsigned long currentTime = millis(); // Get the current time

  if (currentTime - lastPumpActivationTime >= 3600000) { // 3600000 = 1hour
    // 900000 If 15 minutes have elapsed since last pump activation
    pumpActivated = false; // Reset the pump activation flag
  }

  if(readSoilMoisture() && readTemperatureHumidity()){
    sendDataToServer(); // Send data to server

    controlWaterPump();
  }
  delay(checkDelayDuration); // Set value at top of program
}
