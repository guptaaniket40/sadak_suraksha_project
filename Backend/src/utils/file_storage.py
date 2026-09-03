import time
import random
from pathlib import Path

from fastapi import UploadFile

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
    with open(target_path, "wb") as f:
        f.write(content)

    return f"/uploads/{filename}"
