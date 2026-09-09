
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://nexarion-production.vercel.app/api";
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || "http://localhost:5000/api";

// DASHBOARD ENDPOINTS
export const dashboardEndpoints = {
  GET_OVERVIEW_API: BASE_URL + "/dashboard/overview",
  GET_STATS_API: BASE_URL + "/dashboard/stats",
  GET_ACTIVITY_API: BASE_URL + "/dashboard/activity",
  GET_ORDERS_API: BASE_URL + "/dashboard/orders",
  GET_ORDER_STATS_API: BASE_URL + "/dashboard/orders/stats",
  GET_ADVANCED_ORDER_STATS_API: BASE_URL + "/dashboard/orders/advanced-stats",
  GET_ORDER_INVOICE_API: (orderId) => BASE_URL + `/dashboard/orders/${orderId}/invoice`,
  GET_QUOTES_API: BASE_URL + "/dashboard/quotes",
  GET_SHIPMENTS_API: BASE_URL + "/dashboard/shipments",
  GET_FAVORITES_API: BASE_URL + "/dashboard/favorites",
  ADD_TO_FAVORITES_API: (productId) => BASE_URL + `/dashboard/favorites/${productId}`,
  REMOVE_FROM_FAVORITES_API: (productId) => BASE_URL + `/dashboard/favorites/${productId}`,
  GET_RECENTLY_VIEWED_API: BASE_URL + "/dashboard/recently-viewed",
  ADD_TO_RECENTLY_VIEWED_API: (productId) => BASE_URL + `/dashboard/recently-viewed/${productId}`,
  // Chart Data Endpoints
  GET_SPENDING_TREND_API: BASE_URL + "/dashboard/charts/spending-trend",
  GET_ORDERS_BY_STATUS_API: BASE_URL + "/dashboard/charts/orders-by-status",
  GET_SPENDING_BY_CATEGORY_API: BASE_URL + "/dashboard/charts/spending-by-category",
  GET_MONTHLY_ORDERS_API: BASE_URL + "/dashboard/charts/monthly-orders",
  GET_ORDER_TRENDS_API: BASE_URL + "/dashboard/charts/order-trends",
  GET_PAYMENT_STATUS_API: BASE_URL + "/dashboard/charts/payment-status",
  // Products for Quote Selection
  GET_PRODUCTS_FOR_QUOTE_API: BASE_URL + "/products",
  // Cart Endpoints
  GET_CART_API: BASE_URL + "/dashboard/cart",
  ADD_TO_CART_API: (productId) => BASE_URL + `/dashboard/cart/${productId}`,
  UPDATE_CART_ITEM_API: (productId) => BASE_URL + `/dashboard/cart/${productId}`,
  REMOVE_FROM_CART_API: (productId) => BASE_URL + `/dashboard/cart/${productId}`,
  CLEAR_CART_API: BASE_URL + "/dashboard/cart",
  // Inquiry Endpoint
  RAISE_CART_INQUIRY_API: BASE_URL + "/dashboard/cart/inquiry",
};

// AUTH ENDPOINTS
export const authEndpoints = {
  REGISTER_API: AUTH_BASE_URL + "/auth/register",
  LOGIN_API: AUTH_BASE_URL + "/auth/login",
  LOGOUT_API: AUTH_BASE_URL + "/auth/logout",
  GET_ME_API: AUTH_BASE_URL + "/auth/me",
  UPDATE_PROFILE_API: AUTH_BASE_URL + "/auth/updatedetails",
  UPDATE_PASSWORD_API: AUTH_BASE_URL + "/auth/updatepassword",
  FORGOT_PASSWORD_API: AUTH_BASE_URL + "/auth/forgotpassword",
  RESET_PASSWORD_API: (token) => AUTH_BASE_URL + `/auth/resetpassword/${token}`,
  VERIFY_EMAIL_API: AUTH_BASE_URL + "/auth/verify-email",
  RESEND_CODE_API: AUTH_BASE_URL + "/auth/resend-code",
  GOOGLE_AUTH_API: AUTH_BASE_URL + "/auth/google",
  GET_SETTINGS_API: AUTH_BASE_URL + "/auth/settings",
  UPDATE_SETTINGS_API: AUTH_BASE_URL + "/auth/settings",
};

