
export const ADMIN_ROUTES = {
 
    LOGIN: "/",
  REFRESH: "/refresh",
  
 
  USERS: "/users",
  BLOCK_USER: "/users/:userId/block",
  UNBLOCK_USER: "/users/:userId/unblock",
  RESTRICT_USER: "/users/:userId/restrict",
  UNRESTRICT_USER: "/users/:userId/unrestrict",
  
 
  RESERVATIONS: "/reservations",
  
   HOSTS: "/hosts",
  
  // Notification routes
  NOTIFICATIONS: "/notifications",
  
  // Dashboard routes
  DASHBOARD_STATS: "/dashboard-stats",
} as const;

export const USER_ROUTES = {
 
  FAVORITES: "/favorites",
  
 
  GET_PROFILE: "/get-profile",
  UPDATE_PROFILE_IMAGE: "/update-profile-image",
  UPDATE_ABOUT: "/update-about",
  
  // Password routes
  CHANGE_PASSWORD: "/change-password",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  
  // Listings routes
  LISTINGS: "/listings",
  LISTING_BY_ID: "/:listingId",
  UPDATE_LISTING_PRICE: "/listings/:listingId/price",
  DELETE_LISTING: "/listings/:listingId",
  UPDATE_LISTING: "/listings/:listingId",
  

  CREATE_RESERVATION: "/reservation",
  CANCEL_RESERVATION: "/reservations/:reservationId",
  
 
  MESSAGES: "/messages",
  MARK_MESSAGE_SEEN: "/messages/seen/:conversationId",
  CONVERSATION_MESSAGES: "/conversations/:conversationId/messages",
  
 
  NOTIFICATION_COUNT: "/notification-count",
  DELETE_NOTIFICATION: "/notifications/:notificationId",
  NOTIFICATIONS: "/notifications",
  
 
  REVIEWS: "/reviews",
  UPDATE_REVIEW: "/reviews/:reviewId",
  DELETE_REVIEW: "/reviews/:reviewId",
  GET_REVIEWS: "/reviews/:listingId",
  
   UPDATE_OFFER_PRICE: "/listings/:listingId/offer",
  
  
   CREATE_ORDER: "/order",
} as const;