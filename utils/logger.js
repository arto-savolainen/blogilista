const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

module.exports = {
  info, error
}