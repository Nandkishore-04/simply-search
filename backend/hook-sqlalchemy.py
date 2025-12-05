# PyInstaller hook for SQLAlchemy
from PyInstaller.utils.hooks import collect_submodules, collect_data_files

# Collect all sqlalchemy submodules
hiddenimports = collect_submodules('sqlalchemy')

# Collect data files if any
datas = collect_data_files('sqlalchemy')
