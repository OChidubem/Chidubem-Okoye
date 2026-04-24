# Orchid Messages

An iMessage-inspired encrypted messaging experience with a polished Apple-style interface.

## What this build includes

- **End-to-end encryption demo flow** in-browser using:
  - ECDH (`P-256`) for key agreement.
  - AES-256-GCM for message encryption/decryption.
- **Modern, premium UI** with blur-glass panels, gradients, and responsive layout.
- **Conversation UX** with contacts list, bubble chat stream, and quick composer.
- **Device identity controls** to regenerate keys and clear threads.

## Run locally

Because the app uses JavaScript modules, serve files over HTTP:

```bash
python3 -m http.server 4173
```

Then open:

- `http://localhost:4173/index.html`

## Security notes

This project is a **high-fidelity prototype** for UX + cryptography mechanics, not production-ready infrastructure.
To reach Apple-grade production standards, you would still need:

- Strong identity/authentication service and key transparency.
- Secure key backup/recovery strategy.
- Multi-device session protocol and forward secrecy ratchets.
- Metadata minimization, abuse controls, audits, and formal review.
