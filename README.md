# CipherStack

CipherStack is a polished cipher-composition studio built with vanilla HTML, CSS, JavaScript, and a small Node.js server. It lets you chain multiple classical and utility ciphers into a single pipeline, configure each stage, switch between encrypt/decrypt modes, and inspect every transformation step in a visual interface.

## Highlights

- Drag-and-drop pipeline builder for composing cipher chains
- Encrypt and decrypt modes with live pipeline execution
- Step-by-step transform log for each stage in the chain
- Import/export pipeline JSON for sharing saved setups
- Responsive UI with a premium editorial-style frontend
- Zero frontend frameworks and no external runtime dependencies

## Included Ciphers

- Caesar Cipher
- XOR Cipher
- Vigenere
- Rail Fence
- Columnar Transposition
- Atbash
- Base64
- Reverse String
- Substitution

## Tech Stack

- Frontend: vanilla HTML, CSS, JavaScript
- Backend: Node.js HTTP server
- Deployment: works locally and on platforms like Railway

## Requirements

- Node.js 14 or newer
- npm
- A modern browser such as Chrome, Edge, or Firefox

Optional:

- Railway account for deployment
- GitHub repository for version control and Railway integration

## Models Used

This project itself does not require any LLM or AI model to run.

For development assistance and frontend iteration, the interface and code updates were created with help from:

- OpenAI Codex
- GPT-5-based coding assistance in the Codex environment

## Project Structure

```text
vyrothoncodex/
|-- public/
|   |-- index.html
|   |-- style.css
|   `-- app.js
|-- server.js
|-- package.json
`-- README.md
```

## Run Locally

Start the app:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

If you are iterating on the UI, this server is configured to avoid asset caching so CSS/JS changes show up immediately after a refresh.

## How to Use

1. Add ciphers from the library by clicking or dragging them into the pipeline.
2. Reorder stages with drag-and-drop.
3. Configure any stage that exposes settings.
4. Enter input text in the input panel.
5. Run the pipeline in encrypt or decrypt mode.
6. Review the transform log on the right.
7. Export the pipeline to JSON or import a saved one later.

## Deployment

This project is simple to deploy because it uses a single Node server.

### Railway

1. Push the project to GitHub.
2. Create a new Railway project.
3. Connect the GitHub repository.
4. Railway will detect the Node app automatically.
5. Deploy using the existing `npm start` script.

Environment variable:

- `PORT`: supplied automatically by Railway in production, defaults to `3000` locally

## Notes

- The app currently serves static assets from the `public/` folder.
- The local server uses `no-store` cache headers to make frontend iteration easier.
- The project is intentionally lightweight and framework-free.

## License

MIT
