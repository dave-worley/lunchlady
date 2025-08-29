import os
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Load environment variables
load_dotenv()

service_account_file = os.getenv('GOOGLE_SERVICE_ACCOUNT_FILE')
wife_email = os.getenv('WIFE_EMAIL')
your_email = 'davidworley@gmail.com'

# Google services setup with correct scopes
SCOPES = [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file'
]

try:
    credentials = service_account.Credentials.from_service_account_file(
        service_account_file, scopes=SCOPES)
    docs_service = build('docs', 'v1', credentials=credentials)
    drive_service = build('drive', 'v3', credentials=credentials)
except Exception as e:
    print(f"Error setting up Google services: {e}")
    exit(1)

# Read the markdown file
try:
    with open('generated_meal_plan.md', 'r') as file:
        markdown_content = file.read()
    print("Successfully read generated_meal_plan.md")
except Exception as e:
    print(f"Error reading markdown file: {e}")
    exit(1)

# Create Google Doc
doc_title = "Weekly Meal Plan Recipes"
try:
    # Create the document
    doc = docs_service.documents().create(body={'title': doc_title}).execute()
    doc_id = doc['documentId']
    print(f"Created document with ID: {doc_id}")
    
    # Insert the markdown content
    requests = [{
        'insertText': {
            'location': {'index': 1},
            'text': markdown_content
        }
    }]
    
    docs_service.documents().batchUpdate(
        documentId=doc_id, 
        body={'requests': requests}
    ).execute()
    print("Content inserted successfully")
    
    # Share with yourself first
    drive_service.permissions().create(
        fileId=doc_id,
        body={
            'type': 'user',
            'role': 'writer',
            'emailAddress': your_email
        },
        fields='id'
    ).execute()
    print(f"Shared with {your_email}")
    
    # Transfer ownership to you
    drive_service.permissions().create(
        fileId=doc_id,
        body={
            'type': 'user',
            'role': 'owner',
            'emailAddress': your_email
        },
        transferOwnership=True,
        fields='id'
    ).execute()
    print(f"Ownership transferred to {your_email}")
    
    # Share with your wife
    drive_service.permissions().create(
        fileId=doc_id,
        body={
            'type': 'user',
            'role': 'writer',
            'emailAddress': wife_email
        },
        fields='id',
        sendNotificationEmail=True
    ).execute()
    print(f"Shared with {wife_email}")
    
    doc_link = f"https://docs.google.com/document/d/{doc_id}/edit"
    print(f"\nSuccess! Document created and shared: {doc_link}")
    
except HttpError as e:
    print(f"Google API error: {e}")
    print("\nTroubleshooting tips:")
    print("1. Make sure the service account has Google Docs API enabled")
    print("2. Check that the service account key file is valid")
    print("3. Verify the service account has proper permissions")
except Exception as e:
    print(f"Unexpected error: {e}")