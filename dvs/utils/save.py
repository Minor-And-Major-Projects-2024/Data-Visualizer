from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload


def save_file_to_disk(local_file_name, file):
    with open(local_file_name, "wb+") as destination:
        for chunk in file.chunks():
            destination.write(chunk)


def upload_file_to_drive(filename, file_path, SERVICE_ACCOUNT_FILE, FOLDER_ID):
    try:
        print(SERVICE_ACCOUNT_FILE)
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=['https://www.googleapis.com/auth/drive'])
        print(FOLDER_ID)
        service = build('drive', 'v3', credentials=credentials)
        print("Service built")
        file_metadata = {
            'name': filename,
            'parents': [FOLDER_ID]
        }
        print("File metadata created")
        media = MediaFileUpload(file_path, resumable=True)
        print("Media file created")
        file = service.files().create(body=file_metadata, media_body=media,
                                      fields='id').execute()
        print("File created")
        # print(f'File ID: {file.get("id")}')
        public_url = f'https://drive.google.com/uc?id={file.get("id")}'
        # print(f'Public URL: {public_url}')
        return public_url
    except HttpError as error:
        print(f'An error occurred: {error}')
        # file = None
        return ""
