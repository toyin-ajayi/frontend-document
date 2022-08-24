class EventEmitter{
    constructor(){
        this._events  = this._events||new Map()
    }

    addEventListener(type,fn){
        if(this._events.has(type)){
            this._events.set(type,this._events.get(type).concat([fn]))
        }else{
            this._events.set(type,[fn])
        }
    }

    removeListen(type,fn){
        const events = this._events.get(type)
        const index = events.indexOf(fn)
        if(index!==-1){
            events.splice(index,1)
        }
    }

    emit(type,...arg){
        const events = this._events.get(type)
        if(events&&events.length>0){
            events.forEach((fn)=>{
                fn.apply(undefined,arg)
            })
        }

    }

    once(type,fn){
        let _this = this;
        function warp(...arg){
            fn.apply(undefined,arg)
            _this.removeListen(type,warp)
        }
        this.addEventListener(type,warp)
    }




}

const event = new EventEmitter()
event.addEventListener('click',function(x){
    console.log('click',x);
})
event.addEventListener('click',function(x){
    console.log('click2',x);
})
event.addEventListener('move',function(x){
    console.log('click2',x);
})
event.emit('click','123')
event.emit('move','1234')

function a(){
    console.log('a')
}
function b(){
    console.log('b')
}

event.addEventListener('do',a)
event.addEventListener('do',b)

event.emit('do')
event.removeListen('do',a)
event.emit('do')

console.log('___________________')
event.once('once',a)
event.once('once',a)
event.emit('once')