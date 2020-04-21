// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const faunadb = require("faunadb")

const q = faunadb.query
const faunaClient = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET })

exports.handler = async (event, context) => {
  let resp

  if (event.httpMethod === 'GET') {
    resp = await getMemories()
  } else if (event.httpMethod === 'POST') {
    resp = await postMemory()
  } else {
    resp = { statusCode: 500, body: 'GET OUTTA HERE' }
  }

  return { statusCode: resp.statusCode, body: resp.body }

  async function getMemories(){
    try {
      const req = await faunaClient.query(q.Map(q.Paginate(q.Match(q.Index("all_memories"))), q.Lambda("attr", q.Get(q.Var("attr")))))
      console.log(req)
      return { statusCode: 200, body: JSON.stringify(req.data) }
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: err.message}) }
    }
  }

  async function postMemory(){
    try {
      const memory = {
        data: JSON.parse(event.body)
      }
      const req = await faunaClient.query(q.Create(q.Ref("classes/memories"), memory))
      console.log(req)

      return { statusCode: 200, body: JSON.stringify({ newMem: req }) }

    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: err.message}) }
    }
  }

}
