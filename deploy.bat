
@echo off
mkdir deploy
xcopy good-svg-background.php ..\..\..\..\deploy\good-svg-background\trunk /I /Y
xcopy license ..\..\..\..\deploy\good-svg-background\trunk /I /Y
xcopy readme.txt ..\..\..\..\deploy\good-svg-background\trunk /I /Y
xcopy build ..\..\..\..\deploy\good-svg-background\trunk\build\* /e/y
xcopy languages ..\..\..\..\deploy\good-svg-background\trunk\languages\* /e/y
xcopy assets ..\..\..\..\deploy\good-svg-background\assets\* /e/y