// PRODUCT ENDPOINTS
export const productEndpoints = {
  GET_ALL_PRODUCTS_API: BASE_URL + "/products",
  GET_PRODUCT_BY_ID_API: (id) => BASE_URL + `/products/${id}`,
  GET_FEATURED_PRODUCTS_API: BASE_URL + "/products/featured",
  GET_PRODUCTS_BY_CATEGORY_API: (categoryId) => BASE_URL + `/products/category/${categoryId}`,
  GET_PRODUCTS_BY_SUPPLIER_API: (supplierId) => BASE_URL + `/products/supplier/${supplierId}`,
  CREATE_PRODUCT_API: BASE_URL + "/products",
  UPDATE_PRODUCT_API: (id) => BASE_URL + `/products/${id}`,
  DELETE_PRODUCT_API: (id) => BASE_URL + `/products/${id}`,
  UPDATE_STOCK_API: (id) => BASE_URL + `/products/${id}/stock`,
  TOGGLE_FEATURED_API: (id) => BASE_URL + `/products/${id}/toggle-featured`,
  UPDATE_PRODUCT_SUMMARY_API: (id) => BASE_URL + `/products/${id}/summary`,
};

// CATEGORY ENDPOINTS
export const categoryEndpoints = {
  GET_ALL_CATEGORIES_API: BASE_URL + "/categories",
  GET_CATEGORY_BY_ID_API: (id) => BASE_URL + `/categories/${id}`,
  GET_CATEGORY_BY_SLUG_API: (slug) => BASE_URL + `/categories/slug/${slug}`,
  GET_CATEGORY_STATS_API: BASE_URL + "/categories/stats",
  GET_FEATURED_CATEGORIES_API: BASE_URL + "/categories/featured",
  GET_HOT_CATEGORIES_API: BASE_URL + "/categories/hot",
  GET_TRENDING_CATEGORIES_API: BASE_URL + "/categories/trending",
  GET_TOP_SELLING_CATEGORIES_API: BASE_URL + "/categories/top-selling",
  GET_NEW_CATEGORIES_API: BASE_URL + "/categories/new",
  GET_ADMIN_CATEGORIES_API: BASE_URL + "/categories/admin/all",
  CREATE_CATEGORY_API: BASE_URL + "/categories",
  UPDATE_CATEGORY_API: (id) => BASE_URL + `/categories/${id}`,
  DELETE_CATEGORY_API: (id) => BASE_URL + `/categories/${id}`,
  UPLOAD_CATEGORY_IMAGE_API: BASE_URL + "/categories/upload-image",
  TOGGLE_CATEGORY_ACTIVE_API: (id) => BASE_URL + `/categories/${id}/toggle-active`,
  TOGGLE_CATEGORY_FEATURED_API: (id) => BASE_URL + `/categories/${id}/toggle-featured`,
  TOGGLE_CATEGORY_HOT_API: (id) => BASE_URL + `/categories/${id}/toggle-hot`,
  TOGGLE_CATEGORY_TRENDING_API: (id) => BASE_URL + `/categories/${id}/toggle-trending`,
  TOGGLE_CATEGORY_NEW_API: (id) => BASE_URL + `/categories/${id}/toggle-new`,
  TOGGLE_CATEGORY_TOP_SELLING_API: (id) => BASE_URL + `/categories/${id}/toggle-top-selling`,
  UPDATE_CATEGORY_ORDER_API: (id) => BASE_URL + `/categories/${id}/order`,
  BULK_UPDATE_CATEGORY_ORDER_API: BASE_URL + "/categories/bulk-order",
  SYNC_PRODUCT_COUNTS_API: BASE_URL + "/categories/sync-counts",
};

// BRAND ENDPOINTS
export const brandEndpoints = {
  GET_ALL_BRANDS_API: BASE_URL + "/admin/brands",
  GET_BRAND_STATS_API: BASE_URL + "/admin/brands/stats",
  GET_BRAND_BY_ID_API: (id) => BASE_URL + `/admin/brands/${id}`,
  CREATE_BRAND_API: BASE_URL + "/admin/brands",
  UPDATE_BRAND_API: (id) => BASE_URL + `/admin/brands/${id}`,
  DELETE_BRAND_API: (id) => BASE_URL + `/admin/brands/${id}`,
  TOGGLE_BRAND_ACTIVE_API: (id) => BASE_URL + `/admin/brands/${id}/toggle-active`,
  TOGGLE_BRAND_FEATURED_API: (id) => BASE_URL + `/admin/brands/${id}/toggle-featured`,
  UPLOAD_BRAND_LOGO_API: BASE_URL + "/admin/brands/upload-logo",
};

