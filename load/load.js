import { check, sleep } from 'k6'
import http from 'k6/http'
import { login, authHeaders, BASE_URL } from '../lib/client.js'

// Ramp up to 50 VUs over 1m, hold 2m, ramp down 1m
export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '2m', target: 50 },
    { duration: '1m', target: 0  },
  ],
  thresholds: {
    http_req_failed:   ['rate<0.01'],        // <1% errors
    http_req_duration: ['p(95)<1000'],       // 95th percentile under 1s
  },
}

// Login once per VU (setup-like, runs at VU init)
export function setup() {
  return { token: login(__ENV.ADMIN_USER || 'root', __ENV.ADMIN_PASS || 'password123') }
}

export default function ({ token }) {
  const h = authHeaders(token)

  // Mix: 70% list repos, 30% login probe
  const roll = Math.random()
  if (roll < 0.7) {
    const res = http.get(`${BASE_URL}/admin/cluster/repo`, h)
    check(res, { 'list repos ok': r => r.status === 200 })
  } else {
    const res = http.post(
      `${BASE_URL}/admin/login`,
      JSON.stringify({ username: __ENV.ADMIN_USER || 'root', password: __ENV.ADMIN_PASS || 'password123' }),
      { headers: { 'Content-Type': 'application/json' } },
    )
    check(res, { 'login ok': r => r.status === 200 })
  }

  sleep(Math.random() * 0.5 + 0.1)
}
