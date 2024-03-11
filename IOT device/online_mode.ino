#include <DHT.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>

static const unsigned long deviceId = 1000000000;
static const char *serverURL = "https://backend-server-lg5msmrrza-el.a.run.app"; // URL of the Google Cloud Run backend

#define soil_moisture_pin A0
#define DHTTYPE DHT11
#define dht_dpin D2

const int RELAY_PIN = D1;
const int pump_led = D8;
const int server_led = D6;
const int wifi_led = D4;
int checkDelayDuration = 5000;
int pumpFlowDuration = 3000;

bool pumpActivated = false;
unsigned long lastPumpActivationTime = 0;

DHT dht(dht_dpin, DHTTYPE);
float humidity, temperature;
int soil_moisture;

void fetchDeviceSettings()
{
  HTTPClient http;
  WiFiClientSecure client; // Use WiFiClientSecure for HTTPS requests

  const char *path = "/api/user_devices/settings";

  String url = String(serverURL) + String(path);

  String requestBody = "{\"deviceId\":\"" + String(deviceId) + "\"}";

  Serial.print("Fetching device settings from: ");
  Serial.println(url);

  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(requestBody);

  Serial.print("HTTP Request Code: ");
  Serial.println(httpResponseCode);

  if (httpResponseCode == 200)
  {
    digitalWrite(server_led, LOW);
    String response = http.getString();
    Serial.println("Received device settings:");
    Serial.println(response);
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, response);
    if (error)
    {
      Serial.print("Failed to parse JSON: ");
      Serial.println(error.c_str());
      return;
    }

    long checkIntervals = doc["checkIntervals"];
    long pumpDuration = doc["pumpDuration"];

    checkDelayDuration = checkIntervals;
    pumpFlowDuration = pumpDuration;
  }
  else
  {
    digitalWrite(server_led, HIGH);
    Serial.print("Error fetching device settings. HTTP response code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}

void sendDataToServer()
{
  if (soil_moisture < 550)
  {
    HTTPClient http;
    WiFiClientSecure client;

    const char *path = "/sensor_readings";

    String url = String(serverURL) + String(path);

    String payload = "{\"deviceId\": \"" + String(deviceId) + "\"" +
                     ", \"soilMoisture\": " + String(soil_moisture) +
                     ", \"temperature\": " + String(temperature) +
                     ", \"humidity\": " + String(humidity) + "}";

    Serial.print("Sending data to server at: ");
    Serial.println(url);

    http.begin(client, url);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(payload);

    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    if (httpResponseCode > 0)
    {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    }
    else
    {
      Serial.print("Error sending data to server. HTTP Response code: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }
  else
  {
    Serial.println("Invalid Reading, Sensor not in soil");
  }
}

int readSoilMoisture()
{
  soil_moisture = analogRead(soil_moisture_pin);
  if (isnan(soil_moisture))
  {
    return 0;
  }
  return 1;
}

void controlWaterPump()
{
  if (!pumpActivated && soil_moisture > 375 && soil_moisture < 550)
  {
    pumpActivated = true;
    lastPumpActivationTime = millis();
    digitalWrite(RELAY_PIN, LOW);
    digitalWrite(pump_led, HIGH);
    Serial.println("Water Level Low! Pumping Water");
    delay(pumpFlowDuration);
    digitalWrite(RELAY_PIN, HIGH);
    digitalWrite(pump_led, LOW);
    Serial.println("Water Pump turned off");

    HTTPClient http;
    WiFiClientSecure client;

    String url = String(serverURL) + "/pump";

    Serial.print("Sending pump activation data to server at: ");
    Serial.println(url);

    http.begin(client, url);
    http.addHeader("Content-Type", "application/json");
    String requestBody = "{\"deviceId\": " + String(deviceId) + ", \"pumpDuration\": " + String(pumpFlowDuration) + "}";
    int httpResponseCode = http.POST(requestBody);

    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    if (httpResponseCode > 0)
    {
      Serial.print("Pump activation data sent to server. HTTP Response code: ");
      Serial.println(httpResponseCode);
    }
    else
    {
      Serial.print("Error sending pump activation data to server. HTTP Response code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
}

int readTemperatureHumidity()
{
  humidity = dht.readHumidity();
  temperature = dht.readTemperature();

  if (isnan(temperature) || isnan(humidity))
  {
    Serial.println("Failed to read from DHT sensor!");
    return 0;
  }
  else
  {
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

void setup()
{
  dht.begin();

  pinMode(wifi_led, OUTPUT);
  digitalWrite(wifi_led, LOW);

  Serial.begin(9600);

  WiFiManager wifiManager;
  wifiManager.autoConnect("ESP8266_AP");

  digitalWrite(wifi_led, HIGH);
  Serial.println("Humidity, Temperature, and Soil Moisture Level\n\n");
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(pump_led, OUTPUT);
  pinMode(server_led, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);
  fetchDeviceSettings();
  delay(700);
}

void loop()
{
  fetchDeviceSettings();

  unsigned long currentTime = millis();

  if (currentTime - lastPumpActivationTime >= 900000)
  {
    pumpActivated = false;
  }

  if (readSoilMoisture() && readTemperatureHumidity())
  {
    sendDataToServer();
    controlWaterPump();
  }
  delay(checkDelayDuration);
}
