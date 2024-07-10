
export let activeEffect = void (0);
export class ReactiveEffect {
    constructor(private fn) {

    }
    //给effect设置一个父effect
    parent = void (0);
    //记录依赖了哪些列表
    deps = []
    run() {
        try {
            this.parent = activeEffect
            activeEffect = this
            return this.fn()
        } finally {
            activeEffect = this.parent;
            this.parent = void (0);
        }
    }
}
export function effect(fn) {
    //创建一个响应式effect,并让effect执行fn
    const _effect = new ReactiveEffect(fn)
    _effect.run()
}

const targetMap = new WeakMap()
export function track(target, key) {
    if (activeEffect) {
        //说明用户是在effect中使用的这个数据
        let depsMap = targetMap.get(target);
        //获取代理对象，判断映射表中有没有代理对象
        if (!depsMap) {
            targetMap.set(target, depsMap = new Map())
        }
        //如果有这个映射表查找一下有没有这个属性
        let dep = depsMap.get(key)
        //如果没有set集合创建集合
        if (!dep) {
            depsMap.set(key, (dep = new Set()))
        }
        //如果有则看一下set中有没有这个effect
        let shouldTrack = !dep.has(activeEffect);
        if (shouldTrack) {
            dep.add(activeEffect)
            activeEffect.deps.push(dep)
        }

    }

}
export function trigger(target, key, value, oldvalue) {
    //通过对象找到对应的属性，让这个属性对应的effect重新执行
    const depsMap = targetMap.get(target)
    if (!depsMap) return;
    //name或者age对应所有的effect
    const dep = depsMap.get(key)
    dep && dep.forEach(effect => {
        //如果当前的effect和activeEffect相同，则不执行
        //正在执行的effect不要再次执行
        if (effect !== activeEffect) effect.run()

    })
}