const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  const isMulterSizeError = err?.code === 'LIMIT_FILE_SIZE';
  const isMulterFileCountError = err?.code === 'LIMIT_FILE_COUNT';
  const isInvalidImageType = String(err?.message || '').includes('Only image files are allowed');

  const statusCode =
    isMulterSizeError
      ? 413
      : isMulterFileCountError || isInvalidImageType
      ? 400
      : err.message?.startsWith('CORS blocked')
      ? 403
      : res.statusCode >= 400
      ? res.statusCode
      : 500;
  const isProduction = process.env.NODE_ENV === 'production';

  if (statusCode === 500) {
    console.error('Unhandled server error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
