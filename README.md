# KP-generator

## Authentication

This version uses a minimal authentication server with hashed passwords.

### Start the server

```bash
node server.js
```

The server verifies credentials using Node's `crypto.scrypt` hashing and responds with a session token and public user data.

### Run the client

Open `index.html` in your browser and log in with one of the demo accounts:

- **admin / admin123**
- **manager / manager123**

Only non-sensitive session data (token and user profile) is stored in `sessionStorage`. Passwords are never saved on the client.

Use the logout button to clear the session data.