// SUPPLIER ENDPOINTS
export const supplierEndpoints = {
  GET_ALL_SUPPLIERS_API: BASE_URL + "/suppliers",
  GET_SUPPLIER_BY_ID_API: (id) => BASE_URL + `/suppliers/${id}`,
  GET_VERIFIED_SUPPLIERS_API: BASE_URL + "/suppliers/verified",
  GET_SUPPLIER_STATS_API: BASE_URL + "/suppliers/stats",
  CREATE_SUPPLIER_API: BASE_URL + "/suppliers",
  UPDATE_SUPPLIER_API: (id) => BASE_URL + `/suppliers/${id}`,
  DELETE_SUPPLIER_API: (id) => BASE_URL + `/suppliers/${id}`,
  VERIFY_SUPPLIER_API: (id) => BASE_URL + `/suppliers/${id}/verify`,
  TOGGLE_FEATURED_API: (id) => BASE_URL + `/suppliers/${id}/toggle-featured`,
  
  // Supplier Dashboard Endpoints (for logged-in suppliers)
  GET_SUPPLIER_DASHBOARD_API: BASE_URL + "/supplier/dashboard",
  GET_MY_SUPPLIER_PROFILE_API: BASE_URL + "/supplier/profile",
  UPDATE_MY_SUPPLIER_PROFILE_API: BASE_URL + "/supplier/profile",
  GET_MY_PRODUCTS_API: BASE_URL + "/supplier/products",
  GET_MY_PRODUCT_STATS_API: BASE_URL + "/supplier/products/stats",
  GET_MY_PRODUCT_BY_ID_API: (id) => BASE_URL + `/supplier/products/${id}`,
  CREATE_MY_PRODUCT_API: BASE_URL + "/supplier/products",
  UPDATE_MY_PRODUCT_API: (id) => BASE_URL + `/supplier/products/${id}`,
  DELETE_MY_PRODUCT_API: (id) => BASE_URL + `/supplier/products/${id}`,
  UPLOAD_MY_PRODUCT_IMAGE_API: BASE_URL + "/supplier/products/upload-image",
  GET_MY_ORDERS_API: BASE_URL + "/supplier/orders",
  GET_MY_ORDER_BY_ID_API: (id) => BASE_URL + `/supplier/orders/${id}`,
  UPDATE_MY_ORDER_STATUS_API: (id) => BASE_URL + `/supplier/orders/${id}/status`,
  GET_MY_QUOTES_API: BASE_URL + "/supplier/quotes",
  RESPOND_TO_QUOTE_API: (id) => BASE_URL + `/supplier/quotes/${id}/respond`,
};

// ORDER ENDPOINTS
export const orderEndpoints = {
  GET_ALL_ORDERS_API: BASE_URL + "/orders",
  GET_MY_ORDERS_API: BASE_URL + "/orders/myorders",
  GET_ORDER_BY_ID_API: (id) => BASE_URL + `/orders/${id}`,
  CREATE_ORDER_API: BASE_URL + "/orders",
  UPDATE_ORDER_API: (id) => BASE_URL + `/orders/${id}`,
  CANCEL_ORDER_API: (id) => BASE_URL + `/orders/${id}/cancel`,
  UPDATE_STATUS_API: (id) => BASE_URL + `/orders/${id}/status`,
  GET_ORDER_STATS_API: BASE_URL + "/orders/stats",
  GET_ORDERS_PENDING_SHIPMENT_API: BASE_URL + "/orders/pending-shipment",
  GET_ORDERS_PENDING_PAYMENT_API: BASE_URL + "/orders/pending-payment",
};

// QUOTE ENDPOINTS
export const quoteEndpoints = {
  GET_ALL_QUOTES_API: BASE_URL + "/quotes",
  GET_MY_QUOTES_API: BASE_URL + "/quotes/my/requests",
  GET_QUOTE_BY_ID_API: (id) => BASE_URL + `/quotes/${id}`,
  CREATE_QUOTE_API: BASE_URL + "/quotes",
  UPLOAD_ATTACHMENT_API: BASE_URL + "/quotes/upload-attachment",
  UPDATE_QUOTE_API: (id) => BASE_URL + `/quotes/${id}`,
  DELETE_QUOTE_API: (id) => BASE_URL + `/quotes/${id}`,
  RESPOND_TO_QUOTE_API: (id) => BASE_URL + `/quotes/${id}/respond`,
  ACCEPT_QUOTE_API: (id) => BASE_URL + `/quotes/${id}/accept`,
  REJECT_QUOTE_API: (id) => BASE_URL + `/quotes/${id}/reject`,
};

