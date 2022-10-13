const _ = require('lodash')

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

  let maxLikes = -1
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

const mostBlogs = (blogs) => {
  if (blogs.length === 0) { return {} }

  const blogsCount = Object.entries(_.countBy(blogs, 'author'))
  let maxBlogs = 0
  let maxAuthor = ''

  blogsCount.forEach(x => {
    if (x[1] > maxBlogs) {
      maxBlogs = x[1]
      maxAuthor = x[0]
    }
  })

  return { author: maxAuthor, blogs: maxBlogs }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) { return {} }

  let likeCounts = []
  let maxLikes = -1
  let maxAuthor = ''

  blogs.forEach(x => {
    if (!likeCounts[x.author]) {
      likeCounts[x.author] = 0
    }

    likeCounts[x.author] += x.likes

    if (likeCounts[x.author] > maxLikes) {
      maxLikes = likeCounts[x.author]
      maxAuthor = x.author
    }

  })

  return { author: maxAuthor, likes: maxLikes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}