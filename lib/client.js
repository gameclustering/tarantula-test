import http from 'k6/http'
import { check } from 'k6'

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:80'

export function login(username, password) {
  const res = http.post(`${BASE_URL}/admin/login`, JSON.stringify({ username, password }), {
    headers: { 'Content-Type': 'application/json' },
  })
  check(res, { 'login 200': r => r.status === 200 })
  const body = JSON.parse(res.body)
  return body.token || ''
}

export function authHeaders(token) {
  return { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
}