// PAYMENT ENDPOINTS
export const paymentEndpoints = {
  GET_ALL_PAYMENTS_API: BASE_URL + "/payments",
  GET_PAYMENT_BY_ID_API: (id) => BASE_URL + `/payments/${id}`,
  CREATE_PAYMENT_API: BASE_URL + "/payments",
  CREATE_MANUAL_PAYMENT_API: BASE_URL + "/payments/admin/manual",
  VERIFY_PAYMENT_API: (id) => BASE_URL + `/payments/${id}/verify`,
  REFUND_PAYMENT_API: (id) => BASE_URL + `/payments/${id}/refund`,
  UPDATE_PAYMENT_STATUS_API: (id) => BASE_URL + `/payments/${id}/status`,
  GET_PAYMENT_STATS_API: BASE_URL + "/payments/stats",
  GET_MY_PAYMENTS_API: BASE_URL + "/payments/my/payments",
  PROCESS_PAYOUT_API: (id) => BASE_URL + `/payments/${id}/payout`,
  GET_COMMISSION_BREAKDOWN_API: BASE_URL + "/payments/commission-breakdown",
  GET_PAYMENT_METHODS_DISTRIBUTION_API: BASE_URL + "/payments/methods-distribution",
  EXPORT_PAYMENTS_REPORT_API: BASE_URL + "/payments/export",
  // Stripe payment endpoints
  CREATE_STRIPE_INTENT_API: BASE_URL + "/payments/stripe/create-intent",
  CONFIRM_STRIPE_PAYMENT_API: BASE_URL + "/payments/stripe/confirm",
  CREATE_STRIPE_CHECKOUT_SESSION_API: BASE_URL + "/payments/stripe/create-checkout-session",
  GET_STRIPE_CHECKOUT_SESSION_API: (sessionId) => BASE_URL + `/payments/stripe/checkout-session/${sessionId}`,
  // Bank transfer endpoints
  GET_BANK_DETAILS_API: BASE_URL + "/payments/bank-details",
  SUBMIT_BANK_TRANSFER_API: BASE_URL + "/payments/bank-transfer/submit",
  VERIFY_BANK_TRANSFER_API: (id) => BASE_URL + `/payments/bank-transfer/${id}/verify`,
  // Order payment details
  GET_ORDER_PAYMENT_DETAILS_API: (orderId) => BASE_URL + `/payments/order/${orderId}/details`,
};

// SHIPMENT ENDPOINTS
export const shipmentEndpoints = {
  GET_ALL_SHIPMENTS_API: BASE_URL + "/shipments",
  GET_SHIPMENT_BY_ID_API: (id) => BASE_URL + `/shipments/${id}`,
  GET_SHIPMENT_WITH_ORDER_API: (id) => BASE_URL + `/shipments/${id}/with-order`,
  CREATE_SHIPMENT_API: BASE_URL + "/shipments",
  UPDATE_SHIPMENT_API: (id) => BASE_URL + `/shipments/${id}`,
  DELETE_SHIPMENT_API: (id) => BASE_URL + `/shipments/${id}`,
  TRACK_SHIPMENT_API: (trackingNumber) => BASE_URL + `/shipments/track/${trackingNumber}`,
  UPDATE_SHIPMENT_STATUS_API: (id) => BASE_URL + `/shipments/${id}/status`,
  ADD_TRACKING_UPDATE_API: (id) => BASE_URL + `/shipments/${id}/tracking`,
  GET_SHIPMENT_STATS_API: BASE_URL + "/shipments/stats",
  NOTIFY_CUSTOMER_API: (id) => BASE_URL + `/shipments/${id}/notify`,
  DOWNLOAD_LABEL_API: (id) => BASE_URL + `/shipments/${id}/label`,
  EXPORT_SHIPMENTS_REPORT_API: BASE_URL + "/shipments/export",
  GET_MY_SHIPMENTS_API: BASE_URL + "/shipments/my-shipments",
};

