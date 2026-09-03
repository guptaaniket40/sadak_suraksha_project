import re
from fastapi import status

from src.services.auth.schema import AuthSchema
from src.services.auth.serializer import RegisterSerializer, LoginSerializer
from src.utils.helper_functions import convert_password, check_password, password_fits_bcrypt
from src.utils.jwt_auth import jwt_auth
from src.utils.response import response_structure
from src.utils.constant_strings import AuthConstants

EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
USERNAME_REGEX = re.compile(r"^[a-zA-Z ]{3,30}$")
BLOCKED_EMAIL_DOMAINS = {
    "tempmail.com",
    "10minutemail.com",
    "disposablemail.com",
}


class AuthController:

    @staticmethod
    async def register(payload: RegisterSerializer):
        email = payload.email.strip().lower() if payload.email else ""
        username = payload.username.strip() if payload.username else ""
        password = payload.password
        role = payload.role.value if hasattr(payload.role, "value") else (payload.role or "user")

        if not email or not username or not password:
            return response_structure(status.HTTP_400_BAD_REQUEST, False, AuthConstants.REQUIRED_FIELDS)

        if not password_fits_bcrypt(password):
            return response_structure(status.HTTP_400_BAD_REQUEST, False, AuthConstants.PASSWORD_TOO_LONG)

        if not EMAIL_REGEX.match(email):
            return response_structure(status.HTTP_400_BAD_REQUEST, False, AuthConstants.INVALID_EMAIL_FORMAT)

        email_domain = email.split("@")[1].lower() if "@" in email else ""
        if email_domain in BLOCKED_EMAIL_DOMAINS:
            return response_structure(status.HTTP_400_BAD_REQUEST, False, AuthConstants.DISPOSABLE_EMAIL_BLOCKED)

        if not USERNAME_REGEX.match(username):
            return response_structure(status.HTTP_400_BAD_REQUEST, False, AuthConstants.INVALID_USERNAME_FORMAT)

        alphabet_count = len(re.findall(r"[a-zA-Z]", username))
        if alphabet_count < 2:
            return response_structure(status.HTTP_400_BAD_REQUEST, False, AuthConstants.USERNAME_MIN_LETTERS)

        if await AuthSchema.get_account_by_email(email, role):
            return response_structure(status.HTTP_409_CONFLICT, False, AuthConstants.EMAIL_EXISTS)

        if await AuthSchema.get_account_by_username(username, role):
            return response_structure(status.HTTP_409_CONFLICT, False, AuthConstants.USERNAME_EXISTS)

        hashed_password = convert_password(password)
        account = await AuthSchema.create_account(email, username, hashed_password, role)

        token = jwt_auth.generate_token({"id": account.id, "role": role})
        return response_structure(status.HTTP_201_CREATED, True, AuthConstants.REGISTER_SUCCESS, {"token": token})

    @staticmethod
    async def login(payload: LoginSerializer):
        email = payload.email.strip().lower() if payload.email else ""
        password = payload.password
        role = payload.role.value if hasattr(payload.role, "value") else (payload.role or "user")

        if not email or not password:
            return response_structure(status.HTTP_400_BAD_REQUEST, False, AuthConstants.LOGIN_REQUIRED_FIELDS)

        if not password_fits_bcrypt(password):
            return response_structure(status.HTTP_400_BAD_REQUEST, False, AuthConstants.INVALID_CREDENTIALS)

        account = await AuthSchema.get_account_by_email(email, role)
        if not account:
            return response_structure(status.HTTP_400_BAD_REQUEST, False, AuthConstants.INVALID_CREDENTIALS)

        password_matches = await check_password(account.password, password)
        if not password_matches:
            return response_structure(status.HTTP_400_BAD_REQUEST, False, AuthConstants.INVALID_CREDENTIALS)

        token = jwt_auth.generate_token({"id": account.id, "role": role})
        return response_structure(status.HTTP_200_OK, True, AuthConstants.LOGIN_SUCCESS, {"token": token})
