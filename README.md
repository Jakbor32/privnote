# PrivNote

PrivNote is a secure application for creating and sharing self-destructing notes. The app uses strong encryption to protect your private messages and ensures they can only be read by the intended recipient. It is built using **Supabase**, **React**, **TypeScript**, **Vite**, **Tailwind CSS** and **Crypto-js**.

## Introduction

PrivNote allows users to create notes that automatically delete after being read. The application prioritizes security and privacy by implementing **AES-256 encryption** directly in the browser, ensuring that only the note's recipient can decrypt the content.

## Key Features

### End-to-End Encryption

- Notes are encrypted using AES-256 before being sent to the server.
- The encryption key is generated in the user's browser and appended as part of the URL fragment (`#`).
- **Example link:** https://privnote-app.vercel.app/e4e72e56-f03c-4a68-b63d-3dc601ee3ef8#49ae9a9aa4a10fbc606c328b33

### How It Works:

1. **Encryption (Client-Side):**

- A note like `"This is a secret message"` is encrypted in the browser with a randomly generated key using **AES-256** encryption.
- The encrypted note is then stored on the server, and the unique encryption key is appended to the URL.

2. **Decryption (Client-Side):**

- When the recipient opens the link, they provide the correct key from the URL (`#49ee9a9aa8a10fbc606c328b33`).
- The note is then decrypted in the browser and displayed to the user.
- **Without the correct key, the content remains inaccessible.**

### Example of Encrypted Note

- The note `"This is a secret message"` could appear as: U2FsdGVkX1/u0RGLs9IzD0UiOoK2ssrBAF5IDIx26aM=

This is the encrypted value stored in the database. Without the correct key, this cannot be decrypted.

### Why This is Secure:

- **AES-256** encryption is a strong encryption standard that is commonly used for sensitive data.
- The encryption key is generated **in the browser** and never sent to the server, ensuring the server has no access to the decrypted content.
- Even if someone gains access to the database, the encrypted note is useless without the decryption key, which only the recipient possesses.

## New Secure File Hosting up to 50MB

PrivNote is introducing a new feature that allows secure hosting of files up to 50 MB. Each file will be accessible via a unique, time-sensitive link generated with a JWT token, providing an additional layer of security and ensuring controlled access to shared files.

## Technologies

- **Supabase**
- **React**
- **Vite**
- **Tailwind CSS**
- **TypeScript**
- **Crypto-js**

### Live App

[https://privnote-app.vercel.app/](https://privnote-app.vercel.app/)
