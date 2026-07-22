# Final HEAD, Pipeline, and Release

| Item | Value |
|---|---|
| Backend branch | `main` |
| Final commit | `9c7bedac1aa10430501bde51b75b2fb568df9afc` |
| GitHub `main` | same commit |
| GitLab `main` | same commit |
| GitLab main pipeline | `2698077013` |
| GitLab tag pipeline | `2698112641` |
| Pipeline status | `success` |
| Successful jobs | 5/5 in each pipeline |
| GitHub Actions | `29946417773` / `success` |
| Private tag | `v1.0.0-qa.s2.2` |
| Tag target | final commit |
| Private release | https://gitlab.com/jf.aschenbrenner/escalalivre-backend/-/releases/v1.0.0-qa.s2.2 |

The GitLab tag is annotated; dereferencing `refs/tags/v1.0.0-qa.s2.2^{}` resolves to the final commit above. The prior `v1.0.0-qa.s2.1` release was not modified.

Result: `FINAL_HEAD_PIPELINE_RELEASE: PASS`.
