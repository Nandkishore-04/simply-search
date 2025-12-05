# Motorcycle Parts Inventory System - Backend

FastAPI-based REST API for motorcycle spare parts inventory management.

## Prerequisites

- Python 3.8+
- MySQL Server 8.0+
- pip (Python package manager)

## Installation

### 1. Set up MySQL Database

```powershell
# Connect to MySQL
mysql -u root -p

# Create the database
CREATE DATABASE motorcycle_parts CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit MySQL
exit
```

Or use the provided SQL file:
```powershell
mysql -u root -p < database_setup.sql
```

### 2. Install Python Dependencies

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/motorcycle_parts
API_HOST=127.0.0.1
API_PORT=8000
```

Replace `your_password` with your MySQL root password.

## Running the Application

### Development Mode

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python run.py
```

The API will be available at: `http://127.0.0.1:8000`
- API Documentation: `http://127.0.0.1:8000/docs`
- Alternative Docs: `http://127.0.0.1:8000/redoc`

### Production Mode (Windows Service with NSSM)

#### 1. Install NSSM
Download NSSM from: https://nssm.cc/download

#### 2. Create Windows Service

```powershell
# Navigate to NSSM directory
cd path\to\nssm\win64

# Install service
.\nssm.exe install MotorcyclePartsAPI

# Configure service in the GUI:
# Path: C:\Users\nkk01\Desktop\listing\backend\venv\Scripts\python.exe
# Startup directory: C:\Users\nkk01\Desktop\listing\backend
# Arguments: run.py

# Start the service
.\nssm.exe start MotorcyclePartsAPI
```

#### Service Management Commands

```powershell
# Check service status
.\nssm.exe status MotorcyclePartsAPI

# Stop service
.\nssm.exe stop MotorcyclePartsAPI

# Restart service
.\nssm.exe restart MotorcyclePartsAPI

# Remove service
.\nssm.exe remove MotorcyclePartsAPI confirm
```

## API Endpoints

### Products

- `GET /products/search?query={query}` - Global search
- `GET /products/by-bike?model={model}` - Search by bike model
- `GET /products/by-part-number?part_number={number}` - Search by part number
- `GET /products/{id}` - Get single product
- `POST /products` - Create new product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Health Check

- `GET /` - API status
- `GET /health` - Health check

## Database Schema

### Products Table

| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| product_name | String(255) | Product name |
| part_number | String(100) | Part number |
| bike_models | Text | Compatible bike models (comma-separated) |
| category | String(100) | Product category |
| brand | String(100) | Brand name |
| stock_quantity | Integer | Stock level |
| shelf_location | String(100) | Physical location |
| price | Decimal(10,2) | Product price |
| description | Text | Product description |
| created_at | DateTime | Creation timestamp |
| updated_at | DateTime | Last update timestamp |

## Troubleshooting

### Database Connection Issues

1. Verify MySQL is running:
```powershell
Get-Service MySQL*
```

2. Test connection:
```powershell
mysql -u root -p
```

3. Check credentials in `.env` file

### Port Already in Use

Change the port in `.env`:
```env
API_PORT=8001
```

### Module Import Errors

Reinstall dependencies:
```powershell
pip install -r requirements.txt --force-reinstall
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection
│   ├── models/
│   │   ├── __init__.py
│   │   └── product.py       # SQLAlchemy models
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── product.py       # Pydantic schemas
│   └── routes/
│       ├── __init__.py
│       └── products.py      # API endpoints
├── requirements.txt
├── .env.example
├── .env
└── run.py                   # Application entry point
```
