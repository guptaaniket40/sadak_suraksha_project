# FastAPI Imports
from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Local Imports
from src.database.db_config import db
from src.utils.file_storage import ensure_upload_dir, UPLOAD_DIR
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

    app.mount(
        "/uploads",
        StaticFiles(directory=str(UPLOAD_DIR)),
        name="uploads",
    )

    app.include_router(auth.router)
    app.include_router(report.report_router)
    app.include_router(report.myreport_router)
    app.include_router(complaints.router)
    app.include_router(resolved_reports.router)
    app.include_router(chatbot.router)

    return app


app = init_app()


@app.router.get("/")
def result():
    return Response(status_code=status.HTTP_200_OK)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )