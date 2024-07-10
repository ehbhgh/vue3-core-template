// packages/shared/src/index.ts
var isObject = (val) => val !== null && typeof val === "object";

// packages/reactivity/src/handler.ts
var mutableHandler = {
  get(target, key, receiver) {
    console.log(key);
    if (key === "__v_isReactive" /* IS_REACTIVE */) return true;
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    Reflect.set(target, key, value, receiver);
    return true;
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
  console.log(target["__v_isReactive" /* IS_REACTIVE */]);
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
  ReactiveFlags,
  reactive
};
//# sourceMappingURL=reactivity.js.map
