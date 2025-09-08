const {exec}=require('child_process');
const { stdout, stderr } = require('process');
function  runCProgram(inputs,callback)
{
    const command='./program ${input}'
    exec(command,(error,stdout,stderr)=>
    {
        if(error)
        {
            console.error(`error: ${error.message}`);
            callback('error:${error.message}');
            return;
        }
        if(stderr)
        {
     console.error("C Program Error:", stderr);
      callback(`Error: ${stderr}`);
      return;
        }
        else
        {
            callback(stdout.trim());
        }

    });
    module.exports = { runCProgram };

}