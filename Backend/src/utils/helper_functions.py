import bcrypt

MAX_BCRYPT_PASSWORD_BYTES = 72


def convert_password(password: str) -> str:
    """Hash a plain-text password."""
    password_bytes = password.encode("utf-8")
    return bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")


async def check_password(db_password: str, request_password: str) -> bool:
    """Verify a plain-text password against a stored hash."""
    try:
        return bcrypt.checkpw(
            request_password.encode("utf-8"),
            db_password.encode("utf-8"),
        )
    except ValueError:
        return False


def password_fits_bcrypt(password: str) -> bool:
    """bcrypt accepts at most 72 bytes of password input."""
    return len(password.encode("utf-8")) <= MAX_BCRYPT_PASSWORD_BYTES
