<h1 align="center">🎤 EmoSense – Real-Time Multilingual Emotion Detection from Speech Signals</h1>

<p align="center">
  <i>Understand emotions instantly — from any language, any voice.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React.js-blue?style=for-the-badge">
  <img src="https://img.shields.io/badge/Backend-Flask%20%26%20Node.js-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/Language-Python%20%7C%20TypeScript-yellow?style=for-the-badge">
  <img src="https://img.shields.io/badge/NLP-RoBERTa-red?style=for-the-badge">
</p>

---

## 📖 Overview
**EmoSense** is a full-stack AI-powered application that detects **human emotions** from **speech signals in real time**.  
It supports multiple languages, automatically transcribes speech, translates if necessary, and classifies emotions using a **RoBERTa-based transformer model**.  

The system features an **interactive dashboard** that visualizes detected emotions in real time, including a **dynamic background color change** based on the emotion.

---

## ✨ Key Features
- 🎙 **Speech-to-Text:** Converts recorded audio into text using Google Speech Recognition  
- 🌍 **Multilingual Translation:** Detects and translates non-English text to English via Google Translate API  
- 🤖 **Emotion Detection:** Uses `roberta-base-go_emotions` for high-accuracy classification with confidence scores  
- 🖥 **Interactive Dashboard:** Real-time emotion visualization with responsive UI  

---

## 🛠 Tech Stack
- **Frontend:** React.js, Tailwind CSS, TypeScript  
- **Backend:**  
  - Flask (Python) – Emotion analysis  
  - Node.js (Express) – API routing  
- **AI/NLP:** Hugging Face Transformers, RoBERTa  
- **APIs:** Google Speech Recognition, Google Translate API  
- **Deployment:** Modular architecture — separate services for frontend, Node.js API, and Flask AI model  

---

## 📷 Screenshots
