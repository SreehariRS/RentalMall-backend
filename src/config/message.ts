export enum Messages {
  // AuthController messages
  EMAIL_PASSWORD_REQUIRED = "Email and password are required",
  INVALID_EMAIL_PASSWORD = "Invalid email or password",
  REFRESH_TOKEN_REQUIRED = "Refresh token is required",
  INVALID_EXPIRED_REFRESH_TOKEN = "Invalid or expired refresh token",
  UNEXPECTED_ERROR = "An unexpected error occurred",

  // DashboardController messages
  UNEXPECTED_ERROR_DASHBOARD = "An unexpected error occurred while fetching dashboard stats",

  // HostController messages
  UNEXPECTED_ERROR_HOSTS = "An unexpected error occurred while fetching hosts",

  // NotificationController messages
  MISSING_REQUIRED_FIELDS = "Missing required fields",
  NOTIFICATION_SENT_SUCCESS = "Notification sent successfully",
  FAILED_TO_SEND_NOTIFICATION = "Failed to send notification",
  NOTIFICATION_COUNT_FETCHED_SUCCESS = "Notification count fetched successfully",

  // ReservationController messages
  UNEXPECTED_ERROR_RESERVATIONS = "An unexpected error occurred while fetching reservations",
  RESERVATION_CANCELED_SUCCESS = "Your reservation has been canceled.",

  // UserController messages
  UNEXPECTED_ERROR_USERS = "An unexpected error occurred while fetching users",
  USER_ID_REQUIRED = "User ID is required",
  USER_NOT_FOUND = "User not found",
  USER_BLOCKED_SUCCESS = "User blocked successfully",
  USER_UNBLOCKED_SUCCESS = "User unblocked successfully",
  UNEXPECTED_ERROR_BLOCKING_USER = "An unexpected error occurred while blocking the user",
  UNEXPECTED_ERROR_UNBLOCKING_USER = "An unexpected error occurred while unblocking the user",
  HOST_NOT_FOUND = "Host not found",
  HOST_RESTRICTED_SUCCESS = "Host restricted from listing",
  HOST_UNRESTRICTED_SUCCESS = "Host unrestricted from listing",
  UNEXPECTED_ERROR_RESTRICTING_HOST = "An unexpected error occurred while restricting the host",
  UNEXPECTED_ERROR_UNRESTRICTING_HOST = "An unexpected error occurred while unrestricting the host",

  // FavoritesController messages
  USER_ID_LISTING_ID_REQUIRED = "User ID and Listing ID are required.",

  // ListingsController messages
  LISTING_ID_REQUIRED = "Listing ID is required.",
  LISTING_NOT_FOUND = "Listing not found.",
  INVALID_LISTING_ID = "Invalid listing ID",

  // PasswordController messages
  CURRENT_NEW_PASSWORD_REQUIRED = "Current password and new password are required.",
  EMAIL_REQUIRED = "Email is required",
  TOKEN_PASSWORD_REQUIRED = "Token and password are required",

  // PaymentController messages
  FAILED_TO_CREATE_ORDER = "Failed to create order",

  // ProfileController messages
  USER_BLOCKED = "User is blocked.",
  USER_PROFILE_FETCHED_SUCCESS = "User profile fetched successfully.",
  IMAGE_URL_REQUIRED = "Image URL is required",
  PROFILE_IMAGE_UPDATED_SUCCESS = "Profile image updated successfully",
  ABOUT_TEXT_REQUIRED = "About text is required",
  ABOUT_TEXT_UPDATED_SUCCESS = "About text updated successfully",
  FAILED_TO_FETCH_PROFILE = "Failed to fetch profile",

  // ReviewsController messages
  REVIEW_DELETED_SUCCESS = "Review deleted successfully",

  // General messages
  UNAUTHORIZED = "Unauthorized",
  INVALID_ID = "Invalid ID",
  INTERNAL_SERVER_ERROR = "Internal Server Error",
  SOMETHING_WENT_WRONG = "Something went wrong"
}