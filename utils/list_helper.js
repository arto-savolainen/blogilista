const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) { return 0 }
  return blogs.reduce((total, x) => {
    return total + x.likes
  }, 0)
}

module.exports = {
  dummy,
  totalLikes
}