# Security Policy

## Supported Versions

| Version | Status |
|---------|--------|
| 0.2.x   | Active |
| 0.1.x   | Deprecated |

## Reporting a Vulnerability

Please report security vulnerabilities to **security@jellyos.com**.

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We aim to respond within 48 hours.

## Security Measures

JellyOS implements several security features:

- **Vault Encryption**: AES-256-GCM with Argon2id KDF
- **Private Key Storage**: Encrypted at rest, never in logs
- **API Key Protection**: Stored in `~/.jelly/.env` with 600 permissions
- **No Inbound Ports**: All connections are outbound
- **SSRF Protection**: Private host blocking in web_fetch tools

## Best Practices

1. Never commit `.env` or wallet files
2. Use strong passphrases for vault unlock
3. Enable 2FA on exchange accounts
4. Review code before running with real funds
5. Use sandbox wallets for testing