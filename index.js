var Class = function(argv, superFn) {
  var constructor = argv.initialize || function() {};

  if(superFn) {
    constructor.__super__ = superFn;

    //父构造函数会做什么事情，我们无法控制，所以不使用以下方法
    // constructor.prototype.constructor = constructor;
    //constructor.prototype = new superFn();

    //所有我们要使用如下方法，不跑父构造函数，直接将他实例化；
    //ctor现在是一个没有构造函数的父类，prototype与父类一致，constructor被换成了子类的构造函数；
    function ctor() { this.constructor = constructor; }
    ctor.prototype = superFn.prototype;
    constructor.prototype = new ctor;

    var current_class = constructor;

    constructor.prototype.super = function (fn) {
      current_class = current_class.__super__;
      //super 没有fn函数，所以要用一下别人的函数
      //arguments 不是Array，是object，需要用一下Array的函数slice还去掉第一个参数；
      var result = current_class.prototype[fn].apply(this, Array.prototype.slice.call(arguments, 1));
      current_class = constructor;
      return result;
    };

  } else {
    constructor.__super__ = Object;
  }


  for (var fn in argv) {
    if (fn != 'initialize') {
      constructor.prototype[fn] = argv[fn];
    }
  }

  return constructor;
}







exports = module.exports = Class;