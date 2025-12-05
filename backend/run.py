import uvicorn
import sys
import logging
from pathlib import Path
from app.config import get_settings, get_logs_path, get_database_path
from app.main import app  # Import app directly for PyInstaller compatibility

# Configure logging
settings = get_settings()
log_dir = Path(get_logs_path())
log_file = log_dir / "backend.log"

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Starting Motorcycle Parts Inventory Backend")
    logger.info(f"Database location: {get_database_path()}")
    logger.info(f"Logs location: {log_file}")
    
    try:
        # Use app object directly instead of string for PyInstaller compatibility
        uvicorn.run(
            app,  # Direct reference instead of "app.main:app"
            host=settings.API_HOST,
            port=settings.API_PORT,
            reload=False,  # Disabled for production
            log_level="info"
        )
    except Exception as e:
        logger.error(f"Failed to start backend: {e}")
        sys.exit(1)
