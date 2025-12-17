from fastapi import FastAPI
import pika
import json
import threading
import time
import os

app = FastAPI(title="Smart Clinic AI Service", version="1.0.0")

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", 5672))
QUEUE_NAME = "ai_analysis_queue"

def process_message(ch, method, properties, body):
    print(f" [x] Received {body}")
    # Simulate AI processing
    time.sleep(1)
    print(" [x] AI Analysis Complete")

def start_consumer():
    while True:
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=RABBITMQ_HOST, port=RABBITMQ_PORT)
            )
            channel = connection.channel()
            channel.queue_declare(queue=QUEUE_NAME, durable=True)
            
            print(' [*] Waiting for messages. To exit press CTRL+C')
            channel.basic_consume(queue=QUEUE_NAME, on_message_callback=process_message, auto_ack=True)
            channel.start_consuming()
        except Exception as e:
            print(f"Connection failed: {e}. Retrying in 5 seconds...")
            time.sleep(5)

@app.on_event("startup")
async def startup_event():
    consumer_thread = threading.Thread(target=start_consumer, daemon=True)
    consumer_thread.start()

@app.get("/")
def read_root():
    return {"status": "AI Service is running", "model": "SymptomAnalyzer-v1"}

@app.post("/analyze")
def analyze_symptoms(symptoms: str):
    # Mock AI analysis
    return {
        "symptoms": symptoms,
        "suggested_specialty": "General Practice",
        "urgency": "Medium"
    }
