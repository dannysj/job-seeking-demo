const Follow = require("../model/Follow");


Follow.whetherFollowed(1,2).then(result=>{
  console.log(result)
});
