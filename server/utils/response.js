// HTTP Status Code Constants
export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};

/**
 * Success response handler
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {Object} data - Response data
 * @param {String} message - Success message
 */
export const successResponse = (res, statusCode = HTTP_STATUS.OK, data = {}, message = 'Success') => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Error response handler
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 * @param {Object} errors - Additional error details (optional)
 */
export const errorResponse = (res, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    error: { message }
  };
  
  if (errors) {
    response.error.details = errors;
  }
  
  res.status(statusCode).json(response);
};

// Specific HTTP Status Response Helpers

// 200 OK - Standard success response
export const ok = (res, data = {}, message = 'Success') => {
  successResponse(res, HTTP_STATUS.OK, data, message);
};

// 201 Created - Resource created successfully
export const created = (res, data = {}, message = 'Created successfully') => {
  successResponse(res, HTTP_STATUS.CREATED, data, message);
};

// 204 No Content - Success with no response body
export const noContent = (res) => {
  res.status(HTTP_STATUS.NO_CONTENT).send();
};

// 400 Bad Request - Invalid request data
export const badRequest = (res, message = 'Bad Request', errors = null) => {
  errorResponse(res, HTTP_STATUS.BAD_REQUEST, message, errors);
};

// 401 Unauthorized - Authentication required or failed
export const unauthorized = (res, message = 'Unauthorized - Authentication required') => {
  errorResponse(res, HTTP_STATUS.UNAUTHORIZED, message);
};

// 403 Forbidden - Authenticated but not authorized
export const forbidden = (res, message = 'Forbidden - You do not have permission to access this resource') => {
  errorResponse(res, HTTP_STATUS.FORBIDDEN, message);
};

// 404 Not Found - Resource not found
export const notFound = (res, message = 'Not Found') => {
  errorResponse(res, HTTP_STATUS.NOT_FOUND, message);
};

 // 409 Conflict - Resource conflict (e.g., duplicate entry)
export const conflict = (res, message = 'Already exists') => {
  errorResponse(res, HTTP_STATUS.CONFLICT, message);
};

 // 422 Unprocessable Entity - Validation failed
export const unprocessableEntity = (res, message = 'Validation failed', errors = null) => {
  errorResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, message, errors);
};

// 429 Too Many Requests - Rate limit exceeded
export const tooManyRequests = (res, message = 'Too many requests - Please try again later') => {
  errorResponse(res, HTTP_STATUS.TOO_MANY_REQUESTS, message);
};

// 500 Internal Server Error - Server error
export const internalServerError = (res, message = 'Internal Server Error') => {
  errorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
};

// 503 Service Unavailable - Service temporarily unavailable
export const serviceUnavailable = (res, message = 'Service temporarily unavailable') => {
  errorResponse(res, HTTP_STATUS.SERVICE_UNAVAILABLE, message);
};
