const Runner = require("run-my-sql-file");
 
Runner.connectionOptions({
   host:"localhost",
   port: 23306,
   user:"root",
   password:"supersecret"
});

const file1_path = __dirname + "/test.sql";
  
//IT WILL RUN THE FILE
Runner.runFile(file1_path, (err)=>{
   if(err){
      console.log(err);
   } else {
      console.log("Script sucessfully executed!");
   }
});
