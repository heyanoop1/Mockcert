# Security

## Threat assumptions

This project handles public mock-exam content and administrative credentials. The operational assumption is that publicly reachable endpoints may be probed by automated scanners, malicious users, and malformed uploads.

## Secret handling

- Store secrets only in environment variables.
- Never commit real credentials or tokens to source control.
- Rotate admin credentials and signing secrets before production use.
- Validate environment variables at startup.

## Upload security

- Restrict file types to CSV and JSON.
- Enforce a max upload size.
- Validate file signatures and content before processing.
- Store uploads separately from source control and keep them out of the web root.
- Never execute content from uploaded files.

## Admin account recovery

- Use a controlled admin bootstrap via environment variables.
- Require strong passwords and administrative approval for recovery events.
- Log recovery/admin changes through audit records.

## Vulnerability reporting

Please report suspected vulnerabilities privately to the project maintainer and avoid publishing details until a patch is available.

## Production checklist

- Enable HTTPS and secure cookies.
- Restrict admin routes behind authentication and authorization.
- Apply rate limiting to public and import endpoints.
- Set strong CSP and security headers.
- Keep Prisma, Next.js, and OS packages updated.
- Monitor health and log suspicious access patterns.