// REVIEW ENDPOINTS
export const reviewEndpoints = {
  GET_ALL_REVIEWS_API: BASE_URL + "/reviews",
  GET_PRODUCT_REVIEWS_API: (productId) => BASE_URL + `/reviews/product/${productId}`,
  GET_SUPPLIER_REVIEWS_API: (supplierId) => BASE_URL + `/reviews/supplier/${supplierId}`,
  CREATE_REVIEW_API: BASE_URL + "/reviews",
  UPDATE_REVIEW_API: (id) => BASE_URL + `/reviews/${id}`,
  DELETE_REVIEW_API: (id) => BASE_URL + `/reviews/${id}`,
  LIKE_REVIEW_API: (id) => BASE_URL + `/reviews/${id}/like`,
  REPORT_REVIEW_API: (id) => BASE_URL + `/reviews/${id}/report`,
};

// CONTACT ENDPOINTS
export const contactEndpoints = {
  SUBMIT_CONTACT_API: BASE_URL + "/contacts",
  BOOK_MEETING_API: BASE_URL + "/contacts/book-meeting",
  RAISE_QUERY_API: BASE_URL + "/contacts/raise-query",
  GET_ALL_CONTACTS_API: BASE_URL + "/contacts",
  GET_CONTACT_BY_ID_API: (id) => BASE_URL + `/contacts/${id}`,
  GET_CONTACT_STATS_API: BASE_URL + "/contacts/stats",
  UPDATE_CONTACT_STATUS_API: (id) => BASE_URL + `/contacts/${id}/status`,
  RESPOND_TO_CONTACT_API: (id) => BASE_URL + `/contacts/${id}/respond`,
  ASSIGN_CONTACT_API: (id) => BASE_URL + `/contacts/${id}/assign`,
  ADD_NOTE_API: (id) => BASE_URL + `/contacts/${id}/notes`,
  DELETE_CONTACT_API: (id) => BASE_URL + `/contacts/${id}`,
  UPLOAD_ATTACHMENT_API: BASE_URL + "/contacts/upload-attachment",
};

// NOTIFICATION ENDPOINTS
export const notificationEndpoints = {
  GET_ALL_NOTIFICATIONS_API: BASE_URL + "/notifications",
  GET_UNREAD_NOTIFICATIONS_API: BASE_URL + "/notifications/unread",
  GET_UNREAD_COUNT_API: BASE_URL + "/notifications/unread/count",
  MARK_AS_READ_API: (id) => BASE_URL + `/notifications/${id}/read`,
  MARK_ALL_AS_READ_API: BASE_URL + "/notifications/read/all",
  DELETE_NOTIFICATION_API: (id) => BASE_URL + `/notifications/${id}`,
  DELETE_ALL_NOTIFICATIONS_API: BASE_URL + "/notifications/all",
  CREATE_NOTIFICATION_API: BASE_URL + "/notifications",
};

// USER ENDPOINTS
export const userEndpoints = {
  GET_ALL_USERS_API: BASE_URL + "/users",
  GET_USER_BY_ID_API: (id) => BASE_URL + `/users/${id}`,
  UPDATE_USER_API: (id) => BASE_URL + `/users/${id}`,
  DELETE_USER_API: (id) => BASE_URL + `/users/${id}`,
  UPDATE_USER_ROLE_API: (id) => BASE_URL + `/users/${id}/role`,
  BLOCK_USER_API: (id) => BASE_URL + `/users/${id}/block`,
  UNBLOCK_USER_API: (id) => BASE_URL + `/users/${id}/unblock`,
  GET_USER_STATS_API: BASE_URL + "/users/stats",
  UPLOAD_PROFILE_PHOTO_API: BASE_URL + "/users/upload-photo",
};

