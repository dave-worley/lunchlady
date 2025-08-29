import os
import json
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Load environment variables
load_dotenv()

service_account_file = os.getenv('GOOGLE_SERVICE_ACCOUNT_FILE')

print("Service Account Diagnostics")
print("=" * 40)

# Read service account details
try:
    with open(service_account_file, 'r') as f:
        sa_info = json.load(f)
    print(f"Service Account Email: {sa_info.get('client_email', 'Not found')}")
    print(f"Project ID: {sa_info.get('project_id', 'Not found')}")
    print()
except Exception as e:
    print(f"Error reading service account file: {e}")
    exit(1)

# Test different API scopes
test_configs = [
    {
        'name': 'Google Drive API',
        'scopes': ['https://www.googleapis.com/auth/drive'],
        'service': 'drive',
        'version': 'v3',
        'test': lambda svc: svc.about().get(fields="user").execute()
    },
    {
        'name': 'Google Docs API',
        'scopes': ['https://www.googleapis.com/auth/documents'],
        'service': 'docs',
        'version': 'v1',
        'test': lambda svc: svc.documents().create(body={'title': 'Test Doc'}).execute()
    }
]

for config in test_configs:
    print(f"Testing {config['name']}...")
    try:
        credentials = service_account.Credentials.from_service_account_file(
            service_account_file, scopes=config['scopes'])
        service = build(config['service'], config['version'], credentials=credentials)
        result = config['test'](service)
        print(f"✓ {config['name']} is working")
        
        # Clean up test doc if created
        if config['service'] == 'docs' and 'documentId' in result:
            try:
                drive_creds = service_account.Credentials.from_service_account_file(
                    service_account_file, scopes=['https://www.googleapis.com/auth/drive'])
                drive_service = build('drive', 'v3', credentials=drive_creds)
                drive_service.files().delete(fileId=result['documentId']).execute()
            except:
                pass
                
    except HttpError as e:
        print(f"✗ {config['name']} error: {e}")
    except Exception as e:
        print(f"✗ {config['name']} unexpected error: {e}")
    print()

print("\nNext steps:")
print("1. If Google Docs API fails, enable it in Google Cloud Console:")
print(f"   https://console.cloud.google.com/apis/library/docs.googleapis.com?project={sa_info.get('project_id', 'YOUR_PROJECT_ID')}")
print("2. If Drive API fails, enable it in Google Cloud Console:")
print(f"   https://console.cloud.google.com/apis/library/drive.googleapis.com?project={sa_info.get('project_id', 'YOUR_PROJECT_ID')}")
print("3. Make sure the service account has proper roles (Editor or Owner)")