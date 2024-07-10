import { ReactiveFlags } from "./reactive";

export const mutableHandler = {
    get(target, key, receiver) {
        
        if(key===ReactiveFlags.IS_REACTIVE) return true;
        //取值的时候根据原对象的key返回对应的value
        //使用proxy的时候要搭配reflect来使用解决this问题
        //取值的时候，让这个属性和effect产生关系，让effect收集这个属性
        return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
        //更新的时候，找到对应的effect，执行effect
        Reflect.set(target, key, value, receiver)
        return true;
    }
}