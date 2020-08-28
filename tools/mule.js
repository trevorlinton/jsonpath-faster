"use strict";

const inspect = require("../lib/inspect");
const jp = require("..");

const addPragmas = (obj, pragmas, post) => {
  const nobj = { ...obj, pragmas: {} };

  const props = {};
  for (const pragma of pragmas) {
    props[pragma] = {
      configurable: true,
      get: function() {
        if (this.pragmas[pragma])
          return Object.defineProperty(this, pragma, { value: this });

        let value = addPragmas({ ...this }, pragmas);
        value.pragmas = { ...this.pragmas, [pragma]: true };
        if (post) value = post(value);
        Object.defineProperty(this, pragma, { value });
        return value;
      }
    };
  }

  return Object.defineProperties(nobj, props);
};

const base = {
  apply(obj) {
    console.log(inspect(this.pragmas));
  }
};

const obj = addPragmas(base, ["leaf", "interior"]);

obj.apply({});
obj.leaf.apply({});
obj.leaf.interior.apply({});
obj.interior.leaf.apply({});
obj.leaf.leaf.leaf.leaf.apply({});
