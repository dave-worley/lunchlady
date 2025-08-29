import os
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Load environment variables
load_dotenv()

service_account_file = os.getenv('GOOGLE_SERVICE_ACCOUNT_FILE')
wife_email = os.getenv('WIFE_EMAIL')
your_email = 'davidworley@gmail.com'  # Replace with your Gmail address

# The document ID from the URL you have
# Extract from: https://docs.google.com/document/d/{DOC_ID}/edit
doc_id = '1ZFdaUSJg5U-WYOrJBpNX00nkFkvKHzPhFd7W3Ukh1Eo'  # Replace with the actual document ID

# Google Drive setup
SCOPES = ['https://www.googleapis.com/auth/drive']

credentials = service_account.Credentials.from_service_account_file(
    service_account_file, scopes=SCOPES)
drive_service = build('drive', 'v3', credentials=credentials)

try:
    # First, share with yourself as writer
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

    print(f"Document fixed! You should now be able to access it at: https://docs.google.com/document/d/{doc_id}/edit")

except Exception as e:
    print(f"Error fixing permissions: {e}")
