@echo off
chcp 65001 >nul
echo ========================================================
echo   DAY WEB TANG EM TRAI LUC THE ANH LEN GITHUB
echo ========================================================
echo.
echo 1. Hay tao 1 repository moi tren GitHub (https://github.com/new)
echo    - Dat ten Repository (vi du: tang-em-trai-the-anh)
echo    - Chon che do Public (Cong khai)
echo    - KHONG can tich chon Add README hay .gitignore
echo    - Nhan nut "Create repository"
echo.
echo 2. Dan link repository cua ban vao day (vi du: https://github.com/lucthuhue/tang-em-trai-the-anh.git):
set /p REPO_URL="Link Repository: "

if "%REPO_URL%"=="" (
    echo Khong duoc de trong link! Vui long chay lai file nay.
    pause
    exit /b
)

echo.
echo Dang ket noi va day len GitHub...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
git push -u origin main

echo.
echo ========================================================
echo DA DAY LEN GITHUB THANH CONG!
echo.
echo CAC BUOC DE LAY LINK WEB GUI CHO EM TRAI THE ANH:
echo 1. Vao trang repository cua ban tren GitHub
echo 2. Nhan vao tab "Settings" (Cai dat)
echo 3. Chon muc "Pages" o menu ben trai
echo 4. Tai muc "Branch", chon "main" va thu muc "/ (root)", sau do nhan "Save"
echo 5. Doi khoang 1-2 phut, GitHub se cung cap link web de gui cho The Anh!
echo ========================================================
pause
