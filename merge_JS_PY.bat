cd ./KRVRJS
start /separate /wait cmd /c npm run build
cd ..

echo y | rmdir .\\KRVRSW\\public\\ /s
echo y | Xcopy .\\KRVRJS\\build .\\KRVRSW\\public\\ /E /H /C /I