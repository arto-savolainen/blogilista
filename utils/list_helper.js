const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) { return 0 }
  return blogs.reduce((total, current) => {
    return total + current.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) { return {} }

  let maxLikes = 0
  let favBlog = {}

  blogs.forEach(x => {
    if (x.likes > maxLikes) {
      maxLikes = x.likes
      favBlog = x
    }
  })

  return favBlog

  //alternate way
 /*   
  return blogs.reduce((prev, current) => {
    if (prev.likes > current.likes) {
      return prev
    }
    
    return current
  })*/
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}