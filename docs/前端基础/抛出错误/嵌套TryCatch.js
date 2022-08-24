try{

    test()
  }catch(error){
    console.error('外部:'+ error);
  }
  
  function test(){
    try {
        throw "err"; // generates an exception
      }
      catch (e) {
          return e
      }
  }