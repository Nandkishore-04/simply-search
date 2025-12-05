from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from .routes.products import router as products_router
from .database import engine, Base
from .config import get_settings
from .backup import create_backup

settings = get_settings()
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create automatic backup
    logger.info("Application starting up...")
    try:
        backup_path = create_backup()
        if backup_path:
            logger.info(f"Automatic backup created: {backup_path}")
        else:
            logger.info("No backup created (database may not exist yet)")
    except Exception as e:
        logger.warning(f"Failed to create startup backup: {e}")
    
    yield
    
    # Shutdown
    logger.info("Application shutting down...")


app = FastAPI(
    title="Motorcycle Parts Inventory API",
    description="FastAPI backend for motorcycle spare parts inventory management",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for Electron app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify Electron app origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products_router)


@app.get("/")
def root():
    return {
        "message": "Motorcycle Parts Inventory API",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/backup/list")
def list_backups():
    """List all available backups"""
    from .backup import list_backups
    return {"backups": list_backups()}


@app.post("/backup/create")
def manual_backup():
    """Manually create a backup"""
    backup_path = create_backup()
    if backup_path:
        return {"success": True, "backup_path": str(backup_path)}
    return {"success": False, "message": "Failed to create backup"}
