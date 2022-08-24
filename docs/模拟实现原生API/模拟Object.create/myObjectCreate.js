function myCreateObject(o){
	function F(){}
	F.prototype = o;//重写F的原型，将他指向传入的o，这就相当于继承自o
	return new F();//new里面就会把实例的__proto__指向F.prototype，达到和Object.create一样的效果
}