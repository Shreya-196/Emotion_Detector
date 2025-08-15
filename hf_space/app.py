from flask import Flask, request, jsonify
import speech_recognition as sr
import transformers
from flask_cors import CORS
from deep_translator import GoogleTranslator
import os
import tempfile

app = Flask(__name__)
CORS(app, origins=["*"])  # Configure CORS for your domains

# Load model on startup
try:
    classifier = transformers.pipeline(
        task="text-classification",
        model="SamLowe/roberta-base-go_emotions",
        top_k=3
    )
    print("✅ Emotion classifier loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    classifier = None

def transcribe_audio(file_path):
    """Converts speech to text using Google Speech Recognition."""
    recognizer = sr.Recognizer()

    with sr.AudioFile(file_path) as source:
        print("🔍 Processing audio file...")
        audio = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio)
        print(f"✅ Recognized Text: {text}")
        return text
    except sr.UnknownValueError:
        print("❌ Could not understand the audio.")
        return None
    except sr.RequestError:
        print("❌ Google Speech Recognition service error.")
        return None

def translate_text(text):
    try:
        translated = GoogleTranslator(source='auto', target='en').translate(text)
        print(f"🌍 Translated: {translated}")
        return translated
    except Exception as e:
        print(f"⚠️ Translation failed: {e}")
        return text

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "Emotion Detection API is running"}), 200

@app.route("/predict", methods=["POST"])
def predict_emotion():
    if "audio" not in request.files:
        print("❌ No audio file received in request.")
        return jsonify({"error": "No audio file uploaded"}), 400

    audio_file = request.files["audio"]
    print(f"✅ Received audio file: {audio_file.filename}")

    # Use temporary file to avoid conflicts
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
        file_path = temp_file.name
        audio_file.save(file_path)
        print(f"📁 Audio file saved at: {file_path}")

    try:
        # Step 1: Convert audio to text
        transcribed_text = transcribe_audio(file_path)

        if not transcribed_text:
            return jsonify({"error": "Could not transcribe the audio"}), 500

        # Step 2: Translate text if needed
        translated_text = translate_text(transcribed_text)

        if classifier is None:
            return jsonify({"error": "Emotion classifier not available"}), 500

        # Step 3: Perform emotion classification
        predictions = classifier(translated_text)
        emotions = [{"label": p["label"], "score": p["score"]} for p in predictions[0]]

        print("📊 Emotion analysis complete.")

        return jsonify({
            "original_transcription": transcribed_text,
            "translated_text": translated_text,
            "emotions": emotions
        })

    except Exception as e:
        print(f"❌ Emotion classification error: {e}")
        return jsonify({"error": "Failed to analyze emotions"}), 500

    finally:
        # Cleanup: Delete temporary file
        try:
            os.remove(file_path)
            print(f"🗑️ Deleted audio file: {file_path}")
        except Exception as e:
            print(f"⚠️ Error deleting file: {e}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    app.run(host="0.0.0.0", port=port, debug=False)