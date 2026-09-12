import time
import random
import mimetypes
from pathlib import Path
from fastapi import UploadFile

from src.utils.storage import get_s3_client, BUCKET, is_s3_configured

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"


def ensure_upload_dir() -> None:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


async def save_upload_file(file: UploadFile) -> str:
    ensure_upload_dir()

    timestamp = int(time.time() * 1000)
    rand_suffix = random.randint(100000000, 999999999)
    original_ext = Path(file.filename or "upload.jpg").suffix or ".jpg"

    filename = f"{timestamp}-{rand_suffix}{original_ext}"
    target_path = UPLOAD_DIR / filename

    content = await file.read()
    
    # Save locally
    try:
        with open(target_path, "wb") as f:
            f.write(content)
    except Exception as e:
        print(f"Warning: Local file write error: {e}")

    # Upload to Neon S3 if configured
    if is_s3_configured():
        try:
            s3 = get_s3_client()
            content_type = file.content_type or mimetypes.guess_type(filename)[0] or "image/jpeg"
            s3.put_object(
                Bucket=BUCKET,
                Key=filename,
                Body=content,
                ContentType=content_type,
            )
            s3.put_object(
                Bucket=BUCKET,
                Key=f"uploads/{filename}",
                Body=content,
                ContentType=content_type,
            )
        except Exception as e:
            print(f"Warning: S3 upload failed: {e}")

    return f"/uploads/{filename}"

