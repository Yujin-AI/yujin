;(async () => {
  const url = 'http://localhost:5656?url=https://docs.adonisjs.com'
  const res = await fetch(url)

  if (res.ok) {
    const stream = res.body
    let count = 0
    for await (const chunk of stream) {
      const buffer = Buffer.from(chunk).toString()
      console.log('Buffer:', buffer)
      const data = JSON.parse(buffer)
      count++

      console.log('Crawling completed: ', data)
    }
    console.log('articles found:', count)
  }
})()