// REPORTS ENDPOINTS
export const reportEndpoints = {
  // Overview Reports
  GET_REPORT_OVERVIEW_API: BASE_URL + "/reports/overview",
  GET_WEEKLY_REPORT_API: BASE_URL + "/reports/weekly",
  GET_MONTHLY_REPORT_API: BASE_URL + "/reports/monthly",
  GET_QUARTERLY_REPORT_API: BASE_URL + "/reports/quarterly",
  GET_YEARLY_REPORT_API: BASE_URL + "/reports/yearly",
  GET_CUSTOM_REPORT_API: BASE_URL + "/reports/custom",
  
  // Revenue & Sales Reports
  GET_REVENUE_REPORT_API: BASE_URL + "/reports/revenue",
  GET_REVENUE_TREND_API: BASE_URL + "/reports/revenue/trend",
  GET_SALES_BY_CATEGORY_API: BASE_URL + "/reports/sales/by-category",
  GET_SALES_BY_REGION_API: BASE_URL + "/reports/sales/by-region",
  GET_TOP_SELLING_PRODUCTS_API: BASE_URL + "/reports/products/top-selling",
  
  // User Reports
  GET_USER_ACTIVITY_REPORT_API: BASE_URL + "/reports/users/activity",
  GET_NEW_REGISTRATIONS_API: BASE_URL + "/reports/users/registrations",
  GET_USER_DEMOGRAPHICS_API: BASE_URL + "/reports/users/demographics",
  
  // Performance Reports
  GET_KPI_METRICS_API: BASE_URL + "/reports/kpi",
  GET_ORDER_SUCCESS_RATE_API: BASE_URL + "/reports/orders/success-rate",
  GET_AVG_ORDER_VALUE_API: BASE_URL + "/reports/orders/avg-value",
  GET_CUSTOMER_RETENTION_API: BASE_URL + "/reports/customers/retention",
  GET_CUSTOMER_SATISFACTION_API: BASE_URL + "/reports/customers/satisfaction",
  
  // Export Reports
  EXPORT_REPORT_PDF_API: BASE_URL + "/reports/export/pdf",
  EXPORT_REPORT_CSV_API: BASE_URL + "/reports/export/csv",
  EXPORT_REPORT_EXCEL_API: BASE_URL + "/reports/export/excel",
  
  // Email Report
  EMAIL_REPORT_API: BASE_URL + "/reports/email",
  
  // Scheduled Reports
  GET_SCHEDULED_REPORTS_API: BASE_URL + "/reports/scheduled",
  CREATE_SCHEDULED_REPORT_API: BASE_URL + "/reports/scheduled",
  UPDATE_SCHEDULED_REPORT_API: (id) => BASE_URL + `/reports/scheduled/${id}`,
  DELETE_SCHEDULED_REPORT_API: (id) => BASE_URL + `/reports/scheduled/${id}`,
  TOGGLE_SCHEDULED_REPORT_API: (id) => BASE_URL + `/reports/scheduled/${id}/toggle`,
  SEND_SCHEDULED_REPORT_NOW_API: (id) => BASE_URL + `/reports/scheduled/${id}/send-now`,
};

