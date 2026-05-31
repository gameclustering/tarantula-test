# tarantula-test

k6 test suite for the Tarantula game clustering platform — smoke, integration, and load tests targeting deployed app repos.

## Requirements

- [k6](https://k6.io/docs/get-started/installation/) v0.50+

## Structure

```
lib/            # shared helpers (login, auth headers, base URL)
smoke/          # quick sanity checks — is the service alive?
integration/    # API flow tests — create/list/delete repos, issue tasks
load/           # sustained and spike load scenarios
```

## Running

All scripts read `BASE_URL`, `ADMIN_USER`, and `ADMIN_PASS` from environment variables.

```bash
# Smoke — 1 VU, 1 iteration
k6 run smoke/smoke.js \
  -e BASE_URL=http://192.168.1.11 \
  -e ADMIN_USER=root \
  -e ADMIN_PASS=password123

# Integration — full repo CRUD flow
k6 run integration/cluster.js \
  -e BASE_URL=http://192.168.1.11 \
  -e ADMIN_USER=root \
  -e ADMIN_PASS=password123

# Load — ramp to 50 VUs over 4 minutes
k6 run load/load.js \
  -e BASE_URL=http://192.168.1.11 \
  -e ADMIN_USER=root \
  -e ADMIN_PASS=password123
```

## Thresholds

| Suite | Threshold |
|---|---|
| Smoke | 0% errors, p95 < 2s |
| Integration | 0% errors, p95 < 3s |
| Load | <1% errors, p95 < 1s |

## License

Apache 2.0 — see [LICENSE](LICENSE).
