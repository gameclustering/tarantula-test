import { check, sleep } from 'k6'
import http from 'k6/http'
import { login, authHeaders, BASE_URL } from '../lib/client.js'

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed: ['rate==0'],
    http_req_duration: ['p(95)<2000'],
  },
}

export default function () {
  // 1. login
  const token = login(__ENV.ADMIN_USER || 'root', __ENV.ADMIN_PASS || 'password123')
  check(token, { 'got token': t => t.length > 0 })

  // 2. list repos
  const repoRes = http.get(`${BASE_URL}/admin/cluster/repo`, authHeaders(token))
  check(repoRes, {
    'list repos 200': r => r.status === 200,
    'list repos is array': r => Array.isArray(JSON.parse(r.body)),
  })

  // 3. cloud meta (any recent task)
  const metaRes = http.get(`${BASE_URL}/cloud/meta/task/0`, authHeaders(token))
  check(metaRes, { 'cloud meta responds': r => r.status === 200 || r.status === 404 })

  sleep(1)
}
