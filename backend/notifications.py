import os
import requests
from datetime import datetime
from sqlalchemy.orm import Session
import models

def send_whatsapp_notification(
    db: Session,
    student_name: str,
    student_phone: str,
    scholarship_title: str,
    student_id: str,
    scholarship_id: str = None
):
    """
    Triggers a WhatsApp notification to the student's mobile number.
    Tries Twilio WhatsApp API first, then Meta WhatsApp Cloud API, and falls back to mock console prints.
    Logs all attempts in the notifications table.
    """
    message_text = f"Hi {student_name}, your application for {scholarship_title} was submitted successfully!"
    
    # Read settings
    twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
    twilio_token = os.getenv("TWILIO_AUTH_TOKEN")
    twilio_from = os.getenv("TWILIO_FROM_WHATSAPP", "whatsapp:+14155238886")
    
    meta_token = os.getenv("META_WHATSAPP_TOKEN")
    meta_phone_id = os.getenv("META_WHATSAPP_PHONE_NUMBER_ID")

    sent_via = "mock"
    status_msg = "Simulated WhatsApp transmission successful."

    # Format phone number for WhatsApp
    # Clean non-numeric characters except +
    cleaned_phone = "".join([c for c in student_phone if c.isdigit() or c == "+"])
    if not cleaned_phone.startswith("+"):
        cleaned_phone = "+91" + cleaned_phone  # Default to India if no country code

    # 1. Attempt Twilio WhatsApp
    if twilio_sid and twilio_token:
        try:
            from twilio.rest import Client
            client = Client(twilio_sid, twilio_token)
            client.messages.create(
                body=message_text,
                from_=twilio_from,
                to=f"whatsapp:{cleaned_phone}"
            )
            sent_via = "twilio"
            status_msg = "Real WhatsApp sent successfully via Twilio."
            print(f"[WhatsApp Twilio] Sent to {cleaned_phone}")
        except Exception as e:
            status_msg = f"Failed to send via Twilio: {str(e)}"
            print(f"[WhatsApp Twilio Error] {status_msg}")

    # 2. Attempt Meta WhatsApp Business Cloud API
    elif meta_token and meta_phone_id:
        try:
            url = f"https://graph.facebook.com/v17.0/{meta_phone_id}/messages"
            headers = {
                "Authorization": f"Bearer {meta_token}",
                "Content-Type": "application/json"
            }
            # Note: Meta WhatsApp API requires approved templates during production.
            # Here we send a sandbox template payload or raw message depending on setup.
            payload = {
                "messaging_product": "whatsapp",
                "to": cleaned_phone,
                "type": "template",
                "template": {
                    "name": "submission_success",
                    "language": {
                        "code": "en_US"
                    },
                    "components": [
                        {
                            "type": "body",
                            "parameters": [
                                {"type": "text", "text": student_name},
                                {"type": "text", "text": scholarship_title}
                            ]
                        }
                    ]
                }
            }
            response = requests.post(url, headers=headers, json=payload, timeout=10)
            if response.status_code in [200, 201]:
                sent_via = "meta"
                status_msg = "Real WhatsApp template sent successfully via Meta."
                print(f"[WhatsApp Meta] Sent template to {cleaned_phone}")
            else:
                print(f"[WhatsApp Meta Template Failed] Status {response.status_code}. Retrying with direct text message...")
                # Fallback to direct freeform text message (ideal for developer testing)
                text_payload = {
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": cleaned_phone,
                    "type": "text",
                    "text": {
                        "body": message_text
                    }
                }
                text_response = requests.post(url, headers=headers, json=text_payload, timeout=10)
                if text_response.status_code in [200, 201]:
                    sent_via = "meta"
                    status_msg = "Real WhatsApp text sent successfully via Meta Business Cloud API."
                    print(f"[WhatsApp Meta] Sent text message to {cleaned_phone}")
                else:
                    status_msg = f"Meta API text fallback returned status {text_response.status_code}: {text_response.text}"
                    print(f"[WhatsApp Meta Error] {status_msg}")
        except Exception as e:
            status_msg = f"Failed to send via Meta Cloud API: {str(e)}"
            print(f"[WhatsApp Meta Error] {status_msg}")
    
    else:
        # Fallback to local logs
        print(f"\n--- [WHATSAPP MOCK OUTBOX LOG] ---")
        print(f"To: {cleaned_phone}")
        print(f"Content: {message_text}")
        print(f"-----------------------------------\n")

    # Record notification in the PostgreSQL database log
    notification = models.Notification(
        student_id=student_id,
        scholarship_id=scholarship_id,
        channel="whatsapp",
        sent_at=datetime.utcnow(),
        message=f"[{sent_via.upper()}] To: {cleaned_phone} | Template: submission_success | Msg: \"{message_text}\" (Status: {status_msg})"
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)

    # Also log a general in-app notification in database
    in_app_notification = models.Notification(
        student_id=student_id,
        scholarship_id=scholarship_id,
        channel="in-app",
        sent_at=datetime.utcnow(),
        message=f"Application for {scholarship_title} has been logged in your Tracker."
    )
    db.add(in_app_notification)
    db.commit()

    return notification
