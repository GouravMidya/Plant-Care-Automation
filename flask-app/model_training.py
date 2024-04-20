import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.externals import joblib
import requests

# Function to fetch sensor records from the backend
def fetch_sensor_records(device_id, start_date, end_date):
    url = f'http://localhost:4000/sensor_readings/?deviceId={device_id}&startDate={start_date}&endDate={end_date}'
    response = requests.get(url)
    if response.status_code == 200:
        sensor_records = response.json()['data']
        return pd.DataFrame(sensor_records)
    else:
        print(f"Error fetching sensor records: {response.text}")
        return None

# Function to fetch pump history records from the backend
def fetch_pump_history(device_id, start_date, end_date):
    url = f'http://localhost:4000/pump/history?deviceId={device_id}&startDate={start_date}&endDate={end_date}'
    response = requests.get(url)
    if response.status_code == 200:
        pump_history = response.json()['data']
        return pd.DataFrame(pump_history)
    else:
        print(f"Error fetching pump history: {response.text}")
        return None

# Fetch data from the backend
device_id = 'your_device_id'
start_date = 'start_date_in_iso_format'
end_date = 'end_date_in_iso_format'

sensor_data = fetch_sensor_records(device_id, start_date, end_date)
pump_data = fetch_pump_history(device_id, start_date, end_date)

# Merge sensor and pump data based on timestamp
merged_data = pd.merge_asof(pump_data, sensor_data, on='timestamp', by='deviceId', direction='backward')

# Calculate time elapsed since last pumping event
merged_data['time_elapsed'] = (merged_data['timestamp'] - merged_data.groupby('deviceId')['timestamp'].shift(1)).dt.total_seconds()

# Prepare features and target variable
X = merged_data[['soilMoisture', 'temperature', 'time_elapsed']]
y = merged_data.groupby('deviceId')['timestamp'].shift(-1) - merged_data['timestamp']

# Train a Random Forest Regressor
model = RandomForestRegressor()
model.fit(X, y)

# Save the model
joblib.dump(model, 'pump_prediction_model.pkl')

# Predict the next pumping event timestamp
current_sensor_data = {'soilMoisture': 300, 'temperature': 28.5, 'time_elapsed': 3600}
predicted_time_to_next_pump = model.predict(pd.DataFrame([current_sensor_data]))
next_pump_timestamp = pd.Timestamp.now() + pd.Timedelta(seconds=predicted_time_to_next_pump[0])
print(f"Next pumping event predicted at: {next_pump_timestamp}")