const {graphql, buildSchema} = require('graphql')
const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const cors = require('cors')

const app = express()

// 允许客户端跨域请求
app.use(cors())

// 1、使用 Graphql schema 语法构建一个schema
const schema = buildSchema(`
  type Query {
    foo: String
    count: Int
  }
`);

// 2、定义 schema 的 resolver
const rootValue = {
  foo() {
    return 'bar'
  },
  count() {
    return 123
  }
}

// 3、挂载 Graphql 中间件
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true // 开启浏览器 Graphql IDE 调式工具
}))

// 4、启动 web 服务
app.listen(4000, () => {
  console.log('Graphql Server is running at http://localhost:4000/graphql')
})
