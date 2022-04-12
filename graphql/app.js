const {graphql, buildSchema} = require('graphql')

const schema = buildSchema(`
  type Query {
    foo: String
    count: Int
  }
`);

const root = {
  foo() {
    return 'bar'
  },
  count() {
    return 123
  }
}

graphql(schema, '{ count, foo }', root).then(res => {
  console.log(res)
})
