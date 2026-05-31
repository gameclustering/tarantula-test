import { check, sleep } from 'k6'
import http from 'k6/http'
import { login, authHeaders, BASE_URL } from '../lib/client.js'

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed: ['rate==0'],
    http_req_duration: ['p(95)<3000'],
  },
}

export default function () {
  const token = login(__ENV.ADMIN_USER || 'root', __ENV.ADMIN_PASS || 'password123')
  const h = authHeaders(token)

  // 1. list repos — baseline
  const listRes = http.get(`${BASE_URL}/admin/cluster/repo`, h)
  check(listRes, { 'list repos ok': r => r.status === 200 })
  const before = JSON.parse(listRes.body)

  // 2. create a test repo
  const newRepo = { type: 'test', name: 'tarantula-test', tag: '', branch: 'main' }
  const createRes = http.post(`${BASE_URL}/admin/cluster/repo`, JSON.stringify(newRepo), h)
  check(createRes, {
    'create repo 200': r => r.status === 200,
    'create repo successful': r => JSON.parse(r.body).successful === true,
  })

  // 3. list again — count increased
  const listRes2 = http.get(`${BASE_URL}/admin/cluster/repo`, h)
  const after = JSON.parse(listRes2.body)
  check(listRes2, {
    'repo count increased': () => after.length === before.length + 1,
  })

  // 4. delete the test repo we just created
  const created = after.find(r => r.name === 'tarantula-test' && r.type === 'test')
  if (created) {
    const delRes = http.del(`${BASE_URL}/admin/cluster/repo/${created.id}`, null, h)
    check(delRes, {
      'delete repo 200': r => r.status === 200,
      'delete repo successful': r => JSON.parse(r.body).successful === true,
    })
  }

  sleep(1)
}
