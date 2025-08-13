# KP-generator

## Updating html2pdf.js integrity hash

When updating the html2pdf.js version or the bundled file:

1. **Download the script**
   ```bash
   curl -sSLO https://cdn.jsdelivr.net/npm/html2pdf.js@<version>/dist/html2pdf.bundle.min.js
   ```
2. **Compute the SRI hash** (SHA384)
   ```bash
   openssl dgst -sha384 -binary html2pdf.bundle.min.js | openssl base64 -A
   ```
3. **Update `index.html`**
   - Replace the `integrity` attribute value with the new hash
   - Commit the updated `html2pdf.bundle.min.js` file for local fallback

This ensures that the CDN resource is verified and a local fallback is available if the CDN fails to load.

