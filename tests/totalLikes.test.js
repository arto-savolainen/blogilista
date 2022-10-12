const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const emptyList = []

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const biggerList = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 0,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Bloopp',
      author: 'Blabps',
      url: 'www.blblasd.asd',
      likes: 20,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: '400 likes blog',
      author: 'Liked Man',
      url: 'www.greatblog.org',
      likes: 400,
      __v: 0
    }
  ]



  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger is calculated right', () => {
    const result = listHelper.totalLikes(biggerList)
    expect(result).toBe(420)
  })
})
