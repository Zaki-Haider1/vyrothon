# CipherStack — Cascade Encryption Builder

A modular cipher pipeline application that allows you to chain multiple encryption/decryption algorithms together to create complex encryption workflows.

## Project Structure

```
cipherstack/
├── public/
│   ├── index.html       # Main HTML document
│   ├── style.css        # All styling
│   └── app.js          # All application logic
├── server.js           # Node.js HTTP server
├── package.json        # Project metadata & dependencies
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Features

- **9 Cipher Algorithms**: Caesar, XOR, Vigenere, Rail Fence, Columnar Transposition, Atbash, Base64, Reverse, Substitution
- **Pipeline Builder**: Chain multiple ciphers together for complex encryption
- **Encrypt/Decrypt Modes**: Switch between encryption and decryption workflows
- **Interactive UI**: Real-time configuration and visualization
- **Import/Export**: Save and load cipher pipelines as JSON
- **Step-by-Step Logging**: View each transformation in the pipeline

## Installation

```bash
# Clone or extract the project
cd cipherstack

# Install dependencies (if any are added in future)
npm install
```

## Running Locally

```bash
# Start the server
npm start

# The app will be available at http://localhost:3000
```

## Deploying to Railway

1. **Create a Railway Account**: Visit [railway.app](https://railway.app)

2. **Connect Your Repository**:
   - Push this project to GitHub
   - Create a new project in Railway
   - Connect to your GitHub repository

3. **Railway Configuration**:
   - Railway automatically detects Node.js projects
   - The `start` script in `package.json` will be used
   - Environment variable: `PORT` is automatically set

4. **Deploy**:
   - Push changes to your repository
   - Railway will automatically deploy on push
   - Your app will be live at the provided Railway URL

## How to Use

1. **Add Ciphers**: Click any cipher from the Cipher Library (left panel) to add it to your pipeline
2. **Configure**: Expand each node and adjust settings (key, shift amount, etc.)
3. **Run Pipeline**: Enter your plaintext, click the Encrypt button, and see results
4. **View Logs**: Check the right panel to see step-by-step transformations
5. **Export**: Click "Export" to save your pipeline configuration
6. **Import**: Click "Import" to load a saved pipeline

## Environment Variables

- `PORT` (default: 3000): Port for the server to listen on

## Technologies

- **Frontend**: Vanilla JavaScript, HTML, CSS Grid
- **Backend**: Node.js (native HTTP module)
- **No external dependencies**: Everything runs in vanilla JS for minimal bundle size

## License

MIT
