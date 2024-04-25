# Plant Care Automation 🌱
---
## Project Description
This project aims to automate the care of plants by monitoring their health and automating watering cycles. It uses React for the frontend, Express for the backend, and is deployed on render.com.
---
## Features
- Real-time plant health monitoring
- Automated irrigation control
- User-friendly dashboard for easy control and monitoring
---
## Requirements
- Node.js
---
## Installation
1. Clone this github repo on your local machine
2. Go to Backend folder in cmd terminal
3. Run Command, This will install all the necessary dependencies
``` js
npm install
```
4. Create a .env file in your backend folder and add the connection link to your mongodb database under the variable MONG_URI
5.Backend setup is complete , you can verify the same by running below command in your backend folder
```
npm start
```
6.Come to frontend folder and run this command, This will install all the necessary dependencies
```
npm install
```
7.In frontend folder, go to src/utils/apiConfig.js file
8.Change the API_URL to the url for your backend server , if hosted locally it should be
```
export const API_URL = 'http://localhost:4000
```
9.Run the following command to see the react website
```
npm start
```
---
## Usage
Provide instructions on how to use the project after installation. If your project has a user interface, consider including screenshots or video demos.
---
## Contributing
If you're open to contributions, provide instructions on how other developers can contribute to your project.
---
## License
Include information about the license of your project.
---
## Contact
Your contact information for people to provide feedback or ask questions.
