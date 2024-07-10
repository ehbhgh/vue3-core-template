import { ReactiveFlags } from "./reactive";
import { track, trigger } from "./effect";
export const mutableHandler = {
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) return true;
        //取值的时候根据原对象的key返回对应的value
        //使用proxy的时候要搭配reflect来使用解决this问题
        //取值的时候，让这个属性和effect产生关系，让effect收集这个属性
        const res = Reflect.get(target, key, receiver)
        //取值的时候让这个属性和effect产生关系，让effect收集这个属性
        track(target, key)

        return res
    },
    set(target, key, value, receiver) {
        //旧值
        let oldvalue = target[key]
        //新值
        let r = Reflect.set(target, key, value, receiver)
        if (oldvalue != value) {
            //更新的时候，找到对应的effect，执行effect
            trigger(target, key, value, oldvalue)
        }

        return r
    }
}