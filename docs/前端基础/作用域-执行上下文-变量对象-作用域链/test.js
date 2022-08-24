function test(arg) {
  console.log(arg); // function arg(){console.log('hello world') }
  var arg = "hello";
  function arg() {
    console.log("hello world");
  }
  console.log(arg); // hello
}
test("hi");

var a = 20;

function test() {
    var b = 10;
   function innerTest() {
        var c = 10;
        return b + c;
   }
   innerTest()
    return b;
}

test();