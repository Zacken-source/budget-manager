import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from './app.js'
import pool from './config/database.js'

let token
let transactionId
const testUser = {
  username: `testuser_${Date.now()}`,
  email:    `test_${Date.now()}@test.com`,
  password: 'password123'
}

// Nettoie les données de test après
afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email = ?', [testUser.email])
  await pool.end()
})

// ── AUTH ──────────────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  it('crée un compte et retourne un token', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser)
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.email).toBe(testUser.email)
    token = res.body.token
  })

  it('refuse un doublon email', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser)
    expect(res.status).toBe(409)
  })

  it('refuse un mot de passe trop court', async () => {
    const res = await request(app).post('/api/auth/register')
      .send({ ...testUser, email: 'other@test.com', password: '123' })
    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/login', () => {
  it('connecte et retourne un token', async () => {
    const res = await request(app).post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })

  it('refuse les mauvais identifiants', async () => {
    const res = await request(app).post('/api/auth/login')
      .send({ email: testUser.email, password: 'mauvais' })
    expect(res.status).toBe(401)
  })
})

describe('GET /api/auth/me', () => {
  it('retourne le profil avec un token valide', async () => {
    const res = await request(app).get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.email).toBe(testUser.email)
  })

  it('refuse sans token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })
})

// ── CATEGORIES ────────────────────────────────────────────────────────────

describe('GET /api/categories', () => {
  it('retourne les catégories système', async () => {
    const res = await request(app).get('/api/categories')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })
})

// ── TRANSACTIONS ──────────────────────────────────────────────────────────

describe('POST /api/transactions', () => {
  it('crée une transaction', async () => {
    // Récupère d'abord une catégorie valide
    const cats = await request(app).get('/api/categories')
      .set('Authorization', `Bearer ${token}`)
    const cat = cats.body.find(c => c.type === 'expense')

    const res = await request(app).post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        category_id: cat.id,
        amount: 42.50,
        type: 'expense',
        description: 'Test transaction',
        date: '2024-06-01'
      })
    expect(res.status).toBe(201)
    expect(Number(res.body.amount)).toBe(42.50)
    transactionId = res.body.id
  })

  it('refuse un montant négatif', async () => {
    const cats = await request(app).get('/api/categories')
      .set('Authorization', `Bearer ${token}`)
    const cat = cats.body[0]

    const res = await request(app).post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ category_id: cat.id, amount: -10, type: 'expense', date: '2024-06-01' })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/transactions', () => {
  it("liste les transactions de l'user", async () => {
    const res = await request(app).get('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('filtre par type', async () => {
    const res = await request(app).get('/api/transactions?type=expense')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    res.body.forEach(t => expect(t.type).toBe('expense'))
  })
})

describe('DELETE /api/transactions/:id', () => {
  it('supprime sa propre transaction', async () => {
    const res = await request(app).delete(`/api/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204)
  })

  it('refuse de supprimer une transaction inexistante', async () => {
    const res = await request(app).delete('/api/transactions/999999')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
  })
})

describe('GET /api/transactions/stats', () => {
  it('retourne les stats', async () => {
    const res = await request(app).get('/api/transactions/stats')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('summary')
    expect(res.body).toHaveProperty('byCategory')
    expect(res.body).toHaveProperty('byMonth')
  })
})