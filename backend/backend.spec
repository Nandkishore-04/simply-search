# -*- mode: python ; coding: utf-8 -*-

import os
from pathlib import Path
from PyInstaller.utils.hooks import collect_all, collect_submodules, collect_data_files
from PyInstaller.building.build_main import Analysis, PYZ, EXE, COLLECT

# ----------------------------------------------------------------------
# 1️⃣  Hidden imports, data files, and binaries
# ----------------------------------------------------------------------
hiddenimports = [
    # Uvicorn
    "uvicorn.logging",
    "uvicorn.loops",
    "uvicorn.loops.auto",
    "uvicorn.protocols",
    "uvicorn.protocols.http",
    "uvicorn.protocols.http.auto",
    "uvicorn.protocols.websockets",
    "uvicorn.protocols.websockets.auto",
    "uvicorn.lifespan",
    "uvicorn.lifespan.on",
    # SQLAlchemy - Comprehensive imports
    "sqlalchemy",
    "sqlalchemy.ext.declarative",
    "sqlalchemy.ext.asyncio",
    "sqlalchemy.orm",
    "sqlalchemy.pool",
    "sqlalchemy.dialects",
    "sqlalchemy.dialects.sqlite",
    "sqlalchemy.sql",
    "sqlalchemy.sql.sqltypes",
    # Pydantic v2 - Critical imports
    "pydantic",
    "pydantic_core",
    "pydantic_settings",
    "pydantic.deprecated",
    "pydantic.json_schema",
    "pydantic.networks",
    "pydantic.types",
    "pydantic.v1",
    "pydantic_core._pydantic_core",
    "pydantic.annotated_handlers",
    "pydantic.functional_validators",
    "pydantic.functional_serializers",
    # Other
    "dotenv",
]

# Collect everything that `pydantic` needs (templates, validators, etc.)
# This returns (datas, binaries, hiddenimports)
_pyd_datas, _pyd_bins, _pyd_hidden = collect_all("pydantic")
hiddenimports += _pyd_hidden

# Also collect pydantic_core
_pyd_core_datas, _pyd_core_bins, _pyd_core_hidden = collect_all("pydantic_core")
hiddenimports += _pyd_core_hidden

# Also collect pydantic_settings
_pyd_settings_datas, _pyd_settings_bins, _pyd_settings_hidden = collect_all("pydantic_settings")
hiddenimports += _pyd_settings_hidden

# Collect ALL SQLAlchemy submodules recursively
hiddenimports += collect_submodules('sqlalchemy')
_sql_datas = collect_data_files('sqlalchemy')

datas = _pyd_datas + _pyd_core_datas + _pyd_settings_datas + _sql_datas
binaries = _pyd_bins + _pyd_core_bins + _pyd_settings_bins

# ----------------------------------------------------------------------
# 2️⃣  Analysis – entry point is run.py (your FastAPI backend)
# ----------------------------------------------------------------------
a = Analysis(
    ["run.py"],
    pathex=[os.path.abspath(".")],
    binaries=binaries,
    datas=[('app', 'app')] + datas,  # Include app directory explicitly
    hiddenimports=hiddenimports,
    hookspath=[os.path.abspath(".")],  # Include custom hooks directory
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=None,
    noarchive=False,
)

# ----------------------------------------------------------------------
# 3️⃣  Build the PYZ archive
# ----------------------------------------------------------------------
pyz = PYZ(a.pure, a.zipped_data, cipher=None)

# ----------------------------------------------------------------------
# 4️⃣  Create the executable – console=True for debugging
#    Icon support requires .ico format (PNG not supported by PyInstaller)
# ----------------------------------------------------------------------
exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name="MotorcyclePartsBackend",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,  # Set to True to see errors and logs
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    # Icon can be set here if you have an .ico file
    # icon=os.path.abspath("path/to/your/icon.ico"),
)

# ----------------------------------------------------------------------
# 5️⃣  Collect everything into the final folder
# ----------------------------------------------------------------------
coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name="MotorcyclePartsBackend",
)
