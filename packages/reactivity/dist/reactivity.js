// packages/shared/src/index.ts
var isObject = (val) => val !== null && typeof val === "object";

// packages/reactivity/src/effect.ts
var activeEffect = void 0;
var ReactiveEffect = class {
  constructor(fn) {
    this.fn = fn;
    //给effect设置一个父effect
    this.parent = void 0;
    //记录依赖了哪些列表
    this.deps = [];
  }
  run() {
    try {
      this.parent = activeEffect;
      activeEffect = this;
      return this.fn();
    } finally {
      activeEffect = this.parent;
      this.parent = void 0;
    }
  }
};
function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
var targetMap = /* @__PURE__ */ new WeakMap();
function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = /* @__PURE__ */ new Set());
    }
    let shouldTrack = !dep.has(activeEffect);
    if (shouldTrack) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
  }
}
function trigger(target, key, value, oldvalue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  dep && dep.forEach((effect2) => {
    effect2.run();
  });
}

// packages/reactivity/src/handler.ts
var mutableHandler = {
  get(target, key, receiver) {
    if (key === "__v_isReactive" /* IS_REACTIVE */) return true;
    const res = Reflect.get(target, key, receiver);
    track(target, key);
    return res;
  },
  set(target, key, value, receiver) {
    let oldvalue = target[key];
    let r = Reflect.set(target, key, value, receiver);
    if (oldvalue != value) {
      trigger(target, key, value, oldvalue);
    }
    return r;
  }
};

// packages/reactivity/src/reactive.ts
var reactMap = /* @__PURE__ */ new WeakMap();
var ReactiveFlags = /* @__PURE__ */ ((ReactiveFlags2) => {
  ReactiveFlags2["IS_REACTIVE"] = "__v_isReactive";
  return ReactiveFlags2;
})(ReactiveFlags || {});
function reactive(target) {
  if (!isObject(target)) return target;
  let existProxy = reactMap.get(target);
  if (existProxy) return existProxy;
  if (target["__v_isReactive" /* IS_REACTIVE */]) return target;
  const proxy = new Proxy(
    target,
    mutableHandler
  );
  reactMap.set(target, proxy);
  return proxy;
}
export {
  ReactiveEffect,
  ReactiveFlags,
  activeEffect,
  effect,
  reactive,
  track,
  trigger
};
//# sourceMappingURL=reactivity.js.map
