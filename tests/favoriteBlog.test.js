const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
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
      title: 'big likes blog',
      author: 'Liked Man',
      url: 'www.greatblog.org',
      likes: 40000000000000000000000000000000000000000000000000000000000000000,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Lowly Blog',
      author: 'OOOO',
      url: 'www.ooooooooo.xxx',
      likes: 6,
      __v: 0
    }
  ]

  test('of empty list is {}', () => {
    const t0 = performance.now()

    const result = listHelper.favoriteBlog(emptyList)

    const t1 = performance.now()
    console.log('t1 - t0:', t1 - t0)
    
    expect(result).toEqual({})
  })

  test('when list has only one blog returns that object', () => {
    const t0 = performance.now()

    const result = listHelper.favoriteBlog(listWithOneBlog)

    const t1 = performance.now()
    console.log('t1 - t0:', t1 - t0)

    expect(result).toEqual(listWithOneBlog[0])
  })

  test('of a bigger list is calculated right', () => {
    const t0 = performance.now()
 
    const result = listHelper.favoriteBlog(biggerList)
   
    const t1 = performance.now()
    console.log('t1 - t0:', t1 - t0)
  
    expect(result).toEqual(biggerList[2])
  })
})
