cd ./KRVRJS
start /separate /wait cmd /c npm run build
cd ..

echo y | rmdir .\\KRVRSW3\\public\\ /s
echo y | Xcopy .\\KRVRJS\\build .\\KRVRSW3\\public\\ /E /H /C /I