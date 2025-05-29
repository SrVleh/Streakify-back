import request from 'supertest'
import { app, server } from '../app.js'
import mongoose from "mongoose";

describe('Habits', () => {
  let token = ''

  beforeAll( async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'Anaveh1',
        password: 'test1234'
      })

    token = response.body.token || response.headers['set-cookie']?.[0]?.split('=')[1]
  })

  afterAll(async () => {
    console.log('Closing server...')
    server.close() // close Express server
    await mongoose.connection.close()
  })

  it('GET /habits/ with token', async () => {
    const response = await request(app)
      .get('/habits/')
      .set('Cookie', [`access_token=${token}`]) // or use .set('Authorization', `Bearer ${token}`) if that's how your auth works
    expect(response.status).toBe(200)
  })

  it('GET /habits/ without token', async () => {
    const response = await request(app)
      .get('/habits/')
    expect(response.status).toBe(401)
  })

  it('GET /habits/6832ef6b067b3293ecd8c315 with token', async () => {
    const response = await request(app)
      .get('/habits/6832ef6b067b3293ecd8c315')
      .set('Cookie', [`access_token=${token}`]) // or use .set('Authorization', `Bearer ${token}`) if that's how your auth works
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      "_id": "6832ef6b067b3293ecd8c315",
      "user": "6832ee4162a1677d1353afa9",
      "name": "121",
      "description": "123456789122222223",
      "frequency": "Every day! Yay!",
      "createdAt": "2025-05-25T10:22:35.640Z",
      "updatedAt": "2025-05-25T10:22:35.640Z",
      "__v": 0
    })
  })
})