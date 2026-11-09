@echo off
chcp 65001 > nul
echo ====================================================
echo  スムーズ乗換 Navi (SmoothNavi) ローカルサーバー
echo ====================================================
echo.
echo ブラウザで以下のURLを開いてください:
echo http://localhost:8000
echo.
echo (同じWi-Fiに接続したスマホからアクセスする場合は、
echo  PCのローカルIPアドレス:8000 を入力してください)
echo.
echo ※ 終了するには、このウィンドウで Ctrl + C を押してください。
echo.
python -m http.server 8000
pause
