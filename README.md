# Semantic Version Action

Validate a complete [Semantic Version 2.0.0](https://semver.org/) value while accepting the conventional lowercase `v` tag prefix.

## Usage

```yaml
- name: Resolve release version
  id: version
  uses: insd47/semver-action@v1
  with:
    version: ${{ github.ref_name }}

- name: Print release metadata
  run: |
    echo '${{ steps.version.outputs.version }}'
    echo '${{ steps.version.outputs.is-prerelease }}'
```

The action accepts both `1.2.3-beta.1` and `v1.2.3-beta.1`. It rejects partial versions, surrounding text, whitespace, uppercase `V`, and Git ref paths.

## Outputs

| Output          | Example                 |
| --------------- | ----------------------- |
| `version`       | `1.2.3-beta.1+build.42` |
| `major`         | `1`                     |
| `minor`         | `2`                     |
| `patch`         | `3`                     |
| `prerelease`    | `beta.1`                |
| `build`         | `build.42`              |
| `is-prerelease` | `true`                  |

## Tauri

The normalized version can be merged into the Tauri configuration without modifying a manifest:

```yaml
- uses: tauri-apps/tauri-action@v1
  with:
    tagName: ${{ github.ref_name }}
    releaseName: 'v__VERSION__'
    prerelease: ${{ steps.version.outputs.is-prerelease }}
    args: >-
      --config '{"version":"${{ steps.version.outputs.version }}"}'
      --target ${{ matrix.target }}
```

## Security

Pin the action to a full commit SHA when reproducible workflows matter. The floating `v1` tag receives compatible fixes.
