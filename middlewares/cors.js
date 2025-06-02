// INFO: We import cors from cors library
import cors from 'cors'

// INFO: We create an array with all the origins we want to allow
const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:1234',
  'http://localhost:5173'
]

// INFO: We create our middleware which is a function that recieves as arg a list of accepted origins
// ✅ If the request’s origin is in the accepted list, it's allowed.
// ✅ If there's no origin header (e.g. curl or same-origin request), it's allowed.
// ❌ If it’s not in the accepted list, it’s rejected with an error.
export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) return callback(null, true)

    if (!origin) return callback(null, true)

    return callback(new Error('Not allowed by CORS'))
  }
})
