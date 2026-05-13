@echo off
chcp 65001 > nul
echo.
echo  =====================================================
echo   Java Portal — Образовательная платформа
echo  =====================================================
echo.
echo  Запускаем Spring Boot сервер...
echo  После запуска откройте браузер: http://localhost:8080
echo.
cd /d "%~dp0"
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dfile.encoding=UTF-8 -Dstdout.encoding=UTF-8"
pause
