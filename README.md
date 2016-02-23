##Test Project
Setting up a Babylon js app with Typescript in Visual Studio Code  
adding definitely typed manager to project and add babylon.d.ts:   
npm install tsd -g  
tsd init  
tsd install babylon -s
add "typings/tsd.d.ts" to files in tsconfig.json  
   
   
when adding --watch as arg in tasks.json it will always look for changes and compile typescript, if not you have to hit ctrl+shift+b


