var a=11;
function test2(){
  this.a=22;
  let b=()=>{console.log(this.a)}
  let c=function(){console.log(this.a)}

  b();
  c()
}
var x=new test2();
//输出22