// ADMIN ENDPOINTS
export const adminEndpoints = {
  // Dashboard
  GET_ADMIN_DASHBOARD_API: BASE_URL + "/admin/dashboard/overview",
  GET_ADMIN_STATS_API: BASE_URL + "/admin/stats",
  
  // User Management
  GET_ALL_USERS_API: BASE_URL + "/admin/users",
  CREATE_ADMIN_USER_API: BASE_URL + "/admin/users",
  GET_USER_BY_ID_API: (id) => BASE_URL + `/admin/users/${id}`,
  UPDATE_USER_API: (id) => BASE_URL + `/admin/users/${id}`,
  DELETE_USER_API: (id) => BASE_URL + `/admin/users/${id}`,
  TOGGLE_USER_ACTIVE_API: (id) => BASE_URL + `/admin/users/${id}/toggle-active`,
  
  // Supplier Management
  GET_ALL_SUPPLIERS_API: BASE_URL + "/admin/suppliers",
  GET_SUPPLIER_DETAILS_API: (id) => BASE_URL + `/admin/suppliers/${id}`,
  CREATE_SUPPLIER_API: BASE_URL + "/admin/suppliers",
  APPROVE_SUPPLIER_API: (id) => BASE_URL + `/admin/suppliers/${id}/approve`,
  REJECT_SUPPLIER_API: (id) => BASE_URL + `/admin/suppliers/${id}/reject`,
  
  // Product Management
  GET_ALL_PRODUCTS_API: BASE_URL + "/admin/products",
  GET_PRODUCT_STATS_API: BASE_URL + "/admin/products/stats",
  GET_PRODUCT_BY_ID_API: (id) => BASE_URL + `/admin/products/${id}`,
  CREATE_PRODUCT_API: BASE_URL + "/admin/products",
  UPLOAD_PRODUCT_IMAGE_API: BASE_URL + "/admin/products/upload-image",
  UPDATE_PRODUCT_API: (id) => BASE_URL + `/admin/products/${id}`,
  DELETE_PRODUCT_API: (id) => BASE_URL + `/admin/products/${id}`,
  APPROVE_PRODUCT_API: (id) => BASE_URL + `/admin/products/${id}/approve`,
  REJECT_PRODUCT_API: (id) => BASE_URL + `/admin/products/${id}/reject`,
  TOGGLE_PRODUCT_ACTIVE_API: (id) => BASE_URL + `/admin/products/${id}/toggle-active`,
  TOGGLE_PRODUCT_FEATURED_API: (id) => BASE_URL + `/admin/products/${id}/toggle-featured`,
  
  // Order Management
  GET_ALL_ORDERS_API: BASE_URL + "/admin/orders",
  GET_ORDER_STATS_API: BASE_URL + "/admin/orders/stats",
  GET_ORDER_BY_ID_API: (id) => BASE_URL + `/admin/orders/${id}`,
  CREATE_ORDER_API: BASE_URL + "/admin/orders",
  UPDATE_ORDER_STATUS_API: (id) => BASE_URL + `/admin/orders/${id}/status`,
  DELETE_ORDER_API: (id) => BASE_URL + `/admin/orders/${id}`,
  
  // Payment Management
  GET_ALL_PAYMENTS_API: BASE_URL + "/payments",
  GET_PAYMENT_BY_ID_API: (id) => BASE_URL + `/payments/${id}`,
  GET_PAYMENT_STATS_API: BASE_URL + "/payments/stats",
  UPDATE_PAYMENT_STATUS_API: (id) => BASE_URL + `/payments/${id}/status`,
  PROCESS_REFUND_API: (id) => BASE_URL + `/payments/${id}/refund`,
  PROCESS_PAYOUT_API: (id) => BASE_URL + `/payments/${id}/payout`,
  GET_COMMISSION_BREAKDOWN_API: BASE_URL + "/payments/commission-breakdown",
  GET_PAYMENT_METHODS_DISTRIBUTION_API: BASE_URL + "/payments/methods-distribution",
  
  // Quote Management
  GET_ALL_QUOTES_API: BASE_URL + "/admin/quotes",
  GET_QUOTE_STATS_API: BASE_URL + "/admin/quotes/stats",
  GET_QUOTE_BY_ID_API: (id) => BASE_URL + `/admin/quotes/${id}`,
  CREATE_ADMIN_QUOTE_API: BASE_URL + "/admin/quotes",
  UPDATE_QUOTE_STATUS_API: (id) => BASE_URL + `/admin/quotes/${id}/status`,
  SEND_QUOTE_RESPONSE_API: (id) => BASE_URL + `/admin/quotes/${id}/respond`,
  ADMIN_ACCEPT_QUOTE_API: (id) => BASE_URL + `/admin/quotes/${id}/accept`,
  ASSIGN_QUOTE_API: (id) => BASE_URL + `/admin/quotes/${id}/assign`,
  CONVERT_QUOTE_TO_ORDER_API: (id) => BASE_URL + `/admin/quotes/${id}/convert-to-order`,
  CONTACT_BUYER_API: (id) => BASE_URL + `/admin/quotes/${id}/contact-buyer`,
  DELETE_QUOTE_API: (id) => BASE_URL + `/admin/quotes/${id}`,
  
  // Shipment Management
  GET_ALL_SHIPMENTS_API: BASE_URL + "/shipments",
  GET_SHIPMENT_BY_ID_API: (id) => BASE_URL + `/shipments/${id}`,
  CREATE_SHIPMENT_API: BASE_URL + "/shipments",
  UPDATE_SHIPMENT_API: (id) => BASE_URL + `/shipments/${id}`,
  DELETE_SHIPMENT_API: (id) => BASE_URL + `/shipments/${id}`,
  UPDATE_SHIPMENT_STATUS_API: (id) => BASE_URL + `/shipments/${id}/status`,
  ADD_TRACKING_UPDATE_API: (id) => BASE_URL + `/shipments/${id}/tracking`,
  GET_SHIPMENT_STATS_API: BASE_URL + "/shipments/stats",
  NOTIFY_CUSTOMER_API: (id) => BASE_URL + `/shipments/${id}/notify`,
  
  // Contact Management
  GET_ALL_CONTACTS_API: BASE_URL + "/admin/contacts",
};

