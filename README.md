# Verdant

I have developed a full-stack application using Reactjs, Framer motion, Tailwind CSS, and Firebase. This project allows the user to add new items and to maintain all the things in the Firestore database.

The Arduino code is for an automated plant care system that utilizes various sensors and relays to control temperature, humidity, soil moisture, LED lighting, and watering. It connects to the Firebase Realtime Database to store and retrieve plant-related data. The key features include:

1. Monitors and controls temperature, humidity, and soil moisture levels. (DHT22 Humidity/Temperature Sensor, FC-28 Soil Moisture Sensor)
2. Manages cooling, heating, dehumidification, and humidification systems based on sensor data. (TEC1-12706 Peltier Module)
3. Implements LED lighting with adjustable brightness according to a predefined schedule. (WS2812B addressable RGB LED strip)
4. Activates a watering system to maintain proper soil moisture levels. (5V Mini Water Pump)
5. Checks and performs fertilization based on a predefined frequency. (5V Mini Water Pump)
6. Syncs system time using NTP (Network Time Protocol) and uses WiFi for connectivity.
7. Utilizes FastLED library for controlling a strip of LEDs.
8. Uses FirebaseESP8266 library for interacting with the Firebase Realtime Database.
9. Configures various pins for relays, sensors, and LED control.
10. Periodically updates plant-related data to the Firebase database.
11. Allows remote monitoring and control through Firebase's API.

All these are Controlled through an ESP8266 NodeMCU

