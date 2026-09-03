class AuthConstants:
    REQUIRED_FIELDS = "Email, username, and password are required."
    INVALID_EMAIL_FORMAT = "Invalid email format."
    DISPOSABLE_EMAIL_BLOCKED = "Disposable email addresses are not allowed."
    INVALID_USERNAME_FORMAT = (
        "Username must be 3-30 characters and contain letters and spaces only, "
        "no numbers or special characters."
    )
    USERNAME_MIN_LETTERS = "Username must contain at least 2 letters."
    EMAIL_EXISTS = "Email already in use."
    USERNAME_EXISTS = "Username already in use."
    REGISTER_SUCCESS = "Account created successfully."
    LOGIN_SUCCESS = "Logged in successfully."
    LOGIN_REQUIRED_FIELDS = "All fields required."
    INVALID_CREDENTIALS = "Invalid credentials."
    INVALID_ROLE = "Invalid role specified."
    PASSWORD_TOO_LONG = "Password must be 72 bytes or fewer."


class JWTConstants:
    JWT_EXPIRE = "Session expired. Please log in again."
    JWT_INVALID = "Invalid authentication token."
    JWT_MISSING = "No authentication token provided."
    ADMIN_ONLY = "Access denied: Admins only."


class ReportConstants:
    CREATE_SUCCESS = "Report submitted!"
    CREATE_FAILED = "Failed to submit report."
    FETCH_MY_REPORTS_FAILED = "Failed to fetch your reports."
    STATUS_COUNTS_FAILED = "Failed to get status counts."
    NOT_FOUND = "Report not found."


class ComplaintConstants:
    FETCH_FAILED = "Failed to fetch complaints."
    INVALID_STATUS = "Invalid status value."
    STATUS_UPDATED = "Status updated."
    REJECTED = "Report rejected."
    IMAGE_UPLOADED = "Admin image uploaded."
    IMAGE_UPLOAD_FAILED = "Upload failed."
    REMARKS_UPDATED = "Admin remarks updated."


class ResolvedReportConstants:
    FETCH_FAILED = "Failed to fetch reports."
    FETCH_RESOLVED_FAILED = "Failed to fetch resolved reports."


class ChatbotConstants:
    MESSAGE_REQUIRED = "Message is required."
    FALLBACK_NO_KEY = (
        "Namaste! Sadak Suraksha AI assistant yahan hai. Sadak samasyaon ya "
        "report status ke baare mein aap pooch sakte hain. (Note: "
        "OPENROUTER_API_KEY configure karein live AI model ke liye)."
    )
    SERVER_ERROR = "Maaf kijiye, abhi server se connect hone mein samasya aa rahi hai. Kripya thodi der baad prayas karein."
    GENERIC_ERROR = "Maaf kijiye, request process karte samay samasya aayi. Kripya dobara koshish karein."
