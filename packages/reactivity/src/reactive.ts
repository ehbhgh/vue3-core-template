import { isObject } from "@vue/shared";
import { mutableHandler } from "./handler";

const reactMap=new WeakMap();
export const enum ReactiveFlags {
    IS_REACTIVE="__v_isReactive",

}
export function reactive(target: object) {
    //reactive函数只处理对象类型的数据，不是对象不处理
    if (!isObject(target)) return target;

    //看一下对象是否有被代理过，如果有直接返回
    let existProxy = reactMap.get(target);
    //存在就返回
    if(existProxy) return existProxy;


    //判断
    if(target[ReactiveFlags.IS_REACTIVE]) return target;
    //创建一个代理对象
    const proxy = new Proxy(target,
        mutableHandler
    )
    
    //将代理对象和原始数据建立映射关系,缓存代理结果
    reactMap.set(target, proxy);

    
    return proxy;

}


