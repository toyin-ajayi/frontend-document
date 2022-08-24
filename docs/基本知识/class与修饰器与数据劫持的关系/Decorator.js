//Decorators是什么Decorators可以改变类方法和类实例字段的属性和行为，使我们可以灵活地使用更简单的语法动态实现这些内容，是非侵入式的。---举例，你给手机添加一个外壳罢了，并不影响手机原有的通话、充电等功能
//原理 Decorators的本质是利用了ES5的Object.defineProperty属性，这三个参数其实是和Object.defineProperty参数一致的，因此不能更改



class User {
    constructor( firstname, lastName ) {
        this.firstname = firstname;
        this.lastName = lastName;
    }
    
    @readonly
    getFullName() {
        return this.firstname + ' ' + this.lastName;
    }
  }
  // create instance
  let user = new User( 'John', 'Doe' );
  console.log( user.getFullName() );
  
  // 某天我不小心重写了这个方法
  User.prototype.getFullName = function() {
    return 'HACKED!';
  }
  
  // 输出 HACKED! 与预期不符，怎么避免此类情况发生
  
  // 方法1 这是最好的解决方案么？修饰器登场
  Object.defineProperty( User.prototype, 'getFullName', {
    writable: false
  });
  
  
  // 方法2
  
  // 将此方法添加到修饰方法getFullName上
  function readonly( target, property, descriptor ) {
    descriptor.writable = false;
    return descriptor;
  }

 // 类似于
 Object.defineProperty(User.prototype, 'getFullName', descriptor);