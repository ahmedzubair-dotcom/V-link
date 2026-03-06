@echo off
echo ==========================================
echo    V-LINK Azure Kudu Deployment Builder
echo ==========================================

echo [1/4] Installing Frontend Dependencies...
cd frontend
call npm install

echo [2/4] Building Vite Frontend for Production...
call npm run build

echo [3/4] Packaging inside Backend for Kudu...
cd ..
if not exist backend\public mkdir backend\public
xcopy /s /e /y frontend\dist\* backend\public\

echo [4/4] Generating deployment zip...
cd backend
REM Removing any old node_modules so the zip isn't massive (Kudu installs them automatically)
if exist node_modules rmdir /s /q node_modules
powershell -Command "Compress-Archive -Path * -DestinationPath ..\vlink-azure-kudu-deploy.zip -Force"

cd ..
echo ==========================================
echo SUCCESS! vlink-azure-kudu-deploy.zip created.
echo Upload this zip file directly to Azure App Service!
echo ==========================================