// INVENTORY ENDPOINTS (Admin only)
export const inventoryEndpoints = {
  // Overview & Stats
  GET_INVENTORY_OVERVIEW_API: BASE_URL + "/inventory/overview",
  
  // Inventory Items
  GET_INVENTORY_ITEMS_API: BASE_URL + "/inventory",
  
  // Stock Operations
  UPDATE_STOCK_API: (id) => BASE_URL + `/inventory/${id}/stock`,
  ADD_STOCK_API: (id) => BASE_URL + `/inventory/${id}/add-stock`,
  REDUCE_STOCK_API: (id) => BASE_URL + `/inventory/${id}/reduce-stock`,
  BULK_UPDATE_STOCK_API: BASE_URL + "/inventory/bulk-update",
  
  // History & Reports
  GET_STOCK_HISTORY_API: (id) => BASE_URL + `/inventory/${id}/history`,
  EXPORT_INVENTORY_API: BASE_URL + "/inventory/export",
  
  // Alerts
  GET_LOW_STOCK_ALERTS_API: BASE_URL + "/inventory/alerts",
};

// SUPPORT TICKET ENDPOINTS
export const supportTicketEndpoints = {
  // User endpoints
  CREATE_TICKET_API: BASE_URL + "/support-tickets",
  GET_MY_TICKETS_API: BASE_URL + "/support-tickets/my-tickets",
  GET_TICKET_BY_ID_API: (id) => BASE_URL + `/support-tickets/${id}`,
  REPLY_TO_TICKET_API: (id) => BASE_URL + `/support-tickets/${id}/reply`,
  CLOSE_TICKET_API: (id) => BASE_URL + `/support-tickets/${id}/close`,
  RATE_TICKET_API: (id) => BASE_URL + `/support-tickets/${id}/rate`,
  GET_UNREAD_COUNT_API: BASE_URL + "/support-tickets/unread-count",
  
  // Admin endpoints
  GET_ALL_TICKETS_API: BASE_URL + "/support-tickets/admin/all",
  GET_TICKET_STATS_API: BASE_URL + "/support-tickets/admin/stats",
  GET_STAFF_FOR_ASSIGNMENT_API: BASE_URL + "/support-tickets/admin/staff",
  UPDATE_TICKET_STATUS_API: (id) => BASE_URL + `/support-tickets/${id}/status`,
  ASSIGN_TICKET_API: (id) => BASE_URL + `/support-tickets/${id}/assign`,
  ADD_INTERNAL_NOTE_API: (id) => BASE_URL + `/support-tickets/${id}/notes`,
  DELETE_TICKET_API: (id) => BASE_URL + `/support-tickets/${id}`,
};

// CATALOG ENDPOINTS
export const catalogEndpoints = {
  // Public endpoints
  GET_ALL_CATALOGS_API: BASE_URL + "/catalogs",
  GET_CATALOG_BY_ID_API: (id) => BASE_URL + `/catalogs/${id}`,
  GET_FEATURED_CATALOGS_API: BASE_URL + "/catalogs/featured",
  GET_CATALOGS_BY_CATEGORY_API: (categoryId) => BASE_URL + `/catalogs/category/${categoryId}`,
  GET_CATEGORIES_WITH_COUNTS_API: BASE_URL + "/catalogs/categories-with-counts",
  DOWNLOAD_CATALOG_API: (id) => BASE_URL + `/catalogs/${id}/download`,
  TRACK_CATALOG_VIEW_API: (id) => BASE_URL + `/catalogs/${id}/view`,
  
  // Admin endpoints
  GET_ALL_CATALOGS_ADMIN_API: BASE_URL + "/catalogs/admin/all",
  GET_CATALOG_STATS_API: BASE_URL + "/catalogs/stats",
  CREATE_CATALOG_API: BASE_URL + "/catalogs",
  UPDATE_CATALOG_API: (id) => BASE_URL + `/catalogs/${id}`,
  DELETE_CATALOG_API: (id) => BASE_URL + `/catalogs/${id}`,
  UPLOAD_CATALOG_PDF_API: BASE_URL + "/catalogs/upload-pdf",
  UPLOAD_CATALOG_COVER_API: BASE_URL + "/catalogs/upload-cover",
  TOGGLE_CATALOG_ACTIVE_API: (id) => BASE_URL + `/catalogs/${id}/toggle-active`,
  TOGGLE_CATALOG_FEATURED_API: (id) => BASE_URL + `/catalogs/${id}/toggle-featured`,
};

// SITE STATS ENDPOINTS
export const siteStatsEndpoints = {
  GET_SITE_STATS_API: BASE_URL + "/site-stats",
  UPDATE_SITE_STATS_API: BASE_URL + "/site-stats",
  RESET_SITE_STATS_API: BASE_URL + "/site-stats/reset",
};

export default BASE_URL;
