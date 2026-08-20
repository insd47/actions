# Actions

Focused utility actions for GitHub workflows.

| Action                    | Purpose                                                                  |
| ------------------------- | ------------------------------------------------------------------------ |
| [`semver`](semver/)       | Validates and normalizes one complete Semantic Version value.            |
| [`temp-file`](temp-file/) | Writes raw content to an isolated temporary file and removes it in Post. |

## Usage

```yaml
- name: Resolve release version
  id: version
  uses: insd47/actions/semver@v2
  with:
    version: ${{ github.ref_name }}

- name: Prepare a temporary file
  id: temporary
  uses: insd47/actions/temp-file@v2
  with:
    path: config/example.json
    content: |
      {"version": ${{ toJSON(steps.version.outputs.version) }}}
```

Each Action documents its own inputs, outputs, and lifecycle guarantees in its directory.

## Development

```bash
corepack enable
pnpm install
pnpm check
pnpm build
```

Source changes must include the corresponding committed `dist` bundle.

## License

[MIT](LICENSE)
