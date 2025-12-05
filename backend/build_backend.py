"""
Build script for creating standalone backend executable using PyInstaller
"""
import os
import sys
import subprocess
from pathlib import Path

def build_backend():
    """Build the backend executable using PyInstaller"""
    print("=" * 60)
    print("Building Motorcycle Parts Backend Executable")
    print("=" * 60)
    
    # Get the directory containing this script
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Check if PyInstaller is installed
    try:
        import PyInstaller
        print(f"✓ PyInstaller {PyInstaller.__version__} found")
    except ImportError:
        print("✗ PyInstaller not found. Installing...")
        subprocess.run([sys.executable, "-m", "pip", "install", "pyinstaller"], check=True)
        print("✓ PyInstaller installed")
    
    # Run PyInstaller with the spec file
    print("\nBuilding executable...")
    spec_file = script_dir / "backend.spec"
    
    if not spec_file.exists():
        print(f"✗ Spec file not found: {spec_file}")
        return False
    
    try:
        subprocess.run(
            [sys.executable, "-m", "PyInstaller", str(spec_file), "--clean"],
            check=True
        )
        print("\n" + "=" * 60)
        print("✓ Build successful!")
        print("=" * 60)
        
        exe_path = script_dir / "dist" / "MotorcyclePartsBackend.exe"
        if exe_path.exists():
            size_mb = exe_path.stat().st_size / (1024 * 1024)
            print(f"\nExecutable created: {exe_path}")
            print(f"Size: {size_mb:.2f} MB")
            print("\nYou can test it by running:")
            print(f"  {exe_path}")
        else:
            print("\n✗ Executable not found in expected location")
            return False
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"\n✗ Build failed: {e}")
        return False

if __name__ == "__main__":
    success = build_backend()
    sys.exit(0 if success else 1)
