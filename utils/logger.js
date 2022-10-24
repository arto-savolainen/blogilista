const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('logger.info:', ...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('logger.error:', ...params)
  }
}

module.exports = {
  info, error
}