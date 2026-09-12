# FastAPI Imports
import mimetypes
from fastapi import FastAPI, Response, status
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

# Local Imports
from src.database.db_config import db
from src.utils.file_storage import ensure_upload_dir, UPLOAD_DIR
from src.utils.storage import get_s3_client, BUCKET, is_s3_configured
from src.urls.v1 import (
    auth,
    report,
    complaints,
    resolved_reports,
    chatbot,
)


def init_app():
    db.init()
    ensure_upload_dir()

    app = FastAPI(
        title="Sadak Suraksha Backend Services",
        description="Sadak Suraksha - Road Safety Complaint Reporting Backend",
        version="1.0.0",
        contact={
            "name": "Sadak Suraksha",
        },
        license_info={
            "name": "MIT License",
            "url": "https://opensource.org/licenses/MIT",
        },
        docs_url="/docs",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
        allow_headers=["Content-Type", "Authorization"],
    )

    @app.on_event("startup")
    async def startup():
        await db.create_all()

    @app.on_event("shutdown")
    async def shutdown():
        await db.close()

    @app.get("/uploads/{file_name:path}")
    async def get_uploaded_file(file_name: str):
        # 1. Check local file
        local_path = UPLOAD_DIR / file_name
        if local_path.is_file():
            return FileResponse(str(local_path))

        # 2. Check S3
        if is_s3_configured():
            s3 = get_s3_client()
            for key in [file_name, f"uploads/{file_name}"]:
                try:
                    obj = s3.get_object(Bucket=BUCKET, Key=key)
                    body = obj["Body"].read()
                    content_type = obj.get("ContentType") or mimetypes.guess_type(file_name)[0] or "image/jpeg"

                    # Save local cache
                    try:
                        ensure_upload_dir()
                        with open(local_path, "wb") as f:
                            f.write(body)
                    except Exception:
                        pass

                    return Response(
                        content=body,
                        media_type=content_type,
                        headers={"Cache-Control": "public, max-age=86400"},
                    )
                except Exception:
                    continue

        return Response(status_code=status.HTTP_404_NOT_FOUND, content="File not found")

    app.include_router(auth.router)
    app.include_router(report.report_router)
    app.include_router(report.myreport_router)
    app.include_router(complaints.router)
    app.include_router(resolved_reports.router)
    app.include_router(chatbot.router)

    return app


app = init_app()


@app.get("/")
def root():
    return {
        "status": "success",
        "message": "Sadak Suraksha backend API is running",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )