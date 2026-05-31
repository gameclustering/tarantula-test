# tarantula-test

Test suite for the Tarantula game clustering platform — integration tests, load tests, and smoke tests targeting deployed app repos.

## Purpose

This repo is used as a `RepoObject` with type `test` in the Tarantula task flow. When a cluster task is issued, the test runner is cloned and executed against the deployed app instance.

## Test Types

| Type | Description |
|---|---|
| **Smoke** | Quick sanity checks — verify the app is up and key endpoints respond |
| **Integration** | End-to-end API and service interaction tests |
| **Load** | Performance and concurrency tests under sustained or spike traffic |

## Structure

```
smoke/        # smoke tests
integration/  # integration tests
load/         # load / performance tests
```

## License

Apache 2.0 — see [LICENSE](LICENSE).
