# 🚀 Quick Start - Running the Roadmap API

## Start the Server

**Option 1: PowerShell (Recommended)**
```powershell
cd E:\rp\backend
$env:PYTHONPATH="E:\rp\backend"
python -m uvicorn api.main:app --reload
```

**Option 2: Use the startup script**
```powershell
cd E:\rp\backend
powershell -ExecutionPolicy Bypass -File start_server.ps1
```

**Option 3: Batch file (Windows)**
```cmd
cd E:\rp\backend
start_server.bat
```

---

## Wait for Server to Load

You'll see these messages:
```
Loading embedding model: nomic-ai/nomic-embed-text-v1.5...
✅ Embedding model loaded
🤖 LLM Client initialized
INFO: Application startup complete  ← Server is ready!
```

This takes **10-15 seconds**. Wait until you see "Application startup complete".

---

## Test the API

**In a NEW terminal** (keep the server running):

```powershell
cd E:\rp\backend
python scripts/test_roadmap_api.py
```

OR test the demo without server:

```powershell
cd E:\rp\backend
python scripts/demo_roadmap_system.py
```

---

## API Endpoints

Once server is running:

- **Health Check**: http://127.0.0.1:8000/roadmap/health
- **Generate Roadmap**: POST http://127.0.0.1:8000/roadmap/generate
- **API Docs**: http://127.0.0.1:8000/docs

---

## Troubleshooting

### "ModuleNotFoundError: No module named 'api'"
**Solution**: Make sure `PYTHONPATH` is set:
```powershell
$env:PYTHONPATH="E:\rp\backend"
```

### "Could not connect to API"
**Solution**: Check that server is running and shows "Application startup complete"

### Server takes long to start
**Normal**: Loading embedding model takes 10-15 seconds on first startup

---

## Stopping the Server

Press **CTRL+C** in the server terminal

---

## Quick Test (No Server Needed)

```powershell
cd E:\rp\backend
python scripts/demo_roadmap_system.py
```

This runs the roadmap generation locally without needing the API server.
