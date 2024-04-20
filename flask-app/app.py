from flask import Flask, request, jsonify
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import schedule
import time
from datetime import datetime, timedelta
import atexit
import pickle

app = Flask(__name__)

# Load the trained model
model = joblib.load('pump_prediction_model.pkl')

# Define the API endpoint
@app.route('/predict', methods=['POST'])
def predict_next_pump():
    # Get the input data from the request
    data = request.json
    soil_moisture = data['soilMoisture']
    temperature = data['temperature']
    time_elapsed = data['timeElapsed']

    # Create a DataFrame with the input data
    input_data = pd.DataFrame([[soil_moisture, temperature, time_elapsed]], 
                              columns=['soilMoisture', 'temperature', 'time_elapsed'])

    # Make the prediction
    predicted_time_to_next_pump = model.predict(input_data)

    # Calculate the next pump timestamp
    next_pump_timestamp = pd.Timestamp.now() + pd.Timedelta(seconds=predicted_time_to_next_pump[0])

    # Return the predicted timestamp as the response
    response = {'nextPumpTimestamp': next_pump_timestamp.isoformat()}
    return jsonify(response)

# Function to update the model with new data
def update_model():
    # Load the existing model
    model = joblib.load('pump_prediction_model.pkl')

    # Load the latest sensor and pump data
    sensor_data = pd.read_json('sensor_records.json')
    pump_data = pd.read_json('pump_history.json')

    # Merge sensor and pump data based on timestamp
    merged_data = pd.merge_asof(pump_data, sensor_data, on='timestamp', by='deviceId', direction='backward')

    # Calculate time elapsed since last pumping event
    merged_data['time_elapsed'] = (merged_data['timestamp'] - merged_data.groupby('deviceId')['timestamp'].shift(1)).dt.total_seconds()

    # Prepare features and target variable
    X_new = merged_data[['soilMoisture', 'temperature', 'time_elapsed']]
    y_new = merged_data.groupby('deviceId')['timestamp'].shift(-1) - merged_data['timestamp']

    # Update the model with new data
    model.fit(X_new, y_new)

    # Save the updated model
    joblib.dump(model, 'pump_prediction_model.pkl')

    print("Model updated successfully.")
    
    
def schedule_next_update():
    # Load the last update timestamp from a file (if exists)
    try:
        with open('last_update.pkl', 'rb') as file:
            last_update = pickle.load(file)
    except FileNotFoundError:
        last_update = None

    # Calculate the next update timestamp
    if last_update is None:
        next_update = datetime.now() + timedelta(days=7)
    else:
        next_update = last_update + timedelta(days=7)

    # Save the next update timestamp to a file
    with open('next_update.pkl', 'wb') as file:
        pickle.dump(next_update, file)    

def check_and_run_update():
    # Load the next update timestamp from a file
    try:
        with open('next_update.pkl', 'rb') as file:
            next_update = pickle.load(file)
    except FileNotFoundError:
        return

    # Check if the current time is past the next update timestamp
    if datetime.now() >= next_update:
        update_model()
        schedule_next_update()

# On a non sleeping continuosly running server
# def run_scheduled_tasks():
#     while True:
#         schedule.run_pending()
#         time.sleep(1)

def on_server_shutdown():
    # Save the last update timestamp to a file
    with open('last_update.pkl', 'wb') as file:
        pickle.dump(datetime.now(), file)

if __name__ == '__main__':
    # On a non sleeping continuosly running server
    # # Schedule the update_model() function to run every 7 days
    # schedule.every(7).days.do(update_model)

    # # Start the scheduled tasks in a separate thread
    # import threading
    # threading.Thread(target=run_scheduled_tasks).start()
    
    # Register the on_server_shutdown function to be called on server shutdown
    atexit.register(on_server_shutdown)

    # Check and run the update if necessary
    check_and_run_update()

    # Start the API server
    app.run()