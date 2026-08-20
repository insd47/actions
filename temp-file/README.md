# Temporary File Action

Write raw content to a uniquely isolated temporary file, expose its absolute path to later steps in the same job, and
remove its entire temporary directory in the job Post phase.

## Usage

```yaml
- name: Prepare Artifact Signing metadata
  id: metadata
  uses: insd47/actions/temp-file@v1
  with:
    path: artifact-signing.json
    content: |
      {
        "Endpoint": "https://krc.codesigning.azure.net/",
        "CodeSigningAccountName": "KITPA",
        "CertificateProfileName": ${{ toJSON(inputs.certificate-profile) }},
        "ExcludeCredentials": [
          "EnvironmentCredential",
          "WorkloadIdentityCredential",
          "ManagedIdentityCredential"
        ]
      }

- name: Sign an artifact
  run: winapp az-sign application.exe --metadata-file "${{ steps.metadata.outputs.path }}"
```

The `path` input is relative to a newly created `RUNNER_TEMP/temp-file-*` directory. Nested paths are allowed, while
absolute paths and traversal outside that directory are rejected. The Action writes UTF-8 without a BOM, uses mode
`0600` on POSIX, and never overwrites an existing file.

The `content` input is written exactly as received, including leading, trailing, and multiline whitespace. Use YAML's
`|-` block form when the file must not end in a newline. Dynamic JSON string values should use `toJSON(...)` so quotes
and control characters remain valid JSON.

## Outputs

| Output | Description                                              |
| ------ | -------------------------------------------------------- |
| `path` | Absolute path of the temporary file for the current job. |

The Post cleanup is idempotent but, like every GitHub Action Post step, cannot run after abrupt runner termination.
