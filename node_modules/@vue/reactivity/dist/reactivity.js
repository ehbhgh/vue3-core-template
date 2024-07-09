// packages/shared/src/index.ts
var isObject = (val) => val !== null && typeof val === "object";

// packages/reactivity/src/index.ts
var flag = isObject({ name: "ws" });
console.log(flag);
//# sourceMappingURL=reactivity.js.map
