@echo off
chcp 65001 > nul
echo ====================================================
echo  スムーズ乗換 Navi - GitHub へのプッシュ
echo ====================================================
echo.
echo 1. GitHub (https://github.com/new) でリポジトリ名「train-car-navi」を作成してください。
echo    ※「Add a README file」のチェックは外した状態で作成してください。
echo.
echo 2. 準備ができたら、何かキーを押すと GitHub へプッシュを実行します。
echo.
pause
echo.
echo プッシュを実行中...
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ====================================================
    echo 【成功】GitHubへのアップロードが完了しました！
    echo 次は Vercel (https://vercel.com/new) で連携してデプロイしてください。
    echo ====================================================
) else (
    echo ====================================================
    echo 【失敗】プッシュに失敗しました。
    echo GitHub上で「train-car-navi」リポジトリが作成されているか、
    echo またはログイン状態を確認してください。
    echo ====================================================
)
echo.
pause
