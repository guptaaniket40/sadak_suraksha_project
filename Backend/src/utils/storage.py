import os
import mimetypes
import boto3
from pathlib import Path
from functools import lru_cache
from dotenv import load_dotenv

ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(ENV_PATH)

BUCKET = os.environ.get("STORAGE_BUCKET", "sadak-suraksha")


@lru_cache
def get_s3_client():
    endpoint = os.environ.get("AWS_ENDPOINT_URL_S3")
    access_key = os.environ.get("AWS_ACCESS_KEY_ID")
    secret_key = os.environ.get("AWS_SECRET_ACCESS_KEY")
    region = os.environ.get("AWS_REGION", "us-east-2")

    if not (endpoint and access_key and secret_key):
        return None

    return boto3.client(
        "s3",
        region_name=region,
        endpoint_url=endpoint,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
    )


def is_s3_configured() -> bool:
    try:
        return get_s3_client() is not None
    except Exception:
        return False
