"""
Automatic database backup utility
Creates daily backups of the SQLite database
"""
import os
import shutil
from datetime import datetime
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


def get_backup_directory():
    """Get or create the backup directory on Desktop for easy access"""
    # Use Desktop for easy user access
    desktop = Path.home() / "Desktop" / "MathajiBro_Backups"
    desktop.mkdir(parents=True, exist_ok=True)
    return desktop


def get_database_path():
    """Get the database file path"""
    appdata = os.getenv('APPDATA')
    if not appdata:
        appdata = os.path.expanduser('~')
    
    db_file = Path(appdata) / "MotorcycleParts" / "inventory.db"
    return db_file


def create_backup():
    """Create a backup of the database with timestamp"""
    try:
        db_path = get_database_path()
        
        # Check if database exists
        if not db_path.exists():
            logger.warning("Database file not found, skipping backup")
            return None
        
        # Create backup directory
        backup_dir = get_backup_directory()
        
        # Generate backup filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_filename = f"inventory_backup_{timestamp}.db"
        backup_path = backup_dir / backup_filename
        
        # Copy database file
        shutil.copy2(db_path, backup_path)
        
        logger.info(f"Backup created successfully: {backup_path}")
        
        # Clean old backups (keep last 30 days)
        cleanup_old_backups(backup_dir, days_to_keep=30)
        
        return backup_path
        
    except Exception as e:
        logger.error(f"Failed to create backup: {e}")
        return None


def cleanup_old_backups(backup_dir, days_to_keep=30):
    """Remove backups older than specified days"""
    try:
        current_time = datetime.now()
        
        for backup_file in backup_dir.glob("inventory_backup_*.db"):
            # Get file modification time
            file_time = datetime.fromtimestamp(backup_file.stat().st_mtime)
            age_days = (current_time - file_time).days
            
            if age_days > days_to_keep:
                backup_file.unlink()
                logger.info(f"Removed old backup: {backup_file.name} (age: {age_days} days)")
                
    except Exception as e:
        logger.error(f"Failed to cleanup old backups: {e}")


def restore_backup(backup_filename):
    """Restore database from a backup file"""
    try:
        backup_dir = get_backup_directory()
        backup_path = backup_dir / backup_filename
        
        if not backup_path.exists():
            logger.error(f"Backup file not found: {backup_filename}")
            return False
        
        db_path = get_database_path()
        
        # Create a backup of current database before restoring
        if db_path.exists():
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            current_backup = db_path.parent / f"inventory_before_restore_{timestamp}.db"
            shutil.copy2(db_path, current_backup)
            logger.info(f"Current database backed up to: {current_backup}")
        
        # Restore from backup
        shutil.copy2(backup_path, db_path)
        logger.info(f"Database restored from: {backup_filename}")
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to restore backup: {e}")
        return False


def list_backups():
    """List all available backups"""
    try:
        backup_dir = get_backup_directory()
        backups = []
        
        for backup_file in sorted(backup_dir.glob("inventory_backup_*.db"), reverse=True):
            file_size = backup_file.stat().st_size / 1024  # KB
            file_time = datetime.fromtimestamp(backup_file.stat().st_mtime)
            
            backups.append({
                'filename': backup_file.name,
                'size_kb': round(file_size, 2),
                'created': file_time.strftime("%Y-%m-%d %H:%M:%S"),
                'path': str(backup_file)
            })
        
        return backups
        
    except Exception as e:
        logger.error(f"Failed to list backups: {e}")
        return []


if __name__ == "__main__":
    # Test backup functionality
    logging.basicConfig(level=logging.INFO)
    
    print("Creating backup...")
    backup_path = create_backup()
    
    if backup_path:
        print(f"✓ Backup created: {backup_path}")
    
    print("\nAvailable backups:")
    for backup in list_backups():
        print(f"  - {backup['filename']} ({backup['size_kb']} KB) - {backup['created']}")
