module.exports = {
  inputFile: "/mnt/tensor/Downloads/enwiki-20180801-pages-articles.xml",
  elastic: {
    limit: 100,
    httpAuth: {
      password: undefined,
      user: undefined,
    },
    host: "tensor",
    index: "enwiki-20180801",
    logFile: "./log/elastic.log",
    port: 9200,
    type: "page",
  }
}