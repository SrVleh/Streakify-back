import request from 'supertest'
import { app, server } from '../app.js'

describe('User', () => {
  afterAll((done) => {
    console.log('Closing server...')
    server.close(done)
  })

  it('POST /auth/login', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'Anaveh1',
        password: 'test1234'
      })
    expect(response.status).toBe(200)
    expect(response.body.user).toEqual({
      "_id": "6832ee4162a1677d1353afa9",
      "username": "Anaveh1"
    })
  })

  it('POST /auth/register', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'Anaveh3',
        password: 'test1234'
      })
    expect(response.status).toBe(422)
  })

  it('POST /auth/logout', async () => {
    const response = await request(app)
      .post('/auth/logout')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe("Logged out successfully!")
  })
})