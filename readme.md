# BloomBuddy - Automated Plant Care System 🌱  

BloomBuddy is an innovative IoT-based automated plant care solution designed to monitor and maintain optimal conditions for plant growth. It combines IoT technology with modern web development and Machine Learning to provide real-time insights, automate plant care, and offer expert assistance via a chatbot interface.  

---

## Table of Contents  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Architecture Overview](#architecture-overview)  
- [Installation](#installation)  
  - [Frontend Setup](#frontend-setup)  
  - [Backend Setup (Express)](#backend-setup-express)  
  - [Backend Setup (Python)](#backend-setup-python)  
- [Deployment](#deployment)  
- [Usage](#usage)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features  

- **Real-Time Monitoring**: Tracks environmental factors like temperature, humidity, and soil moisture using IoT sensors.  
- **Plant Expert Chatbot**: Powered by the open-source **Llama3.2** model with instruction-tuning capabilities to provide expert plant care advice.  
- **Site Navigation Chatbot**: Simplifies user interaction by guiding users through the app's features and functionalities.  
- **Intelligent Alerts**: Recommends corrective actions based on AI analysis.  
- **Automated Actions**: Controls irrigation systems, light exposure, etc., using a feedback loop.  
- **User-Friendly Interface**: Manage your plants from a sleek React-based web application.  

---

## Tech Stack  

**Frontend**: React.js, Tailwind CSS, Axios  
**Backend (Node.js)**: Express.js, MongoDB  
**Backend (Python)**: FastAPI, Langchain, Open Source Model (Llama3.2:3B)  
**IoT Devices**: ESP32 with DHT11, Soil Moisture Sensors  
**Deployment**: [Render.com](https://bloombuddy.onrender.com/)  

---

## Architecture Overview  

```plaintext  
React Frontend <---> Express Backend <---> MongoDB  
                                     \--> Python Backend (ML/LLM Models with Llama3.2)  
IoT Devices --> Express Backend --> Feedback Loop to Frontend and IoT  
```  

---

## Installation  

Follow these steps to set up the project locally. Ensure you have the required software installed:  
- Node.js  
- Python 3.x  
- MongoDB  
- IoT Device Setup (Optional but recommended for full functionality)  

### Frontend Setup  

1. Navigate to the `frontend` directory.  
2. Install dependencies:  
   ```bash  
   cd frontend  
   npm install  
   ```  
3. Start the development server:  
   ```bash  
   npm start  
   ```  

### Backend Setup (Express)  

1. Navigate to the `backend-node` directory.  
2. Install dependencies:  
   ```bash  
   cd backend-node  
   npm install  
   ```  
3. Set environment variables in a `.env` file:  
   ```env  
   PORT=5000  
   MONGO_URI=your_mongodb_connection_string  
   ```  
4. Start the server:  
   ```bash  
   npm run dev  
   ```  

### Backend Setup (Python)  

1. Navigate to the `backend-python` directory.  
2. Create and activate a virtual environment:  
   ```bash  
   python -m venv venv  
   source venv/bin/activate  # On Windows: venv\Scripts\activate  
   ```  
3. Install dependencies:  
   ```bash  
   pip install -r requirements.txt  
   ```  
4. Start the Flask server:  
   ```bash  
   uvicorn app.mainv2:app --reload  
   ```  

---

## Deployment  

The project is deployed using **[Render.com](https://render.com)**. You can access the live application at:  
[**BloomBuddy Live App**](https://bloombuddy.onrender.com/)  

To deploy locally, follow the [installation instructions](#installation).  

---

## Usage  

1. Access the React frontend at `http://localhost:3000` (or the deployed link).  
2. Ensure the Node.js and Python backends are running or access the deployed versions.  
3. Explore features:  
   - Monitor plant health metrics.  
   - Chat with the **Plant Expert Chatbot** for advice.  
   - Use the **Site Navigation Chatbot** to explore the app.  
4. Connect IoT devices to the backend API for automated plant care.  

---

## Contributing  

We welcome contributions! Please fork the repository and submit a pull request. Ensure your code adheres to the following:  
- Follows the coding standards of respective languages.  
- Is thoroughly tested.  

---

## License  

This project is licensed under the MIT License.  
