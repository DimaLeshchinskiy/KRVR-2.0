echo y | rmdir .\\KRVRSW\\src\\main\\resources\\static\\ /s
echo y | Xcopy .\\KRVRJS\\build .\\KRVRSW\\src\\main\\resources\\static\\ /E /H /C /I
cd ./KRVRSW
mvn clean install
