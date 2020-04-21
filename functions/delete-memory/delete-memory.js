// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const faunadb = require("faunadb")

const q = faunadb.query
const faunaClient = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET })

exports.handler = async (event, context) => {

  if (event.httpMethod !== 'DELETE'){
    return { statusCode: 500, body: "This is a place of destruction. Not what you wanted..." }
  }
  
  try {
    const memory = JSON.parse(event.body)
    const memId = memory.ref['@ref'].id
    const req = await faunaClient.query(q.Delete(q.Ref(`classes/memories/${memId}`)))

    return {
      statusCode: 200,
      body: JSON.stringify({ mem: req })
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message}) }
  }
}
