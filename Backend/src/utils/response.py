from typing import Any, Optional
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder


class SuccessResponseSerializer(BaseModel):
    status_code: int
    success: bool = True
    message: str
    data: Optional[Any] = None


class ErrorResponseSerializer(BaseModel):
    status_code: int
    success: bool = False
    message: str
    data: Optional[Any] = None


def response_structure(status_code: int, success: bool, message: str, data: Any = None) -> JSONResponse:
    """
    Uniform response builder used across every controller, mirroring
    minestone's response_structure() helper. Every endpoint returns the
    same shape: { status_code, success, message, data }.
    """
    body = {
        "status_code": status_code,
        "success": success,
        "message": message,
        "data": jsonable_encoder(data) if data is not None else None,
    }
    return JSONResponse(status_code=status_code, content=body)


class ResponseStructure:
    """Class-style helpers, same call pattern as minestone's ResponseStructure."""

    @staticmethod
    def SucessDataResponse(status_data: int, success: bool, message: str, data: Any = None) -> JSONResponse:
        return response_structure(status_data, success, message, data)

    @staticmethod
    def ErrorDataResponse(status: int, success: bool, message: str, data: Any = None) -> JSONResponse:
        return response_structure(status, success, message, data)
