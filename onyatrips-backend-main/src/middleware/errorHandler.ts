export function errorHandler(err: any, req: any, res: any, next: any) {
  console.error('Error:', err.message)
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  })
}