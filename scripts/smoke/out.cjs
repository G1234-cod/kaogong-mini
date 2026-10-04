"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// empty:../../assets/images/奶龙.png
var require__ = __commonJS({
  "empty:../../assets/images/\u5976\u9F99.png"() {
  }
});

// empty:../../assets/images/小兔.png
var require__2 = __commonJS({
  "empty:../../assets/images/\u5C0F\u5154.png"() {
  }
});

// empty:../../assets/images/猫.png
var require__3 = __commonJS({
  "empty:../../assets/images/\u732B.png"() {
  }
});

// scripts/smoke/entry.jsx
var import_react25 = __toESM(require("react"));
var import_server = require("react-dom/server");

// scripts/smoke/stubs.jsx
var import_react = __toESM(require("react"));

// src/types/index.ts
var DEFAULT_SETTINGS = {
  wake: "07:00",
  sleep: "23:30",
  meals: { breakfast: "08:00", lunch: "12:00", dinner: "18:30" },
  water: { intervalMin: 90, targetCups: 8 },
  city: { name: "\u8BB8\u660C", province: "\u6CB3\u5357", lat: 34.035, lon: 113.853 },
  intel: { enabled: true, tastes: [] }
};

// src/constants/foods.ts
var MEAL_SLOT_LABELS = {
  breakfast: "\u65E9\u9910",
  lunch: "\u5348\u9910",
  dinner: "\u665A\u9910",
  supper: "\u591C\u5BB5"
};
function f(name, emoji, slots, tags) {
  return { id: "food-" + name, name, emoji, slots, tags };
}
var B = "breakfast";
var L = "lunch";
var D = "dinner";
var S = "supper";
var DEFAULT_FOODS = [
  // ---------- 早餐 ----------
  f("\u80E1\u8FA3\u6C64+\u6CB9\u998D\u5934", "\u{1F963}", [B], ["\u9971\u8179"]),
  f("\u8C46\u8150\u8111+\u6CB9\u6761", "\u{1F963}", [B], ["\u6E05\u6DE1"]),
  f("\u5305\u5B50+\u8C46\u6D46", "\u{1F95F}", [B], ["\u5FEB\u9910"]),
  f("\u9E21\u86CB\u704C\u997C", "\u{1FAD3}", [B], ["\u5FEB\u9910"]),
  f("\u5C0F\u7C73\u7CA5+\u54B8\u83DC", "\u{1F963}", [B], ["\u6E05\u6DE1"]),
  f("\u516B\u5B9D\u7CA5", "\u{1F963}", [B], ["\u6E05\u6DE1"]),
  f("\u714E\u997C\u679C\u5B50", "\u{1F95E}", [B], ["\u5FEB\u9910", "\u9971\u8179"]),
  f("\u70E7\u997C\u5939\u83DC", "\u{1FAD3}", [B], ["\u5FEB\u9910"]),
  f("\u725B\u5976+\u9762\u5305", "\u{1F95B}", [B], ["\u6E05\u6DE1"]),
  f("\u8336\u53F6\u86CB+\u767D\u7CA5", "\u{1F95A}", [B], ["\u6E05\u6DE1"]),
  f("\u5C0F\u7B3C\u5305", "\u{1F95F}", [B, L], ["\u5FEB\u9910"]),
  f("\u6C34\u714E\u5305", "\u{1F95F}", [B], ["\u9971\u8179"]),
  f("\u6CB9\u6761+\u8C46\u6D46", "\u{1F956}", [B], ["\u5FEB\u9910"]),
  f("\u9984\u9968", "\u{1F372}", [B, S], ["\u6E05\u6DE1"]),
  f("\u70ED\u5E72\u9762", "\u{1F35C}", [B, L], ["\u9971\u8179"]),
  f("\u80A0\u7C89", "\u{1F365}", [B, L], ["\u6E05\u6DE1"]),
  f("\u7CA5\u94FA\u5957\u9910", "\u{1F963}", [B], ["\u6E05\u6DE1"]),
  f("\u4E09\u660E\u6CBB", "\u{1F96A}", [B, S], ["\u6E05\u6DE1", "\u5FEB\u9910"]),
  f("\u84B8\u997A", "\u{1F95F}", [B, S], ["\u6E05\u6DE1"]),
  f("\u7CD6\u7CD5\u83DC\u89D2", "\u{1F96F}", [B], ["\u5FEB\u9910"]),
  f("\u624B\u6293\u997C", "\u{1FAD3}", [B], ["\u5FEB\u9910"]),
  f("\u91AA\u7CDF\u86CB\u82B1\u6C64", "\u{1F372}", [B], ["\u6E05\u6DE1"]),
  f("\u9505\u76D4", "\u{1FAD3}", [B, L], ["\u9971\u8179"]),
  f("\u6742\u7CAE\u714E\u997C", "\u{1F95E}", [B], ["\u9971\u8179"]),
  f("\u80AF\u5FB7\u57FA\u65E9\u9910", "\u{1F373}", [B], ["\u5FEB\u9910"]),
  // ---------- 面食主食 ----------
  f("\u90D1\u5DDE\u70E9\u9762", "\u{1F35C}", [L, D], ["\u9971\u8179"]),
  f("\u7116\u9762", "\u{1F35C}", [L, D], ["\u9971\u8179"]),
  f("\u9978\u70D9\u9762", "\u{1F35C}", [L, D], ["\u9971\u8179"]),
  f("\u6D46\u9762\u6761", "\u{1F35C}", [L, D], ["\u6E05\u6DE1"]),
  f("\u5170\u5DDE\u62C9\u9762", "\u{1F35C}", [L, D], ["\u9971\u8179"]),
  f("\u5200\u524A\u9762", "\u{1F35C}", [L, D], ["\u9971\u8179"]),
  f("\u70ED\u5E72\u9762\uFF08\u5348\uFF09", "\u{1F35C}", [L], ["\u5FEB\u9910"]),
  f("\u70B8\u9171\u9762", "\u{1F35C}", [L, D], ["\u9971\u8179"]),
  f("\u91CD\u5E86\u5C0F\u9762", "\u{1F35C}", [L, D], ["\u8FA3", "\u9971\u8179"]),
  f("\u62C5\u62C5\u9762", "\u{1F35C}", [L, D], ["\u8FA3"]),
  f("\u9178\u8FA3\u7C89", "\u{1F372}", [L, D, S], ["\u8FA3"]),
  f("\u725B\u8089\u677F\u9762", "\u{1F35C}", [L, D], ["\u8FA3", "\u9971\u8179"]),
  f("\u6CB9\u6CFC\u9762", "\u{1F35C}", [L, D], ["\u8FA3", "\u9971\u8179"]),
  f("\u7092\u9762", "\u{1F35D}", [L, D], ["\u9971\u8179"]),
  f("\u76D6\u6D47\u996D", "\u{1F35A}", [L, D], ["\u9971\u8179"]),
  f("\u86CB\u7092\u996D", "\u{1F35A}", [L, S], ["\u5FEB\u9910"]),
  f("\u626C\u5DDE\u7092\u996D", "\u{1F35A}", [L, D], ["\u9971\u8179"]),
  f("\u7172\u4ED4\u996D", "\u{1F35A}", [L, D], ["\u9971\u8179"]),
  f("\u77F3\u9505\u62CC\u996D", "\u{1F35A}", [L, D], ["\u8FA3"]),
  f("\u97E9\u5F0F\u62CC\u996D", "\u{1F35A}", [L, D], ["\u8FA3"]),
  f("\u6728\u6876\u996D", "\u{1F35A}", [L, D], ["\u9971\u8179"]),
  f("\u7C73\u7EBF", "\u{1F372}", [L, D], []),
  f("\u87BA\u86F3\u7C89", "\u{1F372}", [L, D, S], ["\u8FA3"]),
  f("\u6842\u6797\u7C73\u7C89", "\u{1F372}", [L, D], ["\u6E05\u6DE1"]),
  f("\u5357\u660C\u62CC\u7C89", "\u{1F372}", [L, D], ["\u8FA3"]),
  f("\u80A0\u7C89\uFF08\u5348\uFF09", "\u{1F365}", [L], ["\u6E05\u6DE1"]),
  f("\u997A\u5B50", "\u{1F95F}", [L, D], ["\u9971\u8179"]),
  f("\u97ED\u83DC\u76D2\u5B50", "\u{1F95F}", [L], ["\u9971\u8179"]),
  f("\u751F\u714E\u5305", "\u{1F95F}", [L, S], ["\u5FEB\u9910"]),
  f("\u9984\u9968\uFF08\u6B63\u9910\uFF09", "\u{1F372}", [L, D], ["\u6E05\u6DE1"]),
  f("\u8089\u5939\u998D", "\u{1F959}", [L, D], ["\u5FEB\u9910", "\u9971\u8179"]),
  f("\u51C9\u76AE", "\u{1F957}", [L, D], ["\u6E05\u6DE1", "\u5FEB\u9910"]),
  f("\u7C73\u76AE", "\u{1F957}", [L, D], ["\u6E05\u6DE1", "\u5FEB\u9910"]),
  f("\u64C0\u9762\u76AE", "\u{1F957}", [L, D], ["\u8FA3", "\u5FEB\u9910"]),
  f("\u725B\u7F8A\u8089\u6CE1\u998D", "\u{1F372}", [L, D], ["\u9971\u8179"]),
  // ---------- 炒菜/正餐 ----------
  f("\u9EC4\u7116\u9E21\u7C73\u996D", "\u{1F357}", [L, D], ["\u9971\u8179"]),
  f("\u6D1B\u9633\u6C34\u5E2D", "\u{1F372}", [L, D], []),
  f("\u5927\u76D8\u9E21", "\u{1F357}", [L, D], ["\u8FA3", "\u9971\u8179"]),
  f("\u9178\u83DC\u9C7C", "\u{1F41F}", [L, D], ["\u8FA3"]),
  f("\u6C34\u716E\u9C7C", "\u{1F41F}", [L, D], ["\u8FA3"]),
  f("\u5BAB\u4FDD\u9E21\u4E01\u76D6\u996D", "\u{1F35B}", [L, D], ["\u8FA3"]),
  f("\u9C7C\u9999\u8089\u4E1D\u76D6\u996D", "\u{1F35B}", [L, D], ["\u8FA3"]),
  f("\u9EBB\u5A46\u8C46\u8150\u76D6\u996D", "\u{1F35B}", [L, D], ["\u8FA3"]),
  f("\u56DE\u9505\u8089\u76D6\u996D", "\u{1F35B}", [L, D], ["\u8FA3"]),
  f("\u756A\u8304\u7092\u86CB\u76D6\u996D", "\u{1F35B}", [L, D], ["\u6E05\u6DE1"]),
  f("\u9752\u6912\u8089\u4E1D\u76D6\u996D", "\u{1F35B}", [L, D], []),
  f("\u7EA2\u70E7\u8089", "\u{1F969}", [L, D], ["\u9971\u8179"]),
  f("\u7CD6\u918B\u91CC\u810A", "\u{1F356}", [L, D], []),
  f("\u5730\u9505\u9E21", "\u{1F357}", [L, D], ["\u9971\u8179"]),
  f("\u5C0F\u9165\u8089", "\u{1F356}", [L, D], []),
  f("\u6263\u7897", "\u{1F356}", [L, D], ["\u9971\u8179"]),
  f("\u5BB6\u5E38\u5C0F\u7092", "\u{1F958}", [L, D], []),
  f("\u81EA\u52A9\u9910", "\u{1F37D}", [L, D], ["\u9971\u8179"]),
  f("\u98DF\u5802\u5957\u9910", "\u{1F371}", [L, D], ["\u9971\u8179"]),
  f("\u65E5\u5F0F\u5B9A\u98DF", "\u{1F371}", [L, D], ["\u6E05\u6DE1"]),
  // ---------- 火锅/串类 ----------
  f("\u706B\u9505", "\u{1F372}", [L, D], ["\u8FA3", "\u9971\u8179"]),
  f("\u9EBB\u8FA3\u9999\u9505", "\u{1F372}", [L, D], ["\u8FA3", "\u9971\u8179"]),
  f("\u9EBB\u8FA3\u62CC", "\u{1F958}", [L, D, S], ["\u8FA3"]),
  f("\u9EBB\u8FA3\u70EB", "\u{1F372}", [L, D, S], ["\u8FA3"]),
  f("\u5192\u83DC", "\u{1F372}", [L, D], ["\u8FA3"]),
  f("\u4E32\u4E32\u9999", "\u{1F362}", [D, S], ["\u8FA3"]),
  f("\u65CB\u8F6C\u5C0F\u706B\u9505", "\u{1F372}", [L, D], ["\u8FA3"]),
  f("\u5BFF\u559C\u9505", "\u{1F372}", [L, D], ["\u6E05\u6DE1"]),
  // ---------- 快餐连锁 ----------
  f("\u6C49\u5821", "\u{1F354}", [L, D, S], ["\u5FEB\u9910"]),
  f("\u70B8\u9E21", "\u{1F357}", [D, S], ["\u5FEB\u9910"]),
  f("\u62AB\u8428", "\u{1F355}", [L, D], ["\u5FEB\u9910"]),
  f("\u6C99\u53BF\u5C0F\u5403", "\u{1F35C}", [L, D], ["\u5FEB\u9910"]),
  f("\u5170\u5DDE\u62C9\u9762\uFF08\u5FEB\uFF09", "\u{1F35C}", [L, D], ["\u5FEB\u9910", "\u9971\u8179"]),
  f("\u4FBF\u5229\u5E97\u4FBF\u5F53", "\u{1F371}", [L, D], ["\u5FEB\u9910"]),
  f("\u5173\u4E1C\u716E\uFF08\u6B63\u9910\uFF09", "\u{1F362}", [L, D], ["\u6E05\u6DE1"]),
  f("\u8D5B\u767E\u5473", "\u{1F96A}", [L, D], ["\u5FEB\u9910"]),
  f("\u5854\u65AF\u6C40\u6C49\u5821", "\u{1F354}", [L, D], ["\u5FEB\u9910"]),
  f("\u534E\u83B1\u58EB", "\u{1F354}", [L, D], ["\u5FEB\u9910"]),
  // ---------- 轻食/清淡 ----------
  f("\u8F7B\u98DF\u6C99\u62C9", "\u{1F957}", [L, D], ["\u6E05\u6DE1"]),
  f("\u6C34\u679C\u6C99\u62C9", "\u{1F353}", [L, S], ["\u6E05\u6DE1"]),
  f("\u84B8\u86CB\u7FB9\u5957\u9910", "\u{1F95A}", [L, D], ["\u6E05\u6DE1"]),
  f("\u767D\u707C\u83DC\u5FC3\u5957\u9910", "\u{1F96C}", [L, D], ["\u6E05\u6DE1"]),
  f("\u76AE\u86CB\u7626\u8089\u7CA5", "\u{1F963}", [L, S], ["\u6E05\u6DE1"]),
  f("\u5357\u74DC\u7CA5\u5957\u9910", "\u{1F383}", [L, S], ["\u6E05\u6DE1"]),
  f("\u7D20\u658B", "\u{1F96C}", [L, D], ["\u6E05\u6DE1"]),
  f("\u6F6E\u6C55\u7802\u9505\u7CA5", "\u{1F372}", [L, D], ["\u6E05\u6DE1"]),
  // ---------- 地方特色 ----------
  f("\u9053\u53E3\u70E7\u9E21", "\u{1F357}", [L, D], ["\u9971\u8179"]),
  f("\u5F00\u5C01\u704C\u6C64\u5305", "\u{1F95F}", [L, D], ["\u6E05\u6DE1"]),
  f("\u900D\u9065\u9547\u80E1\u8FA3\u6C64\uFF08\u6B63\u9910\uFF09", "\u{1F963}", [L, D], ["\u9971\u8179"]),
  f("\u90CF\u53BF\u8C46\u8150\u83DC", "\u{1F372}", [L, D], ["\u9971\u8179"]),
  f("\u79B9\u5DDE\u6742\u70A3", "\u{1F372}", [L, D], []),
  f("\u9122\u9675\u8C46\u8150\u8111\uFF08\u6B63\u9910\uFF09", "\u{1F963}", [L, D], ["\u6E05\u6DE1"]),
  f("\u8BB8\u660C\u8001\u5F0F\u70E9\u9762", "\u{1F35C}", [L, D], ["\u9971\u8179"]),
  f("\u4FE1\u9633\u7096\u83DC", "\u{1F372}", [L, D], ["\u9971\u8179"]),
  f("\u5357\u9633\u65B9\u57CE\u70E9\u9762", "\u{1F35C}", [L, D], ["\u9971\u8179"]),
  f("\u5468\u53E3\u80E1\u8FA3\u6C64\u914D\u6CB9\u997C", "\u{1F963}", [L, D], ["\u9971\u8179"]),
  // ---------- 夜宵 ----------
  f("\u70E7\u70E4", "\u{1F362}", [D, S], ["\u8FA3"]),
  f("\u70B8\u4E32", "\u{1F362}", [S], ["\u8FA3"]),
  f("\u70E4\u51B7\u9762", "\u{1F32F}", [S], ["\u5FEB\u9910"]),
  f("\u94C1\u677F\u9C7F\u9C7C", "\u{1F991}", [S], ["\u8FA3"]),
  f("\u70E4\u9762\u7B4B", "\u{1F362}", [S], ["\u8FA3"]),
  f("\u82B1\u7532\u7C89", "\u{1F35C}", [S], ["\u8FA3"]),
  f("\u7092\u9178\u5976", "\u{1F366}", [S], ["\u6E05\u6DE1"]),
  f("\u5173\u4E1C\u716E", "\u{1F362}", [S], ["\u6E05\u6DE1"]),
  f("\u6CE1\u9762", "\u{1F35C}", [S], ["\u5FEB\u9910"]),
  f("\u81EA\u70ED\u5C0F\u706B\u9505", "\u{1F372}", [S], ["\u8FA3"]),
  f("\u5364\u5473\u62FC\u76D8", "\u{1F357}", [S], ["\u8FA3"]),
  f("\u9E2D\u8116", "\u{1F986}", [S], ["\u8FA3"]),
  f("\u5C0F\u9F99\u867E", "\u{1F990}", [D, S], ["\u8FA3"]),
  f("\u7092\u7C89\u7092\u9762", "\u{1F35D}", [S], ["\u9971\u8179"]),
  f("\u94C1\u677F\u8C46\u8150", "\u{1F9C8}", [S], ["\u8FA3"]),
  f("\u7AE0\u9C7C\u5C0F\u4E38\u5B50", "\u{1F419}", [S], ["\u5FEB\u9910"]),
  f("\u6C34\u679C\u635E", "\u{1F353}", [S], ["\u6E05\u6DE1"]),
  f("\u86CB\u7CD5\u751C\u54C1", "\u{1F370}", [S], ["\u6E05\u6DE1"]),
  f("\u51B0\u6DC7\u6DCB", "\u{1F366}", [S], ["\u6E05\u6DE1"]),
  f("\u5564\u9152+\u6BDB\u8C46", "\u{1F37A}", [S], ["\u8FA3"])
];

// src/constants/categories.ts
var EXPENSE_CATEGORIES = [
  { name: "\u9910\u996E", emoji: "\u{1F35C}" },
  { name: "\u4EA4\u901A", emoji: "\u{1F68C}" },
  { name: "\u65E5\u7528", emoji: "\u{1F9FB}" },
  { name: "\u5B66\u4E60", emoji: "\u{1F4DA}" },
  { name: "\u5A31\u4E50", emoji: "\u{1F3AE}" },
  { name: "\u901A\u8BAF", emoji: "\u{1F4F1}" },
  { name: "\u533B\u7597", emoji: "\u{1F48A}" },
  { name: "\u5176\u4ED6", emoji: "\u{1F4E6}" }
];
var INCOME_CATEGORIES = [
  { name: "\u751F\u6D3B\u8D39", emoji: "\u{1F3E0}" },
  { name: "\u9000\u6B3E", emoji: "\u21A9\uFE0F" },
  { name: "\u517C\u804C", emoji: "\u{1F4BC}" },
  { name: "\u5956\u5B66\u91D1", emoji: "\u{1F393}" },
  { name: "\u7EA2\u5305", emoji: "\u{1F9E7}" },
  { name: "\u7406\u8D22\u6536\u76CA", emoji: "\u{1F4C8}" },
  { name: "\u4E8C\u624B\u8F6C\u5356", emoji: "\u{1F6CD}\uFE0F" },
  { name: "\u5176\u4ED6", emoji: "\u{1F4B0}" }
];
var EMOJI_LIBRARY = [
  "\u{1F35C}",
  "\u{1F372}",
  "\u{1F35A}",
  "\u{1F363}",
  "\u{1F957}",
  "\u{1F354}",
  "\u{1F355}",
  "\u{1F9CB}",
  "\u2615",
  "\u{1F370}",
  "\u{1F34E}",
  "\u{1F95A}",
  "\u{1F95B}",
  "\u{1F37A}",
  "\u{1F9C1}",
  "\u{1F36B}",
  "\u{1F68C}",
  "\u{1F687}",
  "\u{1F6B2}",
  "\u{1F697}",
  "\u{1F6F5}",
  "\u26FD",
  "\u{1F17F}\uFE0F",
  "\u{1F684}",
  "\u{1F9FB}",
  "\u{1F9F4}",
  "\u{1F9F9}",
  "\u{1F9FA}",
  "\u{1F4A1}",
  "\u{1F511}",
  "\u{1F50C}",
  "\u{1F50B}",
  "\u{1F6E0}\uFE0F",
  "\u{1F4DA}",
  "\u270F\uFE0F",
  "\u{1F4DD}",
  "\u{1F393}",
  "\u{1F5A8}\uFE0F",
  "\u{1F9EE}",
  "\u{1F3AE}",
  "\u{1F3AC}",
  "\u{1F3B5}",
  "\u{1F3A4}",
  "\u{1F3C0}",
  "\u26BD",
  "\u{1F3C3}",
  "\u{1F3A3}",
  "\u{1F3E0}",
  "\u{1F381}",
  "\u{1F9E7}",
  "\u{1F4C8}",
  "\u{1F6CD}\uFE0F",
  "\u21A9\uFE0F",
  "\u{1F4BC}",
  "\u{1F48A}",
  "\u{1F3E5}",
  "\u2764\uFE0F",
  "\u{1F431}",
  "\u{1F436}",
  "\u{1F31F}",
  "\u{1F4E6}",
  "\u{1F4B0}",
  "\u{1F431}\u200D\u{1F4BB}"
];
var DEFAULT_LEDGER_CATS = {
  expense: EXPENSE_CATEGORIES.map((c) => ({ ...c, builtin: true, locked: c.name === "\u5176\u4ED6" })),
  income: INCOME_CATEGORIES.map((c) => ({ ...c, builtin: true, locked: c.name === "\u5176\u4ED6" }))
};

// src/utils/rewards.ts
function genRedeemCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return "KG-" + s;
}
var MOOD_LABELS = ["\u7CDF\u7CD5", "\u4F4E\u843D", "\u4E00\u822C", "\u8FD8\u884C", "\u5F00\u5FC3"];
var PRESET_REWARDS = [
  { id: "rw-milk-tea", title: "\u5976\u8336\u81EA\u7531\u5238", desc: "\u4EFB\u610F\u54C1\u724C\u4EFB\u610F\u676F\u578B\uFF0C\u52A0\u6599\u5168\u7CD6\u968F\u4F60", emoji: "\u{1F9CB}", condType: "streak", condParam: 3, hidden: false, claimed: false, granted: false, mode: "auto" },
  { id: "rw-cart", title: "\u8D2D\u7269\u8F66\u6E05\u7A7A\u5238", desc: "\u8D2D\u7269\u8F66\u91CC\u6311\u4E00\u4EF6\uFF0C\u6211\u6765\u4E70\u5355", emoji: "\u{1F6D2}", condType: "streak", condParam: 5, hidden: false, claimed: false, granted: false, mode: "auto" },
  { id: "rw-movie", title: "\u7535\u5F71\u4E4B\u591C\u5238", desc: "\u9009\u4F60\u60F3\u770B\u7684\uFF0C\u7206\u7C73\u82B1\u6211\u8D1F\u8D23", emoji: "\u{1F3AC}", condType: "streak", condParam: 7, hidden: false, claimed: false, granted: false, mode: "auto" },
  { id: "rw-sleep", title: "\u61D2\u89C9\u4FDD\u62A4\u5238", desc: "\u4E0D\u7528\u65E9\u8D77\u7684\u65E9\u6668\uFF0C\u5E2E\u4F60\u6321\u6389\u6240\u6709\u6253\u6270", emoji: "\u{1F634}", condType: "streak", condParam: 10, hidden: false, claimed: false, granted: false, mode: "auto" },
  { id: "rw-massage", title: "\u80A9\u9888\u6309\u6469\u5238", desc: "\u5907\u8003\u80A9\u9888\u50F5\u786C\u6551\u6025\uFF1A\u4E00\u6B21\u4E13\u4E1A\u6309\u6469\uFF0C\u8D39\u7528\u6211\u5305", emoji: "\u{1F486}", condType: "streak", condParam: 15, hidden: false, claimed: false, granted: false, mode: "auto" },
  { id: "rw-blind", title: "\u60CA\u559C\u76F2\u76D2\u5238", desc: "\u4FDD\u6301\u795E\u79D8\uFF0C\u5230\u65F6\u4F60\u5C31\u77E5\u9053\u4E86", emoji: "\u{1F381}", condType: "streak", condParam: 20, hidden: false, claimed: false, granted: false, mode: "auto" },
  { id: "rw-hidden-weekend", title: "\u96F6\u98DF\u5927\u793C\u5305", desc: "\u5468\u672B\u53CC\u6EE1\u52E4\u7684\u9690\u85CF\u5F69\u86CB", emoji: "\u{1F36B}", condType: "weekend_full", condParam: 0, hidden: true, claimed: false, granted: false, mode: "code" },
  { id: "rw-hidden-mood", title: "\u5FC3\u60C5\u6674\u5929\u60CA\u559C", desc: "\u8FDE\u7EED 3 \u5929\u5FC3\u60C5\u5F88\u597D\u89E3\u9501", emoji: "\u{1F308}", condType: "mood3", condParam: 3, hidden: true, claimed: false, granted: false, mode: "code" },
  { id: "rw-hidden-pomo", title: "\u751C\u54C1\u8865\u7ED9", desc: "\u5355\u65E5\u4E13\u6CE8\u6EE1 3 \u4E2A\u756A\u8304\u89E3\u9501", emoji: "\u{1F370}", condType: "pomo_day", condParam: 3, hidden: true, claimed: false, granted: false, mode: "code" },
  { id: "rw-hidden-30", title: "\u5927\u989D\u5FC3\u613F\u5238", desc: "\u7D2F\u8BA1 30 \u5929\u5168\u52E4\u89E3\u9501", emoji: "\u{1F48E}", condType: "total_full", condParam: 30, hidden: true, claimed: false, granted: false, mode: "code" }
];

// src/utils/date.ts
function pad2(n) {
  return n < 10 ? "0" + n : String(n);
}
function dateStr(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function todayStr() {
  return dateStr(/* @__PURE__ */ new Date());
}
function addDays(dateStrIn, days) {
  const d = /* @__PURE__ */ new Date(dateStrIn + "T00:00:00");
  d.setDate(d.getDate() + days);
  return dateStr(d);
}
function daysBetween(from, to) {
  const a = (/* @__PURE__ */ new Date(from + "T00:00:00")).getTime();
  const b = (/* @__PURE__ */ new Date(to + "T00:00:00")).getTime();
  return Math.round((b - a) / 864e5);
}
function startOfWeek(dateStrIn) {
  const d = /* @__PURE__ */ new Date(dateStrIn + "T00:00:00");
  d.setDate(d.getDate() - (d.getDay() + 6) % 7);
  return dateStr(d);
}
function hmToMin(hm) {
  const [h, m] = hm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}
function nowMin() {
  const d = /* @__PURE__ */ new Date();
  return d.getHours() * 60 + d.getMinutes();
}
function fmtHM(min) {
  return `${pad2(Math.floor(min / 60))}:${pad2(min % 60)}`;
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// src/utils/review.ts
var REVIEW_DAILY_LIMIT = 20;
var MASTER_S = 21;
var LEGACY_INTERVALS = [1, 2, 4, 7, 15];
function firstReviewDate() {
  return Date.now() + 864e5;
}
function noteReviewState(note) {
  if (note.review) return note.review;
  const step = Math.max(0, Math.min(5, note.reviewStep || 0));
  return {
    stability: step >= 5 ? MASTER_S : LEGACY_INTERVALS[step],
    difficulty: 5,
    reps: step,
    lapses: 0
  };
}
function stepFromStability(s) {
  if (s >= MASTER_S) return 5;
  if (s >= 15) return 4;
  if (s >= 7) return 3;
  if (s >= 4) return 2;
  if (s >= 2) return 1;
  return 0;
}
function nextReviewState(state, rating) {
  const cur = state;
  let s = cur.stability;
  let d = cur.difficulty;
  let lapses = cur.lapses;
  switch (rating) {
    case "again":
      s = 1;
      d = Math.min(10, d + 1);
      lapses += 1;
      break;
    case "hard":
      s = s * 1.2;
      d = Math.min(10, d + 0.5);
      break;
    case "good":
      s = s * 2;
      break;
    case "easy":
      s = s * 3;
      d = Math.max(1, d - 0.5);
      break;
  }
  s = Math.round(s * 10) / 10;
  const review = {
    stability: s,
    difficulty: d,
    reps: cur.reps + 1,
    lapses
  };
  const reviewStep = stepFromStability(s);
  const nextReviewDate = reviewStep >= 5 ? null : Date.now() + Math.max(1, Math.round(s)) * 864e5;
  return { review, reviewStep, nextReviewDate };
}
function isNoteDue(note, today) {
  return note.nextReviewDate !== null && dateStr(new Date(note.nextReviewDate)) <= today;
}
function reviewPriority(note, today) {
  if (note.nextReviewDate === null) return -1;
  const overdue = Math.max(0, daysBetween(dateStr(new Date(note.nextReviewDate)), today));
  const d = noteReviewState(note).difficulty;
  return overdue * d + 1;
}

// src/store/normalize.ts
var DEFAULTS = {
  settings: DEFAULT_SETTINGS,
  foods: DEFAULT_FOODS.map((f2) => ({ ...f2 })),
  budget: 0,
  foodLog: {},
  exams: [],
  courses: [],
  checkinItems: [
    { id: "item-ke", name: "\u542C\u5F55\u64AD\u8BFE", emoji: "\u{1F3A7}", category: "\u884C\u6D4B", level: "core", severity: "high" },
    { id: "item-ti", name: "\u5237\u9898\u7EC3\u7B14", emoji: "\u270D\uFE0F", category: "\u884C\u6D4B", level: "core", severity: "high" },
    { id: "item-du", name: "\u6668\u8BFB\u79EF\u7D2F", emoji: "\u{1F4D6}", category: "\u7533\u8BBA", level: "normal", severity: "medium" }
  ],
  checkins: {},
  moods: {},
  rewards: PRESET_REWARDS.map((r) => ({ ...r })),
  todos: [],
  ledger: [],
  periodic: [],
  dates: [],
  notes: [],
  threeThings: {},
  dayLogs: {},
  pomodoroLogs: [],
  quizBook: { stats: { answered: 0, wrong: 0 }, wrongs: [] },
  ledgerCats: {
    expense: DEFAULT_LEDGER_CATS.expense.map((c) => ({ ...c })),
    income: DEFAULT_LEDGER_CATS.income.map((c) => ({ ...c }))
  }
};
function condOf(r) {
  const legacy = r;
  const valid = ["streak", "total_full", "weekend_full", "mood3", "pomo_day"];
  if (r.condType && valid.includes(r.condType)) {
    return { condType: r.condType, condParam: typeof r.condParam === "number" ? r.condParam : 0 };
  }
  const preset = {
    "rw-hidden-weekend": { condType: "weekend_full", condParam: 0 },
    "rw-hidden-mood": { condType: "mood3", condParam: 3 },
    "rw-hidden-pomo": { condType: "pomo_day", condParam: 3 },
    "rw-hidden-30": { condType: "total_full", condParam: 30 }
  };
  if (preset[r.id]) return preset[r.id];
  if (typeof legacy.targetDays === "number") {
    return { condType: "streak", condParam: legacy.targetDays };
  }
  return { condType: void 0, condParam: void 0 };
}
var isObj = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
var objs = (v) => Array.isArray(v) ? v.filter(isObj) : [];
function objMap(v) {
  const out = {};
  if (isObj(v)) {
    for (const [k, x] of Object.entries(v)) if (isObj(x)) out[k] = x;
  }
  return out;
}
function mergeWithDefaults(stored) {
  const src = isObj(stored) ? stored : {};
  const out = { ...DEFAULTS };
  for (const key of Object.keys(DEFAULTS)) {
    const v = src[key];
    if (v === void 0 || v === null) continue;
    const d = DEFAULTS[key];
    if (Array.isArray(d)) {
      if (Array.isArray(v)) out[key] = v;
    } else if (isObj(d)) {
      if (isObj(v)) out[key] = v;
    } else {
      out[key] = v;
    }
  }
  out.budget = Number(out.budget) || 0;
  out.moods = objMap(out.moods);
  out.checkins = objMap(out.checkins);
  out.foodLog = objMap(out.foodLog);
  out.threeThings = objMap(out.threeThings);
  out.dayLogs = objMap(out.dayLogs);
  const foodsArr = Array.isArray(out.foods) ? out.foods : [];
  if (foodsArr.some((x) => typeof x === "string")) {
    out.foods = foodsArr.filter((x) => typeof x === "string").map((name) => ({
      id: "food-m-" + name,
      name,
      emoji: "\u{1F37D}",
      slots: ["lunch", "dinner"],
      tags: []
    }));
  }
  const foods = objs(out.foods);
  out.foods = foods.length > 0 ? foods.map((x) => ({ ...x, emoji: x.emoji || "\u{1F37D}" })) : DEFAULTS.foods.map((f2) => ({ ...f2 }));
  out.ledger = objs(out.ledger).map((l) => ({
    ...l,
    id: typeof l.id === "string" && l.id ? l.id : uid(),
    date: typeof l.date === "string" ? l.date : "",
    amount: Number(l.amount) || 0,
    type: l.type === "income" ? "income" : "expense",
    category: typeof l.category === "string" && l.category ? l.category : "\u5176\u4ED6",
    note: typeof l.note === "string" ? l.note : ""
  }));
  const fillChild = (c, inherited) => ({
    ...c,
    severity: c.severity ?? inherited ?? "medium",
    children: objs(c.children).map((cc) => fillChild(cc, c.severity ?? inherited))
  });
  out.checkinItems = objs(out.checkinItems).map((it) => ({
    ...it,
    level: it.level ?? "normal",
    severity: it.severity ?? "medium",
    children: objs(it.children).map((c) => fillChild(c, it.severity ?? "medium"))
  }));
  out.notes = objs(out.notes).map((n) => {
    const reviewStep = typeof n.reviewStep === "number" ? n.reviewStep : 0;
    return {
      ...n,
      nextReviewDate: typeof n.nextReviewDate === "number" ? n.nextReviewDate : null,
      reviewStep,
      review: n.review || noteReviewState({ reviewStep })
    };
  });
  out.exams = objs(out.exams);
  out.courses = objs(out.courses);
  out.todos = objs(out.todos);
  out.periodic = objs(out.periodic);
  out.dates = objs(out.dates);
  out.pomodoroLogs = objs(
    out.pomodoroLogs
  ).map((l) => ({
    ...l,
    date: typeof l.date === "string" ? l.date : "",
    minutes: Number(l.minutes) || 0,
    endedAt: Number(l.endedAt) || 0,
    task: typeof l.task === "string" ? l.task : void 0
  }));
  const qb = isObj(out.quizBook) ? out.quizBook : void 0;
  out.quizBook = {
    stats: {
      answered: Number(qb?.stats?.answered) || 0,
      wrong: Number(qb?.stats?.wrong) || 0
    },
    wrongs: objs(qb?.wrongs)
  };
  const lc = isObj(out.ledgerCats) ? out.ledgerCats : void 0;
  const cats = (v) => objs(v).filter((c) => typeof c.name === "string" && !!c.name).map((c) => ({ ...c, emoji: typeof c.emoji === "string" ? c.emoji : "\u{1F4B3}" }));
  const expense = cats(lc?.expense);
  const income = cats(lc?.income);
  out.ledgerCats = {
    expense: expense.length > 0 ? expense : DEFAULT_LEDGER_CATS.expense.map((c) => ({ ...c })),
    income: income.length > 0 ? income : DEFAULT_LEDGER_CATS.income.map((c) => ({ ...c }))
  };
  const rewards = objs(out.rewards);
  if (rewards.length === 0 && !stubs_default.getStorageSync("kg_rewards_seeded")) {
    rewards.push(...PRESET_REWARDS.map((r) => ({ ...r })));
  }
  stubs_default.setStorageSync("kg_rewards_seeded", "1");
  out.rewards = rewards.map((r) => {
    const legacy = typeof r.claimed === "boolean" && typeof r.granted === "undefined";
    return {
      ...r,
      desc: typeof r.desc === "string" ? r.desc : "",
      emoji: typeof r.emoji === "string" ? r.emoji : "\u{1F381}",
      hidden: typeof r.hidden === "boolean" ? r.hidden : false,
      granted: typeof r.granted === "boolean" ? r.granted : !!r.claimed,
      mode: r.mode === "code" ? "code" : "auto",
      used: typeof r.used === "boolean" ? r.used : legacy ? !!r.claimed : false,
      ...condOf(r)
    };
  });
  const s = isObj(out.settings) ? out.settings : {};
  const mergedSettings = {
    ...DEFAULT_SETTINGS,
    ...s,
    meals: { ...DEFAULT_SETTINGS.meals, ...isObj(s.meals) ? s.meals : {} },
    water: { ...DEFAULT_SETTINGS.water, ...isObj(s.water) ? s.water : {} },
    city: typeof s.city === "string" ? s.city : null,
    citySource: s.citySource === "manual" ? "manual" : "auto",
    intel: { ...DEFAULT_SETTINGS.intel, ...isObj(s.intel) ? s.intel : {} }
  };
  delete mergedSettings.sedentaryMin;
  out.settings = mergedSettings;
  return out;
}

// scripts/smoke/stubs.jsx
var mk = (tag) => (p) => import_react.default.createElement(tag, p, p && p.children);
var View = mk("view");
var Text = mk("text");
var Input = mk("input");
var Textarea = mk("textarea");
var Label = mk("label");
var Picker = mk("picker");
var ScrollView = mk("scroll-view");
var Swiper = mk("swiper");
var SwiperItem = mk("swiper-item");
var Canvas = mk("canvas");
var Image = mk("image");
var Button = mk("button");
var Taro = new Proxy(
  {
    getStorageSync: () => "",
    setStorageSync: () => {
    },
    removeStorageSync: () => {
    },
    showToast: () => {
    },
    showModal: () => Promise.resolve({ confirm: false }),
    navigateTo: () => {
    },
    navigateBack: () => {
    },
    nextTick: (fn) => fn && fn(),
    getSystemInfoSync: () => ({ windowWidth: 375, windowHeight: 667, pixelRatio: 2 }),
    createSelectorQuery: () => ({
      select: () => ({ boundingClientRect: () => ({ exec: () => {
      } }) }),
      exec: () => {
      }
    })
  },
  {
    get: (t, k) => k in t ? t[k] : () => {
    }
  }
);
var stubs_default = Taro;
var useRouter = () => ({ params: {}, path: "" });
var useLoad = () => {
};
var useDidShow = () => {
};
var DatePicker = mk("date-picker");
var appPrompt = async () => null;
var appConfirm = async () => false;
var showToast = () => {
};
var copyText = () => {
};
var scenario = "defaults";
function setScenario(s) {
  scenario = s;
}
function rawStored() {
  const d = JSON.parse(JSON.stringify(DEFAULTS));
  if (scenario === "full") {
    d.moods = { "2026-09-25": { mood: 3, note: "\u8FD8\u884C" }, "2026-09-26": { mood: 5 } };
    d.ledger = [
      { id: "x1", date: "2026-09-27", amount: 12, type: "expense", category: "\u9910\u996E", note: "" },
      { id: "x2", date: "2026-09-26", amount: 4500, type: "income", category: "\u5DE5\u8D44", note: "" }
    ];
    d.pomodoroLogs = [{ date: "2026-09-27", minutes: 25, endedAt: Date.now(), task: "\u5237\u9898" }];
  }
  if (scenario === "serverish") {
    d.settings = {};
    d.ledgerCats = { expense: d.ledgerCats.expense };
  }
  if (scenario === "nulls") {
    d.settings = null;
    d.moods = null;
    d.ledger = null;
    d.pomodoroLogs = null;
    d.ledgerCats = null;
  }
  if (scenario === "dirty") {
    d.moods = { "2026-09-25": null, "2026-09-26": { mood: 5 } };
    d.ledger = [null, { id: "x1", date: "2026-09-27", amount: 12 }, "junk"];
    d.pomodoroLogs = [null, {}, { date: "2026-09-27", minutes: 25, endedAt: Date.now() }];
    d.todos = [null, { id: "t1", title: "x" }];
    d.foods = [null];
    d.checkins = [null];
    d.mistakes = [null];
    d.wrongNotes = [null];
    d.plans = [null];
    d.tasks = [null];
  }
  return d;
}
function buildData() {
  return mergeWithDefaults(rawStored());
}
function buildRaw() {
  return rawStored();
}
function useData() {
  return {
    data: buildData(),
    ready: true,
    set: () => {
    },
    auth: null,
    onboarded: true,
    rebootstrap: async () => {
    },
    chooseRole: async () => {
    }
  };
}

// src/pages/today/index.tsx
var import_react3 = require("react");

// src/constants/cities.ts
var HENAN_CITIES = [
  { name: "\u8BB8\u660C", province: "\u6CB3\u5357", lat: 34.035, lon: 113.853 },
  { name: "\u90D1\u5DDE", province: "\u6CB3\u5357", lat: 34.747, lon: 113.625 },
  { name: "\u5F00\u5C01", province: "\u6CB3\u5357", lat: 34.797, lon: 114.308 },
  { name: "\u6D1B\u9633", province: "\u6CB3\u5357", lat: 34.62, lon: 112.454 },
  { name: "\u5E73\u9876\u5C71", province: "\u6CB3\u5357", lat: 33.767, lon: 113.193 },
  { name: "\u5B89\u9633", province: "\u6CB3\u5357", lat: 36.099, lon: 114.393 },
  { name: "\u9E64\u58C1", province: "\u6CB3\u5357", lat: 35.748, lon: 114.297 },
  { name: "\u65B0\u4E61", province: "\u6CB3\u5357", lat: 35.303, lon: 113.927 },
  { name: "\u7126\u4F5C", province: "\u6CB3\u5357", lat: 35.216, lon: 113.242 },
  { name: "\u6FEE\u9633", province: "\u6CB3\u5357", lat: 35.762, lon: 115.03 },
  { name: "\u6F2F\u6CB3", province: "\u6CB3\u5357", lat: 33.582, lon: 114.047 },
  { name: "\u4E09\u95E8\u5CE1", province: "\u6CB3\u5357", lat: 34.773, lon: 111.195 },
  { name: "\u5357\u9633", province: "\u6CB3\u5357", lat: 32.991, lon: 112.531 },
  { name: "\u5546\u4E18", province: "\u6CB3\u5357", lat: 34.415, lon: 115.656 },
  { name: "\u4FE1\u9633", province: "\u6CB3\u5357", lat: 32.147, lon: 114.075 },
  { name: "\u5468\u53E3", province: "\u6CB3\u5357", lat: 33.626, lon: 114.699 },
  { name: "\u9A7B\u9A6C\u5E97", province: "\u6CB3\u5357", lat: 32.98, lon: 114.023 },
  { name: "\u6D4E\u6E90", province: "\u6CB3\u5357", lat: 35.067, lon: 112.602 }
];
var OTHER_CITIES = [
  { name: "\u5317\u4EAC", province: "\u5317\u4EAC", lat: 39.904, lon: 116.407 },
  { name: "\u4E0A\u6D77", province: "\u4E0A\u6D77", lat: 31.23, lon: 121.474 },
  { name: "\u5E7F\u5DDE", province: "\u5E7F\u4E1C", lat: 23.129, lon: 113.264 },
  { name: "\u6DF1\u5733", province: "\u5E7F\u4E1C", lat: 22.543, lon: 114.058 },
  { name: "\u6B66\u6C49", province: "\u6E56\u5317", lat: 30.593, lon: 114.305 },
  { name: "\u897F\u5B89", province: "\u9655\u897F", lat: 34.342, lon: 108.94 },
  { name: "\u5357\u4EAC", province: "\u6C5F\u82CF", lat: 32.06, lon: 118.797 },
  { name: "\u6210\u90FD", province: "\u56DB\u5DDD", lat: 30.573, lon: 104.067 }
];
var QUICK_CITIES = [...HENAN_CITIES, ...OTHER_CITIES];
function cityLabel(c) {
  return c.city && c.city !== c.name ? `${c.city} \xB7 ${c.name}` : c.name;
}

// src/constants/water-quiz.ts
var WATER_QUIZ = [
  {
    id: 1,
    q: "\u6211\u56FD\u5BAA\u6CD5\u89C4\u5B9A\u7684\u6839\u672C\u5236\u5EA6\u662F\uFF1F",
    options: ["\u4EBA\u6C11\u4EE3\u8868\u5927\u4F1A\u5236\u5EA6", "\u793E\u4F1A\u4E3B\u4E49\u5236\u5EA6", "\u591A\u515A\u5408\u4F5C\u548C\u653F\u6CBB\u534F\u5546\u5236\u5EA6", "\u6C11\u65CF\u533A\u57DF\u81EA\u6CBB\u5236\u5EA6"],
    answer: 1,
    explain: "\u793E\u4F1A\u4E3B\u4E49\u5236\u5EA6\u662F\u6211\u56FD\u7684\u6839\u672C\u5236\u5EA6\uFF1B\u4EBA\u6C11\u4EE3\u8868\u5927\u4F1A\u5236\u5EA6\u662F\u6839\u672C\u653F\u6CBB\u5236\u5EA6\u3002"
  },
  {
    id: 2,
    q: "\u6211\u56FD\u7684\u6700\u9AD8\u56FD\u5BB6\u6743\u529B\u673A\u5173\u662F\uFF1F",
    options: ["\u56FD\u52A1\u9662", "\u4E2D\u592E\u519B\u59D4", "\u5168\u56FD\u4EBA\u6C11\u4EE3\u8868\u5927\u4F1A", "\u6700\u9AD8\u4EBA\u6C11\u6CD5\u9662"],
    answer: 2,
    explain: "\u5168\u56FD\u4EBA\u6C11\u4EE3\u8868\u5927\u4F1A\u662F\u6700\u9AD8\u56FD\u5BB6\u6743\u529B\u673A\u5173\uFF1B\u56FD\u52A1\u9662\u662F\u6700\u9AD8\u56FD\u5BB6\u884C\u653F\u673A\u5173\u3002"
  },
  {
    id: 3,
    q: "\u4E2D\u56FD\u7B2C\u4E00\u5927\u6DE1\u6C34\u6E56\u662F\uFF1F",
    options: ["\u6D1E\u5EAD\u6E56", "\u592A\u6E56", "\u9752\u6D77\u6E56", "\u9131\u9633\u6E56"],
    answer: 3,
    explain: "\u9131\u9633\u6E56\u662F\u4E2D\u56FD\u7B2C\u4E00\u5927\u6DE1\u6C34\u6E56\uFF1B\u9752\u6D77\u6E56\u662F\u6700\u5927\u7684\u54B8\u6C34\u6E56\u3002"
  },
  {
    id: 4,
    q: "\u4E1D\u7EF8\u4E4B\u8DEF\u6700\u65E9\u5F00\u8F9F\u4E8E\u897F\u6C49\uFF0C\u5176\u4E3B\u8981\u5F00\u8F9F\u8005\u662F\uFF1F",
    options: ["\u5F20\u9A9E", "\u73ED\u8D85", "\u7384\u5958", "\u90D1\u548C"],
    answer: 0,
    explain: "\u897F\u6C49\u5F20\u9A9E\u51FA\u4F7F\u897F\u57DF\u5F00\u8F9F\u4E1D\u7EF8\u4E4B\u8DEF\uFF1B\u73ED\u8D85\u7ECF\u8425\u897F\u57DF\u4E3A\u4E1C\u6C49\uFF0C\u7384\u5958\u53D6\u7ECF\u4E3A\u5510\u4EE3\uFF0C\u90D1\u548C\u4E0B\u897F\u6D0B\u4E3A\u660E\u4EE3\u3002"
  },
  {
    id: 5,
    q: "\u4E94\u56DB\u8FD0\u52A8\u7684\u76F4\u63A5\u5BFC\u706B\u7D22\u662F\uFF1F",
    options: ["\u4E5D\u4E00\u516B\u4E8B\u53D8", "\u5DF4\u9ECE\u548C\u4F1A\u4E2D\u56FD\u5916\u4EA4\u5931\u8D25", "\u6B66\u660C\u8D77\u4E49", "\u620A\u620C\u53D8\u6CD5\u5931\u8D25"],
    answer: 1,
    explain: "1919 \u5E74\u5DF4\u9ECE\u548C\u4F1A\u4E0A\u4E2D\u56FD\u5916\u4EA4\u5931\u8D25\uFF0C\u76F4\u63A5\u5F15\u53D1\u4E86\u4E94\u56DB\u7231\u56FD\u8FD0\u52A8\u3002"
  },
  {
    id: 6,
    q: "GDP\uFF08\u56FD\u5185\u751F\u4EA7\u603B\u503C\uFF09\u662F\u6307\u4E00\u4E2A\u56FD\u5BB6\u6216\u5730\u533A\u5728\u4E00\u5B9A\u65F6\u671F\u5185\uFF1F",
    options: ["\u5168\u90E8\u4EA7\u54C1\u7684\u603B\u503C", "\u5168\u90E8\u8D38\u6613\u603B\u989D", "\u8D22\u653F\u6536\u5165\u603B\u548C", "\u751F\u4EA7\u7684\u6700\u7EC8\u4EA7\u54C1\u548C\u670D\u52A1\u7684\u5E02\u573A\u4EF7\u503C\u603B\u548C"],
    answer: 3,
    explain: "GDP \u6838\u7B97\u6700\u7EC8\u4EA7\u54C1\u548C\u670D\u52A1\uFF0C\u4E0D\u542B\u4E2D\u95F4\u4EA7\u54C1\uFF0C\u907F\u514D\u91CD\u590D\u8BA1\u7B97\u3002"
  },
  {
    id: 7,
    q: "\u552F\u7269\u8FA9\u8BC1\u6CD5\u7684\u5B9E\u8D28\u4E0E\u6838\u5FC3\u662F\uFF1F",
    options: ["\u8D28\u91CF\u4E92\u53D8\u89C4\u5F8B", "\u5BF9\u7ACB\u7EDF\u4E00\u89C4\u5F8B", "\u5426\u5B9A\u4E4B\u5426\u5B9A\u89C4\u5F8B", "\u666E\u904D\u8054\u7CFB\u7684\u89C2\u70B9"],
    answer: 1,
    explain: "\u5BF9\u7ACB\u7EDF\u4E00\u89C4\u5F8B\uFF08\u77DB\u76FE\u89C4\u5F8B\uFF09\u63ED\u793A\u4E86\u4E8B\u7269\u53D1\u5C55\u7684\u6E90\u6CC9\u548C\u52A8\u529B\uFF0C\u662F\u552F\u7269\u8FA9\u8BC1\u6CD5\u7684\u5B9E\u8D28\u4E0E\u6838\u5FC3\u3002"
  },
  {
    id: 8,
    q: '"\u585E\u7FC1\u5931\u9A6C\uFF0C\u7109\u77E5\u975E\u798F"\u4E3B\u8981\u4F53\u73B0\u7684\u54F2\u5B66\u9053\u7406\u662F\uFF1F',
    options: ["\u91CF\u53D8\u5FC5\u7136\u5F15\u8D77\u8D28\u53D8", "\u7269\u8D28\u51B3\u5B9A\u610F\u8BC6", "\u77DB\u76FE\u53CC\u65B9\u5728\u4E00\u5B9A\u6761\u4EF6\u4E0B\u76F8\u4E92\u8F6C\u5316", "\u5B9E\u8DF5\u662F\u68C0\u9A8C\u771F\u7406\u7684\u552F\u4E00\u6807\u51C6"],
    answer: 2,
    explain: "\u7978\u4E0E\u798F\u4F5C\u4E3A\u77DB\u76FE\u53CC\u65B9\uFF0C\u5728\u4E00\u5B9A\u6761\u4EF6\u4E0B\u53EF\u4EE5\u76F8\u4E92\u8F6C\u5316\u3002"
  },
  {
    id: 9,
    q: "\u300A\u672C\u8349\u7EB2\u76EE\u300B\u7684\u4F5C\u8005\u662F\uFF1F",
    options: ["\u534E\u4F57", "\u5F20\u4EF2\u666F", "\u5B59\u601D\u9088", "\u674E\u65F6\u73CD"],
    answer: 3,
    explain: '\u660E\u4EE3\u674E\u65F6\u73CD\u8457\u300A\u672C\u8349\u7EB2\u76EE\u300B\uFF0C\u88AB\u8A89\u4E3A"\u4E1C\u65B9\u836F\u7269\u5DE8\u5178"\u3002'
  },
  {
    id: 10,
    q: "\u9020\u6210\u901A\u8D27\u81A8\u80C0\u7684\u6839\u672C\u539F\u56E0\u901A\u5E38\u662F\uFF1F",
    options: ["\u6D41\u901A\u4E2D\u8D27\u5E01\u91CF\u8D85\u8FC7\u5B9E\u9645\u9700\u8981", "\u5546\u54C1\u4F9B\u5E94\u4E25\u91CD\u8FC7\u5269", "\u5BF9\u5916\u51FA\u53E3\u51CF\u5C11", "\u5C45\u6C11\u50A8\u84C4\u589E\u52A0"],
    answer: 0,
    explain: "\u901A\u8D27\u81A8\u80C0\u7684\u672C\u8D28\u662F\u6D41\u901A\u4E2D\u8D27\u5E01\u91CF\u8D85\u8FC7\u5B9E\u9645\u9700\u8981\u91CF\uFF0C\u5BFC\u81F4\u8D27\u5E01\u8D2C\u503C\u3001\u7269\u4EF7\u4E0A\u6DA8\u3002"
  },
  {
    id: 11,
    q: "\u9E21\u86CB\u5927\u5934\u671D\u4E0A\u7AD6\u7740\u653E\uFF0C\u80FD\u5B58\u653E\u66F4\u4E45\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 0,
    explain: "\u5927\u5934\u4E00\u7AEF\u6709\u6C14\u5BA4\uFF0C\u671D\u4E0A\u653E\u86CB\u9EC4\u4E0D\u6613\u8D34\u58F3\uFF0C\u9E21\u86CB\u66F4\u8010\u5B58\u653E\uFF0C\u751F\u6D3B\u5C0F\u5999\u62DB get~"
  },
  {
    id: 12,
    q: "\u9999\u8549\u653E\u51B0\u7BB1\u51B7\u85CF\uFF0C\u80FD\u4FDD\u9C9C\u66F4\u4E45\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 1,
    explain: "\u9999\u8549\u662F\u70ED\u5E26\u6C34\u679C\uFF0C\u51B7\u85CF\u53CD\u800C\u5BB9\u6613\u51BB\u4F24\u53D1\u9ED1\uFF0C\u5E38\u6E29\u9634\u51C9\u5904\u5B58\u653E\u66F4\u5408\u9002\u3002"
  },
  {
    id: 13,
    q: "\u571F\u8C46\u53D1\u82BD\u540E\uFF0C\u628A\u82BD\u6316\u6389\u5C31\u80FD\u653E\u5FC3\u5403\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 1,
    explain: "\u9F99\u8475\u7D20\u4F1A\u6269\u6563\u5230\u6574\u4E2A\u571F\u8C46\uFF0C\u6316\u82BD\u4E0D\u4FDD\u9669\uFF0C\u53D1\u82BD\u53D8\u7EFF\u7684\u571F\u8C46\u5EFA\u8BAE\u6574\u4E2A\u4E22\u6389\u3002"
  },
  {
    id: 14,
    q: "\u8702\u871C\u6700\u597D\u7528\u521A\u70E7\u5F00\u7684\u6CB8\u6C34\u51B2\u6CE1\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 1,
    explain: "\u9AD8\u6E29\u4F1A\u7834\u574F\u8702\u871C\u91CC\u7684\u6D3B\u6027\u8425\u517B\u6210\u5206\uFF0C\u6E29\u6C34\u51B2\u6CE1\u624D\u662F\u6B63\u89E3\u3002"
  },
  {
    id: 15,
    q: "\u6CB9\u9505\u8D77\u706B\u65F6\uFF0C\u7528\u6C34\u6D47\u80FD\u5FEB\u901F\u706D\u706B\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 1,
    explain: "\u6C34\u9047\u70ED\u6CB9\u4F1A\u7206\u6E85\uFF0C\u706B\u66F4\u5927\uFF01\u6B63\u786E\u505A\u6CD5\u662F\u5173\u706B\u3001\u76D6\u9505\u76D6\uFF0C\u9694\u7EDD\u7A7A\u6C14\u706D\u706B\u3002"
  },
  {
    id: 16,
    q: "\u70EB\u4F24\u540E\u5E94\u7B2C\u4E00\u65F6\u95F4\u7528\u6D41\u52A8\u51B7\u6C34\u51B2\u6D17\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 0,
    explain: "\u6301\u7EED\u51B2 15~20 \u5206\u949F\u80FD\u964D\u6E29\u6B62\u75DB\uFF0C\u6BD4\u62B9\u7259\u818F\u3001\u9171\u6CB9\u4E4B\u7C7B\u7684\u504F\u65B9\u9760\u8C31\u591A\u4E86\u3002"
  },
  {
    id: 17,
    q: "\u5FAE\u6CE2\u7089\u52A0\u70ED\u8FC7\u7684\u98DF\u7269\u4F1A\u6B8B\u7559\u653E\u5C04\u6027\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 1,
    explain: '\u5FAE\u6CE2\u5C5E\u4E8E\u975E\u7535\u79BB\u8F90\u5C04\uFF0C\u505C\u6B62\u52A0\u70ED\u5373\u6D88\u5931\uFF0C\u98DF\u7269\u672C\u8EAB\u4E0D\u4F1A\u5E26"\u8F90\u5C04"\u3002'
  },
  {
    id: 18,
    q: "\u5E38\u6E29\u76D2\u88C5\u725B\u5976\u4FDD\u8D28\u671F\u957F\uFF0C\u662F\u56E0\u4E3A\u9632\u8150\u5242\u653E\u5F97\u591A\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 1,
    explain: "\u5E38\u6E29\u5976\u9760\u8D85\u9AD8\u6E29\u77AC\u65F6\u706D\u83CC\u52A0\u65E0\u83CC\u5305\u88C5\uFF0C\u538B\u6839\u4E0D\u9700\u8981\u9632\u8150\u5242\u3002"
  },
  {
    id: 19,
    q: "\u53CD\u590D\u70E7\u5F00\u7684\u6C34\uFF08\u5343\u6EDA\u6C34\uFF09\u559D\u4E86\u4F1A\u4E2D\u6BD2\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 1,
    explain: "\u5B9E\u6D4B\u5343\u6EDA\u6C34\u7684\u4E9A\u785D\u9178\u76D0\u4ECD\u8FDC\u4F4E\u4E8E\u56FD\u5BB6\u6807\u51C6\uFF0C\u653E\u5FC3\u559D\uFF0C\u591A\u559D\u6C34\u624D\u662F\u6B63\u7ECF\u4E8B\u3002"
  },
  {
    id: 20,
    q: "\u8FD0\u52A8\u51FA\u6C57\u8D8A\u591A\uFF0C\u8BF4\u660E\u8102\u80AA\u71C3\u70E7\u8D8A\u591A\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 1,
    explain: "\u51FA\u6C57\u4E3B\u8981\u662F\u6563\u70ED\u964D\u6E29\uFF0C\u51CF\u6389\u7684\u5927\u591A\u662F\u6C34\u5206\uFF0C\u559D\u70B9\u6C34\u4F53\u91CD\u5C31\u56DE\u6765\u4E86\u3002"
  },
  {
    id: 21,
    q: "\u9C7C\u523A\u5361\u5589\u65F6\uFF0C\u5927\u53E3\u541E\u996D\u56E2\u80FD\u628A\u5B83\u538B\u4E0B\u53BB\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 1,
    explain: "\u786C\u54BD\u53EF\u80FD\u628A\u523A\u63A8\u5F97\u66F4\u6DF1\u751A\u81F3\u5212\u4F24\u98DF\u9053\uFF0C\u8F7B\u54B3\u5F04\u4E0D\u51FA\u6765\u5C31\u8D76\u7D27\u5C31\u533B\u3002"
  },
  {
    id: 22,
    q: "\u7F13\u91CA\u7247\u53EF\u4EE5\u968F\u610F\u63B0\u5F00\u6216\u56BC\u788E\u670D\u7528\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 1,
    explain: "\u63B0\u5F00\u4F1A\u7834\u574F\u7F13\u91CA\u7ED3\u6784\uFF0C\u836F\u7269\u77AC\u95F4\u96C6\u4E2D\u91CA\u653E\u5F88\u5371\u9669\uFF0C\u8981\u9075\u533B\u5631\u6574\u7247\u5403\u3002"
  },
  {
    id: 23,
    q: '\u8FD1\u89C6\u624B\u672F\u80FD"\u6CBB\u6108"\u8FD1\u89C6\u3002',
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 1,
    explain: "\u624B\u672F\u53EA\u662F\u77EB\u6B63\u5C48\u5149\u5EA6\uFF0C\u773C\u8F74\u53D8\u957F\u4E0D\u53EF\u9006\uFF0C\u672F\u540E\u4E5F\u7167\u6837\u8981\u597D\u597D\u62A4\u773C\u3002"
  },
  {
    id: 24,
    q: "\u5C11\u6797\u5BFA\u4F4D\u4E8E\u6CB3\u5357\u7701\u767B\u5C01\u5E02\u7684\u5D69\u5C71\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 0,
    explain: "\u5929\u4E0B\u529F\u592B\u51FA\u5C11\u6797\uFF0C\u5C11\u6797\u5BFA\u5C31\u5728\u767B\u5C01\u5D69\u5C71\uFF0C\u7B49\u4E0A\u5CB8\u4E86\u53BB\u6253\u5361\uFF01"
  },
  {
    id: 25,
    q: "\u7532\u9AA8\u6587\u4E3B\u8981\u51FA\u571F\u4E8E\u6CB3\u5357\u5B89\u9633\u7684\u6BB7\u589F\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 0,
    explain: '"\u4E00\u7247\u7532\u9AA8\u60CA\u5929\u4E0B"\uFF0C\u5B89\u9633\u6BB7\u589F\u5C31\u662F\u7532\u9AA8\u6587\u7684\u4E3B\u8981\u51FA\u571F\u5730\uFF0C\u6CB3\u5357\u4EBA\u7684\u9A84\u50B2\u3002'
  },
  {
    id: 26,
    q: "\u9EC4\u6CB3\u6700\u7EC8\u6CE8\u5165\u6E24\u6D77\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 0,
    explain: "\u9EC4\u6CB3\u4E00\u8DEF\u5411\u4E1C\uFF0C\u5728\u5C71\u4E1C\u6CE8\u5165\u6E24\u6D77\uFF0C\u5165\u6D77\u53E3\u8FD8\u6709\u795E\u5947\u7684\u9EC4\u84DD\u4EA4\u6C47\u666F\u89C2\u3002"
  },
  {
    id: 27,
    q: "\u6211\u56FD\u9762\u79EF\u6700\u5927\u7684\u7701\u7EA7\u884C\u653F\u533A\u662F\u65B0\u7586\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 0,
    explain: "\u65B0\u7586\u7EA6 166 \u4E07\u5E73\u65B9\u516C\u91CC\uFF0C\u5DEE\u4E0D\u591A\u5360\u5168\u56FD\u9646\u5730\u9762\u79EF\u7684\u516D\u5206\u4E4B\u4E00\u3002"
  },
  {
    id: 28,
    q: "\u300A\u53F2\u8BB0\u300B\u662F\u6211\u56FD\u7B2C\u4E00\u90E8\u7EAA\u4F20\u4F53\u901A\u53F2\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 0,
    explain: '\u53F8\u9A6C\u8FC1\u4ECE\u9EC4\u5E1D\u5199\u5230\u6C49\u6B66\u5E1D\uFF0C\u88AB\u9C81\u8FC5\u8A89\u4E3A"\u53F2\u5BB6\u4E4B\u7EDD\u5531\uFF0C\u65E0\u97F5\u4E4B\u79BB\u9A9A"\u3002'
  },
  {
    id: 29,
    q: '\u6210\u8BED"\u7EB8\u4E0A\u8C08\u5175"\u8BF4\u7684\u662F\u4E09\u56FD\u65F6\u671F\u7684\u9A6C\u8C21\u3002',
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 1,
    explain: "\u7EB8\u4E0A\u8C08\u5175\u662F\u6218\u56FD\u8D75\u62EC\uFF08\u957F\u5E73\u4E4B\u6218\uFF09\uFF0C\u9A6C\u8C21\u5931\u8857\u4EAD\u624D\u662F\u4E09\u56FD\u7684\u4E8B\uFF0C\u522B\u5F04\u6DF7\u3002"
  },
  {
    id: 30,
    q: "\u5730\u7403\u81EA\u8F6C\u4EA7\u751F\u4E86\u56DB\u5B63\u66F4\u66FF\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 1,
    explain: "\u81EA\u8F6C\u4EA7\u751F\u663C\u591C\u4EA4\u66FF\uFF0C\u56DB\u5B63\u9760\u516C\u8F6C\u52A0\u9EC4\u8D64\u4EA4\u89D2\uFF0C\u5730\u7406\u5E38\u8BC6\u522B\u4E22\u5206\u3002"
  },
  {
    id: 31,
    q: "\u5149\u5E74\u662F\u65F6\u95F4\u5355\u4F4D\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 1,
    explain: "\u5149\u5E74\u662F\u5149\u5728\u771F\u7A7A\u4E2D\u8D70\u4E00\u5E74\u7684\u8DDD\u79BB\uFF0C\u662F\u957F\u5EA6\u5355\u4F4D\uFF0C\u5E38\u8BC6\u9001\u5206\u9898\u8BB0\u7262\uFF01"
  },
  {
    id: 32,
    q: "\u6211\u56FD\u56FD\u6B4C\u300A\u4E49\u52C7\u519B\u8FDB\u884C\u66F2\u300B\uFF0C\u8BCD\u4F5C\u8005\u662F\u7530\u6C49\u3001\u66F2\u4F5C\u8005\u662F\u8042\u8033\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 0,
    explain: "\u7530\u6C49\u4F5C\u8BCD\u3001\u8042\u8033\u4F5C\u66F2\uFF0C\u8BDE\u751F\u4E8E\u6C11\u65CF\u5371\u4EA1\u4E4B\u9645\uFF0C\u6BCF\u6B21\u5531\u90FD\u5FC3\u6F6E\u6F8E\u6E43\u3002"
  },
  {
    id: 33,
    q: '\u6210\u8BED"\u7834\u91DC\u6C89\u821F"\u51FA\u81EA\u5DE8\u9E7F\u4E4B\u6218\u4E2D\u7684\u9879\u7FBD\u3002',
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 0,
    explain: "\u9879\u7FBD\u7838\u9505\u6C89\u8239\u3001\u4EE5\u5C11\u80DC\u591A\uFF0C\u8FD9\u80A1\u4E0D\u7559\u9000\u8DEF\u7684\u72E0\u52B2\u50CF\u6781\u4E86\u51B2\u523A\u9636\u6BB5\u7684\u4F60\u3002"
  },
  {
    id: 34,
    q: "\u300A\u6C11\u6CD5\u5178\u300B\u89C4\u5B9A\uFF0C\u516B\u5468\u5C81\u4EE5\u4E0A\u7684\u672A\u6210\u5E74\u4EBA\u4E3A\u9650\u5236\u6C11\u4E8B\u884C\u4E3A\u80FD\u529B\u4EBA\u3002",
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 0,
    explain: "\u4E0D\u6EE1\u516B\u5468\u5C81\u662F\u65E0\u6C11\u4E8B\u884C\u4E3A\u80FD\u529B\u4EBA\uFF0C\u516B\u5468\u5C81\u4EE5\u4E0A\u662F\u9650\u5236\uFF0C\u6CD5\u6761\u8981\u62A0\u5B57\u773C\u3002"
  },
  {
    id: 35,
    q: '\u6CB3\u5357\u7701\u7684\u7B80\u79F0\u662F"\u8C6B"\uFF0C\u7701\u4F1A\u662F\u90D1\u5DDE\u3002',
    options: ["\u6B63\u786E", "\u9519\u8BEF"],
    answer: 0,
    explain: '\u4E0A\u53E4\u8C6B\u5DDE\u5C45"\u5929\u5730\u4E4B\u4E2D"\uFF0C\u7B80\u79F0\u7531\u6B64\u800C\u6765\uFF1B\u90D1\u5DDE\u662F\u54B1\u6CB3\u5357\u4EBA\u7684\u4E3B\u573A\u3002'
  },
  {
    id: 36,
    q: '\u6210\u8BED"\u5DEE\u5F3A\u4EBA\u610F"\u7684\u6B63\u786E\u542B\u4E49\u662F\uFF1F',
    options: ["\u5927\u4F53\u4E0A\u8FD8\u80FD\u4EE4\u4EBA\u6EE1\u610F", "\u5B8C\u5168\u4E0D\u80FD\u4EE4\u4EBA\u6EE1\u610F", "\u975E\u5E38\u51FA\u4EBA\u610F\u6599", "\u52C9\u5F3A\u53CA\u683C\u7684\u6C34\u5E73"],
    answer: 0,
    explain: '"\u5DEE"\u662F\u7A0D\u5FAE\u3001"\u5F3A"\u662F\u632F\u594B\uFF0C\u6307\u5927\u4F53\u8FD8\u7B97\u4EE4\u4EBA\u6EE1\u610F\uFF0C\u53EF\u4E0D\u662F\u8BA9\u4EBA\u5931\u671B\u7684\u610F\u601D\u3002'
  },
  {
    id: 37,
    q: '\u6210\u8BED"\u9996\u5F53\u5176\u51B2"\u7684\u6B63\u786E\u542B\u4E49\u662F\uFF1F',
    options: ["\u51B2\u5728\u6700\u524D\u9762\u5E26\u5934\u5E72", "\u6700\u5148\u53D7\u5230\u653B\u51FB\u6216\u906D\u9047\u707E\u96BE", "\u9996\u8981\u7684\u7A81\u7834\u53E3", "\u9996\u5148\u51B2\u8FC7\u7EC8\u70B9"],
    answer: 1,
    explain: '\u5B83\u8BF4\u7684\u662F\u6700\u5148\u53D7\u5230\u51B2\u51FB\u3001\u5148\u906D\u6B83\uFF0C\u4E0D\u662F"\u5E26\u5934\u51B2"\uFF0C\u8A00\u8BED\u9898\u9AD8\u9891\u9677\u9631\u3002'
  },
  {
    id: 38,
    q: '\u6210\u8BED"\u6587\u4E0D\u52A0\u70B9"\u5F62\u5BB9\u4EC0\u4E48\uFF1F',
    options: ["\u5199\u6587\u7AE0\u4E00\u6C14\u5475\u6210\u3001\u65E0\u9700\u6D82\u6539", "\u5199\u6587\u7AE0\u4E0D\u52A0\u6807\u70B9\u7B26\u53F7", "\u6587\u7AE0\u6CA1\u6709\u91CD\u70B9", "\u5B57\u8FF9\u6F66\u8349\u96BE\u8BA4"],
    answer: 0,
    explain: '"\u70B9"\u6307\u6D82\u6539\uFF0C\u5F62\u5BB9\u6587\u601D\u654F\u6377\u3001\u4E0B\u7B14\u6210\u7AE0\uFF0C\u59A5\u59A5\u7684\u5938\u4EBA\u8BCD\u3002'
  },
  {
    id: 39,
    q: '\u6210\u8BED"\u4E03\u6708\u6D41\u706B"\u7684\u672C\u4E49\u662F\u6307\uFF1F',
    options: ["\u5929\u6C14\u708E\u70ED\u96BE\u8010", "\u5929\u6C14\u6E10\u6E10\u8F6C\u51C9", "\u4E03\u5915\u4F73\u8282\u5C06\u81F3", "\u5FC3\u60C5\u70E6\u8E81\u4E0A\u706B"],
    answer: 1,
    explain: '"\u706B"\u6307\u5927\u706B\u661F\u897F\u6C89\uFF0C\u6691\u70ED\u6E10\u9000\u3001\u5929\u6C14\u8F6C\u51C9\uFF0C\u51FA\u9898\u4EBA\u6700\u7231\u6316\u7684\u5751\u3002'
  },
  {
    id: 40,
    q: '\u6210\u8BED"\u4E0D\u520A\u4E4B\u8BBA"\u7684\u6B63\u786E\u542B\u4E49\u662F\uFF1F',
    options: ["\u4E0D\u80FD\u520A\u767B\u53D1\u8868\u7684\u8A00\u8BBA", "\u4E0D\u53EF\u66F4\u6539\u7684\u7CBE\u8F9F\u8A00\u8BBA", "\u4E0D\u503C\u5F97\u8BA8\u8BBA\u7684\u89C2\u70B9", "\u6C34\u5E73\u592A\u5DEE\u7684\u6587\u7AE0"],
    answer: 1,
    explain: '"\u520A"\u6307\u524A\u6539\uFF0C\u53E4\u4EBA\u5728\u7AF9\u7B80\u4E0A\u5199\u9519\u5B57\u8981\u524A\u6389\u91CD\u5199\uFF0C\u4E0D\u53EF\u520A\u6539\uFF1D\u597D\u5230\u4E0D\u7528\u6539\u3002'
  },
  {
    id: 41,
    q: '\u6210\u8BED"\u5371\u8A00\u5371\u884C"\u7684\u6B63\u786E\u542B\u4E49\u662F\uFF1F',
    options: ["\u5371\u9669\u7684\u8A00\u8BBA\u548C\u884C\u4E3A", "\u6B63\u76F4\u7684\u8A00\u8BBA\u548C\u884C\u4E3A", "\u5938\u5927\u5413\u4EBA\u7684\u8BDD", "\u8BF4\u8BDD\u505A\u4E8B\u5192\u5192\u5931\u5931"],
    answer: 1,
    explain: '\u8FD9\u91CC\u7684"\u5371"\u662F\u6B63\u76F4\uFF0C\u8BB2\u6B63\u76F4\u7684\u8BDD\u3001\u505A\u6B63\u76F4\u7684\u4E8B\uFF0C\u662F\u8912\u4E49\u8BCD\u3002'
  },
  {
    id: 42,
    q: '\u6210\u8BED"\u4E45\u5047\u4E0D\u5F52"\u7684\u6B63\u786E\u542B\u4E49\u662F\uFF1F',
    options: ["\u957F\u671F\u8BF7\u5047\u4E0D\u6765\u4E0A\u73ED", "\u957F\u671F\u501F\u7528\u3001\u4E0D\u5F52\u8FD8", "\u79BB\u5BB6\u51FA\u8D70\u4E0D\u56DE\u6765", "\u5047\u671F\u592A\u957F\u4E0D\u60F3\u5F00\u5B66"],
    answer: 1,
    explain: '"\u5047"\u662F\u501F\u7684\u610F\u601D\uFF0C\u6307\u957F\u671F\u501F\u8D70\u4E0D\u8FD8\uFF0C\u53EF\u4E0D\u662F\u8BF7\u5047\u72C2\u9B54\u3002'
  },
  {
    id: 43,
    q: "\u8111\u7B4B\u6025\u8F6C\u5F2F\uFF1A\u4EC0\u4E48\u4E1C\u897F\u8D8A\u6D17\u8D8A\u810F\uFF1F",
    options: ["\u8863\u670D", "\u889C\u5B50", "\u6C34", "\u62B9\u5E03"],
    answer: 2,
    explain: "\u6C34\u628A\u522B\u7684\u6D17\u5E72\u51C0\u4E86\uFF0C\u81EA\u5DF1\u5374\u8D8A\u6765\u8D8A\u810F~"
  },
  {
    id: 44,
    q: '\u8111\u7B4B\u6025\u8F6C\u5F2F\uFF1A\u4EC0\u4E48"\u82B1"\u4E00\u5E74\u56DB\u5B63\u90FD\u5F00\u653E\uFF1F',
    options: ["\u6885\u82B1", "\u5851\u6599\u82B1", "\u592A\u9633\u82B1", "\u6C34\u4ED9\u82B1"],
    answer: 1,
    explain: "\u5851\u6599\u82B1\u6C38\u4E0D\u51CB\u8C22\u3001\u56DB\u5B63\u5E38\u5F00\uFF0C\u8FD8\u7279\u522B\u7701\u5FC3~"
  },
  {
    id: 45,
    q: "\u8111\u7B4B\u6025\u8F6C\u5F2F\uFF1A\u4EC0\u4E48\u95E8\u6C38\u8FDC\u5173\u4E0D\u4E0A\uFF1F",
    options: ["\u7403\u95E8", "\u57CE\u95E8", "\u6728\u95E8", "\u6821\u95E8"],
    answer: 0,
    explain: "\u7403\u95E8\u5929\u751F\u6CA1\u6709\u95E8\u677F\uFF0C\u60F3\u5173\u4E5F\u5173\u4E0D\u4E0A\uFF0C\u8FDB\u7403\u624D\u662F\u5B83\u7684\u4F7F\u547D\u3002"
  },
  {
    id: 46,
    q: "\u8111\u7B4B\u6025\u8F6C\u5F2F\uFF1A\u4EC0\u4E48\u4E1C\u897F\u6253\u7834\u4E86\uFF0C\u5927\u5BB6\u53CD\u800C\u62CD\u624B\u53EB\u597D\uFF1F",
    options: ["\u955C\u5B50", "\u7802\u9505", "\u4E16\u754C\u7EAA\u5F55", "\u9E21\u86CB"],
    answer: 2,
    explain: '\u6253\u7834\u7EAA\u5F55\u4EBA\u4EBA\u559D\u5F69\uFF0C\u795D\u4F60\u7684\u5237\u9898\u91CF\u4E5F\u65E9\u65E5"\u6253\u7834\u7EAA\u5F55"\uFF01'
  },
  {
    id: 47,
    q: "\u8111\u7B4B\u6025\u8F6C\u5F2F\uFF1A\u5C0F\u660E\u7684\u5988\u5988\u6709\u4E09\u4E2A\u5B69\u5B50\uFF0C\u8001\u5927\u53EB\u5927\u5B9D\uFF0C\u8001\u4E8C\u53EB\u4E8C\u5B9D\uFF0C\u8001\u4E09\u53EB\u4EC0\u4E48\uFF1F",
    options: ["\u4E09\u5B9D", "\u5C0F\u5B9D", "\u5C0F\u660E", "\u9898\u76EE\u6CA1\u8BF4"],
    answer: 2,
    explain: '\u9898\u76EE\u7B2C\u4E00\u53E5\u5C31\u4EA4\u4EE3\u4E86\u662F"\u5C0F\u660E\u7684\u5988\u5988"\uFF0C\u8001\u4E09\u5F53\u7136\u5C31\u662F\u5C0F\u660E\u672C\u4EBA\u3002'
  },
  {
    id: 48,
    q: "\u521A\u51FA\u751F\u7684\u5927\u718A\u732B\u5E7C\u5D3D\u662F\u4EC0\u4E48\u989C\u8272\uFF1F",
    options: ["\u9ED1\u767D\u76F8\u95F4", "\u7C89\u7EA2\u8272", "\u7EAF\u767D\u8272", "\u6DF1\u7070\u8272"],
    answer: 1,
    explain: "\u521A\u51FA\u751F\u7684\u718A\u732B\u5B9D\u5B9D\u662F\u7C89\u5AE9\u7684\u5C0F\u4E0D\u70B9\uFF0C\u53EA\u6709\u5DF4\u638C\u5927\uFF0C\u8D8A\u957F\u5927\u8D8A\u9ED1\u767D\u5206\u660E\u3002"
  },
  {
    id: 49,
    q: "\u7AE0\u9C7C\u6709\u51E0\u4E2A\u5FC3\u810F\uFF1F",
    options: ["1 \u4E2A", "2 \u4E2A", "3 \u4E2A", "8 \u4E2A"],
    answer: 2,
    explain: '\u4E24\u4E2A\u9CC3\u5FC3\u8D1F\u8D23\u7ED9\u9CC3\u6CF5\u8840\uFF0C\u4E00\u4E2A\u4F53\u5FC3\u4F9B\u5E94\u5168\u8EAB\uFF0C"\u4E09\u5FC3"\u51B7\u77E5\u8BC6 get~'
  },
  {
    id: 50,
    q: "\u72D7\u72D7\u4E3A\u4EC0\u4E48\u4E0D\u80FD\u5403\u5DE7\u514B\u529B\uFF1F",
    options: ["\u592A\u751C\u5BB9\u6613\u86C0\u7259", "\u53EF\u53EF\u78B1\u4EE3\u8C22\u6162\u3001\u4F1A\u4E2D\u6BD2", "\u70ED\u91CF\u592A\u9AD8\u4F1A\u53D1\u80D6", "\u5403\u4E86\u4F1A\u5174\u594B\u62C6\u5BB6"],
    answer: 1,
    explain: "\u5DE7\u514B\u529B\u4E2D\u7684\u53EF\u53EF\u78B1\u5BF9\u72D7\u72D7\u6709\u6BD2\uFF0C\u4EE3\u8C22\u6162\u6613\u84C4\u79EF\uFF0C\u5BB6\u4E2D\u96F6\u98DF\u8981\u6536\u597D\u5440\u3002"
  }
];
function pickWaterQuiz() {
  const last = Number(stubs_default.getStorageSync("last_water_quiz_id") ?? -1);
  const pool = WATER_QUIZ.filter((q2) => q2.id !== last);
  const q = pool[Math.floor(Math.random() * pool.length)] ?? WATER_QUIZ[0];
  stubs_default.setStorageSync("last_water_quiz_id", String(q.id));
  return q;
}
function quizById(id) {
  return WATER_QUIZ.find((q) => q.id === id) ?? null;
}

// scripts/smoke/stubs-datepicker.jsx
var import_react2 = __toESM(require("react"));
function DatePicker2(p) {
  return import_react2.default.createElement("date-picker", p, p && p.children);
}
var fmtDateShort = (d) => d;

// src/components/Modal.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Modal({
  variant = "sheet",
  onClose,
  closeOnMask = true,
  className = "",
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    View,
    {
      className: `modal-mask${variant === "center" ? " center" : ""}`,
      catchMove: true,
      onClick: closeOnMask ? onClose : void 0,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        View,
        {
          className: `modal${className ? ` ${className}` : ""}`,
          onClick: (e) => e.stopPropagation(),
          children
        }
      )
    }
  );
}

// src/constants/icons.ts
var ICONS = {
  "x": '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
  "check": '<polyline points="20 6 9 17 4 12"></polyline>',
  "check-square": '<polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>',
  "square": '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>',
  "x-circle": '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
  "plus": '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',
  "arrow-up": '<line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>',
  "arrow-down": '<line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>',
  "pencil": '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>',
  "trash": '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>',
  "search": '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
  "gear": '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
  "wrench": '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>',
  "lock": '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
  "user": '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
  "calendar": '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
  "pin": '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>',
  "pushpin": '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>',
  "target": '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>',
  "droplet": '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>',
  "chart-bar": '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>',
  "chart-line": '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>',
  "bell": '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>',
  "refresh": '<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>',
  "signal": '<path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>',
  "compass": '<circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>',
  "clipboard": '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>',
  "chat": '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',
  "folder": '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>',
  "phone": '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
  "mobile": '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>',
  "cloud": '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>',
  "key": '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>',
  "mail": '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
  "gift": '<polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>',
  "book": '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
  "repeat": '<polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>',
  "brain": '<path d="M12 5v14"/><path d="M12 6a3.5 3.5 0 0 0-6 2 3 3 0 0 0-1 5.5A3.5 3.5 0 0 0 9 18a3 3 0 0 0 3-2"/><path d="M12 6a3.5 3.5 0 0 1 6 2 3 3 0 0 1 1 5.5A3.5 3.5 0 0 1 15 18a3 3 0 0 1-3-2"/>',
  "tomato": '<path d="M12 8c4.4 0 7.5 2.8 7.5 6.5S16.4 21 12 21s-7.5-2.8-7.5-6.5S7.6 8 12 8z"/><path d="M12 8V5"/><path d="M9 5.5c1.5 0 2.4.6 3 1.5"/><path d="M15 5.5c-1.5 0-2.4.6-3 1.5"/>',
  "ticket": '<path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2.5 2.5 0 0 0 0 5v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1a2.5 2.5 0 0 0 0-5V8z"/><path d="M13 6.5v2M13 11v2M13 15.5v2"/>',
  "flame": '<path d="M12 2c1 4-2 5.2-2 8.2 0 1.2.8 2 1.8 2 2 0 2.7-2.2 2.2-4.2 2.3 1.8 4 4.6 4 7.2a6 6 0 1 1-12 0c0-4 2.5-7.2 6-13.2z"/>'
};

// src/components/Icon.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function Icon({ name, size = 16, color = "#3d3028", gap = 0, className }) {
  const inner = ICONS[name] ?? "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    Image,
    {
      src,
      className,
      style: {
        width: size,
        height: size,
        display: "inline-block",
        verticalAlign: "middle",
        marginRight: gap
      }
    }
  );
}

// src/utils/checkin.ts
var SEVERITY_META = {
  high: { label: "\u4E25\u91CD \xB7 \u4ECA\u65E5\u5FC5\u505A", color: "#dc2626", cls: "sev-high" },
  medium: { label: "\u4E00\u822C \xB7 \u5E38\u89C4", color: "#d97706", cls: "sev-medium" },
  low: { label: "\u5F39\u6027 \xB7 \u53EF\u987A\u5EF6", color: "#3b82f6", cls: "sev-low" }
};
var LEVEL_META = {
  core: { label: "\u6838\u5FC3", weight: 0 },
  normal: { label: "\u5E38\u89C4", weight: 1 },
  flex: { label: "\u5F39\u6027", weight: 2 }
};
var SEVERITY_ORDER = ["high", "medium", "low"];
function sevOf(item) {
  return item.severity ?? "medium";
}
function levelOf(item) {
  return item.level ?? "normal";
}
function leafIds(item) {
  const kids = item.children ?? [];
  if (kids.length === 0) return [item.id];
  return kids.flatMap(leafIds);
}
function flattenLeaves(item) {
  const kids = item.children ?? [];
  if (kids.length === 0) return [{ id: item.id, name: item.name, emoji: item.emoji, depth: 0 }];
  return kids.flatMap((c) => flattenLeaves(c).map((x) => ({ ...x, depth: x.depth + 1 })));
}
function isItemDone(item, ids) {
  return leafIds(item).every((id) => ids.includes(id));
}
function leafProgress(item, ids) {
  const leaves = leafIds(item);
  return { done: leaves.filter((id) => ids.includes(id)).length, total: leaves.length };
}
function toggleItemIds(item, ids) {
  const leaves = leafIds(item);
  return isItemDone(item, ids) ? ids.filter((x) => !leaves.includes(x)) : [...ids, ...leaves.filter((id) => !ids.includes(id))];
}
function toggleLeafId(ids, leafId) {
  return ids.includes(leafId) ? ids.filter((x) => x !== leafId) : [...ids, leafId];
}
function groupItemsBySeverity(items, checked) {
  return SEVERITY_ORDER.map((severity) => ({
    severity,
    items: items.filter((it) => sevOf(it) === severity).map((it, i) => ({ it, i, done: isItemDone(it, checked) })).sort(
      (a, b) => LEVEL_META[levelOf(a.it)].weight - LEVEL_META[levelOf(b.it)].weight || Number(a.done) - Number(b.done) || a.i - b.i
    ).map((x) => x.it)
  })).filter((g) => g.items.length > 0);
}

// src/constants/copy.ts
var COMFORT_QUOTES = [
  "\u5907\u8003\u5C31\u50CF\u9A6C\u62C9\u677E\uFF0C\u7D2F\u4E86\u5C31\u505C\u4E0B\u6765\u559D\u53E3\u6C34\uFF0C\u4E0D\u4E22\u4EBA\u3002\u6B47\u4E94\u5206\u949F\u518D\u4E0A\uFF0C\u53CD\u6B63\u7EC8\u70B9\u53C8\u4E0D\u4F1A\u8DD1\uFF0C\u6211\u5148\u5E2E\u4F60\u5360\u7740\u4F4D\u7F6E\uFF08\u8FD8\u5E26\u4E86\u5976\u8336\uFF09\u3002",
  "\u7D27\u6025\u64AD\u62A5\uFF1A\u6839\u636E\u5B87\u5B99\u4E0D\u706D\u5B9A\u5F8B\uFF0C\u4F60\u4ECA\u5929\u5DF2\u7ECF\u6BD4\u6628\u5929\u591A\u4F1A\u4E86\u4E00\u5806\u77E5\u8BC6\u70B9\uFF0C\u8FDB\u5EA6\u6761\u8089\u773C\u53EF\u89C1\u5728\u6DA8\uFF01\u5FC3\u60C5\u6389\u7EBF\u53EA\u662F\u6682\u65F6\u6027\u7CFB\u7EDF\u62BD\u98CE\uFF0C\u91CD\u542F\u4E00\u4E0B\u5C31\u597D\u3002",
  "\u54CE\u5440\uFF0C\u8C01\u53C8\u60F9\u6211\u4EEC\u672A\u6765\u516C\u52A1\u5458\u4E0D\u9AD8\u5174\u4E86\uFF1F\u9519\u9898\u662F\u62FF\u6765\u6DA8\u5206\u7684\uFF0C\u4E0D\u662F\u62FF\u6765\u5185\u8017\u7684\u2014\u2014\u9A82\u5B83\u4E00\u987F\uFF0C\u7136\u540E\u5E72\u6389\u5B83\uFF01",
  "\u60C5\u7EEA\u4F4E\u843D\u5C5E\u6B63\u5E38\u6CE2\u52A8\uFF0C\u8BF7\u7ACB\u5373\u6267\u884C\u4EE5\u4E0B\u7A0B\u5E8F\uFF1A\u6DF1\u547C\u5438\u4E09\u6B21 \u2192 \u7545\u60F3\u4E00\u4E0B\u4E0A\u5CB8\u540E\u7684\u5FEB\u4E50\u751F\u6D3B \u2192 \u7EE7\u7EED\u652F\u68F1\u3002\u542C\u6211\u7684\uFF0C\u6CA1\u9519\u3002",
  "\u4F60\u8D1F\u8D23\u52AA\u529B\u5237\u9898\uFF0C\u6211\u8D1F\u8D23\u540E\u52E4\u6253\u6C14\u3002\u4ECA\u5929\u5FC3\u60C5\u6253\u6298\u6CA1\u5173\u7CFB\uFF0C\u5206\u6570\u8FD9\u4E1C\u897F\uFF0C\u660E\u5929\u7167\u6837\u80FD\u8FFD\u56DE\u6765\u3002",
  "\u53EE\u549A\uFF01\u4F60\u7684\u4E13\u5C5E\u7814\u53CB\u5DF2\u4E0A\u7EBF\uFF1A\u53EF\u4EE3\u9A82\u8BA8\u538C\u7684\u9898\u3001\u5938\u5938\u4ECA\u5929\u7684\u4F60\u3001\u65E0\u9650\u91CF\u4F9B\u5E94\u52A0\u6CB9\u6253\u6C14\uFF0C\u968F\u53EB\u968F\u5230\u3002"
];

// src/mocks/proxyMocks.ts
var WEATHER_POOL = [
  { code: 0, desc: "\u6674" },
  { code: 1, desc: "\u591A\u4E91" },
  { code: 2, desc: "\u9634" },
  { code: 61, desc: "\u5C0F\u96E8" }
];
function hashIndex(a, b, mod) {
  const s = Math.abs(Math.round(a * 100)) + Math.abs(Math.round(b * 100)) * 131;
  return s % mod;
}
async function mockFetchWeather(lat, lon) {
  await new Promise((r) => setTimeout(r, 120));
  const w = WEATHER_POOL[hashIndex(lat, lon, WEATHER_POOL.length)];
  const base = 12 + hashIndex(lat, lon, 14);
  return {
    temp: base,
    feels: base - 1,
    humidity: 55 + hashIndex(lat, lon, 30),
    code: w.code,
    desc: w.desc,
    tMax: base + 4,
    tMin: base - 5,
    rainProb: w.code >= 61 ? 70 : 10,
    fetchedAt: Date.now()
  };
}
async function mockSearchCities(q) {
  await new Promise((r) => setTimeout(r, 100));
  const raw = q.trim();
  if (!raw) return [];
  const tokens = raw.split(/[省市区县州旗盟\s]+/).filter((t) => t.length >= 2);
  return QUICK_CITIES.filter(
    (c) => c.name.includes(raw) || tokens.some((t) => c.name.includes(t) || t.includes(c.name))
  ).map((c) => ({
    name: c.name,
    province: c.province,
    city: c.city,
    lat: c.lat,
    lon: c.lon
  }));
}
async function mockReverseGeocode(lat, lon) {
  await new Promise((r) => setTimeout(r, 100));
  let best = QUICK_CITIES[0];
  let bestD = Infinity;
  for (const c of QUICK_CITIES) {
    const d = (c.lat - lat) ** 2 + (c.lon - lon) ** 2;
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return { name: best.name, province: best.province, lat, lon };
}
async function mockSearchPois(lat, lon, keyword) {
  await new Promise((r) => setTimeout(r, 150));
  const suffixes = ["\u5BB6\u5E38\u83DC\u9986", "\u9762\u9986", "\u5C0F\u5403\u5E97", "\u5FEB\u9910\u5E97", "\u70E7\u70E4\u5E97"];
  return suffixes.map((s, i) => ({
    id: `mock-poi-${i}`,
    name: `${keyword || "\u9644\u8FD1"}${s}`,
    address: `\uFF08\u79BB\u7EBF\u6F14\u793A\uFF09${cityNearbyName(lat, lon)}\u67D0\u5904 \xB7 \u6B65\u884C\u7EA6 ${5 + i * 3} \u5206\u949F`,
    lat: lat + (i - 2) * 1e-3,
    lon: lon + (i - 2) * 1e-3,
    distance: 300 + i * 200,
    tel: ""
  }));
}
function cityNearbyName(lat, lon) {
  let best = QUICK_CITIES[0];
  let bestD = Infinity;
  for (const c of QUICK_CITIES) {
    const d = (c.lat - lat) ** 2 + (c.lon - lon) ** 2;
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best.name;
}
async function mockChat(messages) {
  await new Promise((r) => setTimeout(r, 400));
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const text = lastUser?.content ?? "";
  const sys = messages.find((m) => m.role === "system")?.content ?? "";
  if (sys.includes("\u5403\u996D\u987E\u95EE")) return mockFoodChat(messages);
  if (/累|烦|焦虑|难过|压力|崩/.test(text)) {
    const day = Math.floor(Date.now() / 864e5);
    return COMFORT_QUOTES[day % COMFORT_QUOTES.length];
  }
  return "\u6536\u5230\uFF01\u5F53\u524D\u4E3A\u79BB\u7EBF\u6F14\u793A\u6A21\u5F0F\uFF0C\u8054\u7F51\u540E\u7531\u4E13\u5C5E\u52A9\u624B\u4E3A\u4F60\u5B8C\u6574\u89E3\u7B54\u3002\u773C\u4E0B\u6700\u8981\u7D27\u7684\u4E8B\uFF1A\u559D\u53E3\u6C34\uFF0C\u7EE7\u7EED\u5237\u9898\uFF0C\u5CB8\u5C31\u5728\u524D\u65B9\u3002";
}
var MOCK_FOODS = [
  { name: "\u7F8A\u8089\u70E9\u9762", reason: "\u6CB3\u5357\u7ECF\u5178\uFF0C\u6C64\u6D53\u6696\u80C3" },
  { name: "\u80E1\u8FA3\u6C64", reason: "\u65E9\u9910\u6765\u4E00\u7897\uFF0C\u63D0\u795E\u9192\u8111" },
  { name: "\u9EC4\u7116\u9E21\u7C73\u996D", reason: "\u6709\u8089\u6709\u83DC\uFF0C\u9971\u8179\u5B9E\u60E0" },
  { name: "\u9EBB\u8FA3\u70EB", reason: "\u60F3\u5403\u8FA3\u7684\u65F6\u5019\u6700\u5408\u9002" },
  { name: "\u8089\u5939\u998D", reason: "\u62FF\u7740\u5C31\u8D70\uFF0C\u8282\u7701\u65F6\u95F4" },
  { name: "\u70B8\u9171\u9762", reason: "\u9762\u6761\u7B4B\u9053\uFF0C\u54B8\u9999\u7BA1\u9971" },
  { name: "\u8F7B\u98DF\u6C99\u62C9", reason: "\u6E05\u6DE1\u4E0D\u72AF\u56F0\uFF0C\u4E0B\u5348\u5237\u9898\u6E05\u9192" },
  { name: "\u5BFF\u53F8\u62FC\u76D8", reason: "\u6E05\u6DE1\u5C11\u6CB9\uFF0C\u6362\u6362\u53E3\u5473" }
];
function mockFoodChat(messages) {
  const userTexts = messages.filter((m) => m.role === "user").map((m) => m.content);
  const excluded = userTexts.flatMap((t) => {
    const m = t.match(/不要\s*(.+)/);
    return m ? [m[1].trim()] : [];
  });
  const pool = MOCK_FOODS.filter((f2) => !excluded.some((x) => f2.name.includes(x) || x.includes(f2.name)));
  const turns = userTexts.length;
  const agreed = /行|好|就(这个|吃它|它吧)|可以|定了/.test(userTexts[userTexts.length - 1] ?? "");
  const final = agreed || turns >= 5 || pool.length <= 1;
  const cands = (final ? pool.slice(0, 1) : pool.slice(0, Math.min(3, pool.length))).map((f2) => ({
    name: f2.name,
    reason: f2.reason
  }));
  const reply = final ? `\u90A3\u5C31\u8FD9\u4E48\u5B9A\u5566\uFF1A${cands.map((c) => c.name).join("\u3001")}\uFF0C\u795D\u4F60\u5403\u5F97\u5F00\u5FC3\uFF01` : pool.length === 0 ? "\u5019\u9009\u90FD\u88AB\u4F60\u5426\u6389\u5566\uFF0C\u8981\u4E0D\u8BF4\u8BF4\u60F3\u5403\u70B9\u4EC0\u4E48\u65B9\u5411\u7684\uFF1F" : turns <= 1 ? "\u597D\u5440\uFF5E\u5148\u770B\u770B\u8FD9\u51E0\u4E2A\uFF0C\u60F3\u5403\u8FA3\u4E00\u70B9\u8FD8\u662F\u6E05\u6DE1\u4E00\u70B9\uFF1F" : `\u7ED3\u5408\u4F60\u7684\u8981\u6C42\uFF0C\u5269\u4E0B\u8FD9\u51E0\u4E2A\u66F4\u5408\u9002\uFF0C\u6311\u4E00\u4E2A\u4E0D\u8981\u7684\u6211\u518D\u6BD4\u6BD4\uFF1F`;
  return JSON.stringify({ reply, candidates: cands, final: final || cands.length <= 1 });
}

// src/services/storageTransport.ts
var KEY_AUTH = "kg-auth";
var KEY_OPENID = "kg-openid";
var KEY_DATA = "kg-data";
var KEY_GUEST_DATA = "kg-guest-data";
var KEY_DEV_ROLE = "kg-dev-role";
function delay(ms) {
  const d = ms ?? 80 + Math.random() * 120;
  return new Promise((resolve) => setTimeout(resolve, d));
}
function readJSON(key) {
  const raw = stubs_default.getStorageSync(key);
  if (!raw) return null;
  try {
    return JSON.parse(String(raw));
  } catch {
    return null;
  }
}
function writeJSON(key, value) {
  stubs_default.setStorageSync(key, JSON.stringify(value));
}
function getCachedAuth() {
  return readJSON(KEY_AUTH);
}
function getDevRole() {
  const r = stubs_default.getStorageSync(KEY_DEV_ROLE);
  return r === "guest" ? "guest" : r === "user" ? "user" : null;
}
function createStorageTransport() {
  async function login(_code, register) {
    await delay();
    let openid = String(stubs_default.getStorageSync(KEY_OPENID) || "");
    if (!openid) {
      openid = "stub-" + uid();
      stubs_default.setStorageSync(KEY_OPENID, openid);
    }
    const info = { role: getDevRole() ?? (register ? "user" : "guest"), openid };
    writeJSON(KEY_AUTH, info);
    return info;
  }
  async function upgrade() {
    await delay();
    const prev = getCachedAuth();
    const info = {
      role: "user",
      openid: prev?.openid || String(stubs_default.getStorageSync(KEY_OPENID) || "stub-" + uid()),
      nickname: prev?.nickname
    };
    writeJSON(KEY_AUTH, info);
    return info;
  }
  function dataKey(role) {
    return role === "guest" ? KEY_GUEST_DATA : KEY_DATA;
  }
  async function getSnapshot() {
    await delay();
    const auth = getCachedAuth();
    const key = dataKey(auth?.role ?? "user");
    return readJSON(key);
  }
  async function writeOps(ops) {
    await delay();
    const auth = getCachedAuth();
    const key = dataKey(auth?.role ?? "user");
    const snapshot = readJSON(key) ?? {};
    for (const op2 of ops) {
      ;
      snapshot[op2.key] = op2.value;
    }
    writeJSON(key, snapshot);
  }
  async function getTasks() {
    await delay(60);
    return [];
  }
  async function getGrants() {
    await delay(60);
    return [];
  }
  return { login, upgrade, getSnapshot, writeOps, getTasks, getGrants };
}

// src/services/request.ts
var active = null;
function getTransport() {
  if (!active) active = createStorageTransport();
  return active;
}
function setTransport(t) {
  active = t;
}

// src/services/api/data.ts
var KEY_QUEUE = "kg-write-queue";
function readQueue() {
  const raw = stubs_default.getStorageSync(KEY_QUEUE);
  if (!raw) return [];
  try {
    return JSON.parse(String(raw));
  } catch {
    return [];
  }
}
function writeQueue(q) {
  stubs_default.setStorageSync(KEY_QUEUE, JSON.stringify(q));
}
async function fetchSnapshot() {
  return getTransport().getSnapshot();
}
async function writeKeys(ops) {
  if (!ops.length) return;
  try {
    await getTransport().writeOps(ops);
  } catch {
    const q = readQueue();
    q.push(...ops.map((o) => ({ ...o, tries: 0 })));
    writeQueue(q);
  }
}
function op(key, value) {
  return { key, value, ts: Date.now() };
}

// src/services/api/auth.ts
var KEY_AUTH2 = "kg-auth";
var KEY_ROLE_CHOSEN = "kg-role-chosen";
var KEY_GUEST_DATA2 = "kg-guest-data";
function getRoleChosen() {
  const r = String(stubs_default.getStorageSync(KEY_ROLE_CHOSEN) || "");
  return r === "user" || r === "guest" ? r : null;
}
function setRoleChosen(role) {
  stubs_default.setStorageSync(KEY_ROLE_CHOSEN, role);
}
async function ensureAuth() {
  const cached = getCachedAuth();
  if (cached) {
    if (!getRoleChosen()) setRoleChosen(cached.role);
    return cached;
  }
  let code = "";
  try {
    const res = await stubs_default.login();
    code = res.code;
  } catch {
    code = "login-failed";
  }
  const info = await getTransport().login(code, getRoleChosen() === "user");
  return info;
}
async function upgradeAccount(opts) {
  let sandbox = null;
  if (opts.keepData) {
    const raw = stubs_default.getStorageSync(KEY_GUEST_DATA2);
    if (raw) {
      try {
        sandbox = JSON.parse(String(raw));
      } catch {
        sandbox = null;
      }
    }
  }
  const info = await getTransport().upgrade();
  setRoleChosen("user");
  if (sandbox) {
    await writeKeys(Object.keys(sandbox).map((k) => op(k, sandbox[k])));
  }
  stubs_default.removeStorageSync(KEY_GUEST_DATA2);
  return info;
}
function logout() {
  stubs_default.removeStorageSync(KEY_AUTH2);
}

// src/services/httpTransport.ts
var API_BASE = "https://app.gyx-a.cn/api";
var KEY_AUTH3 = "kg-auth";
var KEY_OPENID2 = "kg-openid";
var KEY_TOKEN = "kg-token";
var KEY_DEV_ROLE2 = "kg-dev-role";
var localStore = createStorageTransport();
function getToken() {
  return String(stubs_default.getStorageSync(KEY_TOKEN) || "");
}
function devOverride() {
  const raw = String(stubs_default.getStorageSync(KEY_DEV_ROLE2) || "");
  return raw === "user" || raw === "guest" ? raw : null;
}
function dataRole() {
  return devOverride() ?? getCachedAuth()?.role ?? "guest";
}
var authInFlight = null;
function ensureAuthOnce() {
  if (!authInFlight) {
    authInFlight = ensureAuth().finally(() => {
      authInFlight = null;
    });
  }
  return authInFlight;
}
async function request(method, path, data, retried = false) {
  const needAuth = !path.startsWith("/auth/") && path !== "/healthz";
  if (needAuth && !getToken() && !retried) {
    await ensureAuthOnce().catch(() => {
    });
  }
  const res = await stubs_default.request({
    url: API_BASE + path,
    method,
    data,
    timeout: 1e4,
    header: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" }
  });
  if (res.statusCode === 401 && needAuth && !retried) {
    logout();
    await ensureAuthOnce().catch(() => {
    });
    return request(method, path, data, true);
  }
  if (res.statusCode >= 400) throw new Error(`HTTP ${res.statusCode}`);
  return res.data;
}
async function httpGetQ(path, params) {
  const qs = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  return request("GET", `${path}?${qs}`);
}
async function httpPost(path, data) {
  return request("POST", path, data);
}
async function httpStreamPost(path, data, onChunk, retried = false) {
  const needAuth = !path.startsWith("/auth/") && path !== "/healthz";
  if (needAuth && !getToken() && !retried) {
    await ensureAuthOnce().catch(() => {
    });
  }
  const decoder = new Utf8StreamDecoder();
  await new Promise((resolve, reject) => {
    const task = stubs_default.request({
      url: API_BASE + path,
      method: "POST",
      data,
      timeout: 6e4,
      enableChunked: true,
      header: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
      success: (res) => {
        if (res.statusCode === 401) reject(new Error("HTTP 401"));
        else if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}`));
        else resolve();
      },
      fail: (err) => reject(new Error(err.errMsg || "network error"))
    });
    task.onChunkReceived((res) => {
      try {
        const text = decoder.decode(res.data);
        if (text) onChunk(text);
      } catch {
      }
    });
  }).catch(async (err) => {
    if (!retried && /401/.test(String(err.message))) {
      logout();
      await ensureAuthOnce().catch(() => {
      });
      return httpStreamPost(path, data, onChunk, true);
    }
    throw err;
  });
}
var Utf8StreamDecoder = class {
  constructor() {
    this.pending = [];
  }
  decode(chunk) {
    const bytes = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
    const buf = this.pending.length ? new Uint8Array([...this.pending, ...bytes]) : bytes;
    this.pending = [];
    let out = "";
    let i = 0;
    while (i < buf.length) {
      const b = buf[i];
      let cp = 0;
      let extra = 0;
      if (b < 128) {
        cp = b;
        extra = 0;
      } else if (b >= 192 && b < 224) {
        cp = b & 31;
        extra = 1;
      } else if (b >= 224 && b < 240) {
        cp = b & 15;
        extra = 2;
      } else if (b >= 240) {
        cp = b & 7;
        extra = 3;
      } else {
        i++;
        continue;
      }
      if (i + extra >= buf.length) {
        this.pending = Array.from(buf.slice(i));
        break;
      }
      let ok = true;
      for (let k = 1; k <= extra; k++) {
        const cont = buf[i + k];
        if ((cont & 192) !== 128) {
          ok = false;
          break;
        }
        cp = cp << 6 | cont & 63;
      }
      if (!ok) {
        i++;
        continue;
      }
      if (cp > 65535) {
        const v = cp - 65536;
        out += String.fromCharCode(55296 + (v >> 10), 56320 + (v & 1023));
      } else {
        out += String.fromCharCode(cp);
      }
      i += extra + 1;
    }
    return out;
  }
};
function createHttpTransport() {
  async function login(code, register) {
    const res = await request(
      "POST",
      "/auth/login",
      { code, register }
    );
    stubs_default.setStorageSync(KEY_TOKEN, res.token);
    stubs_default.setStorageSync(KEY_OPENID2, res.openid);
    const info = { role: devOverride() ?? res.role, openid: res.openid, nickname: res.nickname };
    stubs_default.setStorageSync(KEY_AUTH3, JSON.stringify(info));
    return info;
  }
  async function upgrade() {
    const res = await request(
      "POST",
      "/auth/upgrade"
    );
    stubs_default.setStorageSync(KEY_TOKEN, res.token);
    const prev = getCachedAuth();
    const info = { role: res.role, openid: res.openid, nickname: prev?.nickname };
    stubs_default.setStorageSync(KEY_AUTH3, JSON.stringify(info));
    return info;
  }
  async function getSnapshot() {
    if (dataRole() === "guest") return localStore.getSnapshot();
    const res = await request("GET", "/data/snapshot");
    return res.snapshot;
  }
  async function writeOps(ops) {
    if (dataRole() === "guest") return localStore.writeOps(ops);
    await request("PUT", "/data/keys", ops);
  }
  async function getTasks() {
    return request("GET", "/tasks");
  }
  async function getGrants() {
    if (dataRole() === "guest") return [];
    return request("GET", "/grants");
  }
  return { login, upgrade, getSnapshot, writeOps, getTasks, getGrants };
}
async function initTransport() {
  try {
    await request("GET", "/healthz");
    setTransport(createHttpTransport());
    return true;
  } catch {
    return false;
  }
}

// src/services/httpProxy.ts
async function httpFetchWeather(lat, lon) {
  return httpGetQ("/proxy/weather", { lat, lon });
}
async function httpSearchCities(q) {
  return httpGetQ("/proxy/geocode", { q });
}
async function httpReverseGeocode(lat, lon) {
  return httpGetQ("/proxy/geocode", { lat, lon });
}
async function httpSearchPois(lat, lon, keyword, radius = 1e3) {
  return httpGetQ("/proxy/poi", { lat, lon, keyword, radius });
}
async function httpChatAI(messages) {
  const res = await httpPost("/proxy/ai/chat", { messages });
  return res.text;
}
async function httpChatAIStream(messages, onDelta) {
  await httpStreamPost("/proxy/ai/chat", { messages, stream: true }, onDelta);
}
async function httpSubscribeReport(tmplIds) {
  await httpPost("/proxy/subscribe", { tmplIds });
}
async function httpSubscribeStatus() {
  return httpGetQ("/proxy/subscribe/status", {});
}

// src/services/api/proxy.ts
async function fetchWeather(lat, lon) {
  try {
    return await httpFetchWeather(lat, lon);
  } catch {
    return mockFetchWeather(lat, lon);
  }
}
async function searchCities(q) {
  try {
    return await httpSearchCities(q);
  } catch {
    return mockSearchCities(q);
  }
}
async function reverseGeocode(lat, lon) {
  try {
    return await httpReverseGeocode(lat, lon);
  } catch {
    return mockReverseGeocode(lat, lon);
  }
}
async function chatAI(messages) {
  try {
    return await httpChatAI(messages);
  } catch {
    return mockChat(messages);
  }
}
async function chatAIStream(messages, onDelta) {
  let got = false;
  try {
    await httpChatAIStream(messages, (d) => {
      got = true;
      onDelta(d);
    });
  } catch {
    if (!got) onDelta(await mockChat(messages));
  }
}
async function searchNearbyPois(lat, lon, keyword) {
  try {
    return await httpSearchPois(lat, lon, keyword);
  } catch {
    return mockSearchPois(lat, lon, keyword);
  }
}
var TMPL_TODO = "4GEsu8AAaxickTsv20fGqrAz85hbcR_6F1DZYNmboUg";
var TMPL_REVIEW = "4GEsu8AAaxickTsv20fGqrAz85hbcR_6F1DZYNmboUg";
var lastSubscribeAskDay = "";
async function fetchSubscribeStatus() {
  try {
    const res = await httpSubscribeStatus();
    return res.quota ?? {};
  } catch {
    return null;
  }
}
async function subscribeRemind(force = false) {
  const ids = [...new Set([TMPL_TODO, TMPL_REVIEW].filter(Boolean))];
  if (!ids.length) return;
  const today = todayStr();
  if (!force && lastSubscribeAskDay === today) return;
  lastSubscribeAskDay = today;
  try {
    const option = { tmplIds: ids };
    const res = await stubs_default.requestSubscribeMessage(option);
    const accepted = ids.filter((id) => res[id] === "accept");
    if (accepted.length) await httpSubscribeReport(accepted);
  } catch {
  }
}

// src/pages/today/index.tsx
var import__ = __toESM(require__());
var import__2 = __toESM(require__2());
var import__3 = __toESM(require__3());
var import_jsx_runtime3 = require("react/jsx-runtime");
function useNow(intervalMs = 3e4) {
  const [now, setNow] = (0, import_react3.useState)(() => /* @__PURE__ */ new Date());
  (0, import_react3.useEffect)(() => {
    const t = setInterval(() => setNow(/* @__PURE__ */ new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
var WEEKDAY_CN = ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"];
function examDateCN(date) {
  const d = /* @__PURE__ */ new Date(date + "T00:00:00");
  return `${d.getFullYear()}\u5E74${d.getMonth() + 1}\u6708${d.getDate()}\u65E5 \xB7 \u5468${WEEKDAY_CN[d.getDay()]}`;
}
function Today() {
  const { data, ready, auth, set } = useData();
  const now = useNow();
  const today = todayStr();
  const minute = nowMin();
  const upcomingExams = (0, import_react3.useMemo)(
    () => data.exams.filter((e) => daysBetween(today, e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date)),
    [data.exams, today]
  );
  const nextExam = upcomingExams[0] ?? null;
  const otherExams = upcomingExams.slice(1, 4);
  const [weather, setWeather] = (0, import_react3.useState)(null);
  const [weatherLoading, setWeatherLoading] = (0, import_react3.useState)(false);
  const loadWeather = (0, import_react3.useCallback)(() => {
    const city = data.settings.city;
    if (!city) {
      setWeather(null);
      return;
    }
    setWeatherLoading(true);
    fetchWeather(city.lat, city.lon).then(setWeather).catch(() => setWeather(null)).finally(() => setWeatherLoading(false));
  }, [data.settings.city]);
  (0, import_react3.useEffect)(() => {
    loadWeather();
  }, [loadWeather]);
  const [locOpen, setLocOpen] = (0, import_react3.useState)(false);
  const [locQuery, setLocQuery] = (0, import_react3.useState)("");
  const [locCands, setLocCands] = (0, import_react3.useState)([]);
  const [locSearching, setLocSearching] = (0, import_react3.useState)(false);
  const [locDetecting, setLocDetecting] = (0, import_react3.useState)(false);
  const applyCity = (c, source = "manual") => {
    set("settings", (prev) => ({ ...prev, city: c, citySource: source }));
    setLocOpen(false);
    setLocCands([]);
    setLocQuery("");
    showToast(`\u{1F4CD} \u5DF2\u5207\u6362\u5230 ${cityLabel(c)}`);
  };
  const searchLoc = async () => {
    const q = locQuery.trim();
    if (!q) return;
    setLocSearching(true);
    try {
      const list = await searchCities(q);
      setLocCands(list);
      if (list.length === 0) showToast("\u6CA1\u6709\u627E\u5230\u8FD9\u4E2A\u5730\u540D\uFF0C\u6362\u4E2A\u5199\u6CD5\u8BD5\u8BD5");
    } catch {
      showToast("\u641C\u7D22\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC");
    } finally {
      setLocSearching(false);
    }
  };
  const detectLocation = async () => {
    if (locDetecting) return;
    setLocDetecting(true);
    try {
      const setting = await stubs_default.getSetting();
      const granted = setting.authSetting["scope.userFuzzyLocation"];
      if (granted === false) {
        const { confirm } = await stubs_default.showModal({
          title: "\u9700\u8981\u5B9A\u4F4D\u6743\u9650",
          content: "\u5B9A\u4F4D\u6743\u9650\u66FE\u88AB\u62D2\u7EDD\uFF0C\u8BF7\u5728\u8BBE\u7F6E\u9875\u5F00\u542F\u300C\u4F4D\u7F6E\u4FE1\u606F\u300D\u540E\u91CD\u8BD5",
          confirmText: "\u53BB\u8BBE\u7F6E"
        });
        if (!confirm) return;
        const after = await stubs_default.openSetting();
        if (!after.authSetting["scope.userFuzzyLocation"]) {
          showToast("\u672A\u5F00\u542F\u4F4D\u7F6E\u6743\u9650\uFF0C\u53EF\u624B\u52A8\u641C\u7D22\u57CE\u5E02");
          return;
        }
      }
      let pos;
      try {
        pos = await stubs_default.getFuzzyLocation({ type: "gcj02" });
      } catch {
        showToast("\u5B9A\u4F4D\u5931\u8D25\uFF0C\u8BF7\u5141\u8BB8\u5B9A\u4F4D\u6743\u9650\u540E\u91CD\u8BD5");
        return;
      }
      try {
        const r = await reverseGeocode(pos.latitude, pos.longitude);
        applyCity({ name: r.name, province: r.province, city: r.city, lat: r.lat, lon: r.lon }, "auto");
      } catch {
        applyCity({ name: "\u5F53\u524D\u4F4D\u7F6E", province: "", lat: pos.latitude, lon: pos.longitude }, "auto");
      }
    } catch {
      showToast("\u5B9A\u4F4D\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u641C\u7D22\u57CE\u5E02");
    } finally {
      setLocDetecting(false);
    }
  };
  const autoLocate = async () => {
    if (!ready || data.settings.citySource === "manual") return;
    const flag = `kg_locate_${today}`;
    if (stubs_default.getStorageSync(flag)) return;
    try {
      const setting = await stubs_default.getSetting();
      const granted = setting.authSetting["scope.userFuzzyLocation"];
      if (granted === false) return;
      const pos = await stubs_default.getFuzzyLocation({ type: "gcj02" });
      stubs_default.setStorageSync(flag, "1");
      let next;
      try {
        const r = await reverseGeocode(pos.latitude, pos.longitude);
        next = { name: r.name, province: r.province, city: r.city, lat: r.lat, lon: r.lon };
      } catch {
        next = { name: "\u5F53\u524D\u4F4D\u7F6E", province: "", lat: pos.latitude, lon: pos.longitude };
      }
      const cur = data.settings.city;
      const same = cur && Math.abs(cur.lat - next.lat) < 0.01 && Math.abs(cur.lon - next.lon) < 0.01;
      if (!same) {
        set("settings", (prev) => ({ ...prev, city: next, citySource: "auto" }));
      }
    } catch {
    }
  };
  useDidShow(() => {
    autoLocate();
  });
  const dueTodos = data.todos.filter((t) => !t.done && t.dueDate && t.dueDate <= today).sort(
    (a, b) => (a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0) || (a.priority ?? 2) - (b.priority ?? 2)
  );
  const duePeriodic = data.periodic.filter((p) => daysBetween(p.lastDone, today) >= p.everyDays);
  const completePeriodic = (id) => set("periodic", (prev) => prev.map((p) => p.id === id ? { ...p, lastDone: today } : p));
  const toggleTodo = (t) => {
    const kids = t.children ?? [];
    const allDone = kids.length > 0 && kids.every((c) => c.done);
    set(
      "todos",
      (prev) => prev.map(
        (x) => x.id === t.id ? allDone ? { ...x, done: false, children: kids.map((c) => ({ ...c, done: false })) } : {
          ...x,
          done: true,
          ...kids.length > 0 ? { children: kids.map((c) => ({ ...c, done: true })) } : {}
        } : x
      )
    );
  };
  const toggleTodoChild = (t, cid) => {
    set(
      "todos",
      (prev) => prev.map((x) => {
        if (x.id !== t.id) return x;
        const kids = (x.children ?? []).map((c) => c.id === cid ? { ...c, done: !c.done } : c);
        const all = kids.length > 0 && kids.every((c) => c.done);
        return { ...x, children: kids, done: all ? true : x.done };
      })
    );
  };
  const [childModal, setChildModal] = (0, import_react3.useState)(null);
  const childTodo = childModal?.type === "todo" ? data.todos.find((t) => t.id === childModal.id) : void 0;
  const childCkItem = childModal?.type === "checkin" ? data.checkinItems.find((it) => it.id === childModal.id) : void 0;
  const dayLog = data.dayLogs[today] ?? { water: [], stand: [], meals: {} };
  const updateLog = (patch) => set("dayLogs", (prev) => ({
    ...prev,
    [today]: { ...{ water: [], stand: [], meals: {} }, ...prev[today], ...patch }
  }));
  const lastWater = dayLog.water.length ? Math.max(...dayLog.water) : null;
  const waterDue = lastWater === null ? minute >= hmToMin(data.settings.wake) + data.settings.water.intervalMin : minute - lastWater >= data.settings.water.intervalMin;
  const meals = [
    { key: "breakfast", label: "\u65E9\u9910", emoji: "\u{1F305}", time: data.settings.meals.breakfast },
    { key: "lunch", label: "\u5348\u9910", emoji: "\u{1F371}", time: data.settings.meals.lunch },
    { key: "dinner", label: "\u665A\u9910", emoji: "\u{1F319}", time: data.settings.meals.dinner }
  ];
  const sleepMin = hmToMin(data.settings.sleep);
  const sleepDue = minute >= sleepMin - 30;
  const showSleep = minute >= 19 * 60 + 30;
  const nearMeal = (0, import_react3.useMemo)(() => {
    const cands = meals.map((m) => ({ ...m, diff: minute - hmToMin(m.time) })).filter((m) => m.diff >= -120 && m.diff <= 120).sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));
    return cands[0] ?? null;
  }, [minute, data.settings.meals]);
  const nextMeal = (0, import_react3.useMemo)(() => {
    const cands = meals.map((m) => ({ ...m, diff: hmToMin(m.time) - minute })).filter((m) => m.diff > 0).sort((a, b) => a.diff - b.diff);
    if (cands[0]) return cands[0];
    const breakfast = meals[0];
    return { ...breakfast, diff: 24 * 60 - minute + hmToMin(breakfast.time) };
  }, [minute, data.settings.meals]);
  const mealFocus = nearMeal && !dayLog.meals[nearMeal.key] ? nearMeal : nextMeal;
  const mealDueNow = mealFocus === nearMeal && mealFocus.diff >= 0;
  const mealLeftMin = mealFocus === nearMeal ? Math.max(0, -mealFocus.diff) : mealFocus.diff;
  const hour = now.getHours();
  const greeting = hour < 5 ? "\u591C\u6DF1\u4E86\uFF0C\u65E9\u70B9\u4F11\u606F" : hour < 11 ? "\u65E9\u4E0A\u597D\uFF0C\u4ECA\u5929\u4E5F\u8981\u52A0\u6CB9" : hour < 14 ? "\u4E2D\u5348\u597D\uFF0C\u522B\u5FD8\u4E86\u5403\u996D" : hour < 18 ? "\u4E0B\u5348\u597D\uFF0C\u4FDD\u6301\u8282\u594F" : hour < 23 ? "\u665A\u4E0A\u597D\uFF0C\u518D\u575A\u6301\u4E00\u4F1A\u513F" : "\u591C\u6DF1\u4E86\uFF0C\u65E9\u70B9\u4F11\u606F";
  const dueNotes = (0, import_react3.useMemo)(() => data.notes.filter((n) => isNoteDue(n, today)), [data.notes, today]);
  const dueWrongs = (0, import_react3.useMemo)(
    () => data.quizBook.wrongs.filter((w) => isNoteDue(w, today) && quizById(w.quizId)),
    [data.quizBook.wrongs, today]
  );
  const reviewQueue = (0, import_react3.useMemo)(() => {
    const all = [
      ...dueNotes.map((n) => ({ kind: "note", note: n })),
      ...dueWrongs.map((w) => ({ kind: "quiz", wrong: w }))
    ];
    const pri = (c) => reviewPriority(c.kind === "note" ? c.note : c.wrong, today);
    all.sort((a, b) => pri(b) - pri(a));
    return all.slice(0, REVIEW_DAILY_LIMIT);
  }, [dueNotes, dueWrongs, today]);
  const reviewPool = (0, import_react3.useMemo)(
    () => data.notes.filter((n) => n.nextReviewDate !== null && n.reviewStep < 5).length + data.quizBook.wrongs.filter((w) => w.nextReviewDate !== null).length,
    [data.notes, data.quizBook.wrongs]
  );
  const reviewOverflow = dueNotes.length + dueWrongs.length - reviewQueue.length;
  const [reviewDone, setReviewDone] = (0, import_react3.useState)(0);
  const [flipped, setFlipped] = (0, import_react3.useState)(false);
  const reviewTotal = reviewQueue.length + reviewDone;
  const curCard = reviewQueue[0] ?? null;
  const curNote = curCard?.kind === "note" ? curCard.note : null;
  const curWrong = curCard?.kind === "quiz" ? curCard.wrong : null;
  const curQuiz = curWrong ? quizById(curWrong.quizId) : null;
  const answerReview = (rating) => {
    if (!curCard) return;
    subscribeRemind();
    const state = noteReviewState(curCard.kind === "note" ? curCard.note : curCard.wrong);
    const next = nextReviewState(state, rating);
    const { review, nextReviewDate } = next;
    if (curCard.kind === "note") {
      set("notes", (prev) => prev.map((x) => x.id === curCard.note.id ? { ...x, ...next } : x));
    } else {
      set("quizBook", (prev) => ({
        ...prev,
        wrongs: prev.wrongs.map(
          (w) => w.quizId === curCard.wrong.quizId ? { ...w, review, nextReviewDate } : w
        )
      }));
    }
    if (next.reviewStep >= 5) showToast("\u{1F389} \u8FD9\u5F20\u5361\u5DF2\u638C\u63E1\uFF01");
    setFlipped(false);
    setReviewDone((n) => n + 1);
  };
  const ratingBtns = /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "flash-btns", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      View,
      {
        className: "btn small ghost",
        onClick: (e) => {
          e.stopPropagation();
          answerReview("again");
        },
        children: "\u5FD8\u8BB0 \u{1F635}"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      View,
      {
        className: "btn small ghost",
        onClick: (e) => {
          e.stopPropagation();
          answerReview("hard");
        },
        children: "\u56F0\u96BE \u{1F610}"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      View,
      {
        className: "btn small",
        onClick: (e) => {
          e.stopPropagation();
          answerReview("good");
        },
        children: "\u4E00\u822C \u{1F642}"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      View,
      {
        className: "btn small",
        onClick: (e) => {
          e.stopPropagation();
          answerReview("easy");
        },
        children: "\u8F7B\u677E \u{1F604}"
      }
    )
  ] });
  const [waterQuiz, setWaterQuiz] = (0, import_react3.useState)(null);
  const [quizPicked, setQuizPicked] = (0, import_react3.useState)(null);
  const [quizSubmitted, setQuizSubmitted] = (0, import_react3.useState)(false);
  const [quizRevealed, setQuizRevealed] = (0, import_react3.useState)(false);
  const openWaterQuiz = () => {
    setWaterQuiz(pickWaterQuiz());
    setQuizPicked(null);
    setQuizSubmitted(false);
    setQuizRevealed(false);
  };
  const settleQuiz = (picked, revealed) => {
    if (!waterQuiz) return;
    const missed = revealed || picked !== null && picked !== waterQuiz.answer;
    set("quizBook", (prev) => {
      const stats = {
        ...prev.stats,
        answered: prev.stats.answered + (picked !== null ? 1 : 0),
        wrong: prev.stats.wrong + (missed ? 1 : 0)
      };
      if (!missed) return { ...prev, stats };
      const idx = prev.wrongs.findIndex((w) => w.quizId === waterQuiz.id);
      let wrongs = prev.wrongs;
      if (idx === -1) {
        wrongs = [
          ...prev.wrongs,
          {
            quizId: waterQuiz.id,
            wrongCount: 1,
            lastWrongAt: Date.now(),
            nextReviewDate: firstReviewDate(),
            review: { stability: 1, difficulty: 5, reps: 0, lapses: 0 }
          }
        ];
      } else {
        const { review, nextReviewDate } = nextReviewState(noteReviewState(prev.wrongs[idx]), "again");
        wrongs = prev.wrongs.map(
          (w, i) => i === idx ? { ...w, wrongCount: w.wrongCount + 1, lastWrongAt: Date.now(), review, nextReviewDate } : w
        );
      }
      return { ...prev, stats, wrongs };
    });
  };
  const recordWater = () => {
    updateLog({ water: [...dayLog.water, minute] });
    setWaterQuiz(null);
  };
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "sub", children: "\u6B63\u5728\u767B\u5F55\u4E0E\u540C\u6B65\u6570\u636E\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "page", children: [
    auth?.role === "guest" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "row", style: { justifyContent: "center", marginBottom: 10 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "chip warn", children: "\u6F14\u793A\u6A21\u5F0F \xB7 \u6837\u677F\u6570\u636E" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "page-title", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { children: [
      now.getMonth() + 1,
      "\u6708",
      now.getDate(),
      "\u65E5 \xB7 ",
      greeting
    ] }) }),
    nextExam ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "countdown-compact", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "cd-main", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "cd-days", children: [
          daysBetween(today, nextExam.date),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { style: { fontSize: 14, fontWeight: 500, marginLeft: 2 }, children: "\u5929" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "cd-info", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "cd-name", children: nextExam.name }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "cd-date", children: examDateCN(nextExam.date) })
        ] })
      ] }),
      otherExams.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "cd-others", children: otherExams.map((e) => `${e.name} ${daysBetween(today, e.date)} \u5929`).join(" \xB7 ") })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "countdown-compact", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "cd-main", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "target", size: 22 }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "cd-info", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "cd-name", children: "\u8FD8\u6CA1\u6709\u8BBE\u7F6E\u76EE\u6807\u8003\u8BD5" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "cd-date", children: "\u53BB\u300C\u8BFE\u7A0B\u300D\u9875\u6DFB\u52A0" })
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "card weather-card", children: data.settings.city ? weather ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "pin", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children: cityLabel(data.settings.city) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            View,
            {
              className: "icon-btn",
              onClick: () => setLocOpen(true),
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "compass", size: 16 })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            View,
            {
              className: "icon-btn",
              style: { opacity: weatherLoading ? 0.5 : 1 },
              onClick: () => {
                if (!weatherLoading) loadWeather();
              },
              children: weatherLoading ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children: "\u2026" }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "refresh", size: 16 })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "weather-line", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "temp", children: [
          weather.temp,
          "\xB0C"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "sub", children: [
          weather.desc,
          " \xB7 ",
          weather.tMin,
          "~",
          weather.tMax,
          "\xB0C"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "sub", style: { marginTop: 2 }, children: [
        "\u4F53\u611F ",
        weather.feels,
        "\xB0C \xB7 \u6E7F\u5EA6 ",
        weather.humidity,
        "%",
        weather.rainProb >= 40 ? " \xB7 \u2614 \u8BB0\u5F97\u5E26\u4F1E" : "",
        weather.tMin <= 10 ? " \xB7 \u{1F9E5} \u6CE8\u610F\u4FDD\u6696" : ""
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "sub", children: weatherLoading ? "\u5929\u6C14\u52A0\u8F7D\u4E2D\u2026" : "\u5929\u6C14\u83B7\u53D6\u5931\u8D25\uFF0C\u70B9\u53F3\u4E0A\u89D2\u91CD\u8BD5" }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "row-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "sub", children: "\u5F00\u542F\u5B9A\u4F4D\u540E\u81EA\u52A8\u663E\u793A\u5F53\u5730\u5929\u6C14" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "btn ghost small", onClick: detectLocation, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "pin", size: 12, gap: 4 }),
          "\u5F00\u542F\u5B9A\u4F4D"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          View,
          {
            className: "btn ghost small",
            style: { marginLeft: 8 },
            onClick: () => setLocOpen(true),
            children: "\u624B\u52A8\u9009\u62E9"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "pair-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
        View,
        {
          className: "pair-card meal-card",
          onClick: () => stubs_default.navigateTo({ url: "/pages/food/index" }),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "meal-lines", children: meals.map((m) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: `meal-line${dayLog.meals[m.key] ? " on" : ""}`, children: [
              m.emoji,
              " ",
              m.label,
              " ",
              m.time,
              dayLog.meals[m.key] ? " \u2713" : ""
            ] }, m.key)) }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "meal-count", children: [
              mealDueNow ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "meal-big", children: [
                "\u8BE5\u5403",
                mealFocus.label,
                "\u5566"
              ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "meal-small", children: [
                  "\u8DDD",
                  mealFocus.label,
                  "\u8FD8\u6709"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "meal-big", children: fmtHM(mealLeftMin) })
              ] }),
              data.foodLog[today]?.[mealFocus.key] && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "meal-small", children: [
                "\u4ECA\u5929\u5403\u300C",
                data.foodLog[today]?.[mealFocus.key],
                "\u300D"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Image, { className: "meal-animal", src: import__.default, mode: "aspectFit" })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: `pair-card water-card${waterDue ? " due" : ""}`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "water-title", children: "\u559D\u6C34" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "cup-wrap", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "cup", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            View,
            {
              className: `cup-fill${dayLog.water.length ? " has-water" : ""}`,
              style: {
                height: `${Math.min(100, dayLog.water.length / data.settings.water.targetCups * 100)}%`
              }
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "water-count", children: [
            dayLog.water.length,
            "/",
            data.settings.water.targetCups,
            " \u676F"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "water-foot", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: waterDue ? "chip warn" : "sub", style: { fontSize: 12 }, children: waterDue ? "\u8BE5\u559D\u6C34\u5566" : "\u8BB0\u5F97\u591A\u559D\u6C34" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "btn small", onClick: openWaterQuiz, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "droplet", size: 12, gap: 4 }),
            "\u559D\u4E00\u676F"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Image, { className: "water-animal", src: import__3.default, mode: "aspectFit" })
      ] })
    ] }),
    curCard ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "card-title", children: [
        curCard.kind === "quiz" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "book", size: 16, gap: 4 }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children: "\u9519\u9898\u590D\u4E60" })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "brain", size: 16, gap: 4 }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children: "\u4ECA\u65E5\u590D\u4E60" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "sub", children: [
          Math.min(reviewDone + 1, reviewTotal),
          "/",
          reviewTotal,
          " \xB7 \u7B2C",
          " ",
          noteReviewState(curCard.kind === "note" ? curCard.note : curCard.wrong).reps + 1,
          " ",
          "\u6B21\u590D\u4E60"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        View,
        {
          className: "flashcard",
          onClick: () => setFlipped((v) => !v),
          children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: `flash-inner ${flipped ? "flipped" : ""}`, children: curCard.kind === "note" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "flash-face flash-front", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "flash-text", children: curCard.note.text }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "sub", style: { fontSize: 14 }, children: "\u5C3D\u529B\u56DE\u5FC6\u8981\u70B9\uFF0C\u70B9\u51FB\u7FFB\u9762" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "flash-face flash-back", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "sub", style: { marginBottom: 4, textAlign: "center" }, children: [
                curCard.note.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "tag", children: t }, t)),
                "\u8BB0\u5F55\u4E8E ",
                new Date(curCard.note.createdAt).toLocaleDateString("zh-CN")
              ] }),
              ratingBtns
            ] })
          ] }) : curQuiz ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "flash-face flash-front", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "flash-text", children: curQuiz.q }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "sub", style: { fontSize: 14 }, children: [
                "\u66FE\u7B54\u9519 ",
                curCard.wrong.wrongCount,
                " \u6B21 \xB7 \u70B9\u51FB\u7FFB\u9762\u5BF9\u7B54\u6848"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "flash-face flash-back", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "sub", style: { marginBottom: 6, textAlign: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "chip success", children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "check", size: 12, gap: 4 }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children: curQuiz.options[curQuiz.answer] })
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { style: { fontSize: 16, marginBottom: 10 }, children: curQuiz.explain }),
              ratingBtns
            ] })
          ] }) : null })
        },
        curCard.kind === "note" ? curCard.note.id : `quiz-${curCard.wrong.quizId}`
      ),
      reviewOverflow > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "sub", style: { fontSize: 12, marginTop: 6 }, children: [
        "\u4ECA\u65E5\u4E0A\u9650 ",
        REVIEW_DAILY_LIMIT,
        " \u5F20\uFF0C\u53E6\u6709 ",
        reviewOverflow,
        " \u5F20\u987A\u5EF6\u81F3\u660E\u5929"
      ] })
    ] }) : reviewDone > 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "empty", children: "\u{1F389} \u4ECA\u65E5\u590D\u4E60\u5B8C\u6210\uFF0C\u660E\u5929\u89C1\uFF01" }),
      reviewOverflow > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "sub", style: { fontSize: 12 }, children: [
        "\u53E6\u6709 ",
        reviewOverflow,
        " \u5F20\u5230\u671F\u5361\u7247\u987A\u5EF6\u81F3\u660E\u5929"
      ] })
    ] }) : reviewPool > 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "empty", children: [
      "\u{1F9E0} \u4ECA\u65E5\u65E0\u5F85\u590D\u4E60\u5361\u7247\uFF08\u6C60\u4E2D\u5171 ",
      reviewPool,
      " \u5F20\uFF09"
    ] }) }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "pair-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "pair-card bm-card bm-todo", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "bm-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "pushpin", size: 14, gap: 4 }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "bm-title", children: "\u4ECA\u65E5\u4E8B\u9879" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "bm-count", children: duePeriodic.length + dueTodos.length })
        ] }),
        duePeriodic.length + dueTodos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "bm-empty", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Image, { className: "bm-animal", src: import__2.default, mode: "aspectFit" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            View,
            {
              className: "bm-add",
              onClick: () => stubs_default.navigateTo({ url: "/pages/todos/index" }),
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children: "+" })
            }
          )
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(ScrollView, { scrollY: true, className: "bm-list", children: [
          duePeriodic.map((p) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "bm-item", onClick: () => completePeriodic(p.id), children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "ms-check", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children: "" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "bm-name", children: p.name }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "bm-tag", children: [
              "\u6BCF",
              p.everyDays,
              "\u5929"
            ] })
          ] }, p.id)),
          dueTodos.map((t) => {
            const kids = t.children ?? [];
            const over = !!t.dueDate && t.dueDate < today;
            const openKids = () => setChildModal({ type: "todo", id: t.id });
            return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "bm-item", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "ms-check", onClick: () => toggleTodo(t), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children: "" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                Text,
                {
                  className: `bm-name${over ? " over" : ""}`,
                  onClick: () => kids.length > 0 ? openKids() : toggleTodo(t),
                  children: t.text
                }
              ),
              kids.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "bm-expand", onClick: openKids, children: "\u2304" }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "bm-tag", children: over ? "\u903E\u671F" : fmtDateShort(t.dueDate) })
            ] }, t.id);
          })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "pair-card bm-card bm-checkin", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "bm-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "check-square", size: 14, gap: 4 }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "bm-title", children: "\u4ECA\u65E5\u6253\u5361" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "bm-count", children: [
            data.checkinItems.filter((it) => isItemDone(it, data.checkins[today] ?? [])).length,
            "/",
            data.checkinItems.length
          ] })
        ] }),
        data.checkinItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "bm-empty", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Image, { className: "bm-animal", src: import__2.default, mode: "aspectFit" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            View,
            {
              className: "bm-add",
              onClick: () => stubs_default.switchTab({ url: "/pages/checkin/index" }),
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children: "+" })
            }
          )
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ScrollView, { scrollY: true, className: "bm-list", children: data.checkinItems.map((it) => {
          const done = isItemDone(it, data.checkins[today] ?? []);
          const kids = it.children ?? [];
          const toggleIt = () => set("checkins", (prev) => ({
            ...prev,
            [today]: toggleItemIds(it, prev[today] ?? [])
          }));
          const openKids = () => setChildModal({ type: "checkin", id: it.id });
          return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "bm-item", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: `ms-check${done ? " on" : ""}`, onClick: toggleIt, children: done ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "check", size: 12 }) : null }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
              Text,
              {
                className: `bm-name${done ? " done" : ""}`,
                onClick: () => kids.length > 0 ? openKids() : toggleIt(),
                children: [
                  it.emoji,
                  " ",
                  it.name
                ]
              }
            ),
            kids.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "bm-expand", onClick: openKids, children: "\u2304" })
          ] }, it.id);
        }) })
      ] })
    ] }),
    showSleep && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: `card ${sleepDue ? "due" : ""}`, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "hero-tip", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "emoji", children: sleepDue ? "\u{1F634}" : "\u{1F319}" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { style: { flex: 1 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "row-between", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children: "\u7761\u7720\u7763\u4FC3" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: sleepDue ? "chip warn" : "sub", children: sleepDue ? "\u8BE5\u7761\u89C9\u4E86\uFF0C\u522B\u5237\u624B\u673A\uFF01" : "\u8DDD\u7761\u89C9\u8FD8\u6709 " + fmtHM(Math.max(0, sleepMin - minute)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "sub", style: { marginTop: 4 }, children: [
          "\u76EE\u6807\uFF1A",
          data.settings.wake,
          " \u8D77\u5E8A \xB7 ",
          data.settings.sleep,
          " \u7761\u89C9"
        ] })
      ] })
    ] }) }),
    childModal && (childTodo || childCkItem) && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Modal, { variant: "center", className: "child-modal", onClose: () => setChildModal(null), children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children: childModal.type === "todo" ? `\u{1F4CC} ${childTodo?.text ?? ""}` : `${childCkItem?.emoji ?? ""} ${childCkItem?.name ?? ""}` }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "quiz-close", onClick: () => setChildModal(null), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "x", size: 16 }) })
      ] }),
      childModal.type === "todo" && childTodo && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "child-list", children: [
        (childTodo.children ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "list-item", onClick: () => toggleTodoChild(childTodo, c.id), children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: `ms-check${c.done ? " on" : ""}`, children: c.done ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "check", size: 12 }) : null }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: `grow${c.done ? " done" : ""}`, children: c.text })
        ] }, c.id)),
        (childTodo.children ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "empty", children: "\u6CA1\u6709\u5B50\u4EFB\u52A1" })
      ] }),
      childModal.type === "checkin" && childCkItem && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "child-list", children: [
        flattenLeaves(childCkItem).map((leaf) => {
          const checked = data.checkins[today] ?? [];
          const on = checked.includes(leaf.id);
          return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            View,
            {
              className: "list-item",
              style: { paddingLeft: 12 + leaf.depth * 16 },
              onClick: () => set("checkins", (prev) => ({
                ...prev,
                [today]: toggleLeafId(prev[today] ?? [], leaf.id)
              })),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: `ms-check${on ? " on" : ""}`, children: on ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "check", size: 12 }) : null }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: `grow${on ? " done" : ""}`, children: [
                  leaf.emoji ? `${leaf.emoji} ` : "",
                  leaf.name
                ] })
              ]
            },
            leaf.id
          );
        }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "sub", style: { textAlign: "center", marginTop: 8 }, children: [
          "\u8FDB\u5EA6 ",
          leafProgress(childCkItem, data.checkins[today] ?? []).done,
          "/",
          leafProgress(childCkItem, data.checkins[today] ?? []).total
        ] })
      ] })
    ] }),
    locOpen && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Modal, { variant: "center", closeOnMask: false, onClose: () => setLocOpen(false), children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "pin", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children: "\u6240\u5728\u4F4D\u7F6E" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "quiz-close", onClick: () => setLocOpen(false), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "x", size: 16 }) })
      ] }),
      data.settings.city && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "sub", style: { marginBottom: 8 }, children: [
        "\u5F53\u524D\uFF1A",
        cityLabel(data.settings.city)
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
        View,
        {
          className: `btn${locDetecting ? " is-disabled" : ""}`,
          style: { width: "100%" },
          onClick: () => void detectLocation(),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "signal", size: 12, gap: 4 }),
            locDetecting ? "\u5B9A\u4F4D\u4E2D\u2026" : "\u81EA\u52A8\u68C0\u6D4B\u5F53\u524D\u4F4D\u7F6E"
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "sub", style: { textAlign: "center", margin: "10px 0 6px" }, children: "\u6216\u624B\u52A8\u641C\u7D22\uFF08\u652F\u6301\u533A\u53BF\u7EA7\uFF0C\u5982 \u6D1B\u9F99\u533A\uFF09" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "form-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "field", style: { flex: 1, marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          Input,
          {
            placeholder: "\u57CE\u5E02 / \u533A\u53BF\u540D",
            value: locQuery,
            onInput: (e) => setLocQuery(e.detail.value),
            onConfirm: () => void searchLoc()
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          View,
          {
            className: `btn small${locSearching ? " is-disabled" : ""}`,
            onClick: () => {
              if (!locSearching) void searchLoc();
            },
            children: locSearching ? "\u641C\u7D22\u4E2D\u2026" : "\u641C\u7D22"
          }
        )
      ] }),
      locCands.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { style: { marginTop: 10 }, children: locCands.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "list-item", onClick: () => applyCity(c), children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Text, { className: "grow", children: [
          cityLabel(c),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "sub", children: c.province })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "sub", children: "\u203A" })
      ] }, i)) })
    ] }),
    waterQuiz && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Modal, { variant: "center", className: "quiz-modal", closeOnMask: false, onClose: () => setWaterQuiz(null), children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "droplet", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children: "\u559D\u6C34\u5C0F\u8003 \xB7 \u5E38\u8BC6\u5224\u65AD" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "quiz-close", onClick: () => setWaterQuiz(null), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "x", size: 16 }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "quiz-q", children: waterQuiz.q }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { className: "quiz-opts", children: waterQuiz.options.map((opt, i) => {
        const answered = quizSubmitted || quizRevealed;
        const state = quizPicked === i && !answered ? "sel" : !answered ? "" : i === waterQuiz.answer ? "correct" : quizPicked === i ? "wrong" : "";
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          View,
          {
            className: `quiz-opt ${state}`,
            onClick: () => {
              if (!answered) setQuizPicked(i);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "grow", children: opt }),
              answered && i === waterQuiz.answer && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "check", size: 14, color: "#2f9e6e", className: "opt-mark" }),
              answered && quizPicked === i && i !== waterQuiz.answer && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "x", size: 14, color: "#c0392b", className: "opt-mark" }),
              !answered && quizPicked === i && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "opt-mark pick", children: "\u25CF" })
            ]
          },
          i
        );
      }) }),
      !quizSubmitted && !quizRevealed && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "row", style: { marginTop: 12, gap: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          View,
          {
            className: `btn${quizPicked === null ? " is-disabled" : ""}`,
            style: { flex: 1 },
            onClick: () => {
              if (quizPicked !== null) {
                setQuizSubmitted(true);
                settleQuiz(quizPicked, false);
              }
            },
            children: "\u63D0\u4EA4\u7B54\u6848"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          View,
          {
            className: "btn ghost",
            style: { flex: 1 },
            onClick: () => {
              setQuizRevealed(true);
              settleQuiz(null, true);
            },
            children: "\u76F4\u63A5\u770B\u7B54\u6848"
          }
        )
      ] }),
      (quizSubmitted || quizRevealed) && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { className: "quiz-explain", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(View, { style: { fontWeight: 700, marginBottom: 4 }, children: quizSubmitted ? quizPicked === waterQuiz.answer ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "check-square", size: 16, color: "#2f9e6e", gap: 4 }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children: "\u7B54\u5BF9\u4E86\uFF01" })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "x-circle", size: 16, color: "#c0392b", gap: 4 }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children: "\u7B54\u9519\u4E86\uFF0C\u6B63\u786E\u7B54\u6848\u5DF2\u6807\u7EFF" })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "pushpin", size: 16, gap: 4 }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { children: "\u6B63\u786E\u7B54\u6848\u5DF2\u6807\u7EFF" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "sub", children: waterQuiz.explain }),
        (quizRevealed || quizSubmitted && quizPicked !== waterQuiz.answer) && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(View, { style: { marginTop: 6, display: "flex", alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "book", size: 12, gap: 4 }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { className: "sub", style: { fontSize: 12 }, children: "\u5DF2\u8BB0\u5165\u9519\u9898\u672C\uFF0C\u5C06\u6309\u8BB0\u5FC6\u66F2\u7EBF\u5B89\u6392\u590D\u4E60" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          View,
          {
            className: "btn small",
            style: { marginTop: 10, width: "100%" },
            onClick: recordWater,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "droplet", size: 12, gap: 4 }),
              "\u8BB0\u5F55\u559D\u6C34"
            ]
          }
        )
      ] })
    ] })
  ] });
}

// src/pages/courses/index.tsx
var import_react6 = require("react");

// src/components/MilestonePickerModal.tsx
var import_react5 = require("react");

// src/utils/exam-templates.ts
var EXAM_TEMPLATES = [
  {
    type: "civil",
    label: "\u516C\u52A1\u5458\uFF08\u56FD\u8003/\u7701\u8003\uFF09",
    keywords: ["\u56FD\u8003", "\u7701\u8003", "\u516C\u52A1\u5458", "\u516C\u8003", "\u9009\u8C03", "\u9074\u9009"],
    nodes: [
      { label: "\u516C\u544A\u53D1\u5E03", offset: -120 },
      { label: "\u7F51\u4E0A\u62A5\u540D", offset: -45 },
      { label: "\u62A5\u540D\u7F34\u8D39", offset: -35 },
      { label: "\u6253\u5370\u51C6\u8003\u8BC1", offset: -7 },
      { label: "\u7B14\u8BD5", offset: 0 },
      { label: "\u6210\u7EE9\u516C\u5E03", offset: 45 },
      { label: "\u9762\u8BD5", offset: 75 },
      { label: "\u4F53\u68C0\u653F\u5BA1", offset: 100 }
    ]
  },
  {
    type: "cet",
    label: "\u56DB\u516D\u7EA7",
    keywords: ["\u56DB\u7EA7", "\u516D\u7EA7", "cet", "\u56DB\u516D\u7EA7"],
    nodes: [
      { label: "\u62A5\u540D\u5F00\u59CB", offset: -60 },
      { label: "\u6253\u5370\u51C6\u8003\u8BC1", offset: -10 },
      { label: "\u7B14\u8BD5", offset: 0 },
      { label: "\u6210\u7EE9\u53D1\u5E03", offset: 67 }
    ]
  },
  {
    type: "kaoyan",
    label: "\u8003\u7814",
    keywords: ["\u8003\u7814", "\u7814\u7A76\u751F", "\u7855\u58EB"],
    nodes: [
      { label: "\u9884\u62A5\u540D", offset: -90 },
      { label: "\u6B63\u5F0F\u62A5\u540D", offset: -80 },
      { label: "\u6253\u5370\u51C6\u8003\u8BC1", offset: -10 },
      { label: "\u521D\u8BD5", offset: 0 },
      { label: "\u6210\u7EE9\u516C\u5E03", offset: 60 },
      { label: "\u590D\u8BD5", offset: 100 }
    ]
  },
  {
    type: "teacher",
    label: "\u6559\u8D44",
    keywords: ["\u6559\u8D44", "\u6559\u5E08\u8D44\u683C"],
    nodes: [
      { label: "\u62A5\u540D", offset: -60 },
      { label: "\u6253\u5370\u51C6\u8003\u8BC1", offset: -7 },
      { label: "\u7B14\u8BD5", offset: 0 },
      { label: "\u6210\u7EE9\u516C\u5E03", offset: 40 },
      { label: "\u9762\u8BD5", offset: 60 }
    ]
  },
  {
    type: "final",
    label: "\u671F\u672B/\u671F\u4E2D",
    keywords: ["\u671F\u672B", "\u671F\u4E2D"],
    nodes: [
      { label: "\u590D\u4E60\u5F00\u59CB", offset: -14 },
      { label: "\u8003\u8BD5", offset: 0 }
    ]
  }
];
var GENERIC_EXAM_TEMPLATE = {
  type: "generic",
  label: "\u901A\u7528",
  keywords: [],
  nodes: [
    { label: "\u62A5\u540D", offset: -60 },
    { label: "\u51B2\u523A\u590D\u4E60", offset: -14 },
    { label: "\u8003\u8BD5", offset: 0 }
  ]
};
var ALL_EXAM_TEMPLATES = [...EXAM_TEMPLATES, GENERIC_EXAM_TEMPLATE];
function matchExamTemplate(name) {
  const n = name.toLowerCase();
  for (const t of EXAM_TEMPLATES) {
    if (t.keywords.some((k) => n.includes(k.toLowerCase()))) return t;
  }
  return null;
}

// src/components/DatePicker.tsx
var import_react4 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var WEEK = ["\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u65E5"];
function ymOf(ds) {
  return { y: Number(ds.slice(0, 4)), m: Number(ds.slice(5, 7)) };
}
function fmtDateShort2(ds) {
  const { y, m } = ymOf(ds);
  const d = Number(ds.slice(8, 10));
  return (y !== (/* @__PURE__ */ new Date()).getFullYear() ? `${y}\u5E74` : "") + `${m}\u6708${d}\u65E5`;
}
function fmtFull(ds) {
  const { y, m } = ymOf(ds);
  return `${y}\u5E74${m}\u6708${Number(ds.slice(8, 10))}\u65E5`;
}
function DatePicker3({
  value,
  onChange,
  placeholder = "\u9009\u65E5\u671F",
  compact = false,
  fmt
}) {
  const [open, setOpen] = (0, import_react4.useState)(false);
  const [view, setView] = (0, import_react4.useState)(() => ymOf(value || todayStr()));
  const today = todayStr();
  const cells = (0, import_react4.useMemo)(() => {
    const { y, m } = view;
    const daysInMonth2 = new Date(y, m, 0).getDate();
    const offset = (new Date(y, m - 1, 1).getDay() + 6) % 7;
    const prevDays = new Date(y, m - 1, 0).getDate();
    const list = [];
    for (let i = offset; i > 0; i--)
      list.push({ ds: dateStr(new Date(y, m - 2, prevDays - i + 1)), day: prevDays - i + 1, inMonth: false });
    for (let d = 1; d <= daysInMonth2; d++)
      list.push({ ds: dateStr(new Date(y, m - 1, d)), day: d, inMonth: true });
    let n = 1;
    while (list.length % 7 !== 0) {
      list.push({ ds: dateStr(new Date(y, m, n)), day: n, inMonth: false });
      n++;
    }
    return list;
  }, [view]);
  const pick = (ds) => {
    onChange(ds);
    setOpen(false);
  };
  const shift = (delta) => setView((v) => {
    const d = new Date(v.y, v.m - 1 + delta, 1);
    return { y: d.getFullYear(), m: d.getMonth() + 1 };
  });
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      View,
      {
        className: `dp-trigger${compact ? " compact" : ""}`,
        onClick: () => {
          setView(ymOf(value || today));
          setOpen(true);
        },
        children: [
          value ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Text, { children: fmt ? fmt(value) : compact ? fmtDateShort2(value) : fmtFull(value) }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Text, { className: "dp-ph", children: placeholder }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Icon, { name: "calendar", size: 14, className: "dp-ico" })
        ]
      }
    ),
    open && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(Modal, { variant: "sheet", className: "dp-cal", onClose: () => setOpen(false), children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(View, { className: "dp-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(View, { className: "dp-nav", onClick: () => shift(-1), children: "\u2039" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(Text, { className: "dp-title", children: [
          view.y,
          "\u5E74",
          view.m,
          "\u6708"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(View, { className: "dp-nav", onClick: () => shift(1), children: "\u203A" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(View, { className: "dp-grid", children: [
        WEEK.map((w) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Text, { className: "wk", children: w }, w)),
        cells.map((c) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          View,
          {
            className: `dp-day${c.inMonth ? "" : " adj"}${c.ds === today ? " today" : ""}${c.ds === value ? " sel" : ""}`,
            onClick: () => pick(c.ds),
            children: c.day
          },
          c.ds
        ))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(View, { className: "dp-actions", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        View,
        {
          className: "btn ghost small",
          onClick: () => {
            setView(ymOf(today));
            pick(today);
          },
          children: "\u4ECA\u5929"
        }
      ) })
    ] })
  ] });
}

// src/components/MilestonePickerModal.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function offsetLabel(offset) {
  if (offset === 0) return "\u8003\u8BD5\u65E5";
  return offset < 0 ? `\u8003\u524D ${-offset} \u5929` : `\u8003\u540E ${offset} \u5929`;
}
function MilestonePickerModal({
  examName,
  examDate,
  initialType,
  existingLabels,
  onConfirm,
  onClose
}) {
  const [tplType, setTplType] = (0, import_react5.useState)(initialType ?? GENERIC_EXAM_TEMPLATE.type);
  const tpl = ALL_EXAM_TEMPLATES.find((t) => t.type === tplType) ?? GENERIC_EXAM_TEMPLATE;
  const [date, setDate] = (0, import_react5.useState)(examDate);
  const [dateOverride, setDateOverride] = (0, import_react5.useState)({});
  const [checked, setChecked] = (0, import_react5.useState)(
    () => new Set(tpl.nodes.map((_, i) => i).filter((i) => !isAdded(i)))
  );
  const [animating, setAnimating] = (0, import_react5.useState)(false);
  const timersRef = (0, import_react5.useRef)([]);
  function isAdded(i) {
    return existingLabels ? existingLabels.includes(tpl.nodes[i].label) : false;
  }
  function clearTimers() {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }
  const switchTpl = (type) => {
    clearTimers();
    setAnimating(false);
    setTplType(type);
    setDateOverride({});
    const t = ALL_EXAM_TEMPLATES.find((x) => x.type === type) ?? GENERIC_EXAM_TEMPLATE;
    const existing = existingLabels ?? [];
    setChecked(
      new Set(t.nodes.map((_, i) => i).filter((i) => !existing.includes(t.nodes[i].label)))
    );
  };
  const toggle = (i) => {
    if (isAdded(i)) return;
    clearTimers();
    setAnimating(false);
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };
  const selectAll = () => {
    clearTimers();
    setAnimating(true);
    const targets = tpl.nodes.map((_, i) => i).filter((i) => !isAdded(i));
    const next = /* @__PURE__ */ new Set();
    setChecked(/* @__PURE__ */ new Set());
    targets.forEach((i, k) => {
      const t = setTimeout(() => {
        next.add(i);
        setChecked(new Set(next));
        if (k === targets.length - 1) setAnimating(false);
      }, k * 90);
      timersRef.current.push(t);
    });
    if (targets.length === 0) setAnimating(false);
  };
  const clearAll = () => {
    clearTimers();
    setAnimating(false);
    setChecked(/* @__PURE__ */ new Set());
  };
  const changeExamDate = (d) => {
    setDate(d);
    setDateOverride({});
  };
  const nodeDate = (n, i) => dateOverride[i] ?? addDays(date, n.offset);
  const confirm = () => {
    clearTimers();
    const nodes = tpl.nodes.map((n, i) => ({ ...n, i })).filter((n) => checked.has(n.i)).map((n) => ({ label: n.label, date: nodeDate(n, n.i) }));
    onConfirm(nodes, tpl.type, date);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(Modal, { variant: "sheet", onClose, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(View, { className: "card-title", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(Text, { style: { overflow: "hidden" }, children: [
        "\u4E3A\u300C",
        examName,
        "\u300D\u9009\u62E9\u8282\u70B9"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(View, { className: "icon-btn", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Icon, { name: "x", size: 18 }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(View, { className: "row", style: { marginBottom: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Text, { className: "sub", style: { flexShrink: 0 }, children: "\u8003\u8BD5\u65E5\u671F" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(DatePicker3, { value: date, onChange: changeExamDate, compact: true })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(View, { className: "row", style: { marginBottom: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Text, { className: "sub", style: { flexShrink: 0 }, children: "\u8282\u70B9\u6A21\u677F" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        Picker,
        {
          mode: "selector",
          range: ALL_EXAM_TEMPLATES.map((t) => t.label),
          onChange: (e) => switchTpl(ALL_EXAM_TEMPLATES[Number(e.detail.value)].type),
          children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(View, { className: "picker-shell tpl-select", children: tpl.label })
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(View, { style: { maxHeight: "40vh", overflowY: "auto" }, children: tpl.nodes.map((n, i) => {
      const on = checked.has(i);
      const added = isAdded(i);
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(View, { className: `list-item ${on ? "done" : ""}`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          View,
          {
            className: `ms-check${on ? " on" : ""}${added ? " disabled" : ""}`,
            onClick: () => toggle(i),
            children: on ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Icon, { name: "check", size: 12 }) : null
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(View, { className: "grow ms-line", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(View, { className: "row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Text, { className: "grow name", children: n.label }),
            added ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Text, { className: "tag added-tag", children: "\u5DF2\u6DFB\u52A0" }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Text, { className: "sub", style: { fontSize: 12, flexShrink: 0 }, children: offsetLabel(n.offset) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            DatePicker3,
            {
              compact: true,
              value: nodeDate(n, i),
              onChange: (d) => {
                if (added) return;
                setDateOverride((prev) => ({ ...prev, [i]: d }));
              }
            }
          )
        ] })
      ] }, n.label);
    }) }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(View, { className: "row", style: { justifyContent: "center", gap: 10, marginTop: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        View,
        {
          className: `btn plain small${animating ? " is-disabled" : ""}`,
          onClick: () => {
            if (!animating) selectAll();
          },
          children: animating ? "\u5168\u9009\u4E2D\u2026" : "\u5168\u9009"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(View, { className: "btn plain small", onClick: clearAll, children: "\u6E05\u7A7A" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      View,
      {
        className: `btn${checked.size === 0 ? " is-disabled" : ""}`,
        style: { width: "100%", marginTop: 10 },
        onClick: () => {
          if (checked.size > 0) confirm();
        },
        children: [
          "\u65B0\u589E ",
          checked.size,
          " \u4E2A\u8282\u70B9"
        ]
      }
    )
  ] });
}

// src/pages/courses/index.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
function CourseCard({ course }) {
  const { set } = useData();
  const [editing, setEditing] = (0, import_react6.useState)(false);
  const today = todayStr();
  const total = Math.max(1, course.total);
  const pct = Math.round(course.done / total * 100);
  const daysLeft = daysBetween(today, course.targetDate);
  const span = Math.max(1, daysBetween(course.createdAt, course.targetDate));
  const elapsed = Math.min(span, Math.max(0, daysBetween(course.createdAt, today)));
  const expectedPct = Math.round(elapsed / span * 100);
  const finished = course.done >= course.total;
  const lag = !finished && pct < expectedPct - 4;
  const perDay = daysLeft > 0 ? Math.ceil((course.total - course.done) / daysLeft) : course.total - course.done;
  const save = (patch) => set("courses", (prev) => prev.map((c) => c.id === course.id ? { ...c, ...patch } : c));
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "card-title", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: course.name }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "row", style: { flexShrink: 0 }, children: [
        finished ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { className: "badge ok", children: "\u5DF2\u5B8C\u6210 \u{1F389}" }) : lag ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { className: "badge lag", children: "\u8FDB\u5EA6\u843D\u540E" }) : pct > expectedPct + 4 ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { className: "badge ahead", children: "\u9886\u5148" }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { className: "badge ok", children: "\u6B63\u5E38" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "icon-btn", onClick: () => setEditing((v) => !v), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Icon, { name: "pencil", size: 18 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          View,
          {
            className: "icon-btn",
            onClick: () => {
              void appConfirm(`\u5220\u9664\u8BFE\u7A0B\u300C${course.name}\u300D\uFF1F`, void 0, {
                danger: true,
                confirmText: "\u5220\u9664"
              }).then((ok) => {
                if (ok) set("courses", (prev) => prev.filter((c) => c.id !== course.id));
              });
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Icon, { name: "trash", size: 18 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "progress", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "progress-fill", style: { width: `${pct}%` } }) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "row-between sub", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Text, { className: "sub", children: [
        course.done,
        "/",
        course.total,
        " \u8282 \xB7 ",
        pct,
        "%"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Text, { className: "sub", children: [
        "\u76EE\u6807\u65E5\u671F ",
        course.targetDate
      ] })
    ] }),
    !finished && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "row-between", style: { marginTop: 8 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "sub", style: { flex: 1, lineHeight: 1.5 }, children: daysLeft > 0 ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Text, { className: "sub", children: [
        "\u8FD8\u5269 ",
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { style: { color: "var(--danger)", fontWeight: 700 }, children: daysLeft }),
        " \u5929\uFF0C\u6BCF\u5929\u9700\u770B",
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { style: { fontWeight: 700 }, children: perDay }),
        " \u8282"
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Text, { style: { color: "var(--danger)", fontWeight: 700 }, children: [
        "\u5DF2\u5230/\u8D85\u8FC7\u76EE\u6807\u65E5\u671F\uFF0C\u8FD8\u5DEE ",
        course.total - course.done,
        " \u8282"
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          View,
          {
            className: "btn plain small",
            onClick: () => save({ done: Math.max(0, course.done - 1) }),
            children: "\u22121"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          View,
          {
            className: "btn small",
            onClick: () => save({ done: Math.min(course.total, course.done + 1) }),
            children: "\u770B\u5B8C\u4E00\u8282 +1"
          }
        )
      ] })
    ] }),
    editing && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { style: { marginTop: 10 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Label, { children: "\u8BFE\u7A0B\u540D" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Input, { value: course.name, onInput: (e) => save({ name: e.detail.value }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "form-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Label, { children: "\u603B\u8282\u6570" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            Input,
            {
              type: "number",
              value: String(course.total),
              onInput: (e) => save({ total: Math.max(1, Number(e.detail.value) || 1) })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Label, { children: "\u76EE\u6807\u5B8C\u6210\u65E5" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DatePicker2, { value: course.targetDate, onChange: (v) => save({ targetDate: v }) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "btn ghost small", onClick: () => setEditing(false), children: "\u5B8C\u6210" })
    ] })
  ] });
}
function ExamCard({ exam }) {
  const { set } = useData();
  const [label, setLabel] = (0, import_react6.useState)("");
  const [date, setDate] = (0, import_react6.useState)("");
  const [tplOpen, setTplOpen] = (0, import_react6.useState)(false);
  const today = todayStr();
  const left = daysBetween(today, exam.date);
  const curType = exam.templateType ?? matchExamTemplate(exam.name)?.type ?? GENERIC_EXAM_TEMPLATE.type;
  const save = (patch) => set("exams", (prev) => prev.map((e) => e.id === exam.id ? { ...e, ...patch } : e));
  const applyPicked = (nodes, templateType, examDate) => {
    setTplOpen(false);
    save({
      templateType,
      date: examDate,
      milestones: [
        ...exam.milestones,
        ...nodes.map((n) => ({ id: uid(), label: n.label, date: n.date, done: n.date < today }))
      ]
    });
    showToast(`\u5DF2\u65B0\u589E ${nodes.length} \u4E2A\u8282\u70B9`);
  };
  const addMilestone = () => {
    if (!label.trim()) {
      showToast("\u8BF7\u8F93\u5165\u8282\u70B9\u540D\u79F0");
      return;
    }
    if (!date) {
      showToast("\u8BF7\u9009\u62E9\u8282\u70B9\u65E5\u671F");
      return;
    }
    save({
      milestones: [...exam.milestones, { id: uid(), label: label.trim(), date, done: date < today }]
    });
    setLabel("");
    setDate("");
  };
  const sortedMilestones = [...exam.milestones].sort(
    (a, b) => Number(a.done) - Number(b.done) || a.date.localeCompare(b.date)
  );
  const milestoneItems = sortedMilestones.map((m) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: `list-item ${m.done ? "done" : ""}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      View,
      {
        className: `ms-check${m.done ? " on" : ""}`,
        onClick: () => save({
          milestones: exam.milestones.map((x) => x.id === m.id ? { ...x, done: !x.done } : x)
        }),
        children: m.done ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Icon, { name: "check", size: 12, color: "#fff" }) : null
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "grow ms-line", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { className: "name", children: m.label }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        DatePicker2,
        {
          compact: true,
          value: m.date,
          onChange: (d) => save({
            // 改日期后按「早于今天 = 已完成」重新判定，排序随之刷新
            milestones: exam.milestones.map(
              (x) => x.id === m.id ? { ...x, date: d, done: d < today } : x
            )
          })
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      View,
      {
        className: "icon-btn",
        onClick: () => save({ milestones: exam.milestones.filter((x) => x.id !== m.id) }),
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Icon, { name: "x", size: 18 })
      }
    )
  ] }, m.id));
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "card-title", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Icon, { name: "target", size: 16, gap: 4 }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { children: exam.name }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "row", style: { flexShrink: 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "icon-btn", onClick: () => setTplOpen(true), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Icon, { name: "clipboard", size: 18 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          View,
          {
            className: "icon-btn",
            onClick: () => {
              void appConfirm(`\u5220\u9664\u8003\u8BD5\u300C${exam.name}\u300D\u53CA\u5176\u8282\u70B9\uFF1F`, void 0, {
                danger: true,
                confirmText: "\u5220\u9664"
              }).then((ok) => {
                if (ok) set("exams", (prev) => prev.filter((e) => e.id !== exam.id));
              });
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Icon, { name: "trash", size: 18 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "row-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Text, { className: "sub", children: [
        "\u8003\u8BD5\u65E5 ",
        exam.date
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { className: "chip", children: left > 0 ? `\u8FD8\u5269 ${left} \u5929` : left === 0 ? "\u4ECA\u5929\u8003\u8BD5\uFF01" : `\u5DF2\u8FC7\u53BB ${-left} \u5929` })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { style: { marginTop: 8 }, children: [
      exam.milestones.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { className: "empty", children: "\u8FD8\u6CA1\u6709\u8282\u70B9\uFF0C\u70B9\u53F3\u4E0A \u{1F4CB} \u52FE\u9009\u6A21\u677F\u8282\u70B9\uFF0C\u6216\u4E0B\u65B9\u624B\u52A8\u6DFB\u52A0" }),
      exam.milestones.length > 0 && (exam.milestones.length > 4 ? (
        /* 超过 4 个节点时固定高度内部滚动查看（行高约 50px × 4） */
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ScrollView, { scrollY: true, style: { height: 204 }, children: milestoneItems })
      ) : milestoneItems)
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "form-row", style: { marginTop: 8 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "field", style: { flex: 1, marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        Input,
        {
          placeholder: "\u8282\u70B9\u540D\u79F0\uFF08\u5982\uFF1A\u62A5\u540D\uFF09",
          value: label,
          onInput: (e) => setLabel(e.detail.value)
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "field", style: { marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DatePicker2, { value: date, onChange: setDate }) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "btn small", onClick: addMilestone, children: "\u6DFB\u52A0" })
    ] }),
    tplOpen && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      MilestonePickerModal,
      {
        examName: exam.name,
        examDate: exam.date,
        initialType: curType,
        existingLabels: exam.milestones.map((m) => m.label),
        onConfirm: applyPicked,
        onClose: () => setTplOpen(false)
      }
    )
  ] });
}
function Courses() {
  const { data, ready, set } = useData();
  const [name, setName] = (0, import_react6.useState)("");
  const [total, setTotal] = (0, import_react6.useState)("");
  const [targetDate, setTargetDate] = (0, import_react6.useState)("");
  const [examName, setExamName] = (0, import_react6.useState)("");
  const [examDate, setExamDate] = (0, import_react6.useState)("");
  const [picker, setPicker] = (0, import_react6.useState)(null);
  const today = todayStr();
  const addCourse = () => {
    if (!name.trim()) {
      showToast("\u8BF7\u8F93\u5165\u8BFE\u7A0B\u540D");
      return;
    }
    if (!total) {
      showToast("\u8BF7\u8F93\u5165\u603B\u8282\u6570");
      return;
    }
    if (!targetDate) {
      showToast("\u8BF7\u9009\u62E9\u76EE\u6807\u5B8C\u6210\u65E5");
      return;
    }
    const course = {
      id: uid(),
      name: name.trim(),
      total: Math.max(1, Number(total)),
      done: 0,
      targetDate,
      createdAt: today
    };
    set("courses", (prev) => [...prev, course]);
    setName("");
    setTotal("");
    setTargetDate("");
  };
  const openExamPicker = () => {
    if (!examName.trim()) {
      showToast("\u8BF7\u8F93\u5165\u8003\u8BD5\u540D\u79F0");
      return;
    }
    if (!examDate) {
      showToast("\u8BF7\u9009\u62E9\u8003\u8BD5\u65E5\u671F");
      return;
    }
    const tpl = matchExamTemplate(examName);
    setPicker({ name: examName.trim(), date: examDate, initialType: tpl?.type });
  };
  const createExam = (nodes, templateType, examDate2) => {
    if (!picker) return;
    const exam = {
      id: uid(),
      name: picker.name,
      date: examDate2,
      milestones: nodes.map((n) => ({ id: uid(), label: n.label, date: n.date, done: n.date < today })),
      templateType
    };
    set("exams", (prev) => [...prev, exam]);
    showToast(`\u5DF2\u4E3A\u300C${exam.name}\u300D\u751F\u6210 ${nodes.length} \u4E2A\u8282\u70B9`);
    setPicker(null);
    setExamName("");
    setExamDate("");
  };
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { className: "sub", children: "\u52A0\u8F7D\u4E2D\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "page-title", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Icon, { name: "book", size: 16, gap: 4 }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { children: "\u8BFE\u7A0B\u4E0E\u8003\u8BD5" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { className: "section-label", style: { marginTop: 0 }, children: "\u8003\u8BD5\u5012\u8BA1\u65F6" }),
    data.exams.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { className: "empty", children: "\u6DFB\u52A0\u76EE\u6807\u8003\u8BD5\uFF08\u5982 2027 \u56FD\u8003\uFF09\uFF0C\u5728\u5F39\u7A97\u91CC\u52FE\u9009\u62A5\u540D\u3001\u7F34\u8D39\u7B49\u5173\u952E\u8282\u70B9" }) }),
    data.exams.map((exam) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ExamCard, { exam }, exam.id)),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "form-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "field", style: { flex: 1, marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        Input,
        {
          placeholder: "\u8003\u8BD5\u540D\u79F0\uFF08\u5982 2027 \u56FD\u8003\uFF09",
          value: examName,
          onInput: (e) => setExamName(e.detail.value)
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "field", style: { marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DatePicker2, { value: examDate, onChange: setExamDate }) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "btn small", onClick: openExamPicker, children: "\u6DFB\u52A0" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { className: "section-label", children: "\u5F55\u64AD\u8BFE\u8FDB\u5EA6" }),
    data.courses.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Text, { className: "empty", children: "\u6DFB\u52A0\u4F60\u62A5\u7684\u5F55\u64AD\u8BFE\uFF0C\u8BB0\u5F55\u8FDB\u5EA6\uFF0C\u81EA\u52A8\u5012\u6392\u6BCF\u5929\u8BE5\u770B\u51E0\u8282" }) }),
    data.courses.map((course) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(CourseCard, { course }, course.id)),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Label, { children: "\u8BFE\u7A0B\u540D" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Input, { placeholder: "\u5982\uFF1A\u884C\u6D4B\u7CFB\u7EDF\u73ED", value: name, onInput: (e) => setName(e.detail.value) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "form-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "field", style: { flex: "none", width: 84, marginBottom: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Label, { children: "\u603B\u8282\u6570" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            Input,
            {
              type: "number",
              placeholder: "80",
              value: total,
              onInput: (e) => setTotal(e.detail.value)
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(View, { className: "field", style: { flex: 1, minWidth: 0, marginBottom: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Label, { children: "\u76EE\u6807\u5B8C\u6210\u65E5" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DatePicker2, { value: targetDate, onChange: setTargetDate })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(View, { className: "btn small", style: { flexShrink: 0 }, onClick: addCourse, children: "\u6DFB\u52A0" })
      ] })
    ] }),
    picker && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      MilestonePickerModal,
      {
        examName: picker.name,
        examDate: picker.date,
        initialType: picker.initialType,
        onConfirm: createExam,
        onClose: () => setPicker(null)
      }
    )
  ] });
}

// src/pages/checkin/index.tsx
var import_react8 = require("react");

// src/components/CheckinSummary.tsx
var import_react7 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
function CheckinSummary({
  items,
  checked,
  onToggleItem,
  onToggleLeaf,
  streakOf,
  renderRight,
  onAddChild
}) {
  const [sheetId, setSheetId] = (0, import_react7.useState)(null);
  const [collapsed, setCollapsed] = (0, import_react7.useState)(/* @__PURE__ */ new Set());
  const [childDraft, setChildDraft] = (0, import_react7.useState)("");
  const groups = (0, import_react7.useMemo)(() => groupItemsBySeverity(items, checked), [items, checked]);
  const sheetItem = items.find((it) => it.id === sheetId) ?? null;
  const toggleCollapse = (severity) => setCollapsed((prev) => {
    const next = new Set(prev);
    if (next.has(severity)) next.delete(severity);
    else next.add(severity);
    return next;
  });
  const openSheet = (item) => {
    setSheetId(item.id);
    setChildDraft("");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(View, { children: [
    groups.map((g) => {
      const meta = SEVERITY_META[g.severity];
      const isCollapsed = collapsed.has(g.severity);
      return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(View, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(View, { className: "ck-group-h", onClick: () => toggleCollapse(g.severity), children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(View, { className: "ck-dot", style: { background: meta.color } }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Text, { className: "ck-group-label", children: meta.label }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Text, { className: "sub", style: { marginLeft: "auto", fontSize: 12 }, children: [
            g.items.filter((it) => isItemDone(it, checked)).length,
            "/",
            g.items.length
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Text, { className: "ck-caret", children: isCollapsed ? "\u25B8" : "\u25BE" })
        ] }),
        !isCollapsed && g.items.map((item) => {
          const kids = item.children ?? [];
          const hasKids = kids.length > 0;
          const done = isItemDone(item, checked);
          const prog = leafProgress(item, checked);
          const streak = streakOf?.(item) ?? 0;
          return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(View, { className: `ck-row ${done ? "done" : ""}`, children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(View, { className: `ck-sev-bar ${meta.cls}` }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Text, { className: "ck-emoji", children: item.emoji }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(View, { className: "grow ck-body", onClick: () => hasKids ? openSheet(item) : void 0, children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Text, { className: `ck-name ${hasKids ? "ci-toggle" : ""}`, children: item.name }),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Text, { className: "ck-meta", children: [item.category, LEVEL_META[levelOf(item)].label].filter(Boolean).join(" \xB7 ") })
            ] }),
            hasKids && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
              Text,
              {
                className: `ck-badge ${done ? "" : "warn"}`,
                onClick: () => openSheet(item),
                children: [
                  prog.done,
                  "/",
                  prog.total,
                  " \u5B50\u9879"
                ]
              }
            ),
            streak > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(View, { className: "chip", children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Icon, { name: "flame", size: 12, color: "#be5016", gap: 4 }),
              streak,
              " \u5929"
            ] }),
            renderRight?.(item),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
              View,
              {
                className: `ms-check${done ? " on" : ""}`,
                onClick: () => onToggleItem(item),
                children: done ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Icon, { name: "check", size: 12 }) : null
              }
            )
          ] }, item.id);
        })
      ] }, g.severity);
    }),
    sheetItem && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Modal, { variant: "sheet", className: "ck-sheet", onClose: () => setSheetId(null), children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(View, { className: "ck-grab" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(View, { className: "ck-sheet-h", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Text, { children: [
          sheetItem.emoji,
          " ",
          sheetItem.name,
          " \xB7 \u4ECA\u65E5\u5B50\u9879"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Text, { className: "sub", children: [
          leafProgress(sheetItem, checked).done,
          "/",
          leafProgress(sheetItem, checked).total,
          " \u5DF2\u5B8C\u6210"
        ] })
      ] }),
      flattenLeaves(sheetItem).map((leaf) => {
        const leafDone = checked.includes(leaf.id);
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          View,
          {
            className: `ck-sheet-row ${leafDone ? "done" : ""}`,
            onClick: () => onToggleLeaf(leaf.id),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(View, { className: `child-dot ${leafDone ? "on" : ""}`, children: leafDone ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Icon, { name: "check", size: 12 }) : null }),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Text, { className: "ck-sheet-name", style: { paddingLeft: leaf.depth * 16 }, children: [
                leaf.emoji ? `${leaf.emoji} ` : "",
                leaf.name
              ] })
            ]
          },
          leaf.id
        );
      }),
      onAddChild && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(View, { className: "ck-sheet-add", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        Input,
        {
          placeholder: "+ \u5B50\u9879\u540D\u79F0\uFF08\u786E\u8BA4\u952E\u6DFB\u52A0\uFF09",
          value: childDraft,
          onInput: (e) => setChildDraft(e.detail.value),
          onConfirm: () => {
            const name = childDraft.trim();
            if (!name) return;
            onAddChild(sheetItem, name);
            setChildDraft("");
          }
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(View, { className: "ck-sheet-foot", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          View,
          {
            className: "btn ghost small",
            onClick: () => onToggleItem(sheetItem),
            children: isItemDone(sheetItem, checked) ? "\u53D6\u6D88\u5B8C\u6210" : "\u5168\u90E8\u5B8C\u6210"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(View, { className: "btn small", onClick: () => setSheetId(null), children: "\u6536\u8D77" })
      ] })
    ] })
  ] });
}

// src/pages/checkin/index.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
var MOODS = ["\u{1F62B}", "\u{1F61E}", "\u{1F610}", "\u{1F642}", "\u{1F604}"];
function checkAchieve(r, ctx) {
  const n = r.condParam ?? 0;
  switch (r.condType) {
    case "streak":
      return n > 0 && ctx.allStreak >= n;
    case "total_full":
      return n > 0 && ctx.totalFullDays >= n;
    case "weekend_full":
      return ctx.weekendFull;
    case "mood3":
      return ctx.moodStreak >= (n || 3);
    case "pomo_day":
      return ctx.pomoToday >= (n || 3);
    default:
      return false;
  }
}
function condProgress(r, ctx) {
  const n = r.condParam ?? 0;
  switch (r.condType) {
    case "streak":
      return { cur: ctx.allStreak, target: n, unit: "\u5929" };
    case "total_full":
      return { cur: ctx.totalFullDays, target: n, unit: "\u5929" };
    case "mood3":
      return { cur: ctx.moodStreak, target: n || 3, unit: "\u5929" };
    case "pomo_day":
      return { cur: ctx.pomoToday, target: n || 3, unit: "\u4E2A" };
    default:
      return null;
  }
}
function condText(r) {
  const n = r.condParam ?? 0;
  switch (r.condType) {
    case "streak":
      return `\u8FDE\u7EED ${n} \u5929\u5168\u52E4\u89E3\u9501`;
    case "total_full":
      return `\u7D2F\u8BA1 ${n} \u5929\u5168\u52E4\u89E3\u9501`;
    case "mood3":
      return `\u8FDE\u7EED ${n || 3} \u5929\u597D\u5FC3\u60C5\u89E3\u9501`;
    case "pomo_day":
      return `\u5355\u65E5\u4E13\u6CE8 ${n || 3} \u4E2A\u756A\u8304\u89E3\u9501`;
    case "weekend_full":
      return "\u5468\u672B\u53CC\u6EE1\u52E4\u89E3\u9501";
    default:
      return "\u8FBE\u6210\u6761\u4EF6\u89E3\u9501";
  }
}
function hasItemMark(item, ids) {
  return leafIds(item).some((id) => ids.includes(id));
}
function isDayFull(checkins, items, ds) {
  if (items.length === 0) return false;
  const ids = checkins[ds] ?? [];
  return items.every((it) => isItemDone(it, ids));
}
function streakForItem(checkins, item) {
  let streak = 0;
  const d = /* @__PURE__ */ new Date();
  if (!hasItemMark(item, checkins[dateStr(d)] ?? [])) d.setDate(d.getDate() - 1);
  while (hasItemMark(item, checkins[dateStr(d)] ?? [])) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
function fullStreakItems(checkins, items) {
  if (items.length === 0) return 0;
  let streak = 0;
  const d = /* @__PURE__ */ new Date();
  if (!isDayFull(checkins, items, dateStr(d))) d.setDate(d.getDate() - 1);
  while (isDayFull(checkins, items, dateStr(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
function bestFullStreakItems(checkins, items) {
  if (items.length === 0) return 0;
  const days = Object.keys(checkins).sort();
  let best = 0;
  let cur = 0;
  let prev = null;
  for (const day of days) {
    if (!isDayFull(checkins, items, day)) {
      cur = 0;
      prev = null;
      continue;
    }
    cur = prev && daysBetween(prev, day) === 1 ? cur + 1 : 1;
    best = Math.max(best, cur);
    prev = day;
  }
  return best;
}
function Checkin() {
  const { data, ready, set } = useData();
  const today = todayStr();
  const [newName, setNewName] = (0, import_react8.useState)("");
  const [newEmoji, setNewEmoji] = (0, import_react8.useState)("\u{1F4CC}");
  const [newCategory, setNewCategory] = (0, import_react8.useState)("");
  const [newLevel, setNewLevel] = (0, import_react8.useState)("normal");
  const [newSeverity, setNewSeverity] = (0, import_react8.useState)("medium");
  const [moodNote, setMoodNote] = (0, import_react8.useState)("");
  const todayChecked = data.checkins[today] ?? [];
  const itemCount = data.checkinItems.length;
  const todayDone = data.checkinItems.filter((it) => isItemDone(it, todayChecked)).length;
  const allStreak = fullStreakItems(data.checkins, data.checkinItems);
  const bestStreak = bestFullStreakItems(data.checkins, data.checkinItems);
  const toggleLeaf = (leafId) => set("checkins", (prev) => ({ ...prev, [today]: toggleLeafId(prev[today] ?? [], leafId) }));
  const toggleItem = (item) => set("checkins", (prev) => ({ ...prev, [today]: toggleItemIds(item, prev[today] ?? []) }));
  const addChild = (parent, name) => {
    set(
      "checkinItems",
      (prev) => prev.map(
        (it) => it.id === parent.id ? { ...it, children: [...it.children ?? [], { id: uid(), name }] } : it
      )
    );
    showToast("\u5B50\u9879\u5DF2\u6DFB\u52A0 \u2713");
  };
  const mood = data.moods[today];
  const hour = (/* @__PURE__ */ new Date()).getHours();
  const rewardCtx = (0, import_react8.useMemo)(() => {
    const full = (ds) => isDayFull(data.checkins, data.checkinItems, ds);
    const totalFullDays = Object.keys(data.checkins).filter(full).length;
    let moodStreak = 0;
    for (let i = 0; i < 60; i++) {
      const d = addDays(today, -i);
      const m = data.moods[d]?.mood;
      if (m === void 0) {
        if (i === 0) continue;
        break;
      }
      if (m >= 4) moodStreak++;
      else break;
    }
    const now = /* @__PURE__ */ new Date();
    const sat = new Date(now);
    sat.setDate(now.getDate() - (now.getDay() + 1) % 7);
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
    const weekendFull = dateStr(sun) <= today && full(dateStr(sat)) && full(dateStr(sun));
    const pomoToday = data.pomodoroLogs.filter((l) => l.date === today).length;
    return { allStreak, totalFullDays, moodStreak, weekendFull, pomoToday };
  }, [data.checkins, data.checkinItems, data.moods, data.pomodoroLogs, allStreak, today]);
  const [boxQueue, setBoxQueue] = (0, import_react8.useState)([]);
  const [boxOpened, setBoxOpened] = (0, import_react8.useState)(false);
  (0, import_react8.useEffect)(() => {
    if (!ready) return;
    const newly = data.rewards.filter((r) => !r.claimed && checkAchieve(r, rewardCtx));
    if (newly.length === 0) return;
    set(
      "rewards",
      (prev) => prev.map((r) => {
        const hit = newly.find((n) => n.id === r.id);
        if (!hit) return r;
        return {
          ...r,
          claimed: true,
          granted: true,
          achievedAt: Date.now(),
          code: r.mode === "code" ? r.code ?? genRedeemCode() : r.code
        };
      })
    );
    for (const n of newly) {
      if (n.hidden) showToast(`\u{1F389} \u89E3\u9501\u9690\u85CF\u4EFB\u52A1\uFF1A${n.title}\uFF01`);
    }
    setBoxQueue((prev) => prev.length > 0 ? prev : newly);
  }, [data.rewards, rewardCtx, ready]);
  const closeBox = () => {
    setBoxQueue((prev) => prev.slice(1));
    setBoxOpened(false);
  };
  const [heatRange, setHeatRange] = (0, import_react8.useState)("week");
  const [weekOffset, setWeekOffset] = (0, import_react8.useState)(0);
  const [monthOffset, setMonthOffset] = (0, import_react8.useState)(0);
  const [yearOffset, setYearOffset] = (0, import_react8.useState)(0);
  const [detailDate, setDetailDate] = (0, import_react8.useState)(null);
  const weekDays = (0, import_react8.useMemo)(() => {
    const now = /* @__PURE__ */ new Date(today + "T00:00:00");
    const monday = addDays(today, -((now.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => addDays(monday, i + weekOffset * 7));
  }, [today, weekOffset]);
  const weekTitle = `${weekDays[0].slice(5)} ~ ${weekDays[6].slice(5)}`;
  const monthCells = (0, import_react8.useMemo)(() => {
    const base = /* @__PURE__ */ new Date(today + "T00:00:00");
    base.setDate(1);
    base.setMonth(base.getMonth() + monthOffset);
    const y = base.getFullYear();
    const m = base.getMonth();
    const daysInMonth2 = new Date(y, m + 1, 0).getDate();
    const offset = (new Date(y, m, 1).getDay() + 6) % 7;
    return { y, m, daysInMonth: daysInMonth2, offset };
  }, [today, monthOffset]);
  const yearMonths = (0, import_react8.useMemo)(() => {
    const y = (/* @__PURE__ */ new Date(today + "T00:00:00")).getFullYear() + yearOffset;
    const now = /* @__PURE__ */ new Date(today + "T00:00:00");
    const counts = [];
    for (let m = 0; m < 12; m++) {
      const dim = new Date(y, m + 1, 0).getDate();
      const last = y === now.getFullYear() && m === now.getMonth() ? now.getDate() : dim;
      let days = 0;
      for (let d = 1; d <= last; d++) {
        const ds = dateStr(new Date(y, m, d));
        if ((data.checkins[ds] ?? []).length > 0) days++;
      }
      const ratio = last > 0 ? days / last : 0;
      const level = ratio > 0.75 ? 4 : ratio > 0.5 ? 3 : ratio > 0.25 ? 2 : days > 0 ? 1 : 0;
      counts.push({ label: `${m + 1}\u6708`, days, level });
    }
    return counts;
  }, [today, data.checkins, yearOffset]);
  const heatActive = (0, import_react8.useMemo)(
    () => weekDays.filter((d) => d <= today && (data.checkins[d] ?? []).length > 0).length,
    [weekDays, data.checkins, today]
  );
  const yearSel = (0, import_react8.useMemo)(
    () => (/* @__PURE__ */ new Date(today + "T00:00:00")).getFullYear() + yearOffset,
    [today, yearOffset]
  );
  const cellLevel = (d) => {
    const n = (data.checkins[d] ?? []).length;
    return n >= 4 ? 4 : n;
  };
  const setMood = (val) => {
    const prevMood = mood?.mood;
    set("moods", (prev) => ({
      ...prev,
      [today]: { mood: val, note: prev[today]?.note }
    }));
    showToast("\u4ECA\u5929\u7684\u5FC3\u60C5\u5DF2\u8BB0\u4E0B \u2713");
    if (val <= 2 && (prevMood === void 0 || prevMood > 2) && stubs_default.getStorageSync("last_comfort_date") !== today) {
      openComfort();
    }
  };
  const submitMoodNote = () => {
    if (!moodNote.trim()) {
      showToast("\u8BF7\u8F93\u5165\u8BDD\u8BED\u5185\u5BB9");
      return;
    }
    set("moods", (prev) => ({
      ...prev,
      [today]: { mood: prev[today]?.mood ?? 3, note: moodNote.trim() }
    }));
    showToast("\u8BDD\u8BED\u5DF2\u8BB0\u4E0B \u2713");
  };
  (0, import_react8.useEffect)(() => {
    setMoodNote(mood?.note ?? "");
  }, [mood?.note]);
  const [comfortOpen, setComfortOpen] = (0, import_react8.useState)(false);
  const [comfortText, setComfortText] = (0, import_react8.useState)("");
  const [typed, setTyped] = (0, import_react8.useState)(0);
  const openComfort = () => {
    stubs_default.setStorageSync("last_comfort_date", today);
    setComfortOpen(true);
    setComfortText("");
    setTyped(0);
    const run = async () => {
      let text = null;
      if (data.settings.intel?.enabled) {
        try {
          text = await chatAI([
            { role: "user", content: "\u4F60\u670B\u53CB\u5907\u8003\u5FC3\u60C5\u5F88\u5DEE\uFF0C\u7528\u5E7D\u9ED8\u6E29\u6696\u7684\u670B\u53CB\u53E3\u543B\u5B89\u6170\u597950\u4E2A\u5B57\uFF0C\u4E0D\u8981\u66A7\u6627\u3001\u4E0D\u8981\u8BF4\u6559" }
          ]);
        } catch {
          text = null;
        }
      }
      setComfortText(text ?? COMFORT_QUOTES[Math.floor(Math.random() * COMFORT_QUOTES.length)]);
    };
    void run();
  };
  (0, import_react8.useEffect)(() => {
    if (!comfortText) return;
    setTyped(0);
    let n = 0;
    const t = setInterval(() => {
      n++;
      setTyped(n);
      if (n >= comfortText.length) clearInterval(t);
    }, 45);
    return () => clearInterval(t);
  }, [comfortText]);
  const bag = data.rewards.filter((r) => r.granted);
  const visibleTasks = data.rewards.filter((r) => !r.hidden && r.condType);
  const hiddenLeft = data.rewards.filter((r) => r.hidden && !r.claimed).length;
  const useCoupon = (r) => {
    if (r.used) return;
    set("rewards", (prev) => prev.map((x) => x.id === r.id ? { ...x, used: true } : x));
    showToast(`\u300C${r.title}\u300D\u5DF2\u6838\u9500 \u{1F49D}`);
  };
  const curBox = boxQueue[0] ?? null;
  const addCheckinItem = () => {
    if (!newName.trim()) {
      showToast("\u8BF7\u8F93\u5165\u6253\u5361\u9879\u76EE\u540D\u79F0");
      return;
    }
    set("checkinItems", (prev) => [
      ...prev,
      {
        id: uid(),
        name: newName.trim(),
        emoji: newEmoji || "\u{1F4CC}",
        category: newCategory.trim() || void 0,
        level: newLevel,
        severity: newSeverity
      }
    ]);
    setNewName("");
  };
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "sub", children: "\u52A0\u8F7D\u4E2D\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "page-title", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Icon, { name: "check-square", size: 16, gap: 4 }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { children: "\u6BCF\u65E5\u6253\u5361" })
    ] }),
    hour >= 21 && !mood && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "mood-hint", children: "\u4ECA\u5929\u8FC7\u5F97\u600E\u4E48\u6837\uFF1F\u8BB0\u4E00\u7B14\u5FC3\u60C5\u5427 \u{1F319}" }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Text, { children: [
          "\u4ECA\u5929\uFF08",
          today.slice(5),
          "\uFF09"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Text, { className: "sub", children: [
          todayDone,
          "/",
          itemCount
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(ScrollView, { scrollY: true, className: "checkin-scroll", children: [
        data.checkinItems.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "empty", children: "\u8FD8\u6CA1\u6709\u6253\u5361\u9879" }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          CheckinSummary,
          {
            items: data.checkinItems,
            checked: todayChecked,
            onToggleItem: toggleItem,
            onToggleLeaf: toggleLeaf,
            streakOf: (it) => streakForItem(data.checkins, it),
            onAddChild: addChild,
            renderRight: (item) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
              View,
              {
                className: "icon-btn",
                onClick: () => {
                  const hasKids = (item.children ?? []).length > 0;
                  void appConfirm(
                    `\u5220\u9664\u6253\u5361\u9879\u300C${item.name}\u300D\uFF1F`,
                    hasKids ? "\u5B50\u9879\u4F1A\u4E00\u8D77\u5220\u9664\uFF0C\u5386\u53F2\u8BB0\u5F55\u4FDD\u7559" : "\u5386\u53F2\u8BB0\u5F55\u4F1A\u4FDD\u7559",
                    {
                      danger: true,
                      confirmText: "\u5220\u9664"
                    }
                  ).then((ok) => {
                    if (ok) set("checkinItems", (prev) => prev.filter((x) => x.id !== item.id));
                  });
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Icon, { name: "x", size: 18, color: "#c0392b" })
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "form-row", style: { marginTop: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "field", style: { width: 60, marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          Input,
          {
            value: newEmoji,
            onInput: (e) => setNewEmoji(e.detail.value),
            maxlength: 2
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "field", style: { flex: 1, marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          Input,
          {
            placeholder: "\u65B0\u6253\u5361\u9879\uFF08\u5982\uFF1A\u7EC3\u5B57\uFF09",
            value: newName,
            onInput: (e) => setNewName(e.detail.value),
            onConfirm: addCheckinItem
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "field", style: { width: 72, marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          Input,
          {
            placeholder: "\u5206\u7C7B",
            value: newCategory,
            onInput: (e) => setNewCategory(e.detail.value),
            maxlength: 6
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "btn small", onClick: addCheckinItem, children: "\u6DFB\u52A0" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "ck-seg-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "ck-seg-label", children: "\u7B49\u7EA7" }),
        [
          ["core", "\u6838\u5FC3"],
          ["normal", "\u5E38\u89C4"],
          ["flex", "\u5F39\u6027"]
        ].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          View,
          {
            className: `ck-seg ${newLevel === k ? "active" : ""}`,
            onClick: () => setNewLevel(k),
            children: label
          },
          k
        )),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "ck-seg-label", style: { marginLeft: 10 }, children: "\u4E25\u91CD\u5EA6" }),
        [
          ["high", "\u9AD8"],
          ["medium", "\u4E2D"],
          ["low", "\u4F4E"]
        ].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          View,
          {
            className: `ck-seg ${newSeverity === k ? "active" : ""}`,
            onClick: () => setNewSeverity(k),
            children: label
          },
          k
        ))
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Icon, { name: "calendar", size: 16, gap: 4 }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { children: "\u6253\u5361\u70ED\u529B\u56FE" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "sub", children: heatRange === "week" ? `${heatActive} \u5929\u6709\u6253\u5361` : heatRange === "month" ? `${monthCells.y} \u5E74 ${monthCells.m + 1} \u6708` : `${yearSel} \u5E74` })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "seg-tabs", style: { marginBottom: 10 }, children: [["week", "\u5468"], ["month", "\u6708"], ["year", "\u5E74"]].map(
        ([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          View,
          {
            className: `seg-tab ${heatRange === k ? "active" : ""}`,
            onClick: () => setHeatRange(k),
            children: label
          },
          k
        )
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "heat-nav", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          View,
          {
            className: "heat-nav-btn",
            onClick: () => heatRange === "week" ? setWeekOffset((o) => o - 1) : heatRange === "month" ? setMonthOffset((o) => o - 1) : setYearOffset((o) => o - 1),
            children: "\u2039"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "heat-nav-title", children: heatRange === "week" ? weekTitle : heatRange === "month" ? `${monthCells.y} \u5E74 ${monthCells.m + 1} \u6708` : `${yearSel} \u5E74` }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          View,
          {
            className: "heat-nav-btn",
            style: {
              opacity: (heatRange === "week" ? weekOffset >= 0 : heatRange === "month" ? monthOffset >= 0 : yearOffset >= 0) ? 0.35 : 1
            },
            onClick: () => {
              const blocked = heatRange === "week" ? weekOffset >= 0 : heatRange === "month" ? monthOffset >= 0 : yearOffset >= 0;
              if (blocked) return;
              heatRange === "week" ? setWeekOffset((o) => o + 1) : heatRange === "month" ? setMonthOffset((o) => o + 1) : setYearOffset((o) => o + 1);
            },
            children: "\u203A"
          }
        )
      ] }),
      heatRange === "week" && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "heat-week", children: weekDays.map((d) => {
        const n = (data.checkins[d] ?? []).length;
        const level = d > today ? -1 : cellLevel(d);
        return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "heat-w-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Text, { className: "w-day", children: [
            ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"][(/* @__PURE__ */ new Date(d + "T00:00:00")).getDay()],
            " ",
            d.slice(5)
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "w-bar", children: level >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            View,
            {
              className: `w-fill hm-l${level}`,
              style: { width: `${n / Math.max(1, itemCount) * 100}%` }
            }
          ) : null }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "w-n", children: d > today ? "\xB7" : n })
        ] }, d);
      }) }),
      heatRange === "month" && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "heatmap-weekdays month-grid-weekdays", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { children: "\u4E00" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { children: "\u4E8C" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { children: "\u4E09" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { children: "\u56DB" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { children: "\u4E94" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { children: "\u516D" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { children: "\u65E5" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "heatmap month-full", children: Array.from({ length: monthCells.offset + monthCells.daysInMonth }, (_, i) => {
          const day = i - monthCells.offset + 1;
          if (day < 1) return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "hm-cell blank" }, i);
          const ds = dateStr(new Date(monthCells.y, monthCells.m, day));
          const n = (data.checkins[ds] ?? []).length;
          const future = ds > today;
          return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            View,
            {
              className: `hm-cell ${future ? "future" : n > 0 ? "hit" : ""} ${ds === today ? "today" : ""}`,
              onClick: () => {
                if (!future) setDetailDate(ds);
              },
              children: n > 0 && !future ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: `day-stamp s${Math.min(4, n)}`, children: day }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { children: day })
            },
            i
          );
        }) })
      ] }),
      heatRange === "year" && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "heat-year", children: yearMonths.map((m) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "heat-y-cell", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: `y-block hm-l${m.level}`, children: m.days }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "y-label", children: m.label })
      ] }, m.label)) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "row-between", style: { marginTop: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Text, { className: "sub", children: [
          "\u8FDE\u7EED\u5168\u52E4 ",
          allStreak,
          " \u5929 \xB7 \u6700\u4F73 ",
          bestStreak,
          " \u5929"
        ] }),
        heatRange === "week" && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "row hm-legend", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "sub", children: "\u5C11" }),
          [0, 1, 2, 3, 4].map((l) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: `hm-cell hm-l${l}` }, l)),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "sub", children: "\u591A" })
        ] }),
        heatRange === "year" && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "sub legend-month", children: "\u6570\u5B57 = \u5F53\u6708\u6253\u5361\u5929\u6570" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "card-title", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { children: "\u{1F60A} \u4ECA\u65E5\u5FC3\u60C5" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "mood-picker", children: MOODS.map((emoji, i) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
        View,
        {
          className: `mood-btn${mood?.mood === i + 1 ? " selected" : ""}`,
          onClick: () => setMood(i + 1),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "mood-emoji", children: emoji }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "mood-label", children: MOOD_LABELS[i] })
          ]
        },
        emoji
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "form-row", style: { marginTop: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "field", style: { flex: 1, marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          Input,
          {
            placeholder: "\u4E00\u53E5\u8BDD\u8BB0\u5F55\u4ECA\u5929\uFF08\u53EF\u9009\uFF09",
            value: moodNote,
            onInput: (e) => setMoodNote(e.detail.value),
            onConfirm: submitMoodNote
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "btn small", onClick: submitMoodNote, children: "\u8BB0\u4E0B" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "divider" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "mood-history", children: Array.from({ length: 7 }, (_, i) => addDays(today, i - 6)).map((d) => {
        const m = data.moods[d];
        return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "day", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "emoji", children: m ? MOODS[m.mood - 1] : "\xB7" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { children: d.slice(5) })
        ] }, d);
      }) }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        View,
        {
          className: "btn ghost small",
          style: { marginTop: 10, width: "100%" },
          onClick: () => stubs_default.navigateTo({ url: "/pages/mood-history/index" }),
          children: "\u67E5\u770B\u5FC3\u60C5\u8BB0\u5F55 \u203A"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Icon, { name: "gift", size: 16, gap: 4 }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { children: "\u5956\u52B1\u673A\u5236" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Text, { className: "sub", children: [
          "\u8FDE\u7EED\u5168\u52E4 ",
          allStreak,
          " \u5929 \xB7 \u6700\u4F73 ",
          bestStreak,
          " \u5929"
        ] })
      ] }),
      visibleTasks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ScrollView, { scrollY: true, className: "reward-scroll", children: visibleTasks.map((r) => {
        const reached = r.claimed || checkAchieve(r, rewardCtx);
        const prog = condProgress(r, rewardCtx);
        const hasTarget = !!prog && prog.target > 0;
        const pct = hasTarget ? Math.min(100, Math.round(Math.min(prog.cur, prog.target) / prog.target * 100)) : 0;
        return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "list-item reward-item", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "r-emoji", children: r.emoji }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "grow", children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "row-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "name", children: r.title }),
              reached ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "chip success", children: "\u5DF2\u8FBE\u6210" }) : hasTarget ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Text, { className: "sub", children: [
                "\u8FD8\u5DEE ",
                Math.max(0, prog.target - prog.cur),
                " ",
                prog.unit
              ] }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "sub", children: "\u5F85\u89E3\u9501" })
            ] }),
            !reached && hasTarget && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "progress", style: { margin: "4px 0 2px" }, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "progress-fill", style: { width: `${pct}%` } }) }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Text, { className: "sub", style: { fontSize: 14 }, children: [
              condText(r),
              r.mode === "code" ? " \xB7 \u8D35\u91CD\u5238" : ""
            ] })
          ] })
        ] }, r.id);
      }) }),
      hiddenLeft > 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "hidden-teaser", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "teaser-emoji", children: "\u{1F381}" }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Text, { children: [
          "\u6084\u6084\u8BF4\uFF1A\u8FD8\u6709 ",
          hiddenLeft,
          " \u4E2A\u9690\u85CF\u4EFB\u52A1\uFF0C\u8FBE\u6210\u6761\u4EF6\u624D\u63ED\u6653"
        ] })
      ] }),
      visibleTasks.length === 0 && hiddenLeft === 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "empty", children: "\u5956\u52B1\u7531\u597D\u53CB\u5728\u770B\u677F\u7AEF\u8BBE\u7F6E\u540E\u81EA\u52A8\u51FA\u73B0\u5728\u8FD9\u91CC" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Icon, { name: "ticket", size: 16, gap: 4 }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { children: "\u5956\u5238\u888B" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Text, { className: "sub", children: [
          bag.length,
          " \u5F20"
        ] })
      ] }),
      bag.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "empty", children: "\u8FD8\u6CA1\u6709\u5238\uFF0C\u8FBE\u6210\u5956\u52B1\u540E\u81EA\u52A8\u5165\u888B" }),
      (() => {
        const couponItems = bag.map((c) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
          View,
          {
            className: `coupon-card ${c.used ? "coupon-used" : ""}`,
            onClick: () => useCoupon(c),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "c-emoji", children: c.emoji }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "grow", children: [
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "c-title", children: c.title }),
                c.desc ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "sub", children: c.desc }) : null,
                c.mode === "code" && c.code && !c.used && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Text, { className: "coupon-code", children: [
                  "\u5151\u6362\u7801 ",
                  c.code
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: `chip ${c.used ? "" : c.mode === "code" ? "warn" : "success"}`, children: c.used ? "\u5DF2\u4F7F\u7528" : c.mode === "code" ? "\u5F85\u5151\u6362" : "\u53EF\u7528" })
            ]
          },
          c.id
        ));
        return bag.length > 4 ? (
          /* 超过 4 张时固定高度内部滚动查看（卡高约 75px × 4） */
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ScrollView, { scrollY: true, style: { height: 300 }, children: couponItems })
        ) : couponItems;
      })(),
      bag.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "sub", style: { fontSize: 14, marginTop: 6 }, children: "\u70B9\u51FB\u5238\u53EF\u6807\u8BB0\u6838\u9500\uFF08\u627E\u597D\u53CB\u5151\u73B0 \u{1F609}\uFF09" })
    ] }),
    detailDate && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Modal, { variant: "sheet", onClose: () => setDetailDate(null), children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "card-title", style: { marginBottom: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Icon, { name: "calendar", size: 16, gap: 4 }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Text, { children: [
            Number(detailDate.slice(5, 7)),
            " \u6708 ",
            Number(detailDate.slice(8)),
            " \u65E5"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Text, { className: "sub", children: [
          "\u6253\u5361 ",
          (data.checkins[detailDate] ?? []).length,
          "/",
          itemCount
        ] })
      ] }),
      data.checkinItems.map((item) => {
        const ok = isItemDone(item, data.checkins[detailDate] ?? []);
        return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: `list-item ${ok ? "done" : ""}`, children: [
          ok ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Icon, { name: "check-square", size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Icon, { name: "square", size: 14 }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Text, { className: "grow name", children: [
            item.emoji,
            " ",
            item.name
          ] })
        ] }, item.id);
      }),
      data.checkinItems.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "empty", children: "\u8FD8\u6CA1\u6709\u6253\u5361\u9879" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        View,
        {
          className: "btn ghost small",
          style: { marginTop: 10, width: "100%" },
          onClick: () => setDetailDate(null),
          children: "\u5173\u95ED"
        }
      )
    ] }),
    curBox && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "box-overlay", catchMove: true, children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "box-gift-wrap", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: `box-gift ${boxOpened ? "box-open" : ""}`, children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "box-lid" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "box-body" }),
          boxOpened && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "box-spark s1", children: "\u2728" }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "box-spark s2", children: "\u2728" }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "box-spark s3", children: "\u2728" }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "box-spark s4", children: "\u2B50" }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "box-spark s5", children: "\u2B50" }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "box-spark s6", children: "\u{1F31F}" })
          ] })
        ] }),
        boxOpened && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "box-coupon", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "bc-emoji", children: curBox.emoji }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "bc-title", children: curBox.title }),
          curBox.desc ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "bc-desc", children: curBox.desc }) : null,
          curBox.mode === "code" && curBox.code && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Text, { className: "coupon-code", children: [
            "\u5151\u6362\u7801 ",
            curBox.code
          ] })
        ] })
      ] }),
      !boxOpened ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "btn box-btn", onClick: () => setBoxOpened(true), children: "\u5F00\u76D2" }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "btn box-accept", onClick: closeBox, children: boxQueue.length > 1 ? `\u5F00\u5FC3\u6536\u4E0B \u{1F389}\uFF08\u8FD8\u6709 ${boxQueue.length - 1} \u4E2A\uFF09` : "\u5F00\u5FC3\u6536\u4E0B \u{1F389}" })
    ] }),
    comfortOpen && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "comfort-overlay", catchMove: true, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(View, { className: "comfort-box", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "comfort-emoji", children: "\u{1FAC2}" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "comfort-text", children: comfortText ? comfortText.slice(0, typed) : "\u6B63\u5728\u7EC4\u7EC7\u8BED\u8A00\u5B89\u6170\u4F60\u2026" }),
      comfortText && typed < comfortText.length && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { className: "type-caret" }),
      comfortText && typed >= comfortText.length ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { className: "btn", onClick: () => setComfortOpen(false), children: "\u6709\u88AB\u5B89\u6170\u5230 \u{1F917}" }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(View, { style: { height: 40 } })
    ] }) })
  ] });
}

// src/pages/life/index.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
var ENTRIES = [
  { key: "food", icon: "\u{1F37D}", title: "\u5403\u4EC0\u4E48", desc: "\u9009\u62E9\u56F0\u96BE\u7EC8\u7ED3\u8005", url: "/pages/food/index", tint: "#FFF0E3" },
  { key: "ledger", icon: "\u{1F4B0}", title: "\u8BB0\u8D26\u672C", desc: "\u82B1\u9500\u4E0E\u9884\u7B97", url: "/pages/ledger/index", tint: "#E6F7EE" },
  { key: "todos", icon: "\u{1F6D2}", title: "\u5F85\u529E\u6E05\u5355", desc: "\u8981\u529E\u7684\u4E8B\u3001\u8981\u4E70\u7684\u4E1C\u897F", url: "/pages/todos/index", tint: "#E9F0FF" },
  { key: "periodic", icon: "\u{1F501}", title: "\u5468\u671F\u63D0\u9192", desc: "\u6D17\u8863\u3001\u6253\u7535\u8BDD\u7B49\u5B9A\u671F\u4E8B", url: "/pages/periodic/index", tint: "#F0EAFE" },
  { key: "dates", icon: "\u{1F4CC}", title: "\u91CD\u8981\u65E5\u671F", desc: "\u751F\u65E5\u3001\u7EAA\u5FF5\u65E5\u3001\u622A\u6B62\u65E5", url: "/pages/dates/index", tint: "#FFEAF1" },
  { key: "notes", icon: "\u{1F4F0}", title: "\u65F6\u653F\u6536\u96C6", desc: "\u7D20\u6750\u91D1\u53E5\u968F\u624B\u8BB0", url: "/pages/notes/index", tint: "#FFF4DE" },
  { key: "wrongbook", icon: "\u{1F4D5}", title: "\u9519\u9898\u672C", desc: "\u7B54\u9519\u7684\u9898\u90FD\u5728\u8FD9", url: "/pages/wrongbook/index", tint: "#FFECEC" },
  { key: "pomodoro", icon: "\u{1F338}", title: "\u79CD\u82B1\u756A\u8304\u949F", desc: "\u4E13\u6CE8\u4E00\u6735\u82B1", url: "/pages/pomodoro/index", tint: "#E2F8F5" }
];
function Life() {
  const { data, ready } = useData();
  const today = todayStr();
  const badge = {
    todos: ready ? data.todos.filter((t) => !t.done).length : 0,
    periodic: ready ? data.periodic.filter((p) => daysBetween(p.lastDone, today) >= p.everyDays).length : 0
  };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(View, { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(View, { className: "page-title", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Text, { children: "\u{1F308} \u751F\u6D3B\u52A9\u624B" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(View, { className: "grid-menu", children: ENTRIES.map((e) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
      View,
      {
        className: "grid-card",
        onClick: () => stubs_default.navigateTo({ url: e.url }),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Text, { className: "grid-icon", style: { background: e.tint }, children: e.icon }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(View, { className: "grid-title", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Text, { children: e.title }),
            badge[e.key] ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Text, { className: "grid-badge", children: badge[e.key] }) : null
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Text, { className: "grid-desc", children: e.desc })
        ]
      },
      e.key
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(View, { className: "card", style: { marginTop: 14 }, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Text, { className: "sub", children: "\u{1F4A1} \u4E09\u9910\u65F6\u95F4\u3001\u559D\u6C34\u3001\u7761\u7720\u63D0\u9192\u5728\u300C\u4ECA\u65E5\u300D\u9875\uFF1B\u63D0\u9192\u65F6\u95F4\u53EF\u5728\u300C\u8BBE\u7F6E \u2192 \u4F5C\u606F\u4E0E\u63D0\u9192\u300D\u4E2D\u8C03\u6574\u3002" }) })
  ] });
}

// src/pages/settings/index.tsx
var import_react9 = require("react");

// src/services/api/devLogin.ts
var DEV_LOGIN_ENABLED = true;
var KEY_AUTH4 = "kg-auth";
var KEY_OPENID3 = "kg-openid";
var KEY_TOKEN2 = "kg-token";
var KEY_WRITE_QUEUE = "kg-write-queue";
var DEV_OPENID_PREFIX = "dev-acct-";
function isDevAccount() {
  try {
    const raw = stubs_default.getStorageSync(KEY_AUTH4);
    if (!raw) return false;
    const info = JSON.parse(String(raw));
    return String(info.openid || "").startsWith(DEV_OPENID_PREFIX);
  } catch {
    return false;
  }
}
async function devLogin(account, password) {
  const res = await httpPost(
    "/auth/dev-login",
    { account, password }
  );
  stubs_default.setStorageSync(KEY_TOKEN2, res.token);
  stubs_default.setStorageSync(KEY_OPENID3, res.openid);
  const info = { role: res.role, openid: res.openid, nickname: res.nickname };
  stubs_default.setStorageSync(KEY_AUTH4, JSON.stringify(info));
  return info;
}
function devLogout() {
  stubs_default.removeStorageSync(KEY_AUTH4);
  stubs_default.removeStorageSync(KEY_OPENID3);
  stubs_default.removeStorageSync(KEY_TOKEN2);
  stubs_default.removeStorageSync(KEY_WRITE_QUEUE);
}

// src/mocks/fixtures.ts
function buildGuestData() {
  const today = todayStr();
  const examDate = addDays(today, 30);
  const checkinItems = [
    { id: "ck-sl", name: "\u7533\u8BBA", emoji: "\u270D\uFE0F", category: "\u7533\u8BBA", level: "core", severity: "high", children: [
      { id: "ck-sl-1", name: "\u8303\u6587\u7CBE\u8BFB" },
      { id: "ck-sl-2", name: "\u7D20\u6750\u6458\u6284" }
    ] },
    { id: "ck-xc", name: "\u884C\u6D4B", emoji: "\u{1F9EE}", category: "\u884C\u6D4B", level: "core", severity: "high", children: [
      { id: "ck-xc-1", name: "\u8D44\u6599\u5206\u6790" },
      { id: "ck-xc-2", name: "\u8A00\u8BED\u5237\u9898" }
    ] },
    { id: "ck-sz", name: "\u65F6\u653F", emoji: "\u{1F4F0}", category: "\u65F6\u653F", level: "normal", severity: "medium" },
    { id: "ck-yd", name: "\u8FD0\u52A8", emoji: "\u{1F3C3}", category: "\u751F\u6D3B", level: "flex", severity: "low" }
  ];
  const checkins = {};
  for (let i = 14; i >= 0; i--) {
    const d = addDays(today, -i);
    checkins[d] = ["ck-sl-1", "ck-sl-2", "ck-xc-1", "ck-xc-2", "ck-sz", "ck-yd"];
  }
  const dayMs = 864e5;
  const notes = [
    { id: "note-1", text: "\u65B0\u8D28\u751F\u4EA7\u529B\uFF1A\u7531\u6280\u672F\u9769\u547D\u6027\u7A81\u7834\u3001\u751F\u4EA7\u8981\u7D20\u521B\u65B0\u6027\u914D\u7F6E\u3001\u4EA7\u4E1A\u6DF1\u5EA6\u8F6C\u578B\u5347\u7EA7\u800C\u50AC\u751F\uFF0C\u7279\u70B9\u662F\u521B\u65B0\uFF0C\u5173\u952E\u5728\u8D28\u4F18\uFF0C\u672C\u8D28\u662F\u5148\u8FDB\u751F\u4EA7\u529B\u3002", tags: ["\u65F6\u653F"], createdAt: Date.now() - 6 * dayMs, nextReviewDate: Date.now() - dayMs, reviewStep: 2, review: { stability: 4, difficulty: 6, reps: 2, lapses: 1 } },
    { id: "note-2", text: "\u4E2D\u592E\u7ECF\u6D4E\u5DE5\u4F5C\u4F1A\u8BAE\u5B9A\u8C03\uFF1A\u575A\u6301\u7A33\u4E2D\u6C42\u8FDB\u5DE5\u4F5C\u603B\u57FA\u8C03\uFF0C\u5B8C\u6574\u51C6\u786E\u5168\u9762\u8D2F\u5F7B\u65B0\u53D1\u5C55\u7406\u5FF5\uFF0C\u52A0\u5FEB\u6784\u5EFA\u65B0\u53D1\u5C55\u683C\u5C40\u3002", tags: ["\u65F6\u653F"], createdAt: Date.now() - 3 * dayMs, nextReviewDate: Date.now() - 2 * 36e5, reviewStep: 1, review: { stability: 2, difficulty: 5, reps: 1, lapses: 0 } },
    { id: "note-3", text: "\u300C\u5343\u4E07\u5DE5\u7A0B\u300D\u7ECF\u9A8C\uFF1A\u4ECE\u5343\u6751\u793A\u8303\u3001\u4E07\u6751\u6574\u6CBB\u8D77\u6B65\uFF0C\u4E45\u4E45\u4E3A\u529F\u63A8\u8FDB\u4E61\u6751\u5168\u9762\u632F\u5174\u3002", tags: ["\u65F6\u653F"], createdAt: Date.now() - 12 * dayMs, nextReviewDate: Date.now() - dayMs / 2, reviewStep: 3, review: { stability: 7, difficulty: 4, reps: 3, lapses: 0 } },
    { id: "note-4", text: "\u9AD8\u8D28\u91CF\u53D1\u5C55\u662F\u5168\u9762\u5EFA\u8BBE\u793E\u4F1A\u4E3B\u4E49\u73B0\u4EE3\u5316\u56FD\u5BB6\u7684\u9996\u8981\u4EFB\u52A1\u3002", tags: ["\u65F6\u653F"], createdAt: Date.now() - 20 * dayMs, nextReviewDate: Date.now() + 10 * dayMs, reviewStep: 5, review: { stability: 21, difficulty: 2, reps: 6, lapses: 0 } },
    { id: "note-5", text: "\u8D44\u6599\u5206\u6790\u901F\u7B97\uFF1A\u7279\u5F81\u6570\u5B57\u6CD5\u3001\u9519\u4F4D\u52A0\u51CF\u6CD5\u3001\u6709\u6548\u6570\u5B57\u6CD5\u8981\u5F62\u6210\u6761\u4EF6\u53CD\u5C04\u3002", tags: ["\u884C\u6D4B"], createdAt: Date.now() - 2 * dayMs, nextReviewDate: Date.now() + 5 * dayMs, reviewStep: 1, review: { stability: 3, difficulty: 5, reps: 1, lapses: 0 } }
  ];
  const threeThings = {
    [today]: {
      items: [
        { text: "\u6668\u8BFB\u7533\u8BBA\u8303\u6587\u4E00\u7BC7", done: true },
        { text: "\u884C\u6D4B\u8D44\u6599\u5206\u6790\u9650\u65F6\u7EC3", done: true },
        { text: "\u6574\u7406\u672C\u5468\u9519\u9898\u672C", done: false }
      ]
    }
  };
  const pastThree = [
    [["\u6668\u8BFB\u7533\u8BBA\u8303\u6587\u4E00\u7BC7", true], ["\u884C\u6D4B\u8A00\u8BED\u5237\u9898 30 \u9898", true], ["\u6574\u7406\u9519\u9898\u672C", true]],
    [["\u7533\u8BBA\u5927\u4F5C\u6587\u63D0\u7EB2", true], ["\u8D44\u6599\u5206\u6790\u9650\u65F6\u7EC3", true], ["\u8DD1\u6B65 3 \u516C\u91CC", false]],
    [["\u542C\u65F6\u653F\u8BFE 1 \u8282", true], ["\u6570\u91CF\u5173\u7CFB\u4E13\u9879", true], ["\u590D\u76D8\u672C\u5468\u8BA1\u5212", true]],
    [["\u80CC\u8BF5\u91D1\u53E5 10 \u6761", true], ["\u5224\u65AD\u63A8\u7406\u5237\u9898", false], ["\u65E9\u7761\u6253\u5361", true]],
    [["\u6284\u5199\u7533\u8BBA\u8303\u6587", true], ["\u5E38\u8BC6\u5224\u65AD\u5237\u9898", true], ["\u7ED9\u5BB6\u91CC\u6253\u7535\u8BDD", true]]
  ];
  pastThree.forEach((items, i) => {
    threeThings[addDays(today, -(i + 1))] = { items: items.map(([text, done]) => ({ text, done })) };
  });
  const foodLog = { [today]: { lunch: "\u9EC4\u7116\u9E21\u7C73\u996D" } };
  const lunchSeq = ["\u9EBB\u8FA3\u9999\u9505", "\u5170\u5DDE\u62C9\u9762", "\u7172\u4ED4\u996D", "\u8F7B\u98DF\u6C99\u62C9", "\u6C99\u53BF\u5C0F\u5403"];
  lunchSeq.forEach((lunch, i) => {
    foodLog[addDays(today, -(i + 1))] = { lunch };
  });
  const dayLogs = {};
  for (let i = 0; i < 7; i++) {
    const cups = 4 + i * 3 % 4;
    dayLogs[addDays(today, -i)] = {
      water: Array.from({ length: cups }, (_, k) => Date.now() - i * dayMs - (k + 2) * 36e5),
      stand: [],
      meals: { breakfast: i % 3 !== 2, lunch: true }
    };
  }
  const moods = {};
  const moodSeq = [4, 3, 4, 5, 4, 4, 5, 3, 4, 4, 5, 4, 4, 5];
  moodSeq.forEach((m, i) => {
    moods[addDays(today, -(13 - i))] = { mood: m };
  });
  const claimedIds = {
    "rw-milk-tea": { used: true },
    "rw-cart": {},
    "rw-movie": {},
    "rw-sleep": {},
    "rw-massage": {},
    "rw-hidden-weekend": { code: "KG-DEMO" },
    "rw-hidden-mood": { code: "KG-HAPPY" }
  };
  const rewards = PRESET_REWARDS.map((r, i) => {
    const hit = claimedIds[r.id];
    if (!hit) return r;
    return {
      ...r,
      claimed: true,
      granted: true,
      used: !!hit.used,
      code: hit.code,
      achievedAt: Date.now() - (5 - i % 5) * dayMs
    };
  });
  return {
    settings: { ...DEFAULT_SETTINGS, intel: { enabled: true, tastes: ["\u9971\u8179"] } },
    foods: [],
    // 由 normalize 兜底 DEFAULT_FOODS
    budget: 1500,
    foodLog,
    exams: [
      {
        id: "exam-prov",
        name: "2027 \u6CB3\u5357\u7701\u8003",
        date: examDate,
        templateType: "civil",
        milestones: [
          { id: "ms-1", label: "\u516C\u544A\u53D1\u5E03", date: addDays(examDate, -120), done: true },
          { id: "ms-2", label: "\u7F51\u4E0A\u62A5\u540D", date: addDays(examDate, -45), done: true },
          { id: "ms-3", label: "\u62A5\u540D\u7F34\u8D39", date: addDays(examDate, -35), done: true },
          { id: "ms-4", label: "\u6253\u5370\u51C6\u8003\u8BC1", date: addDays(examDate, -7), done: false },
          { id: "ms-5", label: "\u7B14\u8BD5", date: examDate, done: false }
        ]
      }
    ],
    courses: [
      { id: "course-1", name: "\u7533\u8BBA\u7CFB\u7EDF\u73ED", total: 120, done: 68, targetDate: addDays(today, 25), createdAt: addDays(today, -60) },
      { id: "course-2", name: "\u884C\u6D4B 5000 \u9898", total: 5e3, done: 3260, targetDate: addDays(today, 28), createdAt: addDays(today, -90) }
    ],
    checkinItems,
    checkins,
    moods,
    rewards,
    todos: [
      { id: "todo-1", text: "\u6253\u5370\u51C6\u8003\u8BC1\u63D0\u9192\u8BBE\u7F6E", done: false, createdAt: Date.now() - dayMs, priority: 2 },
      { id: "todo-2", text: "\u9884\u7EA6\u56FE\u4E66\u9986\u81EA\u4E60\u5EA7\u4F4D", done: true, createdAt: Date.now() - 2 * dayMs, priority: 1 },
      { id: "todo-3", text: "\u628A\u8D44\u6599\u5206\u6790\u9519\u9898\u91CD\u5237\u4E00\u904D", done: false, createdAt: Date.now() - 3 * dayMs, priority: 3 },
      { id: "todo-4", text: "\u548C\u7814\u53CB\u4E92\u76F8\u62BD\u67E5\u77E5\u8BC6\u70B9", done: false, createdAt: Date.now() - 4 * dayMs, priority: 2 }
    ],
    ledger: [
      { id: "led-1", date: addDays(today, -1), amount: 16.5, category: "\u9910\u996E", note: "\u9EC4\u7116\u9E21\u7C73\u996D", type: "expense" },
      { id: "led-2", date: addDays(today, -2), amount: 45, category: "\u4EA4\u901A", note: "\u56DE\u5BB6\u9AD8\u94C1\u7968", type: "expense" },
      { id: "led-3", date: addDays(today, -3), amount: 1500, category: "\u751F\u6D3B\u8D39", note: "\u5341\u6708\u751F\u6D3B\u8D39", type: "income" },
      { id: "led-4", date: addDays(today, -4), amount: 32, category: "\u5B66\u4E60", note: "\u7533\u8BBA\u771F\u9898\u5377", type: "expense" },
      { id: "led-5", date: addDays(today, -5), amount: 12, category: "\u9910\u996E", note: "\u65E9\u9910\u5305\u5B50\u8C46\u6D46", type: "expense" },
      { id: "led-6", date: addDays(today, -7), amount: 28, category: "\u5A31\u4E50", note: "\u7535\u5F71\u7968", type: "expense" },
      { id: "led-7", date: addDays(today, -9), amount: 15, category: "\u9910\u996E", note: "\u98DF\u5802\u5348\u996D", type: "expense" },
      { id: "led-8", date: addDays(today, -11), amount: 19, category: "\u9910\u996E", note: "\u5976\u8336", type: "expense" },
      { id: "led-9", date: addDays(today, -13), amount: 25, category: "\u65E5\u7528", note: "\u6D17\u8863\u6DB2", type: "expense" },
      { id: "led-10", date: addDays(today, -15), amount: 68, category: "\u5B66\u4E60", note: "\u884C\u6D4B 5000 \u9898", type: "expense" },
      { id: "led-11", date: addDays(today, -18), amount: 240, category: "\u5B66\u4E60", note: "\u7533\u8BBA\u6279\u6539\u8BFE", type: "expense" },
      { id: "led-12", date: addDays(today, -21), amount: 300, category: "\u751F\u6D3B\u8D39", note: "\u517C\u804C\u5DE5\u8D44", type: "income" }
    ],
    periodic: [
      { id: "per-1", name: "\u7406\u53D1", everyDays: 30, lastDone: addDays(today, -20) },
      { id: "per-2", name: "\u4E70\u6C34\u679C", everyDays: 7, lastDone: addDays(today, -3) },
      { id: "per-3", name: "\u7ED9\u5BB6\u91CC\u6253\u7535\u8BDD", everyDays: 7, lastDone: addDays(today, -6) }
    ],
    dates: [
      { id: "date-1", name: "\u751F\u65E5", date: addDays(today, 12), yearly: true },
      { id: "date-2", name: "\u7B14\u8BD5\u65E5", date: addDays(today, 30), yearly: false }
    ],
    notes,
    quizBook: { stats: { answered: 0, wrong: 0 }, wrongs: [] },
    ledgerCats: JSON.parse(JSON.stringify(DEFAULT_LEDGER_CATS)),
    threeThings,
    dayLogs,
    pomodoroLogs: [
      { date: today, minutes: 25, endedAt: Date.now() - 4 * 36e5, task: "\u8D44\u6599\u5206\u6790\u9650\u65F6\u7EC3" },
      { date: today, minutes: 25, endedAt: Date.now() - 2 * 36e5, task: "\u7533\u8BBA\u8303\u6587\u7CBE\u8BFB" },
      { date: addDays(today, -1), minutes: 35, endedAt: Date.now() - dayMs - 3 * 36e5, task: "\u884C\u6D4B\u5237\u9898" },
      { date: addDays(today, -2), minutes: 25, endedAt: Date.now() - 2 * dayMs - 4 * 36e5, task: "\u65F6\u653F\u79EF\u7D2F" },
      { date: addDays(today, -3), minutes: 50, endedAt: Date.now() - 3 * dayMs - 2 * 36e5, task: "\u7533\u8BBA\u5927\u4F5C\u6587" },
      { date: addDays(today, -4), minutes: 25, endedAt: Date.now() - 4 * dayMs - 5 * 36e5, task: "\u8D44\u6599\u5206\u6790\u9650\u65F6\u7EC3" },
      { date: addDays(today, -6), minutes: 45, endedAt: Date.now() - 6 * dayMs - 3 * 36e5, task: "\u5224\u65AD\u63A8\u7406\u4E13\u9879" }
    ]
  };
}

// src/pages/settings/index.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
function Settings() {
  const { data, auth, ready, rebootstrap } = useData();
  const [upgrading, setUpgrading] = (0, import_react9.useState)(false);
  const [demoBusy, setDemoBusy] = (0, import_react9.useState)(false);
  const s = data.settings;
  const demoOn = s.guestDemo !== false;
  const upgrade = async () => {
    if (upgrading) return;
    const ok = await appConfirm("\u5347\u7EA7\u4E3A\u6B63\u5F0F\u8D26\u53F7", "\u5347\u7EA7\u540E\u6570\u636E\u540C\u6B65\u4E91\u7AEF\uFF0C\u6362\u8BBE\u5907\u4E5F\u80FD\u7EE7\u7EED\u4F7F\u7528\u3002", {
      confirmText: "\u53BB\u5347\u7EA7"
    });
    if (!ok) return;
    const keep = await appConfirm(
      "\u8BD5\u73A9\u6570\u636E\u600E\u4E48\u5904\u7406\uFF1F",
      "\u9009\u300C\u5E26\u8D70\u8BD5\u73A9\u6570\u636E\u300D\u4F1A\u628A\u8BD5\u73A9\u671F\u95F4\u7684\u8BB0\u5F55\u540C\u6B65\u5230\u4F60\u7684\u6B63\u5F0F\u8D26\u53F7\uFF1B\u9009\u300C\u91CD\u65B0\u5F00\u59CB\u300D\u5219\u4ECE\u96F6\u5F00\u59CB\u3002",
      { confirmText: "\u5E26\u8D70\u8BD5\u73A9\u6570\u636E", cancelText: "\u91CD\u65B0\u5F00\u59CB" }
    );
    setUpgrading(true);
    try {
      await upgradeAccount({ keepData: keep });
      await rebootstrap();
      stubs_default.showToast({ title: keep ? "\u5DF2\u5347\u7EA7\u5E76\u5E26\u8D70\u8BD5\u73A9\u6570\u636E" : "\u5DF2\u5347\u7EA7\u4E3A\u6B63\u5F0F\u8D26\u53F7", icon: "none" });
    } catch {
      stubs_default.showToast({ title: "\u5347\u7EA7\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5", icon: "none" });
    } finally {
      setUpgrading(false);
    }
  };
  const switchDemo = async (demo) => {
    if (demoBusy) return;
    const ok = await appConfirm(
      demo ? "\u5207\u6362\u4E3A\u6F14\u793A\u6570\u636E\uFF1F" : "\u5207\u6362\u4E3A\u7A7A\u767D\u6A21\u5F0F\uFF1F",
      demo ? "\u5C06\u5199\u5165\u9884\u7F6E\u7684\u6F14\u793A\u8BB0\u5F55\uFF08\u6253\u5361\u3001\u95EA\u5361\u3001\u8BB0\u8D26\u7B49\uFF09\uFF0C\u5F53\u524D\u8BD5\u73A9\u8BB0\u5F55\u4F1A\u88AB\u8986\u76D6\u3002" : "\u5C06\u6E05\u7A7A\u4E1A\u52A1\u8BB0\u5F55\u53EA\u4FDD\u7559\u8BBE\u7F6E\u9879\uFF0C\u4ECE\u96F6\u5F00\u59CB\u8BB0\u5F55\u3002",
      { confirmText: "\u5207\u6362" }
    );
    if (!ok) return;
    setDemoBusy(true);
    try {
      const next = demo ? buildGuestData() : mergeWithDefaults({});
      const payload = {
        ...next,
        settings: demo ? { ...next.settings, guestDemo: true } : { ...s, guestDemo: false }
      };
      await writeKeys(Object.keys(payload).map((k) => op(k, payload[k])));
      await rebootstrap();
      stubs_default.showToast({ title: demo ? "\u5DF2\u5207\u6362\u4E3A\u6F14\u793A\u6570\u636E" : "\u5DF2\u5207\u6362\u4E3A\u7A7A\u767D\u6A21\u5F0F", icon: "none" });
    } finally {
      setDemoBusy(false);
    }
  };
  const resetData = async () => {
    const first = await appConfirm("\u786E\u5B9A\u91CD\u7F6E\u6570\u636E\u5417\uFF1F", "\u670D\u52A1\u5668\u6570\u636E\u4E0D\u53D7\u5F71\u54CD\uFF0C\u91CD\u65B0\u62C9\u53D6\u5373\u53EF\u6062\u590D", {
      danger: true,
      confirmText: "\u7EE7\u7EED"
    });
    if (!first) return;
    const second = await appConfirm("\u518D\u6B21\u786E\u8BA4\uFF1A\u771F\u7684\u8981\u91CD\u7F6E\u5417\uFF1F", "\u5C06\u6E05\u9664\u672C\u5730\u767B\u5F55\u6001\u4E0E\u7F13\u5B58\u6570\u636E\uFF0C\u9875\u9762\u968F\u540E\u91CD\u65B0\u521D\u59CB\u5316\u3002", {
      danger: true,
      confirmText: "\u91CD\u7F6E"
    });
    if (!second) return;
    for (const k of ["kg-auth", "kg-openid", "kg-token", "kg-data", "kg-guest-data", "kg-dev-role", "kg-write-queue"]) {
      stubs_default.removeStorageSync(k);
    }
    await rebootstrap();
    stubs_default.showToast({ title: "\u5DF2\u91CD\u7F6E\u672C\u5730\u6570\u636E", icon: "none" });
  };
  const menus = [
    {
      type: "reminders",
      emoji: "\u23F0",
      label: "\u4F5C\u606F\u4E0E\u63D0\u9192",
      sub: `\u8D77\u5E8A ${s.wake} \xB7 \u7761\u89C9 ${s.sleep} \xB7 \u559D\u6C34\u6BCF ${s.water.intervalMin} \u5206\u949F`
    },
    {
      type: "notify",
      emoji: "\u{1F514}",
      label: "\u670D\u52A1\u901A\u77E5",
      sub: "\u5FAE\u4FE1\u63A8\u9001\u989D\u5EA6\u4E0E\u63A5\u6536\u8BBE\u7F6E"
    },
    {
      type: "city",
      emoji: "\u{1F4CD}",
      label: "\u5929\u6C14\u57CE\u5E02",
      sub: ready && s.city ? `\u5F53\u524D\uFF1A${cityLabel(s.city)}` : "\u672A\u8BBE\u7F6E"
    },
    {
      type: "intel",
      emoji: "\u2728",
      label: "\u667A\u80FD\u63A8\u8350\u504F\u597D",
      sub: s.intel?.enabled ? "\u5DF2\u542F\u7528 \xB7 \u5403\u4EC0\u4E48\u9875\u53EF\u95EE\u5C0F\u52A9\u624B" : "\u672A\u542F\u7528"
    },
    {
      type: "account",
      emoji: "\u{1F510}",
      label: "\u8D26\u53F7\u4E0E\u6570\u636E",
      sub: isDevAccount() ? "\u6F14\u793A\u8D26\u53F7 \xB7 \u5F00\u53D1\u671F\u4E34\u65F6\u8EAB\u4EFD" : auth?.role === "guest" ? "\u8BD5\u73A9\u8D26\u53F7 \xB7 \u5FAE\u4FE1\u4FE1\u606F\u4E0E\u8BD5\u73A9\u6570\u636E" : "\u6B63\u5F0F\u8D26\u53F7 \xB7 \u5FAE\u4FE1\u4FE1\u606F\u4E0E\u6570\u636E\u91CD\u7F6E"
    },
    { type: "about", emoji: "\u2139\uFE0F", label: "\u5173\u4E8E", sub: "\u4F7F\u7528\u8BF4\u660E \xB7 \u6570\u636E\u4E0E\u9690\u79C1" }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(View, { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Text, { children: "\u8D26\u53F7" }),
        auth && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Text, { className: `badge ${auth.role === "guest" ? "lag" : "ok"}`, children: isDevAccount() ? "\u6F14\u793A\u8D26\u53F7" : auth.role === "guest" ? "\u8BD5\u73A9\u8D26\u53F7" : "\u6B63\u5F0F\u8D26\u53F7" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
        View,
        {
          className: "account-hero",
          onClick: () => stubs_default.navigateTo({ url: "/pages/settings-sub/index?type=account" }),
          children: [
            s.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Image, { className: "account-avatar", src: s.avatarUrl, mode: "aspectFill" }) : /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(View, { className: "account-avatar ph", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Icon, { name: "user", size: 28, gap: 0 }) }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(View, { className: "grow", style: { textAlign: "left", minWidth: 0 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Text, { className: "account-name", children: s.nickname ? s.nickname : "\u70B9\u51FB\u5B8C\u5584\u5FAE\u4FE1\u4FE1\u606F" }),
              /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Text, { className: "sub", style: { fontSize: 14, display: "block", marginTop: 2 }, children: s.phone ? `\u624B\u673A ${s.phone}` : "\u5934\u50CF \xB7 \u6635\u79F0 \xB7 \u624B\u673A\u53F7\uFF0C\u70B9\u6B64\u5B8C\u5584" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Text, { className: "sub", children: "\u203A" })
          ]
        }
      ),
      auth?.role === "guest" && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(View, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          View,
          {
            className: `btn small${upgrading ? " is-disabled" : ""}`,
            style: { marginTop: 10 },
            onClick: upgrade,
            children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Text, { children: upgrading ? "\u5347\u7EA7\u4E2D\u2026" : "\u5347\u7EA7\u4E3A\u6B63\u5F0F\u8D26\u53F7" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
          View,
          {
            className: "row",
            style: { justifyContent: "space-between", marginTop: 12 },
            onClick: () => void switchDemo(!demoOn),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Text, { children: "\u6F14\u793A\u6570\u636E / \u7A7A\u767D\u6A21\u5F0F" }),
              /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(View, { className: `ms-check${demoOn ? " on" : ""}`, children: demoOn ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Icon, { name: "check", size: 12 }) : null })
            ]
          }
        )
      ] }),
      auth?.role === "user" && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(View, { className: "btn danger small", style: { marginTop: 10 }, onClick: () => void resetData(), children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Text, { children: "\u91CD\u7F6E\u6570\u636E" }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Text, { className: "section-label", children: "\u901A\u7528" }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(View, { className: "card", style: { padding: 0 }, children: menus.map((m) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
      View,
      {
        className: "menu-item",
        onClick: () => stubs_default.navigateTo({ url: `/pages/settings-sub/index?type=${m.type}` }),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Text, { className: "menu-icon", children: m.emoji }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(View, { className: "grow", style: { textAlign: "left" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Text, { children: m.label }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Text, { className: "sub", style: { fontSize: 14, display: "block" }, children: m.sub })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Text, { className: "sub", children: "\u203A" })
        ]
      },
      m.type
    )) })
  ] });
}

// src/pages/food/index.tsx
var import_react10 = require("react");

// src/services/meituan.ts
var MEITUAN_WAIMAI_APPID = "wxde8ac0a21135c07d";
var ELEME_APPID = "wxece3a9a4c82f58c9";
var APP_META = {
  meituan: { appId: MEITUAN_WAIMAI_APPID, name: "\u7F8E\u56E2\u5916\u5356" },
  eleme: { appId: ELEME_APPID, name: "\u997F\u4E86\u4E48" }
};
async function openDelivery(kind, keyword) {
  const meta = APP_META[kind];
  if (keyword) {
    await copyText(keyword);
    stubs_default.showToast({ title: `\u5DF2\u590D\u5236\u300C${keyword}\u300D\uFF0C\u53BB ${meta.name} \u7C98\u8D34\u641C\u7D22`, icon: "none", duration: 2500 });
  }
  try {
    await stubs_default.navigateToMiniProgram({
      appId: meta.appId,
      fail: async () => {
        await stubs_default.showToast({
          title: `\u6253\u5F00\u5931\u8D25\uFF0C\u8BF7\u5728\u5FAE\u4FE1\u5185\u641C\u7D22\u300C${meta.name}\u300D\u5C0F\u7A0B\u5E8F`,
          icon: "none"
        });
      }
    });
  } catch {
    stubs_default.showToast({ title: "\u6253\u5F00\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5", icon: "none" });
  }
}

// src/pages/food/index.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
var SLOTS = ["breakfast", "lunch", "dinner", "supper"];
var TASTES = ["\u6E05\u6DE1", "\u8FA3", "\u5FEB\u9910", "\u9971\u8179"];
function Food() {
  const { data, ready, set } = useData();
  const [slot, setSlot] = (0, import_react10.useState)(() => {
    const h = (/* @__PURE__ */ new Date()).getHours();
    if (h < 10) return "breakfast";
    if (h < 14) return "lunch";
    if (h < 21) return "dinner";
    return "supper";
  });
  const [wantTastes, setWantTastes] = (0, import_react10.useState)([]);
  const [avoidTastes, setAvoidTastes] = (0, import_react10.useState)([]);
  const [result, setResult] = (0, import_react10.useState)(null);
  const [rolling, setRolling] = (0, import_react10.useState)(false);
  const [rollName, setRollName] = (0, import_react10.useState)("");
  const [copied, setCopied] = (0, import_react10.useState)(false);
  const [newName, setNewName] = (0, import_react10.useState)("");
  const [newTastes, setNewTastes] = (0, import_react10.useState)([]);
  const [managing, setManaging] = (0, import_react10.useState)(false);
  const rollTimer = (0, import_react10.useRef)(null);
  (0, import_react10.useEffect)(() => () => {
    if (rollTimer.current) clearTimeout(rollTimer.current);
  }, []);
  const today = todayStr();
  const todayFoodLog = data.foodLog[today] ?? {};
  const eatenToday = Object.values(todayFoodLog).filter(Boolean);
  const intelOn = ready && !!data.settings.intel?.enabled;
  const filtered = (0, import_react10.useMemo)(() => {
    return data.foods.filter(
      (x) => x.slots.includes(slot) && avoidTastes.every((t) => !x.tags.includes(t)) && wantTastes.every((t) => x.tags.includes(t)) && !eatenToday.includes(x.name)
    );
  }, [data.foods, slot, wantTastes, avoidTastes, eatenToday.join(",")]);
  const slotFoods = (0, import_react10.useMemo)(
    () => data.foods.filter((x) => x.slots.includes(slot)),
    [data.foods, slot]
  );
  const pickWeighted = (pool) => {
    const weighted = [];
    for (const x of pool) {
      weighted.push(x);
      if (x.fav) weighted.push(x, x);
    }
    return weighted[Math.floor(Math.random() * weighted.length)];
  };
  const startRoll = () => {
    if (filtered.length === 0 || rolling) return;
    setRolling(true);
    setResult(null);
    setCopied(false);
    let count = 0;
    const tick = () => {
      setRollName(filtered[Math.floor(Math.random() * filtered.length)].name);
      count++;
      if (count < 18) {
        rollTimer.current = setTimeout(tick, 60 + count * 8);
      } else {
        setRolling(false);
        const final = pickWeighted(filtered);
        setResult(final);
      }
    };
    tick();
  };
  const toggleFav = (id) => {
    set("foods", (prev) => prev.map((x) => x.id === id ? { ...x, fav: !x.fav } : x));
  };
  const recordEaten = (name) => {
    set("foodLog", (prev) => ({
      ...prev,
      [today]: { ...prev[today], [slot]: name }
    }));
    showToast(`\u5DF2\u8BB0\u5F55\uFF1A\u4ECA\u5929${MEAL_SLOT_LABELS[slot]}\u5403\u300C${name}\u300D`);
  };
  const addFood = () => {
    if (!newName.trim()) {
      showToast("\u8BF7\u8F93\u5165\u98DF\u7269\u540D\u79F0");
      return;
    }
    set("foods", (prev) => [
      ...prev,
      { id: uid(), name: newName.trim(), emoji: "\u{1F37D}", slots: [slot], tags: newTastes }
    ]);
    setNewName("");
    setNewTastes([]);
  };
  const toggleTaste = (t, mode) => {
    if (mode === "want") {
      setWantTastes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
      setAvoidTastes((prev) => prev.filter((x) => x !== t));
    } else {
      setAvoidTastes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
      setWantTastes((prev) => prev.filter((x) => x !== t));
    }
    setResult(null);
  };
  const eatenLabel = (s) => todayFoodLog[s];
  const [poiOpen, setPoiOpen] = (0, import_react10.useState)(false);
  const [pois, setPois] = (0, import_react10.useState)([]);
  const [poiLoading, setPoiLoading] = (0, import_react10.useState)(false);
  const openNearby = async () => {
    if (!result) return;
    setPoiOpen(true);
    setPoiLoading(true);
    setPois([]);
    let lat = data.settings.city?.lat;
    let lon = data.settings.city?.lon;
    try {
      const pos = await stubs_default.getFuzzyLocation({ type: "gcj02" });
      lat = pos.latitude;
      lon = pos.longitude;
    } catch {
    }
    if (lat == null || lon == null) {
      showToast("\u8FD8\u6CA1\u6709\u53EF\u7528\u4F4D\u7F6E\uFF0C\u8BF7\u5148\u5728\u300C\u4ECA\u65E5\u300D\u9875\u8BBE\u7F6E\u57CE\u5E02");
      setPoiLoading(false);
      return;
    }
    try {
      const list = await searchNearbyPois(lat, lon, result.name);
      setPois(list);
      if (list.length === 0) showToast("\u9644\u8FD1\u6CA1\u641C\u5230\u76F8\u5173\u5E97\u94FA\uFF0C\u6362\u4E2A\u5019\u9009\u8BD5\u8BD5");
    } catch {
      showToast("\u641C\u7D22\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC");
    } finally {
      setPoiLoading(false);
    }
  };
  const openPoi = (p) => {
    void stubs_default.openLocation({
      latitude: p.lat,
      longitude: p.lon,
      name: p.name,
      address: p.address
    });
  };
  const openAIChat = () => {
    stubs_default.navigateTo({ url: `/pages/ai-chat/index?ctx=food&slot=${slot}` });
  };
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "sub", children: "\u52A0\u8F7D\u4E2D\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { className: "page", children: [
    eatenToday.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "card", style: { padding: "10px 14px" }, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Text, { className: "sub", children: [
      "\u{1F4DD} \u4ECA\u5929\u5DF2\u5403\uFF1A",
      SLOTS.filter((s) => todayFoodLog[s]).map((s) => `${MEAL_SLOT_LABELS[s]}\xB7${todayFoodLog[s]}`).join("\u3000")
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "slot-tabs", children: SLOTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      View,
      {
        className: `slot-btn ${slot === s ? "active" : ""}`,
        onClick: () => {
          setSlot(s);
          setResult(null);
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Text, { children: [
          MEAL_SLOT_LABELS[s],
          eatenLabel(s) ? " \u2713" : ""
        ] })
      },
      s
    )) }),
    !intelOn && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "sub", style: { margin: "10px 2px", fontSize: 14 }, children: "\u672A\u5F00\u542F\u667A\u80FD\u52A9\u624B\uFF0C\u53BB\u300C\u8BBE\u7F6E \u2192 \u667A\u80FD\u52A9\u624B\u300D\u5F00\u542F\u540E\u53EF\u7528\u300CAI \u5BF9\u8BDD\u300D" }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { className: "taste-filter", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { className: "row", style: { flexWrap: "wrap", gap: 6, alignItems: "center" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "sub", style: { fontSize: 14, fontWeight: 600 }, children: "\u60F3\u5403" }),
        TASTES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          Text,
          {
            className: `tag ${wantTastes.includes(t) ? "selected" : ""}`,
            style: { border: "none", padding: "5px 13px", fontSize: 16 },
            onClick: () => toggleTaste(t, "want"),
            children: t
          },
          t
        ))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { className: "row", style: { flexWrap: "wrap", gap: 6, alignItems: "center", marginTop: 6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "sub", style: { fontSize: 14, fontWeight: 600 }, children: "\u4E0D\u5403" }),
        TASTES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          Text,
          {
            className: `tag ${avoidTastes.includes(t) ? "avoid" : ""}`,
            style: { border: "none", padding: "5px 13px", fontSize: 16 },
            onClick: () => toggleTaste(t, "avoid"),
            children: t
          },
          t
        ))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "sub", style: { marginTop: 6, fontSize: 14 }, children: wantTastes.length === 0 && avoidTastes.length === 0 ? `\u5168\u90E8 ${filtered.length} \u4E2A\u5019\u9009\uFF08\u4E0D\u542B\u4ECA\u5929\u5403\u8FC7\u7684\uFF09` : `${wantTastes.map((t) => t).join("+") || "\u4E0D\u9650"}${avoidTastes.length ? "\uFF0C\u4E0D\u5403" + avoidTastes.join("/") : ""} \xB7 \u5269 ${filtered.length} \u4E2A\u5019\u9009` })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "food-result", children: rolling ? /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_jsx_runtime11.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "food-emoji", children: "\u{1F3B0}" }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "food-name roll-name", children: rollName })
    ] }) : result ? /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_jsx_runtime11.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "food-emoji", children: result.emoji }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "food-name", children: result.name }),
      result.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { style: { marginBottom: 6 }, children: result.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        Text,
        {
          className: "tag",
          style: { background: "rgba(255,255,255,0.25)", color: "#fff" },
          children: t
        },
        t
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { className: "row", style: { justifyContent: "center", flexWrap: "wrap", gap: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "btn", onClick: () => recordEaten(result.name), children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { children: "\u5C31\u5403\u5B83 \u{1F37D}" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "btn plain", onClick: startRoll, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { children: "\u6362\u4E00\u4E2A" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          View,
          {
            className: "btn plain",
            onClick: () => {
              void copyText(result.name);
              setCopied(true);
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { children: copied ? "\u5DF2\u590D\u5236 \u2713" : "\u590D\u5236" })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "divider" }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { className: "row", style: { justifyContent: "center", flexWrap: "wrap", gap: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "btn", onClick: () => void openDelivery("meituan", result.name), children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { children: "\u7F8E\u56E2" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "btn", onClick: () => void openDelivery("eleme", result.name), children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { children: "\u997F\u4E86\u4E48" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "btn plain", onClick: () => void openNearby(), children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { children: "\u641C\u9644\u8FD1" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Text, { className: "sub", style: { marginTop: 6, fontSize: 12 }, children: [
        "\u7F8E\u56E2/\u997F\u4E86\u4E48\u4F1A\u590D\u5236\u300C",
        result.name,
        "\u300D\u540E\u8DF3\u8F6C\u5C0F\u7A0B\u5E8F\uFF0C\u7C98\u8D34\u5373\u53EF\u641C\u7D22"
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_jsx_runtime11.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "food-emoji", children: "\u{1F37D}" }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Text, { className: "sub", style: { margin: "6px 0 14px" }, children: [
        "\u9009\u62E9\u56F0\u96BE\u75C7\uFF1F\u8BA9\u547D\u8FD0\u51B3\u5B9A\u4ECA\u5929\u7684",
        MEAL_SLOT_LABELS[slot]
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        View,
        {
          className: `btn big-btn${filtered.length === 0 ? " is-disabled" : ""}`,
          onClick: () => {
            if (filtered.length > 0) startRoll();
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { children: "\u5E2E\u6211\u9009" })
        }
      ),
      filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "sub", style: { marginTop: 10, color: "#fecaca" }, children: "\u7B5B\u9009\u6761\u4EF6\u4E0B\u6CA1\u6709\u5019\u9009\u4E86\uFF0C\u653E\u5BBD\u6761\u4EF6\u6216\u53BB\u4E0B\u9762\u6DFB\u52A0" })
    ] }) }),
    intelOn && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { children: "\u{1F916} \u667A\u80FD\u5E2E\u6211\u60F3" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { className: "btn ghost small", onClick: openAIChat, children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Icon, { name: "chat", size: 12, gap: 4 }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { children: "AI \u5BF9\u8BDD" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Text, { className: "sub", style: { display: "block", marginTop: 2 }, children: [
        "\u548C\u5C0F\u52A9\u624B\u804A\u4E24\u53E5\uFF0C\u5E2E\u4F60\u60F3\u51FA\u4ECA\u5929",
        MEAL_SLOT_LABELS[slot],
        "\u5403\u4EC0\u4E48\uFF0C\u804A\u5B8C\u76F4\u63A5\u62CD\u677F\u8BB0\u5F55"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Text, { children: [
          MEAL_SLOT_LABELS[slot],
          "\u5019\u9009\uFF08",
          filtered.length,
          "/",
          slotFoods.length,
          "\uFF09"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "btn ghost small", onClick: () => setManaging((v) => !v), children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { children: managing ? "\u6536\u8D77" : "\u7BA1\u7406" }) })
      ] }),
      !managing && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { className: "food-chips", children: [
        filtered.slice(0, 24).map((x) => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
          Text,
          {
            className: `food-chip ${x.fav ? "fav" : ""}`,
            onClick: () => toggleFav(x.id),
            children: [
              x.emoji,
              " ",
              x.name,
              " ",
              x.fav ? "\u2B50" : ""
            ]
          },
          x.id
        )),
        filtered.length > 24 && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Text, { className: "sub", children: [
          "\u2026\u5171 ",
          filtered.length,
          " \u4E2A"
        ] }),
        filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "empty", children: "\u7B5B\u9009\u540E\u6CA1\u6709\u5019\u9009" })
      ] }),
      managing && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_jsx_runtime11.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "sub", style: { marginBottom: 8 }, children: "\u70B9\u51FB \u2B50 \u5207\u6362\u6536\u85CF\uFF08\u968F\u673A\u65F6\u66F4\u5BB9\u6613\u62BD\u4E2D\uFF09\uFF1B\u70B9 \u2715 \u5220\u9664" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "food-chips", children: slotFoods.map((x) => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
          View,
          {
            className: `food-chip ${x.fav ? "fav" : ""} ${avoidTastes.some((t) => x.tags.includes(t)) ? "muted" : ""}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Text, { onClick: () => toggleFav(x.id), children: [
                x.emoji,
                " ",
                x.name,
                " ",
                x.fav ? "\u2B50" : ""
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
                View,
                {
                  style: { marginLeft: 4 },
                  onClick: () => set("foods", (prev) => prev.filter((p) => p.id !== x.id)),
                  children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Icon, { name: "x", size: 12, color: "#c0392b" })
                }
              )
            ]
          },
          x.id
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "divider" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "field", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          Input,
          {
            placeholder: `\u6DFB\u52A0\u5230${MEAL_SLOT_LABELS[slot]}\u6C60\u7684\u98DF\u7269`,
            value: newName,
            onInput: (e) => setNewName(e.detail.value)
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "row", style: { flexWrap: "wrap", gap: 6, marginBottom: 10 }, children: TASTES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          Text,
          {
            className: `tag ${newTastes.includes(t) ? "selected" : ""}`,
            style: { border: "none", padding: "4px 12px", fontSize: 16 },
            onClick: () => setNewTastes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]),
            children: t
          },
          t
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "btn small", onClick: addFood, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { children: "\u6DFB\u52A0" }) })
      ] })
    ] }),
    poiOpen && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { className: "chat-overlay", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { className: "chat-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Icon, { name: "pin", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(Text, { className: "grow", children: [
          "\u9644\u8FD1\u300C",
          result?.name ?? "",
          "\u300D"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { className: "chat-close", onClick: () => setPoiOpen(false), children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Icon, { name: "x", size: 12, gap: 4 }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { children: "\u5173\u95ED" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(ScrollView, { scrollY: true, className: "chat-body", children: [
        poiLoading && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "chat-msg ai", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "bubble", children: "\u6B63\u5728\u641C\u7D22\u9644\u8FD1\u7684\u5E97\u2026" }) }),
        !poiLoading && pois.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(View, { className: "chat-msg ai", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "bubble", children: "\u9644\u8FD1\u6CA1\u641C\u5230\u76F8\u5173\u5E97\u94FA\uFF0C\u6362\u4E2A\u5019\u9009\u518D\u8BD5\u8BD5\uFF5E" }) }),
        pois.map((p) => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
          View,
          {
            className: "card",
            style: { margin: 0 },
            onClick: () => openPoi(p),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { className: "row", style: { justifyContent: "space-between" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { style: { fontSize: 16, fontWeight: 700, flex: 1 }, children: p.name }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "sub", style: { fontSize: 12, flexShrink: 0 }, children: p.distance >= 1e3 ? `${(p.distance / 1e3).toFixed(1)} km` : `${p.distance} m` })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "sub", style: { fontSize: 14, display: "block", marginTop: 4 }, children: p.address }),
              p.tel && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(View, { style: { marginTop: 2, display: "flex", alignItems: "center" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Icon, { name: "phone", size: 12, gap: 4 }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "sub", style: { fontSize: 12 }, children: p.tel })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Text, { className: "sub", style: { fontSize: 12, display: "block", marginTop: 6, color: "var(--primary)" }, children: "\u70B9\u51FB\u67E5\u770B\u4F4D\u7F6E\u4E0E\u8DEF\u7EBF \u2192" })
            ]
          },
          p.id
        ))
      ] })
    ] })
  ] });
}

// src/pages/ledger/index.tsx
var import_react11 = require("react");
var import_jsx_runtime12 = require("react/jsx-runtime");
var WEEKDAYS = ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"];
function shiftMonth(month, delta) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function daysInMonth(month) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}
var isExpense = (l) => l.type !== "income";
var PIE_COLORS = ["#be5016", "#f59e0b", "#10b981", "#ef4444", "#c97b63", "#06b6d4", "#f97316", "#84cc16", "#e2703a", "#64748b", "#14b8a6", "#7c5e42"];
function catColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
  return PIE_COLORS[h % PIE_COLORS.length];
}
function Ledger() {
  const { data, ready, set } = useData();
  const [month, setMonth] = (0, import_react11.useState)(() => todayStr().slice(0, 7));
  const [amount, setAmount] = (0, import_react11.useState)("");
  const [category, setCategory] = (0, import_react11.useState)(EXPENSE_CATEGORIES[0].name);
  const [entryType, setEntryType] = (0, import_react11.useState)("expense");
  const [note, setNote] = (0, import_react11.useState)("");
  const [fKeyword, setFK] = (0, import_react11.useState)("");
  const [fTime, setFTime] = (0, import_react11.useState)(null);
  const [fFrom, setFFrom] = (0, import_react11.useState)("");
  const [fTo, setFTo] = (0, import_react11.useState)("");
  const [fCats, setFCats] = (0, import_react11.useState)([]);
  const [editing, setEditing] = (0, import_react11.useState)(null);
  const [chartMode, setChartMode] = (0, import_react11.useState)("day");
  const [chartType, setChartType] = (0, import_react11.useState)("expense");
  const [catRange, setCatRange] = (0, import_react11.useState)("month");
  const [catChart, setCatChart] = (0, import_react11.useState)("bar");
  const [catSelected, setCatSelected] = (0, import_react11.useState)(null);
  const monthEntries = (0, import_react11.useMemo)(
    () => data.ledger.filter((l) => l.date.startsWith(month)),
    [data.ledger, month]
  );
  const prevMonthEntries = (0, import_react11.useMemo)(
    () => data.ledger.filter((l) => l.date.startsWith(shiftMonth(month, -1))),
    [data.ledger, month]
  );
  const expenseTotal = monthEntries.filter(isExpense).reduce((s, l) => s + l.amount, 0);
  const incomeTotal = monthEntries.filter((l) => !isExpense(l)).reduce((s, l) => s + l.amount, 0);
  const balance = incomeTotal - expenseTotal;
  const prevExpenseTotal = prevMonthEntries.filter(isExpense).reduce((s, l) => s + l.amount, 0);
  const todayExpense = monthEntries.filter((l) => isExpense(l) && l.date === todayStr()).reduce((s, l) => s + l.amount, 0);
  const now = /* @__PURE__ */ new Date();
  const isCurrentMonth = month === todayStr().slice(0, 7);
  const daysElapsed = isCurrentMonth ? now.getDate() : daysInMonth(month);
  const dayAvg = expenseTotal / Math.max(1, daysElapsed);
  const budgetLeftDays = data.budget > 0 && dayAvg > 0 ? Math.floor((data.budget - expenseTotal) / dayAvg) : null;
  const momPct = prevExpenseTotal > 0 ? Math.round((expenseTotal - prevExpenseTotal) / prevExpenseTotal * 100) : null;
  const allCats = (0, import_react11.useMemo)(() => {
    const map = /* @__PURE__ */ new Map();
    for (const c of [...data.ledgerCats.expense, ...data.ledgerCats.income]) {
      if (!map.has(c.name)) map.set(c.name, c);
    }
    return [...map.values()];
  }, [data.ledgerCats]);
  const categories = entryType === "expense" ? data.ledgerCats.expense : data.ledgerCats.income;
  const catPages = (0, import_react11.useMemo)(() => {
    const pages2 = [];
    for (let i = 0; i < categories.length; i += 8) {
      const page = categories.slice(i, i + 8);
      while (page.length < 8) page.push(null);
      pages2.push(page);
    }
    return pages2;
  }, [categories]);
  const catEntries = (0, import_react11.useMemo)(() => {
    const today = todayStr();
    return data.ledger.filter((l) => {
      if (catRange === "week") {
        const monday = startOfWeek(today);
        return l.date >= monday && l.date <= addDays(monday, 6);
      }
      if (catRange === "month") return l.date.startsWith(today.slice(0, 7));
      return l.date.startsWith(today.slice(0, 4));
    });
  }, [data.ledger, catRange]);
  const byCategory = (0, import_react11.useMemo)(() => {
    const cats = data.ledgerCats[entryType];
    return cats.map((c) => ({
      c,
      sum: catEntries.filter((l) => isExpense(l) === (entryType === "expense") && l.category === c.name).reduce((s, l) => s + l.amount, 0)
    })).filter((x) => x.sum > 0).sort((a, b) => b.sum - a.sum);
  }, [catEntries, entryType, data.ledgerCats]);
  const catTotal = byCategory.reduce((s, x) => s + x.sum, 0);
  const shownCategories = catSelected ? byCategory.filter((x) => x.c.name === catSelected) : byCategory;
  const barRows = (0, import_react11.useMemo)(() => {
    const rows = byCategory.slice(0, 3).map((x) => ({ key: x.c.name, name: x.c.name, emoji: x.c.emoji, sum: x.sum, selectable: true }));
    if (byCategory.length > 3) {
      rows.push({
        key: "__rest__",
        name: "\u5176\u4ED6",
        emoji: "\u{1F4E6}",
        sum: byCategory.slice(3).reduce((s, x) => s + x.sum, 0),
        selectable: false
      });
    }
    return rows;
  }, [byCategory]);
  const maxBar = Math.max(1, ...barRows.map((x) => x.sum));
  const pieSize = (0, import_react11.useRef)({ w: 0, h: 0 });
  (0, import_react11.useEffect)(() => {
    if (!ready || catChart !== "pie") return;
    stubs_default.nextTick(() => {
      stubs_default.createSelectorQuery().select("#catPie").fields({ node: true, size: true }).exec((res) => {
        const info = res && res[0];
        if (!info || !info.node || !info.width) return;
        const w = info.width;
        const h = info.height;
        pieSize.current = { w, h };
        const canvas = info.node;
        const dpr = stubs_default.getSystemInfoSync().pixelRatio || 2;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);
        const cx = w / 2;
        const cy = h / 2;
        const r = Math.min(w, h) / 2 - 12;
        const inner = r * 0.55;
        if (catTotal <= 0) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.arc(cx, cy, inner, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fillStyle = "#e6e8f0";
          ctx.fill();
          return;
        }
        let angle = -Math.PI / 2;
        for (const it of byCategory) {
          const sweep = it.sum / catTotal * Math.PI * 2;
          const selected = catSelected === it.c.name;
          const mid = angle + sweep / 2;
          const off = selected ? 5 : 0;
          const ox = cx + Math.cos(mid) * off;
          const oy = cy + Math.sin(mid) * off;
          ctx.beginPath();
          ctx.arc(ox, oy, r, angle, angle + sweep);
          ctx.arc(ox, oy, inner, angle + sweep, angle, true);
          ctx.closePath();
          ctx.fillStyle = catColor(it.c.name);
          ctx.globalAlpha = catSelected && !selected ? 0.35 : 1;
          ctx.fill();
          angle += sweep;
        }
        ctx.globalAlpha = 1;
      });
    });
  }, [ready, catChart, catRange, entryType, catSelected, catTotal, byCategory]);
  const onPieTap = (pt) => {
    const { w, h } = pieSize.current;
    if (!w || catTotal <= 0) return;
    const dx = pt.x - w / 2;
    const dy = pt.y - h / 2;
    const r = Math.min(w, h) / 2 - 12;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < r * 0.55 || dist > r + 8) {
      setCatSelected(null);
      return;
    }
    let a = Math.atan2(dy, dx) + Math.PI / 2;
    if (a < 0) a += Math.PI * 2;
    let acc = 0;
    for (const it of byCategory) {
      acc += it.sum / catTotal * Math.PI * 2;
      if (a <= acc) {
        setCatSelected((prev) => prev === it.c.name ? null : it.c.name);
        return;
      }
    }
  };
  const filterActive = !!(fKeyword.trim() || fTime || fCats.length);
  const filtered = (0, import_react11.useMemo)(() => {
    let list = filterActive ? data.ledger : monthEntries;
    if (fTime) {
      const today = todayStr();
      let from = "";
      let to = "";
      if (fTime === "week") {
        from = startOfWeek(today);
        to = addDays(from, 6);
      } else if (fTime === "month") {
        from = `${today.slice(0, 7)}-01`;
        to = `${today.slice(0, 7)}-${String(daysInMonth(today.slice(0, 7))).padStart(2, "0")}`;
      } else if (fTime === "year") {
        from = `${today.slice(0, 4)}-01-01`;
        to = `${today.slice(0, 4)}-12-31`;
      } else {
        from = fFrom;
        to = fTo;
      }
      list = list.filter((l) => (!from || l.date >= from) && (!to || l.date <= to));
    }
    const q = fKeyword.trim().toLowerCase();
    if (q) list = list.filter((l) => l.note.toLowerCase().includes(q) || l.category.includes(q));
    if (fCats.length) list = list.filter((l) => fCats.includes(l.category));
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [data.ledger, monthEntries, filterActive, fTime, fFrom, fTo, fKeyword, fCats]);
  const byDay = (0, import_react11.useMemo)(() => {
    const map = /* @__PURE__ */ new Map();
    for (const l of filtered) {
      if (!map.has(l.date)) map.set(l.date, []);
      map.get(l.date).push(l);
    }
    return [...map.entries()];
  }, [filtered]);
  const year = month.slice(0, 4);
  const chartData = (0, import_react11.useMemo)(() => {
    const inChart = (l) => isExpense(l) === (chartType === "expense");
    if (chartMode === "day") {
      const arr = [];
      for (let d = 1; d <= daysInMonth(month); d++) {
        const ds = `${month}-${String(d).padStart(2, "0")}`;
        arr.push({
          label: String(d),
          sum: monthEntries.filter((l) => inChart(l) && l.date === ds).reduce((s, l) => s + l.amount, 0)
        });
      }
      return arr;
    }
    if (chartMode === "month") {
      const arr = [];
      for (let m = 1; m <= 12; m++) {
        const ms = `${year}-${String(m).padStart(2, "0")}`;
        arr.push({
          label: `${m}\u6708`,
          sum: data.ledger.filter((l) => inChart(l) && l.date.startsWith(ms)).reduce((s, l) => s + l.amount, 0)
        });
      }
      return arr;
    }
    const years = [...new Set(data.ledger.filter(inChart).map((l) => l.date.slice(0, 4)))].sort();
    return years.map((y) => ({
      label: y,
      sum: data.ledger.filter((l) => inChart(l) && l.date.startsWith(y)).reduce((s, l) => s + l.amount, 0)
    }));
  }, [chartMode, chartType, monthEntries, data.ledger, month, year]);
  const chartMax = Math.max(1, ...chartData.map((x) => x.sum));
  const chartTypeName = chartType === "expense" ? "\u652F\u51FA" : "\u6536\u5165";
  const chartTitle = chartMode === "day" ? `\u6BCF\u65E5${chartTypeName}` : chartMode === "month" ? `${year} \u5E74${chartTypeName}` : `\u5386\u5E74${chartTypeName}`;
  const chartColor = chartType === "expense" ? "#be5016" : "#16a34a";
  const chartUnit = chartMode === "day" ? "\u65E5" : chartMode === "month" ? "\u6708" : "\u5E74";
  const BAR_AREA = 64;
  const barWidth = chartMode === "day" ? "58%" : chartMode === "month" ? "60%" : "50%";
  const clearFilters = () => {
    setFK("");
    setFTime(null);
    setFFrom("");
    setFTo("");
    setFCats([]);
  };
  const add = () => {
    const v = Number(amount);
    if (!v || v <= 0) {
      showToast("\u8BF7\u8F93\u5165\u91D1\u989D");
      return;
    }
    const cat = categories.find((c) => c.name === category) ?? categories[0];
    set("ledger", (prev) => [
      { id: uid(), date: todayStr(), amount: v, category: cat.name, note: note.trim(), type: entryType },
      ...prev
    ]);
    setAmount("");
    setNote("");
    showToast(`\u5DF2\u8BB0\u4E00\u7B14${entryType === "expense" ? "\u652F\u51FA" : "\u6536\u5165"} \xA5${v.toFixed(2)}`);
  };
  const saveEdit = () => {
    if (!editing) return;
    set("ledger", (prev) => prev.map((l) => l.id === editing.id ? editing : l));
    setEditing(null);
    showToast("\u5DF2\u4FDD\u5B58\u4FEE\u6539");
  };
  const overBudget = data.budget > 0 && expenseTotal > data.budget;
  const budgetPct = data.budget > 0 ? Math.min(100, Math.round(expenseTotal / data.budget * 100)) : 0;
  const catEmoji = (name) => allCats.find((c) => c.name === name)?.emoji ?? "\u{1F4E6}";
  const xLabelStart = chartMode === "day" ? `1 ${chartUnit}` : chartMode === "month" ? `1 ${chartUnit}` : chartData[0]?.label ?? "";
  const xLabelEnd = chartMode === "day" ? `${daysInMonth(month)} ${chartUnit}` : chartMode === "month" ? `12 ${chartUnit}` : chartData[chartData.length - 1]?.label ?? "";
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "sub", children: "\u52A0\u8F7D\u4E2D\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "page-title", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: "\u{1F4B0} \u8BB0\u8D26\u672C" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "row-between", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "btn plain small", onClick: () => setMonth(shiftMonth(month, -1)), children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: "\u2039" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { style: { fontSize: 18, fontWeight: 700 }, children: [
          month.replace("-", " \u5E74 "),
          " \u6708"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          View,
          {
            className: "btn plain small",
            style: month >= todayStr().slice(0, 7) ? { opacity: 0.35 } : void 0,
            onClick: () => {
              if (month < todayStr().slice(0, 7)) setMonth(shiftMonth(month, 1));
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: "\u203A" })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { style: { display: "flex", textAlign: "center", margin: "12px 0 4px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { style: { flex: 1 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "sub", style: { fontSize: 14 }, children: "\u652F\u51FA" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { style: { fontSize: 22, fontWeight: 800, lineHeight: 1.4 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { style: { fontSize: 14 }, children: "\xA5" }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: expenseTotal.toFixed(2) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { style: { flex: 1 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "sub", style: { fontSize: 14 }, children: "\u6536\u5165" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { style: { fontSize: 22, fontWeight: 800, color: "var(--success)", lineHeight: 1.4 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { style: { fontSize: 14 }, children: "\xA5" }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: incomeTotal.toFixed(2) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { style: { flex: 1 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "sub", style: { fontSize: 14 }, children: "\u7ED3\u4F59" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
            View,
            {
              style: {
                fontSize: 22,
                fontWeight: 800,
                lineHeight: 1.4,
                color: balance >= 0 ? "var(--success)" : "var(--danger)"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { style: { fontSize: 14 }, children: "\xA5" }),
                /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { children: [
                  balance >= 0 ? "+" : "-",
                  Math.abs(balance).toFixed(2)
                ] })
              ]
            }
          )
        ] })
      ] }),
      data.budget > 0 && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { style: { marginTop: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { className: "sub", style: { color: overBudget ? "var(--danger)" : void 0 }, children: [
          "\u9884\u7B97 \xA5",
          data.budget,
          " \xB7 \u5DF2\u7528 ",
          budgetPct,
          "%",
          overBudget ? " \xB7 \u8D85\u652F\uFF01" : ""
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "progress", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          View,
          {
            className: "progress-fill",
            style: {
              width: `${budgetPct}%`,
              background: overBudget ? "var(--danger)" : void 0
            }
          }
        ) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
        View,
        {
          className: "row",
          style: { justifyContent: "space-between", marginTop: 8, flexWrap: "wrap", gap: 4 },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { className: "sub", children: [
              "\u4ECA\u65E5 \xA5",
              todayExpense.toFixed(2)
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { className: "sub", children: [
              "\u65E5\u5747 \xA5",
              dayAvg.toFixed(1)
            ] }),
            budgetLeftDays !== null && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { className: "sub", style: { color: budgetLeftDays < 5 ? "var(--warn)" : void 0 }, children: [
              "\u9884\u7B97\u8FD8\u53EF\u6491 ",
              budgetLeftDays,
              " \u5929"
            ] }),
            momPct !== null && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { className: "sub", style: { color: momPct > 0 ? "var(--danger)" : "var(--success)" }, children: [
              "\u73AF\u6BD4\u4E0A\u6708 ",
              momPct > 0 ? "\u2191" : "\u2193",
              Math.abs(momPct),
              "%"
            ] })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
        View,
        {
          className: "icon-btn",
          style: { fontSize: 14 },
          onClick: () => {
            void appPrompt(
              data.budget > 0 ? "\u4FEE\u6539\u6BCF\u6708\u9884\u7B97\uFF08\u5143\uFF09\uFF1A" : "\u8BBE\u7F6E\u6BCF\u6708\u9884\u7B97\uFF08\u5143\uFF09\uFF1A",
              String(data.budget || ""),
              "number"
            ).then((v) => {
              if (v === null) return;
              const n = Number(v);
              if (v.trim() !== "" && n > 0) set("budget", Math.round(n));
              if (v.trim() === "") set("budget", 0);
            });
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Icon, { name: "pencil", size: 14, gap: 4 }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: data.budget > 0 ? "\u4FEE\u6539\u9884\u7B97" : "\u8BBE\u7F6E\u9884\u7B97" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "card-title chart-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: chartTitle }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "row", style: { alignItems: "center", gap: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "type-toggle", style: { marginBottom: 0 }, children: [["expense", "\u652F\u51FA"], ["income", "\u6536\u5165"]].map(([t, label]) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          View,
          {
            className: `type-btn ${chartType === t ? "active" : ""}`,
            style: { flex: "none", padding: "2px 10px", fontSize: 14 },
            onClick: () => setChartType(t),
            children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: label })
          },
          t
        )) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "type-toggle", style: { marginBottom: 10 }, children: [["day", "\u65E5"], ["month", "\u6708"], ["year", "\u5E74"]].map(([mode, label]) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        View,
        {
          className: `type-btn ${chartMode === mode ? "active" : ""}`,
          onClick: () => setChartMode(mode),
          children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: label })
        },
        mode
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { style: { display: "flex", alignItems: "flex-end", height: 78, gap: 1 }, children: chartData.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
        View,
        {
          style: {
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end"
          },
          onClick: () => {
            if (d.sum <= 0) return;
            const scope = chartMode === "day" ? `${month}-${String(d.label).padStart(2, "0")}` : chartMode === "month" ? `${year}-${d.label}` : `${d.label} \u5E74`;
            showToast(`${scope}\uFF1A\xA5${d.sum.toFixed(2)}`);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { style: { fontSize: 10, color: "var(--text-sub)", marginBottom: 2, lineHeight: 1 }, children: d.sum > 0 ? d.sum.toFixed(0) : "" }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
              View,
              {
                style: {
                  width: barWidth,
                  height: Math.max(d.sum > 0 ? 3 : 1, Math.round(d.sum / chartMax * BAR_AREA)),
                  borderRadius: 2,
                  background: d.sum > 0 ? chartColor : "var(--progress-bg)"
                }
              }
            )
          ]
        },
        i
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "row-between", style: { marginTop: 4 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "sub", style: { fontSize: 14 }, children: xLabelStart }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "sub", style: { fontSize: 14 }, children: xLabelEnd })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "card-title", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Icon, { name: "pencil", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: "\u8BB0\u4E00\u7B14" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
          View,
          {
            className: "btn ghost small",
            onClick: () => stubs_default.navigateTo({ url: "/pages/ledger-cats/index" }),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Icon, { name: "gear", size: 12, gap: 4 }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: "\u7BA1\u7406" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "type-toggle", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          View,
          {
            className: `type-btn ${entryType === "expense" ? "active" : ""}`,
            onClick: () => {
              setEntryType("expense");
              setCategory(data.ledgerCats.expense[0]?.name ?? "\u5176\u4ED6");
              setCatSelected(null);
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: "\u652F\u51FA" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          View,
          {
            className: `type-btn ${entryType === "income" ? "active" : ""}`,
            onClick: () => {
              setEntryType("income");
              setCategory(data.ledgerCats.income[0]?.name ?? "\u5176\u4ED6");
              setCatSelected(null);
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: "\u6536\u5165" })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        Swiper,
        {
          className: "cat-swiper",
          indicatorDots: true,
          indicatorColor: "rgba(0,0,0,0.15)",
          indicatorActiveColor: "#be5016",
          children: catPages.map((page, pi) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(SwiperItem, { children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "cat-grid", children: page.map(
            (c, ci) => c ? /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
              View,
              {
                className: `cat-item ${category === c.name ? "active" : ""}`,
                onClick: () => setCategory(c.name),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "cat-emoji", children: c.emoji }),
                  /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: c.name })
                ]
              },
              c.name
            ) : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "cat-item", style: { opacity: 0 } }, `ph-${ci}`)
          ) }) }, pi))
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "form-row", style: { marginTop: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "field", style: { width: 110, marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          Input,
          {
            type: "digit",
            placeholder: "\u91D1\u989D",
            value: amount,
            onInput: (e) => setAmount(e.detail.value)
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "field", style: { flex: 1, marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          Input,
          {
            placeholder: "\u5907\u6CE8\uFF08\u53EF\u9009\uFF09",
            value: note,
            onInput: (e) => setNote(e.detail.value),
            onConfirm: () => add()
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "btn small", onClick: add, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: "\u8BB0\u4E00\u7B14" }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "card cat-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Icon, { name: "chart-bar", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { children: [
          entryType === "expense" ? "\u652F\u51FA" : "\u6536\u5165",
          "\u5206\u7C7B"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "type-toggle", style: { marginBottom: 0, width: 132 }, children: [["bar", "\u6A2A\u6761"], ["pie", "\u997C\u56FE"]].map(([t, label]) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          View,
          {
            className: `type-btn ${catChart === t ? "active" : ""}`,
            style: { flex: "none", padding: "2px 10px", fontSize: 14 },
            onClick: () => setCatChart(t),
            children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: label })
          },
          t
        )) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "type-toggle", style: { marginBottom: 8 }, children: [["week", "\u5468"], ["month", "\u6708"], ["year", "\u5E74"]].map(([rg, label]) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        View,
        {
          className: `type-btn ${catRange === rg ? "active" : ""}`,
          onClick: () => {
            setCatRange(rg);
            setCatSelected(null);
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: label })
        },
        rg
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "cat-body", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "cat-chart", children: catChart === "bar" ? barRows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          View,
          {
            className: "cat-bar-scroll",
            style: { display: "flex", alignItems: "center", justifyContent: "center" },
            children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "sub", style: { fontSize: 16 }, children: "\u6682\u65E0\u8BB0\u5F55" })
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ScrollView, { scrollY: true, className: "cat-bar-scroll", children: barRows.map((x) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
          View,
          {
            style: {
              marginBottom: 8,
              opacity: catSelected && x.selectable && catSelected !== x.name ? 0.35 : 1
            },
            onClick: () => x.selectable && setCatSelected((p) => p === x.name ? null : x.name),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "row-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { className: "sub", children: [
                  x.emoji,
                  " ",
                  x.name
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { className: "sub", children: [
                  "\xA5",
                  x.sum.toFixed(2),
                  " \xB7 ",
                  Math.round(x.sum / catTotal * 100),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "progress", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                View,
                {
                  className: "progress-fill",
                  style: {
                    width: `${x.sum / maxBar * 100}%`,
                    background: x.selectable && catSelected === x.name ? catColor(x.name) : void 0
                  }
                }
              ) })
            ]
          },
          x.key
        )) }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "cat-pie-wrap", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            Canvas,
            {
              id: "catPie",
              type: "2d",
              className: "cat-pie",
              onClick: (e) => onPieTap(e.detail)
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "cat-pie-center", children: catTotal <= 0 ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "sub", style: { fontSize: 14 }, children: "\u6682\u65E0\u8BB0\u5F55" }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "sub", style: { fontSize: 12 }, children: "\u603B\u8BA1" }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { style: { fontSize: 16, fontWeight: 800 }, children: [
              "\xA5",
              catTotal.toFixed(0)
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ScrollView, { scrollY: true, className: "cat-list", children: shownCategories.map((x) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
          View,
          {
            className: "cat-row",
            onClick: () => setCatSelected((p) => p === x.c.name ? null : x.c.name),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "cat-row-dot", style: { background: catColor(x.c.name) } }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { style: { flex: 1 }, children: [
                x.c.emoji,
                " ",
                x.c.name
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { className: "sub", children: [
                "\xA5",
                x.sum.toFixed(2)
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { className: "cat-row-pct", children: [
                Math.round(x.sum / catTotal * 100),
                "%"
              ] })
            ]
          },
          x.c.name
        )) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "card-title", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Icon, { name: "search", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: "\u7B5B\u9009\u6D41\u6C34" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "row", style: { gap: 8 }, children: [
          filterActive && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "btn plain small", onClick: clearFilters, children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Icon, { name: "x", size: 12, gap: 4 }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: "\u6E05\u9664\u7B5B\u9009" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
            View,
            {
              className: "btn ghost small",
              onClick: () => stubs_default.navigateTo({ url: "/pages/ledger-search/index" }),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Icon, { name: "search", size: 12, gap: 4 }),
                /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: "\u9AD8\u7EA7\u641C\u7D22" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "field", style: { marginBottom: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        Input,
        {
          placeholder: "\u641C\u5907\u6CE8 / \u5206\u7C7B",
          value: fKeyword,
          onInput: (e) => setFK(e.detail.value)
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "row", style: { gap: 6, flexWrap: "wrap", marginBottom: 8 }, children: [["week", "\u672C\u5468"], ["month", "\u672C\u6708"], ["year", "\u4ECA\u5E74"], ["custom", "\u81EA\u5B9A\u4E49"]].map(
        ([t, label]) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          View,
          {
            onClick: () => setFTime((p) => p === t ? null : t),
            style: {
              padding: "4px 12px",
              borderRadius: 999,
              fontSize: 14,
              background: fTime === t ? "var(--primary-light)" : "var(--chip-bg)",
              color: fTime === t ? "var(--primary)" : "var(--text-sub)",
              fontWeight: fTime === t ? 600 : 400
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: label })
          },
          t
        )
      ) }),
      fTime === "custom" && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "row", style: { gap: 8, marginBottom: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { style: { flex: 1 }, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DatePicker2, { value: fFrom, onChange: setFFrom, placeholder: "\u8D77\u59CB\u65E5\u671F", compact: true }) }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { style: { flex: 1 }, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DatePicker2, { value: fTo, onChange: setFTo, placeholder: "\u7ED3\u675F\u65E5\u671F", compact: true }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ScrollView, { scrollX: true, style: { whiteSpace: "nowrap" }, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "row", style: { gap: 6 }, children: allCats.map((c) => {
        const on = fCats.includes(c.name);
        return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          View,
          {
            onClick: () => setFCats((p) => on ? p.filter((x) => x !== c.name) : [...p, c.name]),
            style: {
              padding: "4px 12px",
              borderRadius: 999,
              fontSize: 14,
              flex: "none",
              background: on ? "var(--primary-light)" : "var(--chip-bg)",
              color: on ? "var(--primary)" : "var(--text-sub)",
              fontWeight: on ? 600 : 400
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { children: [
              c.emoji,
              " ",
              c.name
            ] })
          },
          c.name
        );
      }) }) })
    ] }),
    editing && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Modal, { variant: "sheet", onClose: () => setEditing(null), children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "card-title", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: "\u7F16\u8F91\u8BB0\u5F55" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "form-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "sub", children: "\u91D1\u989D" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            Input,
            {
              type: "digit",
              value: String(editing.amount),
              onInput: (e) => setEditing({ ...editing, amount: Number(e.detail.value) || 0 })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "sub", children: "\u65E5\u671F" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            DatePicker2,
            {
              value: editing.date,
              onChange: (v) => setEditing({ ...editing, date: v })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "form-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "sub", children: "\u5206\u7C7B" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            Picker,
            {
              mode: "selector",
              range: allCats.map((c) => c.name),
              value: Math.max(
                0,
                allCats.findIndex((c) => c.name === editing.category)
              ),
              onChange: (e) => {
                const name = allCats[Number(e.detail.value)]?.name;
                if (name) setEditing({ ...editing, category: name });
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "dp-trigger compact", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: editing.category }) })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "field", children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "sub", children: "\u5907\u6CE8" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            Input,
            {
              value: editing.note,
              onInput: (e) => setEditing({ ...editing, note: e.detail.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "row", style: { justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          View,
          {
            className: "btn danger small",
            onClick: () => {
              set("ledger", (prev) => prev.filter((x) => x.id !== editing.id));
              setEditing(null);
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: "\u5220\u9664" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(View, { className: "btn small", onClick: saveEdit, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: "\u4FDD\u5B58" }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "card-title", style: { marginBottom: 4 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Icon, { name: "clipboard", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { children: "\u6D41\u6C34" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "sub", children: filterActive ? `\u7B5B\u9009\u4E2D \xB7 ${filtered.length} \u7B14` : `\u5171 ${filtered.length} \u7B14` })
      ] }),
      byDay.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "empty", children: filterActive ? "\u6CA1\u6709\u7B26\u5408\u6761\u4EF6\u7684\u8BB0\u5F55" : "\u672C\u6708\u8FD8\u6CA1\u6709\u8BB0\u5F55" }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ScrollView, { scrollY: true, className: "flow-scroll", children: byDay.map(([day, items]) => {
        const d = /* @__PURE__ */ new Date(day + "T00:00:00");
        const dayExpense = items.filter(isExpense).reduce((s, l) => s + l.amount, 0);
        const dayIncome = items.filter((l) => !isExpense(l)).reduce((s, l) => s + l.amount, 0);
        return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "row-between", style: { margin: "6px 0 2px" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { className: "sub", children: [
              day.slice(5),
              " \xB7 \u5468",
              WEEKDAYS[d.getDay()]
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "row", children: [
              dayExpense > 0 && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { className: "sub", children: [
                "\u652F\u51FA \xA5",
                dayExpense.toFixed(2)
              ] }),
              dayIncome > 0 && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { className: "sub", style: { color: "var(--success)" }, children: [
                "\u6536\u5165 \xA5",
                dayIncome.toFixed(2)
              ] })
            ] })
          ] }),
          items.map((l) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "list-item", onClick: () => setEditing(l), children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { style: { fontSize: 22 }, children: catEmoji(l.category) }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(View, { className: "grow", children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Text, { className: "name", children: l.note || l.category }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(Text, { className: "sub", style: { fontSize: 14 }, children: [
                l.category,
                !isExpense(l) ? " \xB7 \u6536\u5165" : ""
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
              Text,
              {
                style: {
                  fontWeight: 700,
                  color: isExpense(l) ? void 0 : "var(--success)"
                },
                children: [
                  isExpense(l) ? "-" : "+",
                  l.amount.toFixed(2)
                ]
              }
            )
          ] }, l.id))
        ] }, day);
      }) })
    ] })
  ] });
}

// src/pages/ledger-cats/index.tsx
var import_react12 = require("react");
var import_jsx_runtime13 = require("react/jsx-runtime");
function LedgerCats() {
  const { data, ready, set } = useData();
  const [tab, setTab] = (0, import_react12.useState)("expense");
  const [modal, setModal] = (0, import_react12.useState)(null);
  const [name, setName] = (0, import_react12.useState)("");
  const [emoji, setEmoji] = (0, import_react12.useState)("");
  const cats = data.ledgerCats[tab];
  const openEdit = (c) => {
    setModal({ mode: "edit", original: c });
    setName(c.name);
    setEmoji(c.emoji);
  };
  const openAdd = () => {
    setModal({ mode: "add" });
    setName("");
    setEmoji("");
  };
  const moveCat = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= cats.length) return;
    const next = [...cats];
    [next[index], next[target]] = [next[target], next[index]];
    set(
      "ledgerCats",
      (prev) => tab === "expense" ? { ...prev, expense: next } : { ...prev, income: next }
    );
  };
  const countOf = (catName) => data.ledger.filter((l) => l.category === catName && (l.type ?? "expense") === tab).length;
  const save = () => {
    if (!modal) return;
    const newName = name.trim();
    if (!newName) {
      showToast("\u8BF7\u8F93\u5165\u5206\u7C7B\u540D\u79F0");
      return;
    }
    const newEmoji = emoji || "\u{1F4E6}";
    const originalName = modal.mode === "edit" ? modal.original.name : null;
    if (cats.some((c) => c.name === newName && c.name !== originalName)) {
      showToast("\u5206\u7C7B\u5DF2\u5B58\u5728");
      return;
    }
    if (modal.mode === "add") {
      set(
        "ledgerCats",
        (prev) => tab === "expense" ? { ...prev, expense: [...prev.expense, { name: newName, emoji: newEmoji }] } : { ...prev, income: [...prev.income, { name: newName, emoji: newEmoji }] }
      );
    } else {
      const original = modal.original;
      const finalName = original.locked ? original.name : newName;
      if (finalName !== original.name) {
        set(
          "ledger",
          (prev) => prev.map(
            (l) => l.category === original.name && (l.type ?? "expense") === tab ? { ...l, category: finalName } : l
          )
        );
      }
      set(
        "ledgerCats",
        (prev) => tab === "expense" ? {
          ...prev,
          expense: prev.expense.map(
            (c) => c.name === original.name ? { ...c, name: finalName, emoji: newEmoji } : c
          )
        } : {
          ...prev,
          income: prev.income.map(
            (c) => c.name === original.name ? { ...c, name: finalName, emoji: newEmoji } : c
          )
        }
      );
    }
    setModal(null);
    showToast("\u5DF2\u4FDD\u5B58");
  };
  const removeCat = () => {
    if (!modal || modal.mode !== "edit") return;
    const original = modal.original;
    if (original.builtin || original.locked) return;
    const n = countOf(original.name);
    void appConfirm("\u5220\u9664\u5206\u7C7B", `\u8BE5\u5206\u7C7B\u4E0B ${n} \u7B14\u8BB0\u5F55\u5C06\u5F52\u5165\u300C\u5176\u4ED6\u300D`, { danger: true }).then((ok) => {
      if (!ok) return;
      set(
        "ledger",
        (prev) => prev.map(
          (l) => l.category === original.name && (l.type ?? "expense") === tab ? { ...l, category: "\u5176\u4ED6" } : l
        )
      );
      set(
        "ledgerCats",
        (prev) => tab === "expense" ? { ...prev, expense: prev.expense.filter((c) => c.name !== original.name) } : { ...prev, income: prev.income.filter((c) => c.name !== original.name) }
      );
      setModal(null);
    });
  };
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Text, { className: "sub", children: "\u52A0\u8F7D\u4E2D\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(View, { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(View, { className: "page-title", children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Icon, { name: "folder", size: 16, gap: 4 }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Text, { children: "\u5206\u7C7B\u7BA1\u7406" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(View, { className: "type-toggle", children: [["expense", "\u652F\u51FA"], ["income", "\u6536\u5165"]].map(([t, label]) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      View,
      {
        className: `type-btn ${tab === t ? "active" : ""}`,
        onClick: () => setTab(t),
        children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Text, { children: label })
      },
      t
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(View, { className: "card", children: cats.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(View, { className: "list-item", onClick: () => openEdit(c), children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Text, { style: { fontSize: 22 }, children: c.emoji }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(View, { className: "grow", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Text, { className: "name", children: c.name }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Text, { className: "sub", children: c.locked ? "\u7CFB\u7EDF" : c.builtin ? "\u5185\u7F6E" : "\u81EA\u5B9A\u4E49" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(View, { className: "row", style: { flexShrink: 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          View,
          {
            className: "icon-btn",
            style: { opacity: i === 0 ? 0.3 : 1 },
            onClick: (e) => {
              e.stopPropagation();
              moveCat(i, -1);
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Icon, { name: "arrow-up", size: 16 })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          View,
          {
            className: "icon-btn",
            style: { opacity: i === cats.length - 1 ? 0.3 : 1 },
            onClick: (e) => {
              e.stopPropagation();
              moveCat(i, 1);
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Icon, { name: "arrow-down", size: 16 })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Text, { className: "sub", children: "\u203A" })
    ] }, c.name)) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(View, { className: "btn", onClick: openAdd, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Text, { children: "+ \u65B0\u589E\u5206\u7C7B" }) }),
    modal && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(Modal, { variant: "sheet", onClose: () => setModal(null), children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(View, { className: "card-title", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Text, { children: modal.mode === "edit" ? "\u7F16\u8F91\u5206\u7C7B" : "\u65B0\u589E\u5206\u7C7B" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(View, { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Text, { className: "sub", children: "\u540D\u79F0" }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          Input,
          {
            value: name,
            disabled: modal.mode === "edit" && !!modal.original.locked,
            placeholder: "\u5206\u7C7B\u540D\u79F0",
            onInput: (e) => setName(e.detail.value)
          }
        )
      ] }),
      modal.mode === "edit" && modal.original.locked && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Text, { className: "sub", children: "\u300C\u5176\u4ED6\u300D\u4E0D\u53EF\u6539\u540D" }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(View, { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Text, { className: "sub", children: "\u56FE\u6807" }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ScrollView, { scrollY: true, style: { height: 150 }, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(View, { className: "cat-grid", children: EMOJI_LIBRARY.map((em) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          View,
          {
            className: `cat-item ${emoji === em ? "active" : ""}`,
            onClick: () => setEmoji(em),
            children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Text, { className: "cat-emoji", children: em })
          },
          em
        )) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(View, { className: "row", style: { justifyContent: "flex-end" }, children: [
        modal.mode === "add" ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(View, { className: "btn plain small", onClick: () => setModal(null), children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Text, { children: "\u53D6\u6D88" }) }) : !modal.original.builtin && !modal.original.locked && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(View, { className: "btn danger small", onClick: removeCat, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Text, { children: "\u5220\u9664" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(View, { className: "btn small", onClick: save, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Text, { children: "\u4FDD\u5B58" }) })
      ] })
    ] })
  ] });
}

// src/pages/ledger-search/index.tsx
var import_react13 = require("react");
var import_jsx_runtime14 = require("react/jsx-runtime");
var WEEKDAYS2 = ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"];
var isExpense2 = (l) => l.type !== "income";
function LedgerSearch() {
  const { data, ready } = useData();
  const [q, setQ] = (0, import_react13.useState)("");
  const [dateFrom, setDateFrom] = (0, import_react13.useState)("");
  const [dateTo, setDateTo] = (0, import_react13.useState)("");
  const [type, setType] = (0, import_react13.useState)("all");
  const [cats, setCats] = (0, import_react13.useState)([]);
  const [min, setMin] = (0, import_react13.useState)("");
  const [max, setMax] = (0, import_react13.useState)("");
  const [searched, setSearched] = (0, import_react13.useState)(false);
  const [results, setResults] = (0, import_react13.useState)([]);
  const allCats = (0, import_react13.useMemo)(() => {
    const map = /* @__PURE__ */ new Map();
    for (const c of [...data.ledgerCats.expense, ...data.ledgerCats.income]) {
      if (!map.has(c.name)) map.set(c.name, c);
    }
    return [...map.values()];
  }, [data.ledgerCats.expense, data.ledgerCats.income]);
  const catEmoji = (name) => allCats.find((c) => c.name === name)?.emoji ?? "\u{1F4E6}";
  const runSearch = () => {
    if (dateFrom && dateTo && dateFrom > dateTo) {
      showToast("\u8D77\u59CB\u65E5\u671F\u4E0D\u80FD\u665A\u4E8E\u7ED3\u675F\u65E5\u671F");
      return;
    }
    const kw = q.trim().toLowerCase();
    const list = data.ledger.filter((l) => {
      if (kw && !(l.note.toLowerCase().includes(kw) || l.category.includes(kw))) return false;
      if (dateFrom && l.date < dateFrom) return false;
      if (dateTo && l.date > dateTo) return false;
      if (type === "expense" && !isExpense2(l)) return false;
      if (type === "income" && isExpense2(l)) return false;
      if (cats.length > 0 && !cats.includes(l.category)) return false;
      if (min !== "" && l.amount < Number(min)) return false;
      if (max !== "" && l.amount > Number(max)) return false;
      return true;
    });
    setResults([...list].sort((a, b) => b.date.localeCompare(a.date)));
    setSearched(true);
  };
  const clearAll = () => {
    setQ("");
    setDateFrom("");
    setDateTo("");
    setType("all");
    setCats([]);
    setMin("");
    setMax("");
    setSearched(false);
    setResults([]);
  };
  const expenseSum = results.filter(isExpense2).reduce((s, l) => s + l.amount, 0);
  const incomeSum = results.filter((l) => !isExpense2(l)).reduce((s, l) => s + l.amount, 0);
  const byDay = (0, import_react13.useMemo)(() => {
    const map = /* @__PURE__ */ new Map();
    for (const l of results) {
      if (!map.has(l.date)) map.set(l.date, []);
      map.get(l.date).push(l);
    }
    return [...map.entries()];
  }, [results]);
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { className: "sub", children: "\u52A0\u8F7D\u4E2D\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "page-title", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Icon, { name: "search", size: 16, gap: 4 }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { children: "\u9AD8\u7EA7\u641C\u7D22" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(View, { className: "card-title", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { children: "\u641C\u7D22\u6761\u4EF6" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { className: "sub", children: "\u5173\u952E\u8BCD" }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Input, { placeholder: "\u641C\u5907\u6CE8 / \u5206\u7C7B", value: q, onInput: (e) => setQ(e.detail.value) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "form-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "field", style: { flex: 1, marginBottom: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { className: "sub", children: "\u8D77" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DatePicker2, { value: dateFrom, onChange: setDateFrom, placeholder: "\u4E0D\u9650", compact: true })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "field", style: { flex: 1, marginBottom: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { className: "sub", children: "\u81F3" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(DatePicker2, { value: dateTo, onChange: setDateTo, placeholder: "\u4E0D\u9650", compact: true })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(View, { className: "type-toggle", style: { marginTop: 12, marginBottom: 0 }, children: [["all", "\u5168\u90E8"], ["expense", "\u652F\u51FA"], ["income", "\u6536\u5165"]].map(([t, label]) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
        View,
        {
          className: `type-btn ${type === t ? "active" : ""}`,
          onClick: () => setType(t),
          children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { children: label })
        },
        t
      )) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { children: "\u5206\u7C7B\u4E0E\u91D1\u989D" }),
        cats.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(Text, { className: "sub", children: [
          "\u5DF2\u9009 ",
          cats.length,
          " \u4E2A"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(View, { className: "cat-grid", children: allCats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
        View,
        {
          className: `cat-item ${cats.includes(c.name) ? "active" : ""}`,
          onClick: () => setCats(
            (prev) => prev.includes(c.name) ? prev.filter((n) => n !== c.name) : [...prev, c.name]
          ),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { className: "cat-emoji", children: c.emoji }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { children: c.name })
          ]
        },
        c.name
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "form-row", style: { marginTop: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "field", style: { flex: 1, marginBottom: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { className: "sub", children: "\u6700\u4F4E" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            Input,
            {
              type: "digit",
              placeholder: "\u4E0D\u9650",
              value: min,
              onInput: (e) => setMin(e.detail.value)
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "field", style: { flex: 1, marginBottom: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { className: "sub", children: "\u6700\u9AD8" }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            Input,
            {
              type: "digit",
              placeholder: "\u4E0D\u9650",
              value: max,
              onInput: (e) => setMax(e.detail.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "row", style: { marginTop: 14 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
          View,
          {
            className: "btn",
            style: { flex: 1, textAlign: "center" },
            onClick: runSearch,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Icon, { name: "search", size: 12, gap: 4 }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { children: "\u641C\u7D22" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
          View,
          {
            className: "btn plain",
            style: { flex: 1, textAlign: "center" },
            onClick: clearAll,
            children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { children: "\u6E05\u7A7A" })
          }
        )
      ] })
    ] }),
    searched && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "card-title", style: { marginBottom: 0 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { children: "\u641C\u7D22\u7ED3\u679C" }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(Text, { className: "sub", children: [
        results.length,
        " \u7B14 \xB7 \u652F\u51FA \xA5",
        expenseSum.toFixed(2),
        " \xB7 \u6536\u5165 \xA5",
        incomeSum.toFixed(2)
      ] })
    ] }) }),
    searched && results.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { className: "empty", children: "\u6CA1\u6709\u7B26\u5408\u6761\u4EF6\u7684\u8BB0\u5F55" }),
    searched && byDay.map(([day, items]) => {
      const d = /* @__PURE__ */ new Date(day + "T00:00:00");
      const dayExpense = items.filter(isExpense2).reduce((s, l) => s + l.amount, 0);
      const dayIncome = items.filter((l) => !isExpense2(l)).reduce((s, l) => s + l.amount, 0);
      return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "card-title", style: { marginBottom: 4 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(Text, { className: "sub", children: [
            day.slice(5),
            " \xB7 \u5468",
            WEEKDAYS2[d.getDay()]
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "row", children: [
            dayExpense > 0 && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(Text, { className: "sub", children: [
              "\u652F\u51FA \xA5",
              dayExpense.toFixed(2)
            ] }),
            dayIncome > 0 && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(Text, { className: "sub", style: { color: "var(--success)" }, children: [
              "\u6536\u5165 \xA5",
              dayIncome.toFixed(2)
            ] })
          ] })
        ] }),
        items.map((l) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "list-item", children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { style: { fontSize: 22 }, children: catEmoji(l.category) }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(View, { className: "grow", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Text, { className: "name", children: l.note || l.category }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(Text, { className: "sub", style: { fontSize: 14 }, children: [
              l.category,
              " \xB7 ",
              l.date,
              !isExpense2(l) ? " \xB7 \u6536\u5165" : ""
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
            Text,
            {
              style: {
                fontWeight: 700,
                color: isExpense2(l) ? void 0 : "var(--success)"
              },
              children: [
                isExpense2(l) ? "-" : "+",
                l.amount.toFixed(2)
              ]
            }
          )
        ] }, l.id))
      ] }, day);
    })
  ] });
}

// src/pages/todos/index.tsx
var import_react14 = require("react");
var import_jsx_runtime15 = require("react/jsx-runtime");
var rank = (t) => t.priority ?? 2;
function Todos() {
  const { data, ready, set } = useData();
  const today = todayStr();
  const [text, setText] = (0, import_react14.useState)("");
  const [showDone, setShowDone] = (0, import_react14.useState)(false);
  const [prio, setPrio] = (0, import_react14.useState)(2);
  const [due, setDue] = (0, import_react14.useState)("");
  const [expandedIds, setExpandedIds] = (0, import_react14.useState)(/* @__PURE__ */ new Set());
  const [drafts, setDrafts] = (0, import_react14.useState)({});
  const add = () => {
    if (!text.trim()) {
      showToast("\u8BF7\u8F93\u5165\u4EFB\u52A1\u5185\u5BB9");
      return;
    }
    set("todos", (prev) => [
      {
        id: uid(),
        text: text.trim(),
        done: false,
        createdAt: Date.now(),
        priority: prio,
        dueDate: due || void 0
      },
      ...prev
    ]);
    setText("");
    setDue("");
  };
  const toggleExpand = (id) => setExpandedIds((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
  const toggleParent = (t) => {
    const kids = t.children ?? [];
    const allDone = kids.length > 0 && kids.every((c) => c.done);
    set(
      "todos",
      (prev) => prev.map(
        (x) => x.id === t.id ? allDone ? { ...x, done: false, children: kids.map((c) => ({ ...c, done: false })) } : { ...x, done: !x.done } : x
      )
    );
  };
  const toggleChild = (t, cid) => {
    set(
      "todos",
      (prev) => prev.map((x) => {
        if (x.id !== t.id) return x;
        const kids = (x.children ?? []).map((c) => c.id === cid ? { ...c, done: !c.done } : c);
        const all = kids.length > 0 && kids.every((c) => c.done);
        return { ...x, children: kids, done: all || x.done };
      })
    );
  };
  const addChild = (t) => {
    const v = (drafts[t.id] ?? "").trim();
    if (!v) {
      showToast("\u8BF7\u8F93\u5165\u5B50\u6B65\u9AA4\u5185\u5BB9");
      return;
    }
    set(
      "todos",
      (prev) => prev.map(
        (x) => x.id === t.id ? { ...x, children: [...x.children ?? [], { id: uid(), text: v, done: false }] } : x
      )
    );
    setDrafts((d) => ({ ...d, [t.id]: "" }));
  };
  const removeChild = (t, cid) => {
    set(
      "todos",
      (prev) => prev.map((x) => {
        if (x.id !== t.id) return x;
        const kids = (x.children ?? []).filter((c) => c.id !== cid);
        const all = kids.length > 0 && kids.every((c) => c.done);
        return { ...x, children: kids, done: all || x.done };
      })
    );
  };
  const isOver = (t) => !t.done && !!t.dueDate && t.dueDate < today;
  const undone = data.todos.filter((t) => !t.done).sort(
    (a, b) => Number(isOver(b)) - Number(isOver(a)) || rank(a) - rank(b) || b.createdAt - a.createdAt
  );
  const done = data.todos.filter((t) => t.done);
  const visible = showDone ? [...undone, ...done] : undone;
  const todayChecked = data.checkins[today] ?? [];
  const ckDone = data.checkinItems.filter((it) => isItemDone(it, todayChecked)).length;
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Text, { className: "sub", children: "\u52A0\u8F7D\u4E2D\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(View, { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(View, { className: "page-title", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Text, { children: "\u{1F6D2} \u5F85\u529E\u6E05\u5355" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(View, { className: "form-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(View, { className: "field", style: { flex: 1, marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          Input,
          {
            placeholder: "\u8981\u4E70\u7684\u4E1C\u897F\u3001\u8981\u529E\u7684\u4E8B\u2026",
            value: text,
            onInput: (e) => setText(e.detail.value),
            onConfirm: add
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(View, { className: "btn small", onClick: add, children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Text, { children: "\u6DFB\u52A0" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(View, { className: "prio-picker", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Text, { className: "pp-label", children: "\u4F18\u5148\u7EA7" }),
        [1, 2, 3].map((p) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          View,
          {
            className: `prio-dot p${p} ${prio === p ? "sel" : ""}`,
            onClick: () => setPrio(p)
          },
          p
        ))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(View, { className: "prio-picker", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Text, { className: "pp-label", children: "\u622A\u6B62" }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(View, { className: `chip ${due === today ? "success" : ""}`, onClick: () => setDue(due === today ? "" : today), children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Text, { children: "\u4ECA\u5929" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DatePicker2, { value: due, onChange: setDue, placeholder: "\u9009\u65E5\u671F", compact: true }),
        !!due && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Text, { className: "sub", style: { fontSize: 12 }, onClick: () => setDue(""), children: "\u6E05\u9664" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(Text, { children: [
          "\u672A\u5B8C\u6210 ",
          undone.length,
          " \u4EF6"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(View, { className: "row sub", style: { fontSize: 16, gap: 4 }, onClick: () => setShowDone((v) => !v), children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(View, { className: `ms-check${showDone ? " on" : ""}`, style: { width: 16, height: 16 }, children: showDone ? /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Icon, { name: "check", size: 12, color: "#fff" }) : null }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Text, { children: "\u663E\u793A\u5DF2\u5B8C\u6210" })
        ] })
      ] }),
      data.checkinItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(View, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(View, { className: "ck-mix-h", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Text, { children: "\u4ECA\u65E5\u6253\u5361" }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(Text, { className: "sub", style: { marginLeft: "auto", fontSize: 12 }, children: [
            ckDone,
            "/",
            data.checkinItems.length
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          CheckinSummary,
          {
            items: data.checkinItems,
            checked: todayChecked,
            onToggleItem: (item) => set("checkins", (prev) => ({ ...prev, [today]: toggleItemIds(item, prev[today] ?? []) })),
            onToggleLeaf: (leafId) => set("checkins", (prev) => ({ ...prev, [today]: toggleLeafId(prev[today] ?? [], leafId) }))
          }
        )
      ] }),
      visible.map((t) => {
        const kids = t.children ?? [];
        const hasKids = kids.length > 0;
        const doneCount = kids.filter((c) => c.done).length;
        const expanded = expandedIds.has(t.id);
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(View, { className: "todo-item-wrap", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(View, { className: `list-item ${t.done ? "done" : ""}`, children: [
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(View, { className: `ms-check${t.done ? " on" : ""}`, onClick: () => toggleParent(t), children: t.done ? /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Icon, { name: "check", size: 12, color: "#fff" }) : null }),
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Text, { className: "grow name", onClick: () => hasKids && toggleExpand(t.id), children: t.text }),
            t.dueDate && !isOver(t) && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Icon, { name: "calendar", size: 12, gap: 4 }),
            t.dueDate && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(Text, { className: `todo-due${isOver(t) ? " over" : ""}`, children: [
              isOver(t) ? "\u903E\u671F " : "",
              fmtDateShort(t.dueDate)
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(View, { className: `prio-dot p${rank(t)}` }),
            hasKids && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(Text, { className: "sub-prog", children: [
              doneCount,
              "/",
              kids.length
            ] }),
            hasKids && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
              View,
              {
                className: `icon-btn expand-arrow ${expanded ? "open" : ""}`,
                onClick: () => toggleExpand(t.id),
                children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Text, { children: "\u25BE" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
              View,
              {
                className: "icon-btn",
                onClick: () => set("todos", (prev) => prev.filter((x) => x.id !== t.id)),
                children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Icon, { name: "x", size: 18 })
              }
            )
          ] }),
          hasKids && expanded && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(View, { className: "todo-children", children: [
            kids.map((c) => /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(View, { className: `todo-child ${c.done ? "done" : ""}`, children: [
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
                View,
                {
                  className: `child-check ${c.done ? "on" : ""}`,
                  onClick: () => toggleChild(t, c.id),
                  children: c.done ? /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Icon, { name: "check", size: 12, color: "#fff" }) : null
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Text, { className: "grow name", children: c.text }),
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(View, { className: "child-x", onClick: () => removeChild(t, c.id), children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Icon, { name: "x", size: 14 }) })
            ] }, c.id)),
            /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(View, { className: "child-add-row", children: [
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Text, { children: "+" }),
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
                Input,
                {
                  placeholder: "\u6DFB\u52A0\u5B50\u6B65\u9AA4\uFF0C\u786E\u8BA4\u952E\u4FDD\u5B58",
                  value: drafts[t.id] ?? "",
                  onInput: (e) => setDrafts((d) => ({ ...d, [t.id]: e.detail.value })),
                  onConfirm: () => addChild(t)
                }
              )
            ] })
          ] })
        ] }, t.id);
      }),
      visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Text, { className: "empty", children: showDone ? "\u4EC0\u4E48\u90FD\u6CA1\u6709" : "\u6CA1\u6709\u5F85\u529E\uFF0C\u5F88\u6E05\u723D\uFF01" })
    ] })
  ] });
}

// src/pages/periodic/index.tsx
var import_react15 = require("react");
var import_jsx_runtime16 = require("react/jsx-runtime");
function Periodic() {
  const { data, ready, set } = useData();
  const [name, setName] = (0, import_react15.useState)("");
  const [every, setEvery] = (0, import_react15.useState)("");
  const today = todayStr();
  const add = () => {
    if (!name.trim()) {
      showToast("\u8BF7\u8F93\u5165\u4E8B\u9879\u540D\u79F0");
      return;
    }
    if (!every) {
      showToast("\u8BF7\u8F93\u5165\u95F4\u9694\u5929\u6570");
      return;
    }
    set("periodic", (prev) => [
      ...prev,
      { id: uid(), name: name.trim(), everyDays: Math.max(1, Number(every)), lastDone: today }
    ]);
    setName("");
    setEvery("");
  };
  const sorted = [...data.periodic].sort((a, b) => {
    const da = daysBetween(a.lastDone, today) - a.everyDays;
    const db = daysBetween(b.lastDone, today) - b.everyDays;
    return db - da;
  });
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Text, { className: "sub", children: "\u52A0\u8F7D\u4E2D\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(View, { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(View, { className: "page-title", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Icon, { name: "repeat", size: 16, gap: 4 }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Text, { children: "\u5468\u671F\u63D0\u9192" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Text, { className: "sub", style: { display: "block", marginTop: -6, marginBottom: 12 }, children: "\u{1F514} \u5230\u671F\u540E\u5C06\u901A\u8FC7\u300C\u670D\u52A1\u901A\u77E5\u300D\u63D0\u9192\u4F60\uFF08\u9700\u6388\u6743\uFF09" }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(View, { className: "form-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(View, { className: "field", style: { flex: 1, marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
          Input,
          {
            placeholder: "\u4E8B\u9879\u540D\u79F0\uFF0C\u5982\uFF1A\u6D17\u8863\u670D",
            value: name,
            onInput: (e) => setName(e.detail.value)
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(View, { className: "field", style: { width: 100, marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
          Input,
          {
            type: "number",
            placeholder: "\u6BCF\u51E0\u5929",
            value: every,
            onInput: (e) => setEvery(e.detail.value)
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(View, { className: "btn small", onClick: add, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Text, { children: "\u6DFB\u52A0" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Text, { className: "sub", style: { marginTop: 6 }, children: "\u5982\uFF1A\u6D17\u8863\u670D\uFF08\u6BCF 3 \u5929\uFF09\u3001\u7ED9\u5BB6\u91CC\u6253\u7535\u8BDD\uFF08\u6BCF 2 \u5929\uFF09\u3001\u6362\u5E8A\u5355\uFF08\u6BCF 14 \u5929\uFF09" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(View, { className: "card", children: [
      sorted.map((p) => {
        const since = daysBetween(p.lastDone, today);
        const due = since >= p.everyDays;
        return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(View, { className: "list-item", children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(View, { className: "grow", children: [
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Text, { className: "name", children: p.name }),
            /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(Text, { className: "sub", children: [
              "\u6BCF ",
              p.everyDays,
              " \u5929 \xB7",
              " ",
              due ? /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(Text, { style: { color: "var(--danger)", fontWeight: 700 }, children: [
                "\u8BE5\u505A\u4E86\uFF01\uFF08\u5DF2\u9694 ",
                since,
                " \u5929\uFF09"
              ] }) : `\u8FD8\u5269 ${p.everyDays - since} \u5929`
            ] })
          ] }),
          due && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
            View,
            {
              className: "btn small",
              onClick: () => {
                subscribeRemind();
                set(
                  "periodic",
                  (prev) => prev.map((x) => x.id === p.id ? { ...x, lastDone: today } : x)
                );
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Text, { children: "\u505A\u5B8C\u4E86" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
            View,
            {
              className: "icon-btn",
              onClick: () => set("periodic", (prev) => prev.filter((x) => x.id !== p.id)),
              children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Icon, { name: "x", size: 18 })
            }
          )
        ] }, p.id);
      }),
      data.periodic.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Text, { className: "empty", children: "\u6DFB\u52A0\u9700\u8981\u5B9A\u671F\u505A\u7684\u4E8B\u9879" })
    ] })
  ] });
}

// src/pages/dates/index.tsx
var import_react16 = require("react");
var import_jsx_runtime17 = require("react/jsx-runtime");
var REMIND_OPTIONS = [0, 1, 3, 7];
var remindText = (days) => {
  const s = [...days].sort((a, b) => a - b);
  return s.map((d) => d === 0 ? "\u5F53\u5929" : `\u63D0\u524D${d}\u5929`).join("\u3001");
};
function Dates() {
  const { data, ready, set } = useData();
  const [name, setName] = (0, import_react16.useState)("");
  const [date, setDate] = (0, import_react16.useState)("");
  const [yearly, setYearly] = (0, import_react16.useState)(false);
  const [remindDays, setRemindDays] = (0, import_react16.useState)([]);
  const [editingId, setEditingId] = (0, import_react16.useState)(null);
  const today = todayStr();
  const nextOccurrence = (d, isYearly) => {
    if (!isYearly) return d;
    const thisYear = today.slice(0, 4) + d.slice(4);
    return thisYear >= today ? thisYear : String(Number(thisYear.slice(0, 4)) + 1) + d.slice(4);
  };
  const startEdit = (d) => {
    setEditingId(d.id);
    setName(d.name);
    setDate(d.date);
    setYearly(d.yearly);
    setRemindDays(d.remindDays ?? []);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setDate("");
    setYearly(false);
    setRemindDays([]);
  };
  const toggleRemind = (day) => setRemindDays(
    (prev) => prev.includes(day) ? prev.filter((x) => x !== day) : [...prev, day]
  );
  const save = () => {
    if (!name.trim()) {
      showToast("\u8BF7\u8F93\u5165\u540D\u79F0");
      return;
    }
    if (!date) {
      showToast("\u8BF7\u9009\u62E9\u65E5\u671F");
      return;
    }
    if (remindDays.length) subscribeRemind();
    const days = [...remindDays].sort((a, b) => a - b);
    if (editingId) {
      set(
        "dates",
        (prev) => prev.map(
          (x) => x.id === editingId ? { ...x, name: name.trim(), date, yearly, remindDays: days } : x
        )
      );
      showToast("\u5DF2\u4FDD\u5B58");
    } else {
      set("dates", (prev) => [
        ...prev,
        { id: uid(), name: name.trim(), date, yearly, remindDays: days }
      ]);
      showToast(days.length ? "\u5DF2\u6DFB\u52A0\uFF0C\u5230\u671F\u5C06\u63A8\u9001\u63D0\u9192" : "\u5DF2\u6DFB\u52A0");
    }
    cancelEdit();
  };
  const sorted = [...data.dates].sort(
    (a, b) => nextOccurrence(a.date, a.yearly).localeCompare(nextOccurrence(b.date, b.yearly))
  );
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Text, { className: "sub", children: "\u52A0\u8F7D\u4E2D\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(View, { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(View, { className: "page-title", children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Icon, { name: "pushpin", size: 16, gap: 4 }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Text, { children: "\u91CD\u8981\u65E5\u671F" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(View, { className: "form-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(View, { className: "field", style: { flex: 1, marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
          Input,
          {
            placeholder: "\u540D\u79F0\uFF0C\u5982\uFF1A\u5988\u5988\u751F\u65E5",
            value: name,
            onInput: (e) => setName(e.detail.value)
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(View, { className: "field", style: { marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(DatePicker2, { value: date, onChange: setDate }) }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(View, { className: "btn small", onClick: save, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Text, { children: editingId ? "\u4FDD\u5B58" : "\u6DFB\u52A0" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
        View,
        {
          className: "row",
          style: { marginTop: 8, fontSize: 16, color: "var(--text-sub)" },
          onClick: () => setYearly((v) => !v),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(View, { className: `ms-check${yearly ? " on" : ""}`, children: yearly ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Icon, { name: "check", size: 12, color: "#fff" }) : null }),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Text, { children: "\u6BCF\u5E74\u91CD\u590D\uFF08\u751F\u65E5 / \u7EAA\u5FF5\u65E5\uFF09" })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(View, { className: "row", style: { flexWrap: "wrap", gap: 6, marginTop: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Icon, { name: "bell", size: 14, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Text, { className: "sub", style: { fontSize: 14, width: "100%" }, children: "\u63D0\u524D\u63D0\u9192\uFF08\u53EF\u591A\u9009\uFF0C\u547D\u4E2D\u5F53\u5929\u65E9\u4E0A 7:30 \u63A8\u9001\u5FAE\u4FE1\uFF09" }),
        REMIND_OPTIONS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
          Text,
          {
            className: `tag ${remindDays.includes(d) ? "selected" : ""}`,
            style: { border: "none", padding: "4px 12px", fontSize: 16 },
            onClick: () => toggleRemind(d),
            children: d === 0 ? "\u5F53\u5929" : `\u63D0\u524D${d}\u5929`
          },
          d
        ))
      ] }),
      editingId && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(View, { className: "btn plain small", style: { marginTop: 10 }, onClick: cancelEdit, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Text, { children: "\u53D6\u6D88\u7F16\u8F91" }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(View, { className: "card", children: [
      sorted.map((d) => {
        const target = nextOccurrence(d.date, d.yearly);
        const left = daysBetween(today, target);
        return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
          View,
          {
            className: "list-item",
            onClick: () => {
              if (editingId !== d.id) startEdit(d);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(View, { className: "grow", children: [
                /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(View, { className: "row", style: { alignItems: "center" }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Text, { className: "name", children: d.name }),
                  d.yearly && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Text, { className: "tag", children: "\u6BCF\u5E74" }),
                  d.remindDays?.length ? /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(import_jsx_runtime17.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Icon, { name: "bell", size: 12, gap: 4 }),
                    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Text, { className: "tag", children: remindText(d.remindDays) })
                  ] }) : null
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(Text, { className: "sub", children: [
                  d.date,
                  editingId === d.id ? " \xB7 \u6B63\u5728\u7F16\u8F91" : " \xB7 \u70B9\u51FB\u53EF\u7F16\u8F91"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Text, { className: "chip", children: left > 0 ? `\u8FD8\u5269 ${left} \u5929` : left === 0 ? "\u5C31\u662F\u4ECA\u5929\uFF01" : `\u5DF2\u8FC7 ${-left} \u5929` }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
                View,
                {
                  className: "icon-btn",
                  onClick: (e) => {
                    e.stopPropagation();
                    if (editingId === d.id) cancelEdit();
                    set("dates", (prev) => prev.filter((x) => x.id !== d.id));
                  },
                  children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Icon, { name: "x", size: 18 })
                }
              )
            ]
          },
          d.id
        );
      }),
      data.dates.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Text, { className: "empty", children: "\u751F\u65E5\u3001\u7EAA\u5FF5\u65E5\u3001\u62A5\u540D\u622A\u6B62\u65E5\u2026\u5199\u4E0B\u6765\u5C31\u4E0D\u4F1A\u5FD8" })
    ] })
  ] });
}

// src/pages/notes/index.tsx
var import_react17 = require("react");
var import_jsx_runtime18 = require("react/jsx-runtime");
var NOTE_TAGS = ["\u65F6\u653F", "\u7D20\u6750", "\u5FC3\u5F97", "\u91D1\u53E5", "\u5176\u4ED6"];
function Notes() {
  const { data, ready, set } = useData();
  const [text, setText] = (0, import_react17.useState)("");
  const [tags, setTags] = (0, import_react17.useState)([]);
  const [search, setSearch] = (0, import_react17.useState)("");
  const [filterTag, setFilterTag] = (0, import_react17.useState)(null);
  const add = () => {
    if (!text.trim()) {
      showToast("\u8BF7\u8F93\u5165\u5185\u5BB9");
      return;
    }
    set("notes", (prev) => [
      {
        id: uid(),
        text: text.trim(),
        tags,
        createdAt: Date.now(),
        // 「时政」标签自动进复习池（明天首复习），其他默认不进
        nextReviewDate: tags.includes("\u65F6\u653F") ? firstReviewDate() : null,
        reviewStep: 0,
        review: noteReviewState({ reviewStep: 0 })
      },
      ...prev
    ]);
    setText("");
    setTags([]);
  };
  const filtered = (0, import_react17.useMemo)(() => {
    const q = search.trim().toLowerCase();
    return data.notes.filter((n) => {
      if (filterTag && !n.tags.includes(filterTag)) return false;
      if (!q) return true;
      return n.text.toLowerCase().includes(q) || n.tags.some((t) => t.includes(q));
    });
  }, [data.notes, search, filterTag]);
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Text, { className: "sub", children: "\u52A0\u8F7D\u4E2D\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(View, { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(View, { className: "page-title", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Text, { children: "\u{1F4F0} \u65F6\u653F\u6536\u96C6" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(View, { className: "field", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
        Textarea,
        {
          style: { height: 96 },
          placeholder: "\u7C98\u8D34\u65F6\u653F\u65B0\u95FB\u3001\u7533\u8BBA\u7D20\u6750\u3001\u770B\u5230\u7684\u597D\u53E5\u5B50\u2026",
          value: text,
          onInput: (e) => setText(e.detail.value),
          maxlength: -1
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(View, { className: "row", style: { flexWrap: "wrap", gap: 6, marginBottom: 10 }, children: NOTE_TAGS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
        Text,
        {
          className: `tag ${tags.includes(t) ? "selected" : ""}`,
          style: { border: "none", padding: "4px 12px", fontSize: 16 },
          onClick: () => setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]),
          children: t
        },
        t
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(View, { className: "row", style: { gap: 8, flexWrap: "wrap" }, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(View, { className: "btn small", onClick: add, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Text, { children: "\u4FDD\u5B58" }) }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(View, { className: "card", style: { padding: "8px 14px", marginBottom: 8 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
        Input,
        {
          placeholder: "\u641C\u7D22\u8BB0\u5F55\u2026",
          value: search,
          onInput: (e) => setSearch(e.detail.value),
          style: { border: "none", padding: "6px 0", borderRadius: 0 }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(View, { className: "row", style: { flexWrap: "wrap", gap: 6, marginTop: 6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          Text,
          {
            className: `tag ${filterTag === null ? "selected" : ""}`,
            style: { border: "none", padding: "3px 10px", fontSize: 14 },
            onClick: () => setFilterTag(null),
            children: "\u5168\u90E8"
          }
        ),
        NOTE_TAGS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          Text,
          {
            className: `tag ${filterTag === t ? "selected" : ""}`,
            style: { border: "none", padding: "3px 10px", fontSize: 14 },
            onClick: () => setFilterTag(t === filterTag ? null : t),
            children: t
          },
          t
        ))
      ] })
    ] }),
    filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(View, { className: "empty", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Text, { children: search || filterTag ? "\u6CA1\u6709\u5339\u914D\u7684\u8BB0\u5F55" : "\u8FD8\u6CA1\u6709\u8BB0\u5F55" }) }),
    filtered.map((n) => {
      const inReview = n.nextReviewDate !== null;
      const daysLeft = n.nextReviewDate ? Math.max(0, Math.ceil((n.nextReviewDate - Date.now()) / 864e5)) : 0;
      return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(View, { className: "card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Text, { style: { whiteSpace: "pre-wrap", lineHeight: 1.6 }, children: n.text }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(View, { className: "row-between", style: { marginTop: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(View, { className: "row", style: { flexWrap: "wrap" }, children: [
            n.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Text, { className: "tag", children: t }, t)),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Text, { className: "sub", style: { fontSize: 14 }, children: new Date(n.createdAt).toLocaleDateString("zh-CN") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
            View,
            {
              className: "icon-btn",
              onClick: () => set("notes", (prev) => prev.filter((x) => x.id !== n.id)),
              children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Icon, { name: "trash", size: 18 })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(View, { style: { marginTop: 6 }, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          Text,
          {
            className: `tag review-toggle ${inReview ? "selected" : ""}`,
            onClick: () => set(
              "notes",
              (prev) => prev.map(
                (x) => x.id === n.id ? {
                  ...x,
                  nextReviewDate: inReview ? null : firstReviewDate(),
                  reviewStep: inReview ? x.reviewStep : 0,
                  // 重新加入复习池 → 记忆状态重置为初始；退出保留现状
                  review: inReview ? x.review : noteReviewState({ reviewStep: 0 })
                } : x
              )
            ),
            children: n.reviewStep >= 5 ? "\u{1F9E0} \u5DF2\u638C\u63E1" : inReview ? `\u{1F9E0} ${daysLeft === 0 ? "\u4ECA\u5929\u590D\u4E60" : `${daysLeft} \u5929\u540E\u590D\u4E60`}` : "\u{1F9E0} \u52A0\u5165\u590D\u4E60"
          }
        ) })
      ] }, n.id);
    })
  ] });
}

// src/pages/wrongbook/index.tsx
var import_react18 = require("react");
var import_jsx_runtime19 = require("react/jsx-runtime");
function WrongBook() {
  const { data, ready, set } = useData();
  const [filter, setFilter] = (0, import_react18.useState)("all");
  const wrongs = data.quizBook.wrongs;
  const dueCount = wrongs.filter((w) => w.nextReviewDate !== null).length;
  const masteredCount = wrongs.length - dueCount;
  const filtered = (0, import_react18.useMemo)(() => {
    return wrongs.filter((w) => {
      if (filter === "due") return w.nextReviewDate !== null;
      if (filter === "mastered") return w.nextReviewDate === null;
      return true;
    });
  }, [wrongs, filter]);
  const patchWrong = (quizId, patch) => set("quizBook", (prev) => ({
    ...prev,
    wrongs: prev.wrongs.map((w) => w.quizId === quizId ? { ...w, ...patch } : w)
  }));
  const removeWrong = (quizId) => set("quizBook", (prev) => ({
    ...prev,
    wrongs: prev.wrongs.filter((w) => w.quizId !== quizId)
  }));
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Text, { className: "sub", children: "\u52A0\u8F7D\u4E2D\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(View, { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(View, { className: "page-title", children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Icon, { name: "book", size: 16, gap: 4 }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Text, { children: "\u9519\u9898\u672C" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(View, { className: "stat-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(View, { className: "stat", children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Text, { className: "stat-num", children: wrongs.length }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Text, { className: "stat-label", children: "\u9519\u9898\u6C60" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(View, { className: "stat", children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Text, { className: "stat-num", children: dueCount }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Text, { className: "stat-label", children: "\u5F85\u590D\u4E60" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(View, { className: "stat", children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Text, { className: "stat-num", children: masteredCount }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Text, { className: "stat-label", children: "\u5DF2\u638C\u63E1" })
      ] })
    ] }) }),
    dueCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
      View,
      {
        className: "btn small",
        style: { marginBottom: 10 },
        onClick: () => stubs_default.switchTab({ url: "/pages/today/index" }),
        children: [
          "\u{1F9E0} \u53BB\u4ECA\u65E5\u9875\u590D\u4E60 ",
          dueCount,
          " \u9053\u5230\u671F\u9519\u9898"
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(View, { className: "row", style: { flexWrap: "wrap", gap: 6, marginBottom: 10 }, children: [
      ["all", "\u5168\u90E8"],
      ["due", "\u5F85\u590D\u4E60"],
      ["mastered", "\u5DF2\u638C\u63E1"]
    ].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
      Text,
      {
        className: `tag ${filter === k ? "selected" : ""}`,
        style: { border: "none", padding: "4px 12px", fontSize: 16 },
        onClick: () => setFilter(k),
        children: label
      },
      k
    )) }),
    wrongs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Text, { className: "empty", children: "\u8FD8\u6CA1\u6709\u9519\u9898\u3002\u5728\u300C\u4ECA\u65E5\u300D\u9875\u559D\u6C34\u7B54\u9898\u7B54\u9519\u65F6\u4F1A\u81EA\u52A8\u8BB0\u5165\u8FD9\u91CC\uFF0C\u5E76\u6309\u8BB0\u5FC6\u66F2\u7EBF\u5B89\u6392\u590D\u4E60\u3002" }) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(View, { className: "empty", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Text, { children: "\u8BE5\u5206\u7C7B\u4E0B\u6CA1\u6709\u9519\u9898" }) }) : filtered.map((w) => {
      const q = quizById(w.quizId);
      if (!q) return null;
      const mastered = w.nextReviewDate === null;
      return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(View, { className: "card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(View, { className: "row-between", style: { marginBottom: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Text, { className: `chip ${mastered ? "success" : "warn"}`, children: mastered ? "\u2713 \u5DF2\u638C\u63E1" : "\u23F3 \u5F85\u590D\u4E60" }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(Text, { className: "sub", style: { fontSize: 14 }, children: [
            "\u7B54\u9519 ",
            w.wrongCount,
            " \u6B21"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Text, { style: { fontWeight: 600, lineHeight: 1.5, display: "block" }, children: q.q }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(View, { className: "row", style: { marginTop: 4 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Icon, { name: "check", size: 14, color: "#2f9e6e", gap: 4 }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Text, { className: "sub", children: q.options[q.answer] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Text, { className: "sub", style: { marginTop: 2, display: "block" }, children: q.explain }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(View, { className: "row", style: { marginTop: 10, gap: 8 }, children: [
          mastered ? /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
            View,
            {
              className: "btn ghost small",
              onClick: () => {
                patchWrong(w.quizId, {
                  nextReviewDate: firstReviewDate(),
                  review: { stability: 1, difficulty: 5, reps: 0, lapses: 0 }
                });
                showToast("\u5DF2\u91CD\u65B0\u52A0\u5165\u590D\u4E60\u961F\u5217");
              },
              children: "\u91CD\u65B0\u590D\u4E60"
            }
          ) : /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
            View,
            {
              className: "btn ghost small",
              onClick: () => {
                patchWrong(w.quizId, { nextReviewDate: null });
                showToast("\u5DF2\u6807\u8BB0\u4E3A\u638C\u63E1");
              },
              children: "\u6807\u8BB0\u5DF2\u638C\u63E1"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
            View,
            {
              className: "btn plain small",
              onClick: () => {
                removeWrong(w.quizId);
                showToast("\u5DF2\u79FB\u9664");
              },
              children: "\u79FB\u9664"
            }
          )
        ] })
      ] }, w.quizId);
    })
  ] });
}

// src/pages/pomodoro/index.tsx
var import_react19 = require("react");
var import_jsx_runtime20 = require("react/jsx-runtime");
var LS_START = "pomodoro_start_time";
var LS_MINUTES = "pomodoro_target_minutes";
var LS_TASK = "pomodoro_task";
var LS_MODE = "pomodoro_mode";
var LS_PAUSED_AT = "pomodoro_paused_at";
var LS_PAUSED_MS = "pomodoro_paused_ms";
var PRESETS = [15, 25, 45, 60];
var liveSession = null;
function readSession() {
  const startAt = Number(stubs_default.getStorageSync(LS_START) ?? "");
  if (!startAt) return null;
  const mode = stubs_default.getStorageSync(LS_MODE) === "free" ? "free" : "count";
  const minutes = Number(stubs_default.getStorageSync(LS_MINUTES) ?? "");
  if (mode === "count" && !minutes) return null;
  const task = stubs_default.getStorageSync(LS_TASK) || void 0;
  const pausedAt = Number(stubs_default.getStorageSync(LS_PAUSED_AT) ?? "") || void 0;
  const pausedMs = Number(stubs_default.getStorageSync(LS_PAUSED_MS) ?? "") || void 0;
  return {
    startAt,
    minutes: mode === "free" ? 0 : minutes,
    task: task || void 0,
    mode,
    pausedAt,
    pausedMs
  };
}
function writeSession(s) {
  if (s) {
    stubs_default.setStorageSync(LS_START, String(s.startAt));
    stubs_default.setStorageSync(LS_MODE, s.mode);
    if (s.mode === "count") stubs_default.setStorageSync(LS_MINUTES, String(s.minutes));
    else stubs_default.removeStorageSync(LS_MINUTES);
    if (s.task) stubs_default.setStorageSync(LS_TASK, s.task);
    else stubs_default.removeStorageSync(LS_TASK);
    if (s.pausedAt) stubs_default.setStorageSync(LS_PAUSED_AT, String(s.pausedAt));
    else stubs_default.removeStorageSync(LS_PAUSED_AT);
    if (s.pausedMs) stubs_default.setStorageSync(LS_PAUSED_MS, String(s.pausedMs));
    else stubs_default.removeStorageSync(LS_PAUSED_MS);
  } else {
    stubs_default.removeStorageSync(LS_START);
    stubs_default.removeStorageSync(LS_MINUTES);
    stubs_default.removeStorageSync(LS_TASK);
    stubs_default.removeStorageSync(LS_MODE);
    stubs_default.removeStorageSync(LS_PAUSED_AT);
    stubs_default.removeStorageSync(LS_PAUSED_MS);
  }
  liveSession = s;
}
function fmtMS(ms) {
  const s = Math.max(0, Math.ceil(ms / 1e3));
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
}
function isCustomValid(v) {
  const n = Number(v);
  return v !== "" && !Number.isNaN(n) && n >= 5 && n <= 120;
}
function Pomodoro() {
  const { data, ready, set } = useData();
  const today = todayStr();
  const storedMinutes = data.settings.pomoMinutes ?? 25;
  const [minutesSel, setMinutesSel] = (0, import_react19.useState)(storedMinutes);
  const [customMode, setCustomMode] = (0, import_react19.useState)(!PRESETS.includes(storedMinutes));
  const [customInput, setCustomInput] = (0, import_react19.useState)(PRESETS.includes(storedMinutes) ? "" : String(storedMinutes));
  const [taskInput, setTaskInput] = (0, import_react19.useState)("");
  const [now, setNow] = (0, import_react19.useState)(Date.now());
  const [bloomed, setBloomed] = (0, import_react19.useState)(false);
  const [abandonAsk, setAbandonAsk] = (0, import_react19.useState)(false);
  const [modeSel, setModeSel] = (0, import_react19.useState)(() => {
    const s = liveSession ?? readSession();
    return s?.mode === "free" ? "free" : "count";
  });
  const [session, setSession] = (0, import_react19.useState)(() => {
    const s = liveSession ?? readSession();
    if (!s) return null;
    if (s.mode === "free") return s;
    return Date.now() < s.startAt + s.minutes * 6e4 ? s : null;
  });
  const activeMode = session ? session.mode : modeSel;
  (0, import_react19.useEffect)(() => {
    const s = liveSession ?? readSession();
    if (!s || s.mode !== "count") return;
    const deadline = s.startAt + s.minutes * 6e4;
    if (Date.now() >= deadline) {
      set("pomodoroLogs", (prev) => [
        ...prev,
        { date: todayStr(), minutes: s.minutes, endedAt: deadline, task: s.task }
      ]);
      writeSession(null);
      showToast("\u{1F345} \u4E0A\u6B21\u4E13\u6CE8\u5DF2\u5B8C\u6210\uFF0C\u5DF2\u8865\u8BB0\u5F55");
    }
  }, []);
  (0, import_react19.useEffect)(() => {
    if (!session || session.pausedAt) return;
    const t = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(t);
  }, [session]);
  const pausedTotal = session ? (session.pausedMs ?? 0) + (session.pausedAt ? now - session.pausedAt : 0) : 0;
  const totalMs = session && session.mode === "count" ? session.minutes * 6e4 : 0;
  const freeElapsedMs = session && session.mode === "free" ? Math.max(0, now - session.startAt - pausedTotal) : 0;
  const elapsed = session && session.mode === "count" ? Math.min(totalMs, now - session.startAt) : 0;
  const remainingMs = totalMs - elapsed;
  const progress = session && totalMs > 0 ? elapsed / totalMs : 0;
  const done = !!session && session.mode === "count" && now >= session.startAt + totalMs;
  (0, import_react19.useEffect)(() => {
    if (!session || !done) return;
    set("pomodoroLogs", (prev) => [
      ...prev,
      { date: todayStr(), minutes: session.minutes, endedAt: Date.now(), task: session.task }
    ]);
    writeSession(null);
    setSession(null);
    setBloomed(true);
    showToast("\u{1F345} \u4E13\u6CE8\u5B8C\u6210\uFF01");
  }, [done]);
  const pickPreset = (m) => {
    setMinutesSel(m);
    setCustomMode(false);
    set("settings", (prev) => ({ ...prev, pomoMinutes: m }));
  };
  const enterCustom = () => {
    setCustomMode(true);
    if (!customInput) return;
    if (!isCustomValid(customInput)) {
      showToast("\u81EA\u5B9A\u4E49\u65F6\u957F\u9700\u5728 5~120 \u5206\u949F\u4E4B\u95F4");
      return;
    }
    const m = Math.round(Number(customInput));
    setMinutesSel(m);
    set("settings", (prev) => ({ ...prev, pomoMinutes: m }));
  };
  const changeCustom = (v) => {
    setCustomInput(v);
    if (!isCustomValid(v)) return;
    const m = Math.round(Number(v));
    setMinutesSel(m);
    set("settings", (prev) => ({ ...prev, pomoMinutes: m }));
  };
  const start = () => {
    if (activeMode === "count" && customMode && !isCustomValid(customInput)) {
      showToast("\u81EA\u5B9A\u4E49\u65F6\u957F\u9700\u5728 5~120 \u5206\u949F\u4E4B\u95F4");
      return;
    }
    const s = {
      startAt: Date.now(),
      minutes: activeMode === "count" ? minutesSel : 0,
      task: taskInput.trim() || void 0,
      mode: activeMode
    };
    writeSession(s);
    setSession(s);
    setNow(Date.now());
    setBloomed(false);
  };
  const pauseOrResume = () => {
    if (!session || session.mode !== "free") return;
    if (session.pausedAt) {
      const next = {
        ...session,
        pausedMs: (session.pausedMs ?? 0) + (Date.now() - session.pausedAt),
        pausedAt: void 0
      };
      writeSession(next);
      setSession(next);
    } else {
      const next = { ...session, pausedAt: Date.now() };
      writeSession(next);
      setSession(next);
    }
    setNow(Date.now());
  };
  const finishFree = () => {
    if (!session || session.mode !== "free") return;
    const end = Date.now();
    const paused = (session.pausedMs ?? 0) + (session.pausedAt ? end - session.pausedAt : 0);
    const effMs = Math.max(0, end - session.startAt - paused);
    writeSession(null);
    setSession(null);
    if (effMs < 6e4) {
      showToast("\u4E0D\u8DB3 1 \u5206\u949F\uFF0C\u5C31\u4E0D\u8BB0\u5566");
      return;
    }
    const minutes = Math.ceil(effMs / 6e4);
    set("pomodoroLogs", (prev) => [
      ...prev,
      { date: todayStr(), minutes, endedAt: end, task: session.task }
    ]);
    showToast(`\u5DF2\u8BB0\u5F55 ${minutes} \u5206\u949F\u4E13\u6CE8`);
  };
  const doAbandon = () => {
    writeSession(null);
    setSession(null);
    setBloomed(false);
    setAbandonAsk(false);
  };
  const todayLogs = (0, import_react19.useMemo)(
    () => data.pomodoroLogs.filter((l) => l.date === today),
    [data.pomodoroLogs, today]
  );
  const todayCount = todayLogs.length;
  const todayMinutes = todayLogs.reduce((sum, l) => sum + l.minutes, 0);
  const lastTask = todayLogs.length ? todayLogs[todayLogs.length - 1].task : void 0;
  const stage = progress < 0.25 ? "\u{1F330}" : progress < 0.5 ? "\u{1F331}" : progress < 0.75 ? "\u{1F33F}" : "\u{1F338}";
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "sub", children: "\u52A0\u8F7D\u4E2D\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(View, { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(View, { className: "type-toggle", style: { maxWidth: 252, margin: "0 auto 12px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
        View,
        {
          className: `type-btn ${activeMode === "count" ? "active" : ""}`,
          style: session ? { opacity: 0.5 } : void 0,
          onClick: () => {
            if (session) return;
            setModeSel("count");
            setBloomed(false);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Icon, { name: "tomato", size: 12, gap: 4 }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { children: "\u5012\u8BA1\u65F6" })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        View,
        {
          className: `type-btn ${activeMode === "free" ? "active" : ""}`,
          style: session ? { opacity: 0.5 } : void 0,
          onClick: () => {
            if (session) return;
            setModeSel("free");
            setBloomed(false);
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { children: "\u23F1 \u6B63\u8BA1\u65F6" })
        }
      )
    ] }),
    activeMode === "count" && /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(View, { className: "type-toggle", children: [
      PRESETS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        View,
        {
          className: `type-btn ${!customMode && minutesSel === m ? "active" : ""}`,
          style: session ? { opacity: 0.5 } : void 0,
          onClick: () => {
            if (session) return;
            pickPreset(m);
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(Text, { children: [
            m,
            " \u5206"
          ] })
        },
        m
      )),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        View,
        {
          className: `type-btn ${customMode ? "active" : ""}`,
          style: session ? { opacity: 0.5 } : void 0,
          onClick: () => {
            if (session) return;
            customMode ? pickPreset(PRESETS[1]) : enterCustom();
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { children: "\u81EA\u5B9A\u4E49" })
        }
      )
    ] }),
    activeMode === "count" && customMode && !session && /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(View, { className: "field", style: { maxWidth: 220, margin: "0 auto 4px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Label, { children: "\u81EA\u5B9A\u4E49\u65F6\u957F\uFF085-120 \u5206\u949F\uFF09" }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        Input,
        {
          type: "number",
          value: customInput,
          onInput: (e) => changeCustom(e.detail.value),
          onBlur: () => {
            if (!isCustomValid(customInput)) showToast("\u81EA\u5B9A\u4E49\u65F6\u957F\u9700\u5728 5~120 \u5206\u949F\u4E4B\u95F4");
          },
          className: customInput && !isCustomValid(customInput) ? "invalid" : "",
          placeholder: "\u5982 17"
        }
      )
    ] }),
    activeMode === "free" ? /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(View, { className: "pomo-stage", children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        View,
        {
          className: "pomo-ring",
          style: { background: "conic-gradient(var(--progress-bg) 0% 100%)" }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(View, { className: "pomo-ring-mask" }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(View, { className: "pomo-center", children: session ? /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
          Text,
          {
            className: "pomo-flower",
            style: session.pausedAt ? { opacity: 0.4 } : (
              // 呼吸感：透明度随秒针缓动（无 keyframes 的轻量实现）
              { opacity: 0.6 + 0.4 * ((Math.sin(now / 1e3) + 1) / 2) }
            ),
            children: session.pausedAt ? "\u23F8" : "\u{1F9D8}"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "pomo-time", children: fmtMS(freeElapsedMs) }),
        session.task && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "pomo-task", children: session.task }),
        session.pausedAt && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "sub", children: "\u5DF2\u6682\u505C\uFF0C\u968F\u65F6\u7EE7\u7EED" })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "pomo-flower dormant", children: "\u23F1" }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "pomo-time", children: "00:00" }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "sub", children: "\u4E0D\u9650\u65F6\u957F\uFF0C\u4E13\u6CE8\u5230\u4F60\u60F3\u505C\u4E3A\u6B62" })
      ] }) })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(View, { className: "pomo-stage", children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        View,
        {
          className: "pomo-ring",
          style: {
            background: `conic-gradient(var(--primary) ${(progress * 100).toFixed(2)}%, var(--progress-bg) 0%)`
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(View, { className: "pomo-ring-mask" }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(View, { className: "pomo-center", children: bloomed ? /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "pomo-flower bloom", children: "\u{1F33C}" }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "pomo-time", children: "\u5B8C\u6210\uFF01" }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "sub", children: "\u4F11\u606F\u4E00\u4E0B\uFF0C\u559D\u53E3\u6C34 \u{1F33F}" })
      ] }) : session ? /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: `pomo-flower ${progress >= 0.75 ? "pre-bloom" : ""}`, children: stage }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "pomo-time", children: fmtMS(remainingMs) }),
        session.task && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "pomo-task", children: session.task })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "pomo-flower dormant", children: "\u{1F330}" }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(Text, { className: "pomo-time", children: [
          minutesSel,
          ":00"
        ] })
      ] }) })
    ] }),
    !session && !bloomed && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(View, { className: "field", style: { maxWidth: 340, margin: "0 auto" }, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      Input,
      {
        placeholder: "\uFF08\u53EF\u9009\uFF09\u6BD4\u5982\uFF1A\u5237\u8A00\u8BED 20 \u9898",
        value: taskInput,
        onInput: (e) => setTaskInput(e.detail.value)
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(View, { className: "row", style: { justifyContent: "center", marginTop: 14 }, children: bloomed ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(View, { className: "btn", onClick: start, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { children: "\u518D\u6765\u4E00\u4E2A \u{1F345}" }) }) : session && session.mode === "free" ? /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_jsx_runtime20.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(View, { className: "btn ghost", onClick: pauseOrResume, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { children: session.pausedAt ? "\u7EE7\u7EED" : "\u6682\u505C" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(View, { className: "btn", onClick: finishFree, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { children: "\u7ED3\u675F\u5E76\u8BB0\u5F55" }) })
    ] }) : session ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(View, { className: "btn danger", onClick: () => setAbandonAsk(true), children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { children: "\u653E\u5F03" }) }) : /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(View, { className: "btn", style: { padding: "10px 40px", fontSize: 18 }, onClick: start, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { children: "\u5F00\u59CB\u4E13\u6CE8" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(View, { className: "card", style: { marginTop: 16 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Icon, { name: "tomato", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { children: "\u4ECA\u65E5\u756A\u8304" }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
          View,
          {
            className: "btn ghost small",
            onClick: () => stubs_default.navigateTo({ url: "/pages/pomo-logs/index" }),
            children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { children: "\u67E5\u770B\u8BB0\u5F55 \u203A" })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(View, { className: "row-between", children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "pomo-stat-num", children: todayCount }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "sub", children: todayCount === 0 ? "\u79CD\u4E0B\u4E00\u9897\u79CD\u5B50\u5427" : todayCount < 4 ? "\u4FDD\u6301\u8282\u594F\uFF0C\u7EE7\u7EED\u52A0\u6CB9" : "\u592A\u68D2\u4E86\uFF0C\u6CE8\u610F\u4F11\u606F \u{1F4AA}" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(Text, { className: "sub", style: { display: "block", marginTop: 2 }, children: [
        "\u5171 ",
        todayMinutes,
        " \u5206\u949F"
      ] }),
      lastTask && /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(Text, { className: "sub", style: { display: "block", marginTop: 4 }, children: [
        "\u6700\u8FD1\u4E00\u6B21\uFF1A",
        lastTask
      ] })
    ] }),
    abandonAsk && /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(Modal, { variant: "center", className: "mini-modal", closeOnMask: false, onClose: () => setAbandonAsk(false), children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "mini-title", children: "\u653E\u5F03\u8FD9\u4E2A\u756A\u8304\uFF1F" }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { className: "sub", children: "\u5269\u4E0B\u7684\u4E13\u6CE8\u65F6\u95F4\u4F1A\u6D88\u5931\uFF0C\u79CD\u5B50\u4E5F\u4F1A\u67AF\u840E \u{1F940}" }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(View, { className: "row", style: { justifyContent: "center", marginTop: 16 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(View, { className: "btn", onClick: () => setAbandonAsk(false), children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { children: "\u7EE7\u7EED\u4E13\u6CE8" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(View, { className: "btn danger", onClick: doAbandon, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Text, { children: "\u5FCD\u75DB\u653E\u5F03" }) })
      ] })
    ] })
  ] });
}

// src/pages/mood-history/index.tsx
var import_react20 = require("react");
var import_jsx_runtime21 = require("react/jsx-runtime");
var MOODS2 = ["\u{1F62B}", "\u{1F61E}", "\u{1F610}", "\u{1F642}", "\u{1F604}"];
var MOOD_COLORS = ["#ef4444", "#f97316", "#fbbf24", "#4ade80", "#22c55e"];
var WEEKDAYS3 = ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"];
var RANGE_CFG = {
  week: { label: "\u5468", cmp: "\u8F83\u4E0A\u5468" },
  month: { label: "\u6708", cmp: "\u8F83\u4E0A\u6708" },
  year: { label: "\u5E74", cmp: "\u8F83\u53BB\u5E74" }
};
var avgOf = (arr) => {
  const xs = arr.filter((x) => x.m);
  return xs.length ? xs.reduce((s, x) => s + x.m.mood, 0) / xs.length : 0;
};
function buildDays(range, offset, moods, today) {
  if (range === "week") {
    const now = /* @__PURE__ */ new Date(today + "T00:00:00");
    const monday = addDays(today, -((now.getDay() + 6) % 7));
    const start = addDays(monday, offset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(start, i);
      return { d, m: moods[d] };
    });
  }
  if (range === "month") {
    const base = /* @__PURE__ */ new Date(today + "T00:00:00");
    base.setDate(1);
    base.setMonth(base.getMonth() + offset);
    const y2 = base.getFullYear();
    const m = base.getMonth();
    const dim = new Date(y2, m + 1, 0).getDate();
    return Array.from({ length: dim }, (_, i) => {
      const d = dateStr(new Date(y2, m, i + 1));
      return { d, m: moods[d] };
    });
  }
  const y = (/* @__PURE__ */ new Date(today + "T00:00:00")).getFullYear() + offset;
  const leap = y % 4 === 0 && y % 100 !== 0 || y % 400 === 0;
  const daysInYear = leap ? 366 : 365;
  return Array.from({ length: daysInYear }, (_, i) => {
    const d = dateStr(new Date(y, 0, i + 1));
    return { d, m: moods[d] };
  });
}
function MoodRow({ d, m, today }) {
  const dt = /* @__PURE__ */ new Date(d + "T00:00:00");
  const weekday = WEEKDAYS3[dt.getDay()];
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "mood-entry", children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "me-emoji", children: MOODS2[m.mood - 1] }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "grow", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "row-between", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(Text, { className: "me-date", children: [
          d === today ? "\u4ECA\u5929" : `${Number(d.slice(5, 7))}/${Number(d.slice(8))}`,
          " \xB7 \u5468",
          weekday
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "sub", children: MOOD_LABELS[m.mood - 1] })
      ] }),
      m.note && /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(Text, { className: "me-note", children: [
        "\u300C",
        m.note,
        "\u300D"
      ] })
    ] })
  ] });
}
function MoodColumns({ days, range, today }) {
  const thin = range === "month";
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(View, { style: { display: "flex", alignItems: "flex-end", height: 92 }, children: days.map(({ d, m }) => {
      const isToday = d === today;
      if (!m) {
        return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
          View,
          {
            style: {
              flex: 1,
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end"
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
              View,
              {
                style: {
                  width: thin ? 3 : 8,
                  height: 2,
                  borderRadius: 2,
                  background: "var(--text-sub)",
                  opacity: 0.4
                }
              }
            )
          },
          d
        );
      }
      const h = Math.max(6, m.mood / 5 * 76);
      return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(
        View,
        {
          style: {
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end"
          },
          children: [
            !thin && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { style: { fontSize: 12, marginBottom: 2 }, children: MOODS2[m.mood - 1] }),
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
              View,
              {
                style: {
                  width: thin ? 4 : "58%",
                  height: h,
                  borderRadius: 2,
                  background: MOOD_COLORS[m.mood - 1],
                  opacity: isToday ? 1 : 0.85,
                  boxShadow: isToday ? "0 0 0 2px rgba(190,80,22,0.45)" : "none"
                }
              }
            )
          ]
        },
        d
      );
    }) }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(View, { style: { display: "flex", marginTop: 4 }, children: days.map(({ d }, i) => {
      const show = range === "week" || range === "month" && (i === 0 || (i + 1) % 5 === 0) || range === "year" && d.endsWith("-01");
      return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
        Text,
        {
          style: {
            flex: 1,
            textAlign: "center",
            fontSize: 10,
            color: "var(--text-sub)",
            visibility: show ? "visible" : "hidden",
            whiteSpace: "nowrap"
          },
          children: range === "year" ? `${Number(d.slice(5, 7))}\u6708` : range === "week" ? `${Number(d.slice(5, 7))}/${Number(d.slice(8))}` : String(Number(d.slice(8)))
        },
        d
      );
    }) })
  ] });
}
function MoodHistory() {
  const { data, ready } = useData();
  const today = todayStr();
  const [range, setRange] = (0, import_react20.useState)("week");
  const [weekOffset, setWeekOffset] = (0, import_react20.useState)(0);
  const [monthOffset, setMonthOffset] = (0, import_react20.useState)(0);
  const [yearOffset, setYearOffset] = (0, import_react20.useState)(0);
  const { cmp } = RANGE_CFG[range];
  const offset = range === "week" ? weekOffset : range === "month" ? monthOffset : yearOffset;
  const win = (0, import_react20.useMemo)(
    () => buildDays(range, offset, data.moods, today),
    [range, offset, data.moods, today]
  );
  const prevWin = (0, import_react20.useMemo)(
    () => buildDays(range, offset - 1, data.moods, today),
    [range, offset, data.moods, today]
  );
  const entries = (0, import_react20.useMemo)(() => win.filter((x) => x.m).slice().reverse(), [win]);
  const avg = avgOf(win);
  const avgPrev = avgOf(prevWin);
  const diff = avg && avgPrev ? avg - avgPrev : 0;
  const trend = diff > 0.05 ? "up" : diff < -0.05 ? "down" : "flat";
  const trendArrow = trend === "up" ? "\u2191" : trend === "down" ? "\u2193" : "\u2192";
  const trendWord = trend === "up" ? "\u597D\u8F6C" : trend === "down" ? "\u56DE\u843D" : "\u6301\u5E73";
  const goodDays = win.filter((x) => (x.m?.mood ?? 0) >= 4).length;
  const recorded = entries.length;
  const dist = MOOD_LABELS.map((_, i) => win.filter((x) => x.m?.mood === i + 1).length);
  const topIdx = dist.indexOf(Math.max(...dist));
  const periodLabel = (0, import_react20.useMemo)(() => {
    const now = /* @__PURE__ */ new Date(today + "T00:00:00");
    if (range === "week") {
      const monday = addDays(today, -((now.getDay() + 6) % 7));
      const start = addDays(monday, weekOffset * 7);
      return `${start.slice(5)} ~ ${addDays(start, 6).slice(5)}`;
    }
    if (range === "month") {
      const base = /* @__PURE__ */ new Date(today + "T00:00:00");
      base.setDate(1);
      base.setMonth(base.getMonth() + monthOffset);
      return `${base.getFullYear()} \u5E74 ${base.getMonth() + 1} \u6708`;
    }
    return `${now.getFullYear() + yearOffset} \u5E74`;
  }, [range, weekOffset, monthOffset, yearOffset, today]);
  const goPrev = () => {
    if (range === "week") setWeekOffset((o) => o - 1);
    else if (range === "month") setMonthOffset((o) => o - 1);
    else setYearOffset((o) => o - 1);
  };
  const goNext = () => {
    if (offset >= 0) return;
    if (range === "week") setWeekOffset((o) => o + 1);
    else if (range === "month") setMonthOffset((o) => o + 1);
    else setYearOffset((o) => o + 1);
  };
  const monthCols = (0, import_react20.useMemo)(() => {
    if (range !== "year") return win;
    const year = win[0]?.d.slice(0, 4) ?? String((/* @__PURE__ */ new Date(today + "T00:00:00")).getFullYear() + yearOffset);
    const byMonth = /* @__PURE__ */ new Map();
    for (const { d, m } of win) {
      if (!m) continue;
      const key = d.slice(0, 7);
      const arr = byMonth.get(key) ?? [];
      arr.push(m.mood);
      byMonth.set(key, arr);
    }
    return Array.from({ length: 12 }, (_, i) => {
      const ym = `${year}-${String(i + 1).padStart(2, "0")}`;
      const arr = byMonth.get(ym);
      return arr ? { d: `${ym}-01`, m: { mood: Math.round(arr.reduce((s, x) => s + x, 0) / arr.length) } } : { d: `${ym}-01` };
    });
  }, [range, win, today, yearOffset]);
  const lowDays = entries.filter((x) => (x.m?.mood ?? 5) <= 2);
  const emptyTip = "\u8FD8\u6CA1\u6709\u5FC3\u60C5\u8BB0\u5F55\uFF0C\u53BB\u300C\u6253\u5361\u300D\u9875\u8BB0\u4E00\u7B14\u5427";
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "sub", children: "\u52A0\u8F7D\u4E2D\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(View, { className: "seg-tabs", style: { marginBottom: 12 }, children: Object.keys(RANGE_CFG).map((k) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
      View,
      {
        className: `seg-tab ${range === k ? "active" : ""}`,
        onClick: () => setRange(k),
        children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { children: RANGE_CFG[k].label })
      },
      k
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "heat-nav", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(View, { className: "heat-nav-btn", onClick: goPrev, children: "\u2039" }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "heat-nav-title", children: periodLabel }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
        View,
        {
          className: "heat-nav-btn",
          style: { opacity: offset >= 0 ? 0.35 : 1 },
          onClick: goNext,
          children: "\u203A"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { children: "\u{1F308} \u5FC3\u60C5\u6982\u89C8" }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(Text, { className: "sub", children: [
          recorded,
          " \u5929\u6709\u8BB0\u5F55"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "row-between", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "mood-avg", children: [
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "big", children: avg ? MOODS2[Math.round(avg) - 1] : "\xB7" }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "sub", children: avg ? `\u5E73\u5747 ${MOOD_LABELS[Math.round(avg) - 1]} ${avg.toFixed(1)}` : "\u6682\u65E0" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "mood-avg", children: [
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: `big mood-trend-${avg && avgPrev ? trend : "flat"}`, children: avg && avgPrev ? trendArrow : "\xB7" }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "sub", children: avg && avgPrev ? `${cmp} ${trend === "flat" ? "\u6301\u5E73" : `${diff > 0 ? "+" : ""}${diff.toFixed(1)} ${trendWord}`}` : "\u6682\u65E0\u5BF9\u6BD4" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "mood-avg", children: [
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "big", children: goodDays }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "sub", children: "\u5929\u5FC3\u60C5\u4E0D\u9519" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Icon, { name: "chart-line", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { children: "\u5FC3\u60C5\u8D8B\u52BF" }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "sub", children: "\u5217\u9AD8=\u5F53\u5929\u5FC3\u60C5\uFF0C\u7070\u70B9=\u65E0\u8BB0\u5F55" })
      ] }),
      entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "empty", children: emptyTip }) : /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(MoodColumns, { days: monthCols, range, today })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Icon, { name: "chart-bar", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { children: "\u5FC3\u60C5\u5206\u5E03" }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "sub", children: recorded ? `\u6700\u5E38\u51FA\u73B0\uFF1A${MOODS2[topIdx]} ${MOOD_LABELS[topIdx]}` : "\u672C\u5468\u671F" })
      ] }),
      MOOD_LABELS.map((label, i) => {
        const cnt = dist[i];
        const pct = recorded ? cnt / recorded * 100 : 0;
        return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "mood-dist-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "md-emoji", children: MOODS2[i] }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "md-label", children: label }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(View, { className: "md-bar", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(View, { className: "md-fill", style: { width: `${pct}%`, background: MOOD_COLORS[i] } }) }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(Text, { className: "md-count", children: [
            cnt,
            " \u5929"
          ] })
        ] }, label);
      })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { children: "\u{1FAC2} \u4F4E\u843D\u65E5\u56DE\u987E" }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(Text, { className: "sub", children: [
          lowDays.length,
          " \u5929"
        ] })
      ] }),
      lowDays.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "empty", children: recorded ? "\u672C\u5468\u671F\u6CA1\u6709\u4F4E\u843D\u8BB0\u5F55\uFF0C\u72B6\u6001\u5F88\u7A33 \u{1F44D}" : emptyTip }) : /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(import_jsx_runtime21.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(View, { className: "mood-scroll", children: lowDays.map(({ d, m }) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(MoodRow, { d, m, today }, d)) }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "sub", style: { fontSize: 14, marginTop: 6 }, children: "\u90A3\u51E0\u5929\u90FD\u8FC7\u6765\u4E86\uFF0C\u7FFB\u7BC7\u7EE7\u7EED \u{1F4AA}" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Icon, { name: "book", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { children: "\u5FC3\u60C5\u65F6\u95F4\u7EBF" }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "sub", children: "\u6BCF\u5929\u4E00\u6761 \xB7 \u4E0A\u4E0B\u6ED1\u52A8" })
      ] }),
      entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Text, { className: "empty", children: emptyTip }) : /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(View, { className: "mood-scroll", children: entries.map(({ d, m }) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(MoodRow, { d, m, today }, d)) })
    ] })
  ] });
}

// src/pages/pomo-logs/index.tsx
var import_react21 = require("react");
var import_jsx_runtime22 = require("react/jsx-runtime");
var WEEKDAYS4 = ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"];
var PIE_COLORS2 = ["#be5016", "#d97706", "#c97b63", "#4d7c5f", "#e3b448", "#d6cec2"];
var EMPTY_TIP = "\u6700\u8FD1\u8FD8\u6CA1\u6709\u4E13\u6CE8\u8BB0\u5F55";
var lastDays = (n, anchor) => Array.from({ length: n }, (_, i) => addDays(anchor, i - (n - 1)));
var weekdayOf = (date) => `\u5468${WEEKDAYS4[(/* @__PURE__ */ new Date(date + "T00:00:00")).getDay()]}`;
var taskSegs = (logs) => {
  const map = /* @__PURE__ */ new Map();
  for (const l of logs) {
    const name = l.task?.trim() || "\u672A\u547D\u540D";
    map.set(name, (map.get(name) ?? 0) + l.minutes);
  }
  const list = [...map.entries()].map(([name, minutes]) => ({ name, minutes })).filter((x) => x.minutes > 0).sort((a, b) => b.minutes - a.minutes);
  const merged = list.length > 6 ? [
    ...list.slice(0, 5),
    { name: "\u5176\u4ED6", minutes: list.slice(5).reduce((s, x) => s + x.minutes, 0) }
  ] : list;
  const total = merged.reduce((s, x) => s + x.minutes, 0);
  let acc = 0;
  return merged.map((x) => {
    const frac = total > 0 ? x.minutes / total : 0;
    const seg = { ...x, frac, start: acc };
    acc += frac;
    return seg;
  });
};
var statsOfDays = (days, daily) => {
  let count = 0;
  let minutes = 0;
  for (const d of days) {
    const g = daily.get(d);
    if (g) {
      count += g.count;
      minutes += g.minutes;
    }
  }
  return { count, minutes };
};
var daysOfYear = (y) => y % 4 === 0 && y % 100 !== 0 || y % 400 === 0 ? 366 : 365;
function PomoLogs() {
  const { data, ready } = useData();
  const today = todayStr();
  const [range, setRange] = (0, import_react21.useState)("today");
  const [anchor, setAnchor] = (0, import_react21.useState)(today);
  const fmtTime = (ts) => {
    const d = new Date(ts);
    return `${d.getHours()}:${pad2(d.getMinutes())}`;
  };
  const daily = (0, import_react21.useMemo)(() => {
    const map = /* @__PURE__ */ new Map();
    for (const l of data.pomodoroLogs) {
      const g = map.get(l.date) ?? { minutes: 0, count: 0 };
      g.minutes += l.minutes;
      g.count++;
      map.set(l.date, g);
    }
    return map;
  }, [data.pomodoroLogs]);
  const monthly = (0, import_react21.useMemo)(() => {
    const map = /* @__PURE__ */ new Map();
    for (const l of data.pomodoroLogs) {
      const ym = l.date.slice(0, 7);
      const g = map.get(ym) ?? { minutes: 0, count: 0 };
      g.minutes += l.minutes;
      g.count++;
      map.set(ym, g);
    }
    return map;
  }, [data.pomodoroLogs]);
  const anchorY = Number(anchor.slice(0, 4));
  const weekDays = (0, import_react21.useMemo)(
    () => lastDays(7, anchor).map((date) => ({ date, minutes: daily.get(date)?.minutes ?? 0 })),
    [daily, anchor]
  );
  const monthDays = (0, import_react21.useMemo)(
    () => lastDays(30, anchor).map((date) => ({ date, minutes: daily.get(date)?.minutes ?? 0 })),
    [daily, anchor]
  );
  const yearMonths = (0, import_react21.useMemo)(
    () => Array.from({ length: 12 }, (_, i) => {
      const ym = `${anchorY}-${pad2(i + 1)}`;
      return { ym, m: i + 1, minutes: monthly.get(ym)?.minutes ?? 0 };
    }),
    [monthly, anchorY]
  );
  const rangeLogs = (0, import_react21.useMemo)(() => {
    if (range === "today") return data.pomodoroLogs.filter((l) => l.date === anchor);
    if (range === "year") return data.pomodoroLogs.filter((l) => l.date.slice(0, 4) === String(anchorY));
    const span = range === "week" ? 7 : 30;
    return data.pomodoroLogs.filter((l) => {
      const diff = daysBetween(l.date, anchor);
      return diff >= 0 && diff < span;
    });
  }, [data.pomodoroLogs, range, anchor, anchorY]);
  const todayLogs = (0, import_react21.useMemo)(() => [...rangeLogs].sort((a, b) => a.endedAt - b.endedAt), [rangeLogs]);
  const todayMinutes = (0, import_react21.useMemo)(() => todayLogs.reduce((s, l) => s + l.minutes, 0), [todayLogs]);
  const segs = (0, import_react21.useMemo)(() => taskSegs(rangeLogs), [rangeLogs]);
  const segTotal = segs.reduce((s, x) => s + x.minutes, 0);
  const weekTotal = weekDays.reduce((s, d) => s + d.minutes, 0);
  const weekPeak = Math.max(...weekDays.map((d) => d.minutes));
  const weekMax = Math.max(1, weekPeak);
  const monthTotal = monthDays.reduce((s, d) => s + d.minutes, 0);
  const monthPeak = Math.max(...monthDays.map((d) => d.minutes));
  const monthMax = Math.max(1, monthPeak);
  const yearTotal = yearMonths.reduce((s, m) => s + m.minutes, 0);
  const yearPeak = Math.max(...yearMonths.map((m) => m.minutes));
  const yearMax = Math.max(1, yearPeak);
  const stats = (0, import_react21.useMemo)(() => {
    if (range === "week") return { ...statsOfDays(weekDays.map((d) => d.date), daily), divisor: 7 };
    if (range === "month") return { ...statsOfDays(monthDays.map((d) => d.date), daily), divisor: 30 };
    if (range === "year") {
      let count = 0;
      for (const m of yearMonths) count += monthly.get(m.ym)?.count ?? 0;
      return { count, minutes: yearTotal, divisor: daysOfYear(anchorY) };
    }
    return null;
  }, [range, daily, weekDays, monthDays, yearMonths, monthly, yearTotal, anchorY]);
  const shiftAnchor = (dir) => {
    if (range === "year") {
      const d = /* @__PURE__ */ new Date(anchor + "T00:00:00");
      d.setFullYear(d.getFullYear() + dir);
      setAnchor(dateStr(d));
    } else {
      const step = range === "today" ? 1 : range === "week" ? 7 : 30;
      setAnchor(addDays(anchor, dir * step));
    }
  };
  const canForward = daysBetween(anchor, today) > 0;
  const rangeText = range === "week" ? "\u8FD1 7 \u5929" : range === "month" ? "\u8FD1 30 \u5929" : `${anchorY} \u5E74`;
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { className: "sub", children: "\u52A0\u8F7D\u4E2D\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(View, { className: "seg-tabs", style: { marginBottom: 12 }, children: [
      ["today", "\u4ECA\u5929"],
      ["week", "\u4E00\u5468"],
      ["month", "\u4E00\u6708"],
      ["year", "\u4E00\u5E74"]
    ].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
      View,
      {
        className: `seg-tab ${range === k ? "active" : ""}`,
        onClick: () => setRange(k),
        children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { children: label })
      },
      k
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "pomo-nav", children: [
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(View, { className: "pomo-nav-btn", onClick: () => shiftAnchor(-1), children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { children: "\u2039" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
        DatePicker2,
        {
          value: anchor,
          onChange: (v) => setAnchor(v),
          compact: true,
          fmt: (v) => range === "year" ? `${v.slice(0, 4)}\u5E74` : fmtDateShort(v)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
        View,
        {
          className: `pomo-nav-btn${canForward ? "" : " disabled"}`,
          onClick: () => canForward && shiftAnchor(1),
          children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { children: "\u203A" })
        }
      )
    ] }),
    range === "today" && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Icon, { name: "tomato", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { children: anchor === today ? "\u4ECA\u65E5\u4E13\u6CE8" : `${fmtDateShort(anchor)}\u4E13\u6CE8` }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(Text, { className: "sub", children: [
          todayLogs.length,
          " \u6B21"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { style: { textAlign: "center", margin: "4px 0 12px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { className: "sub", children: "\u5F53\u65E5\u7D2F\u8BA1" }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { style: { fontSize: 40, fontWeight: 800, lineHeight: 1.2, color: "var(--primary)" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { children: todayMinutes }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { style: { fontSize: 16, fontWeight: 600, marginLeft: 3 }, children: "\u5206\u949F" })
        ] })
      ] }),
      todayLogs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { className: "empty", children: anchor === today ? "\u4ECA\u5929\u8FD8\u6CA1\u5F00\u59CB\u4E13\u6CE8\uFF0C\u53BB\u79CD\u4E00\u9897\u79CD\u5B50\u5427" : "\u8FD9\u4E00\u5929\u6CA1\u6709\u4E13\u6CE8\u8BB0\u5F55" }),
      todayLogs.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "pomo-item", children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { className: "pomo-item-name", children: l.task || "\u4E13\u6CE8" }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "pomo-item-meta", children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { children: fmtTime(l.endedAt) }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { children: "\xB7" }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(Text, { children: [
            l.minutes,
            " \u5206\u949F"
          ] })
        ] })
      ] }, i))
    ] }),
    range === "week" && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Icon, { name: "chart-bar", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { children: "\u6BCF\u65E5\u4E13\u6CE8" }),
        weekTotal > 0 && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(Text, { className: "sub", children: [
          "\u5CF0\u503C ",
          weekPeak,
          " \u5206\u949F"
        ] })
      ] }),
      weekTotal === 0 ? /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { className: "empty", children: EMPTY_TIP }) : /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(View, { style: { display: "flex", alignItems: "flex-end", height: 92 }, children: weekDays.map((d) => {
          const isAnchor = d.date === anchor;
          const h = d.minutes > 0 ? Math.max(4, d.minutes / weekMax * 64) : 0;
          return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
            View,
            {
              style: {
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { style: { fontSize: 12, color: "var(--text-sub)", marginBottom: 2 }, children: d.minutes > 0 ? d.minutes : "" }),
                /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
                  View,
                  {
                    style: {
                      width: "58%",
                      height: h,
                      borderRadius: 2,
                      background: isAnchor ? "linear-gradient(180deg, #d97706, #be5016)" : "rgba(190,80,22,0.35)"
                    }
                  }
                )
              ]
            },
            d.date
          );
        }) }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(View, { style: { display: "flex", marginTop: 4 }, children: weekDays.map((d) => {
          const isAnchor = d.date === anchor;
          return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
            Text,
            {
              style: {
                flex: 1,
                textAlign: "center",
                fontSize: 12,
                fontWeight: isAnchor ? 700 : 400,
                color: isAnchor ? "var(--primary)" : "var(--text-sub)"
              },
              children: isAnchor && anchor === today ? "\u4ECA\u5929" : weekdayOf(d.date)
            },
            d.date
          );
        }) })
      ] })
    ] }),
    range === "month" && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Icon, { name: "chart-line", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { children: "\u8FD1 30 \u5929\u8D8B\u52BF" }),
        monthTotal > 0 && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(Text, { className: "sub", children: [
          "\u5CF0\u503C ",
          monthPeak,
          " \u5206\u949F"
        ] })
      ] }),
      monthTotal === 0 ? /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { className: "empty", children: EMPTY_TIP }) : /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(View, { style: { display: "flex", alignItems: "flex-end", height: 92 }, children: monthDays.map((d) => {
          const isAnchor = d.date === anchor;
          const h = d.minutes > 0 ? Math.max(2, d.minutes / monthMax * 76) : 0;
          return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(View, { style: { flex: 1, height: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end" }, children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
            View,
            {
              style: {
                width: 4,
                height: h,
                borderRadius: 2,
                background: isAnchor ? "linear-gradient(180deg, #d97706, #be5016)" : "rgba(190,80,22,0.35)"
              }
            }
          ) }, d.date);
        }) }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(View, { style: { display: "flex", marginTop: 4 }, children: monthDays.map((d, i) => {
          const show = i === 0 || (i + 1) % 5 === 0;
          return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
            Text,
            {
              style: {
                flex: 1,
                textAlign: "center",
                fontSize: 12,
                color: "var(--text-sub)",
                visibility: show ? "visible" : "hidden"
              },
              children: i + 1
            },
            d.date
          );
        }) })
      ] })
    ] }),
    range === "year" && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Icon, { name: "chart-bar", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(Text, { children: [
          anchorY,
          " \u5E74\u6BCF\u6708\u4E13\u6CE8"
        ] }),
        yearTotal > 0 && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(Text, { className: "sub", children: [
          "\u5CF0\u503C ",
          yearPeak,
          " \u5206\u949F"
        ] })
      ] }),
      yearTotal === 0 ? /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { className: "empty", children: EMPTY_TIP }) : /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(View, { style: { display: "flex", alignItems: "flex-end", height: 92 }, children: yearMonths.map((m) => {
          const isAnchor = m.m === Number(anchor.slice(5, 7));
          const h = m.minutes > 0 ? Math.max(4, m.minutes / yearMax * 64) : 0;
          return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
            View,
            {
              style: {
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { style: { fontSize: 10, color: "var(--text-sub)", marginBottom: 2 }, children: m.minutes > 0 ? m.minutes : "" }),
                /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
                  View,
                  {
                    style: {
                      width: "52%",
                      height: h,
                      borderRadius: 2,
                      background: isAnchor ? "linear-gradient(180deg, #d97706, #be5016)" : "rgba(190,80,22,0.35)"
                    }
                  }
                )
              ]
            },
            m.ym
          );
        }) }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(View, { style: { display: "flex", marginTop: 4 }, children: yearMonths.map((m) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
          Text,
          {
            style: {
              flex: 1,
              textAlign: "center",
              fontSize: 12,
              color: "var(--text-sub)"
            },
            children: m.m
          },
          m.ym
        )) })
      ] })
    ] }),
    range !== "today" && segs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(View, { className: "card-title", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(Text, { children: [
        "\u{1F967} \u4EFB\u52A1\u5206\u5E03\uFF08",
        rangeText,
        "\uFF09"
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { style: { display: "flex", alignItems: "center", gap: 14 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
          View,
          {
            style: {
              width: 110,
              height: 110,
              borderRadius: "50%",
              flexShrink: 0,
              position: "relative",
              background: `conic-gradient(${segs.map(
                (s, i) => `${PIE_COLORS2[i]} ${(s.start * 100).toFixed(2)}% ${((s.start + s.frac) * 100).toFixed(2)}%`
              ).join(", ")})`
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
              View,
              {
                style: {
                  position: "absolute",
                  inset: 18,
                  borderRadius: "50%",
                  background: "var(--card)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { style: { fontSize: 18, fontWeight: 800 }, children: segTotal }),
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { style: { fontSize: 12, color: "var(--text-sub)" }, children: "\u5206\u949F" })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
          View,
          {
            style: {
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 6
            },
            children: segs.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
              View,
              {
                style: { display: "flex", alignItems: "center", gap: 6, fontSize: 14 },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
                    View,
                    {
                      style: {
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: PIE_COLORS2[i],
                        flexShrink: 0
                      }
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
                    Text,
                    {
                      style: {
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      },
                      children: s.name
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(Text, { className: "sub", style: { flexShrink: 0 }, children: [
                    s.minutes,
                    "\u5206 \xB7 ",
                    Math.round(s.frac * 100),
                    "%"
                  ] })
                ]
              },
              `${s.name}-${i}`
            ))
          }
        )
      ] })
    ] }),
    stats && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(View, { className: "card-title", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(Text, { children: [
        "\u23F1 ",
        rangeText,
        "\u4E13\u6CE8"
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "pomo-stats-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "pomo-stat-box", children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { className: "num", children: stats.count }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { className: "sub", children: "\u756A\u8304\u6570" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "pomo-stat-box", children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { className: "num", children: stats.minutes }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { className: "sub", children: "\u7D2F\u8BA1\u5206\u949F" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(View, { className: "pomo-stat-box", children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { className: "num", children: Math.round(stats.minutes / stats.divisor * 10) / 10 }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Text, { className: "sub", children: "\u65E5\u5747\u5206\u949F" })
        ] })
      ] })
    ] })
  ] });
}

// src/pages/settings-sub/index.tsx
var import_react23 = require("react");

// src/components/DevAccountPanel.tsx
var import_react22 = require("react");

// src/components/ConfirmDialog.tsx
function appConfirm2(title, message, opts) {
  return new Promise((resolve) => {
    stubs_default.showModal({
      title,
      content: message ?? "",
      confirmText: opts?.confirmText ?? "\u786E\u5B9A",
      cancelText: opts?.cancelText ?? "\u53D6\u6D88",
      confirmColor: opts?.danger ? "#e5484d" : "#5b6abf"
    }).then((res) => resolve(!!res.confirm)).catch(() => resolve(false));
  });
}

// src/components/DevAccountPanel.tsx
var import_jsx_runtime23 = require("react/jsx-runtime");
function seedOps() {
  const fixtures = buildGuestData();
  const seeded = { ...fixtures, settings: { ...fixtures.settings, nickname: "\u6F14\u793A\u8D26\u53F7" } };
  return Object.keys(seeded).map((k) => op(k, seeded[k]));
}
function DevAccountPanel({ onDone }) {
  const [account, setAccount] = (0, import_react22.useState)("");
  const [password, setPassword] = (0, import_react22.useState)("");
  const [busy, setBusy] = (0, import_react22.useState)(false);
  const dev = isDevAccount();
  const doLogin = async () => {
    const acc = account.trim();
    if (!acc || !password) {
      showToast("\u8BF7\u8F93\u5165\u8D26\u53F7\u548C\u5BC6\u7801");
      return;
    }
    setBusy(true);
    try {
      const ok = await initTransport();
      if (!ok) throw new Error("server unreachable");
      await devLogin(acc, password);
      const snap = await fetchSnapshot();
      const bare = !snap || !snap.checkins && !snap.notes && !snap.exams;
      if (bare) await writeKeys(seedOps());
      showToast("\u5DF2\u767B\u5F55\u6F14\u793A\u8D26\u53F7");
      await onDone();
    } catch {
      showToast("\u767B\u5F55\u5931\u8D25\uFF1A\u8D26\u53F7\u6216\u5BC6\u7801\u9519\u8BEF\uFF0C\u6216\u670D\u52A1\u5668\u4E0D\u53EF\u8FBE");
    } finally {
      setBusy(false);
    }
  };
  const doReset = async () => {
    const ok = await appConfirm2("\u91CD\u7F6E\u6F14\u793A\u6570\u636E\uFF1F", "\u5F53\u524D\u6F14\u793A\u8D26\u53F7\u7684\u6570\u636E\u5C06\u6062\u590D\u4E3A\u521D\u59CB\u6F14\u793A\u72B6\u6001\u3002", {
      danger: true,
      confirmText: "\u91CD\u7F6E"
    });
    if (!ok) return;
    setBusy(true);
    try {
      await writeKeys(seedOps());
      showToast("\u6F14\u793A\u6570\u636E\u5DF2\u91CD\u7F6E");
      await onDone();
    } finally {
      setBusy(false);
    }
  };
  const doLogout = async () => {
    const ok = await appConfirm2("\u9000\u51FA\u6F14\u793A\u8D26\u53F7\uFF1F", "\u5C06\u56DE\u5230\u4F60\u7684\u5FAE\u4FE1\u771F\u5B9E\u8D26\u53F7\uFF08\u6F14\u793A\u6570\u636E\u4FDD\u7559\u5728\u670D\u52A1\u5668\uFF09\u3002", {
      confirmText: "\u9000\u51FA"
    });
    if (!ok) return;
    devLogout();
    showToast("\u5DF2\u9000\u51FA\u6F14\u793A\u8D26\u53F7");
    await onDone();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(View, { className: "card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(View, { className: "card-title", children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Text, { children: "\u6F14\u793A\u8D26\u53F7\uFF08\u5F00\u53D1\uFF09" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Text, { className: "sub", children: "\u5F00\u53D1\u671F\u4E34\u65F6\u529F\u80FD\uFF1A\u8D26\u53F7\u5BC6\u7801\u767B\u5F55\u9884\u7F6E\u5168\u91CF\u6F14\u793A\u6570\u636E\u7684\u8D26\u53F7\uFF0C\u67E5\u770B\u8FD0\u884C\u6548\u679C\uFF08\u4E0E\u5FAE\u4FE1\u8EAB\u4EFD\u9694\u79BB\uFF0C\u4E0A\u7EBF\u524D\u79FB\u9664\uFF09" }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(View, { className: "field", children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Text, { className: "sub", children: "\u8D26\u53F7" }),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
        Input,
        {
          value: account,
          placeholder: "demo",
          onInput: (e) => setAccount(e.detail.value)
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(View, { className: "field", children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Text, { className: "sub", children: "\u5BC6\u7801" }),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
        Input,
        {
          password: true,
          value: password,
          placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801",
          onInput: (e) => setPassword(e.detail.value)
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(View, { className: `btn ${busy ? "is-disabled" : ""}`, onClick: () => void (busy ? 0 : doLogin()), children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Text, { children: busy ? "\u5904\u7406\u4E2D\u2026" : "\u767B\u5F55\u6F14\u793A\u8D26\u53F7" }) }),
    dev && /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(View, { className: "btn", onClick: () => void (busy ? 0 : doReset()), children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Text, { children: "\u91CD\u7F6E\u6F14\u793A\u6570\u636E" }) }),
    dev && /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(View, { className: "btn danger", onClick: () => void (busy ? 0 : doLogout()), children: /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(Text, { children: "\u9000\u51FA\u6F14\u793A\u8D26\u53F7" }) })
  ] });
}

// src/pages/settings-sub/index.tsx
var import_jsx_runtime24 = require("react/jsx-runtime");
var TASTE_TAGS = ["\u6E05\u6DE1", "\u8FA3", "\u5FEB\u9910", "\u9971\u8179"];
var TITLES = {
  reminders: "\u4F5C\u606F\u4E0E\u63D0\u9192",
  city: "\u5929\u6C14\u57CE\u5E02",
  intel: "\u667A\u80FD\u63A8\u8350\u504F\u597D",
  notify: "\u670D\u52A1\u901A\u77E5",
  account: "\u8D26\u53F7\u4E0E\u6570\u636E",
  about: "\u5173\u4E8E"
};
function TimeField({
  label,
  value,
  onPick
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "field", children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Picker, { mode: "time", value, onChange: (e) => onPick(e.detail.value), children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "dp-trigger compact", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: value }) }) })
  ] });
}
function NumField({
  label,
  value,
  min,
  fallback,
  onSubmit
}) {
  const [draft, setDraft] = (0, import_react23.useState)(String(value));
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "field", children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Input,
      {
        type: "number",
        value: draft,
        onInput: (e) => setDraft(e.detail.value),
        onBlur: () => {
          const n = Number(draft);
          const v = draft.trim() === "" || !n ? fallback : Math.max(min, Math.round(n));
          setDraft(String(v));
          onSubmit(v);
        }
      }
    )
  ] });
}
function RemindersSub() {
  const { data, set } = useData();
  const s = data.settings;
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "form-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        TimeField,
        {
          label: "\u8D77\u5E8A\u65F6\u95F4",
          value: s.wake,
          onPick: (v) => set("settings", { ...s, wake: v })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        TimeField,
        {
          label: "\u7761\u89C9\u65F6\u95F4",
          value: s.sleep,
          onPick: (v) => set("settings", { ...s, sleep: v })
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "form-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        TimeField,
        {
          label: "\u65E9\u9910",
          value: s.meals.breakfast,
          onPick: (v) => set("settings", { ...s, meals: { ...s.meals, breakfast: v } })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        TimeField,
        {
          label: "\u5348\u9910",
          value: s.meals.lunch,
          onPick: (v) => set("settings", { ...s, meals: { ...s.meals, lunch: v } })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        TimeField,
        {
          label: "\u665A\u9910",
          value: s.meals.dinner,
          onPick: (v) => set("settings", { ...s, meals: { ...s.meals, dinner: v } })
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "form-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        NumField,
        {
          label: "\u559D\u6C34\u95F4\u9694\uFF08\u5206\u949F\uFF09",
          value: s.water.intervalMin,
          min: 15,
          fallback: 90,
          onSubmit: (v) => set("settings", { ...s, water: { ...s.water, intervalMin: v } })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        NumField,
        {
          label: "\u6BCF\u65E5\u559D\u6C34\u76EE\u6807\uFF08\u676F\uFF09",
          value: s.water.targetCups,
          min: 1,
          fallback: 8,
          onSubmit: (v) => set("settings", { ...s, water: { ...s.water, targetCups: v } })
        }
      )
    ] })
  ] });
}
function CitySub() {
  const { data, set } = useData();
  const s = data.settings;
  const [query, setQuery] = (0, import_react23.useState)("");
  const [candidates, setCandidates] = (0, import_react23.useState)([]);
  const [msg, setMsg] = (0, import_react23.useState)("");
  const [searching, setSearching] = (0, import_react23.useState)(false);
  const pick = (c) => {
    set("settings", {
      ...s,
      city: { name: c.name, province: c.province, city: c.city, lat: c.lat, lon: c.lon },
      citySource: "manual"
    });
    setMsg(
      `\u5DF2\u5207\u6362\u5230 ${c.city ? cityLabel(c) : c.province ? c.province + " \xB7 " + c.name : c.name}`
    );
    setCandidates([]);
    setQuery("");
  };
  const search = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setMsg("");
    try {
      const list = await searchCities(query.trim());
      setCandidates(list);
      if (list.length === 0) setMsg("\u6CA1\u6709\u627E\u5230\u8FD9\u4E2A\u5730\u540D\uFF0C\u6362\u4E2A\u5199\u6CD5\u8BD5\u8BD5");
    } catch {
      setMsg("\u641C\u7D22\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC");
    } finally {
      setSearching(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(Text, { className: "sub", style: { marginBottom: 8, display: "block" }, children: [
        "\u5F53\u524D\u57CE\u5E02\uFF1A",
        s.city ? cityLabel(s.city) : "\u672A\u8BBE\u7F6E"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "row-between", style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(Text, { className: "sub", children: [
          "\u5B9A\u4F4D\u65B9\u5F0F\uFF1A",
          s.citySource === "manual" ? "\u624B\u52A8\u6307\u5B9A\uFF08\u81EA\u52A8\u5B9A\u4F4D\u5DF2\u6682\u505C\uFF09" : "\u81EA\u52A8\u5B9A\u4F4D"
        ] }),
        s.citySource === "manual" && /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
          View,
          {
            className: "btn ghost small",
            onClick: () => {
              set("settings", { ...s, citySource: "auto" });
              setMsg("\u5DF2\u6062\u590D\u81EA\u52A8\u5B9A\u4F4D\uFF0C\u56DE\u5230\u300C\u4ECA\u65E5\u300D\u9875\u5373\u53EF\u751F\u6548");
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Icon, { name: "refresh", size: 12, gap: 4 }),
              "\u6062\u590D\u81EA\u52A8\u5B9A\u4F4D"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "form-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "field", style: { flex: 1, marginBottom: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
          Input,
          {
            placeholder: "\u641C\u7D22\u57CE\u5E02\u6216\u533A\u53BF\uFF08\u5982 \u6D1B\u9F99\u533A\uFF0C\u7ED3\u679C\u8BF7\u70B9\u9009\uFF09",
            value: query,
            onInput: (e) => setQuery(e.detail.value),
            onConfirm: () => void search()
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
          View,
          {
            className: `btn small${searching ? " is-disabled" : ""}`,
            onClick: () => {
              if (!searching) void search();
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: searching ? "\u641C\u7D22\u4E2D\u2026" : "\u641C\u7D22" })
          }
        )
      ] }),
      msg !== "" && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", style: { marginTop: 6, display: "block" }, children: msg }),
      candidates.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { style: { marginTop: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", style: { marginBottom: 4, display: "block" }, children: "\u641C\u7D22\u7ED3\u679C\uFF08\u70B9\u51FB\u9009\u62E9\uFF09\uFF1A" }),
        candidates.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "list-item", onClick: () => pick(c), children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(Text, { className: "grow", children: [
            cityLabel(c),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", children: c.province })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", children: "\u203A" })
        ] }, i))
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "section-label", children: "\u6CB3\u5357\u7701\uFF08\u70B9\u9009\u5207\u6362\uFF09" }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "row", style: { flexWrap: "wrap", gap: 6 }, children: HENAN_CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Text,
      {
        className: `tag ${s.city?.name === c.name && s.city?.province === "\u6CB3\u5357" ? "selected" : ""}`,
        style: { border: "none", padding: "6px 14px", fontSize: 16 },
        onClick: () => pick(c),
        children: c.name
      },
      c.name
    )) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "section-label", children: "\u5E38\u7528\u57CE\u5E02" }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "row", style: { flexWrap: "wrap", gap: 6 }, children: OTHER_CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Text,
      {
        className: `tag ${s.city?.name === c.name ? "selected" : ""}`,
        style: { border: "none", padding: "6px 14px", fontSize: 16 },
        onClick: () => pick(c),
        children: c.name
      },
      c.name
    )) }) })
  ] });
}
function IntelSub() {
  const { data, set } = useData();
  const s = data.settings;
  const intel = s.intel ?? { enabled: true, tastes: [] };
  const toggle = () => {
    set("settings", { ...s, intel: { ...intel, enabled: !intel.enabled } });
    showToast(!intel.enabled ? "\u5DF2\u542F\u7528\u667A\u80FD\u63A8\u8350\uFF0C\u53BB\u300C\u751F\u6D3B \u2192 \u5403\u4EC0\u4E48\u300D\u4F53\u9A8C\u5427" : "\u5DF2\u5173\u95ED\u667A\u80FD\u63A8\u8350");
  };
  const toggleTaste = (t) => {
    const has = intel.tastes.includes(t);
    set("settings", {
      ...s,
      intel: {
        ...intel,
        tastes: has ? intel.tastes.filter((x) => x !== t) : [...intel.tastes, t]
      }
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", style: { marginBottom: 10, display: "block" }, children: "\u5F00\u542F\u540E\uFF0C\u300C\u5403\u4EC0\u4E48\u300D\u9875\u53EF\u4EE5\u95EE\u4E13\u5C5E\u5C0F\u52A9\u624B\uFF1A\u5B83\u4F1A\u7ED3\u5408\u4F60\u7684\u53E3\u5473\u548C\u4ECA\u5929\u5403\u8FC7\u7684\u4E1C\u897F\uFF0C\u7ED9\u51FA\u4ECA\u5929\u7684\u63A8\u8350\uFF08\u542B\u63A8\u8350\u7406\u7531\uFF09\uFF0C\u63A8\u8350\u7ED3\u679C\u53EF\u4E00\u952E\u52A0\u5165\u5019\u9009\u6C60\u3002 \u667A\u80FD\u670D\u52A1\u7531\u4E91\u7AEF\u7EDF\u4E00\u4EE3\u7406\uFF0C\u65E0\u9700\u586B\u5199\u4EFB\u4F55\u5BC6\u94A5\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "row", style: { justifyContent: "space-between" }, onClick: toggle, children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: "\u542F\u7528\u667A\u80FD\u63A8\u8350" }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: `ms-check${intel.enabled ? " on" : ""}`, children: intel.enabled ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Icon, { name: "check", size: 12 }) : null })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "card-title", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: "\u53E3\u5473\u504F\u597D\uFF08\u53EF\u591A\u9009\uFF09" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "row", style: { flexWrap: "wrap", gap: 6 }, children: TASTE_TAGS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        Text,
        {
          className: `tag ${intel.tastes.includes(t) ? "selected" : ""}`,
          style: { border: "none", padding: "6px 14px", fontSize: 16 },
          onClick: () => toggleTaste(t),
          children: t
        },
        t
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", style: { marginTop: 8, display: "block" }, children: "\u9009\u4E2D\u7684\u53E3\u5473\u4F1A\u4F5C\u4E3A\u5C0F\u52A9\u624B\u63A8\u8350\u65F6\u7684\u53C2\u8003\u504F\u597D\u3002" })
    ] })
  ] });
}
var AVATAR_SIZE = 128;
async function compressAvatar(tempPath) {
  const canvas = await new Promise((resolve, reject) => {
    stubs_default.createSelectorQuery().select("#avatarCanvas").fields({ node: true, size: true }).exec((res) => {
      const node = res && res[0] && res[0].node;
      if (node) resolve(node);
      else reject(new Error("canvas \u8282\u70B9\u672A\u5C31\u7EEA"));
    });
  });
  const info = await stubs_default.getImageInfo({ src: tempPath });
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;
  const ctx = canvas.getContext("2d");
  const img = canvas.createImage();
  await new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("\u56FE\u7247\u52A0\u8F7D\u5931\u8D25"));
    img.src = tempPath;
  });
  const side = Math.min(info.width, info.height);
  ctx.drawImage(
    img,
    (info.width - side) / 2,
    (info.height - side) / 2,
    side,
    side,
    0,
    0,
    AVATAR_SIZE,
    AVATAR_SIZE
  );
  const tmp = await stubs_default.canvasToTempFilePath({
    canvas,
    canvasId: "avatarCanvas",
    x: 0,
    y: 0,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    destWidth: AVATAR_SIZE,
    destHeight: AVATAR_SIZE,
    fileType: "jpg",
    quality: 0.82
  });
  const base64 = stubs_default.getFileSystemManager().readFileSync(tmp.tempFilePath, "base64");
  return "data:image/jpeg;base64," + base64;
}
function AccountSub() {
  const { auth, rebootstrap, data, set } = useData();
  const s = data.settings;
  const [avatarBusy, setAvatarBusy] = (0, import_react23.useState)(false);
  const [nickDraft, setNickDraft] = (0, import_react23.useState)(s.nickname ?? "");
  const [phoneDraft, setPhoneDraft] = (0, import_react23.useState)(s.phone ?? "");
  const onChooseAvatar = async (e) => {
    const temp = e.detail.avatarUrl;
    if (!temp) return;
    setAvatarBusy(true);
    try {
      const avatarUrl = await compressAvatar(temp);
      set("settings", { ...s, avatarUrl });
      showToast("\u5934\u50CF\u5DF2\u66F4\u65B0");
    } catch {
      showToast("\u5934\u50CF\u5904\u7406\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
    } finally {
      setAvatarBusy(false);
    }
  };
  const saveNickname = () => {
    const name = nickDraft.trim().slice(0, 16);
    if (name === (s.nickname ?? "")) return;
    set("settings", { ...s, nickname: name });
    showToast(name ? "\u6635\u79F0\u5DF2\u4FDD\u5B58" : "\u5DF2\u6E05\u7A7A\u6635\u79F0");
  };
  const savePhone = () => {
    const phone = phoneDraft.trim().slice(0, 11);
    if (phone === (s.phone ?? "")) return;
    if (phone !== "" && !/^\d{11}$/.test(phone)) {
      setPhoneDraft(s.phone ?? "");
      showToast("\u624B\u673A\u53F7\u5E94\u4E3A 11 \u4F4D\u6570\u5B57");
      return;
    }
    set("settings", { ...s, phone: phone === "" ? void 0 : phone });
    showToast(phone ? "\u624B\u673A\u53F7\u5DF2\u4FDD\u5B58" : "\u5DF2\u6E05\u7A7A\u624B\u673A\u53F7");
  };
  const clearTrial = async () => {
    const ok = await appConfirm("\u6E05\u7A7A\u8BD5\u73A9\u8BB0\u5F55\uFF1F", "\u5C06\u6E05\u9664\u8BD5\u73A9\u671F\u95F4\u7684\u672C\u5730\u8BB0\u5F55\u5E76\u6062\u590D\u4E3A\u6F14\u793A\u6570\u636E\u3002", {
      danger: true,
      confirmText: "\u6E05\u7A7A"
    });
    if (!ok) return;
    stubs_default.removeStorageSync("kg-guest-data");
    await rebootstrap();
    showToast("\u8BD5\u73A9\u8BB0\u5F55\u5DF2\u6E05\u7A7A");
  };
  const clearCache = async () => {
    const first = await appConfirm("\u786E\u5B9A\u6E05\u7A7A\u672C\u5730\u7F13\u5B58\u5417\uFF1F", "\u670D\u52A1\u5668\u6570\u636E\u4E0D\u53D7\u5F71\u54CD\uFF0C\u91CD\u65B0\u62C9\u53D6\u5373\u53EF\u6062\u590D", { danger: true, confirmText: "\u7EE7\u7EED" });
    if (!first) return;
    const second = await appConfirm("\u518D\u6B21\u786E\u8BA4\uFF1A\u771F\u7684\u8981\u6E05\u7A7A\u5417\uFF1F", "\u5C06\u6E05\u9664\u672C\u5730\u767B\u5F55\u6001\u4E0E\u7F13\u5B58\u6570\u636E\uFF0C\u9875\u9762\u968F\u540E\u91CD\u65B0\u521D\u59CB\u5316\u3002", { danger: true, confirmText: "\u6E05\u7A7A" });
    if (!second) return;
    for (const k of ["kg-auth", "kg-openid", "kg-token", "kg-data", "kg-guest-data", "kg-dev-role", "kg-write-queue"]) {
      stubs_default.removeStorageSync(k);
    }
    await rebootstrap();
    showToast("\u5DF2\u6E05\u7A7A\u672C\u5730\u7F13\u5B58");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: "\u5FAE\u4FE1\u4FE1\u606F" }),
        auth && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: `badge ${auth.role === "guest" ? "lag" : "ok"}`, children: isDevAccount() ? "\u6F14\u793A\u8D26\u53F7" : auth.role === "guest" ? "\u8BD5\u73A9\u8D26\u53F7" : "\u6B63\u5F0F\u8D26\u53F7" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "row", style: { gap: 14, alignItems: "center" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Button, { className: "avatar-btn", "open-type": "chooseAvatar", onChooseAvatar, children: s.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Image, { className: "account-avatar", src: s.avatarUrl, mode: "aspectFill" }) : /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "account-avatar ph", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Icon, { name: "user", size: 28, gap: 0 }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "grow", style: { textAlign: "left" }, children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", children: avatarBusy ? "\u5934\u50CF\u5904\u7406\u4E2D\u2026" : "\u70B9\u51FB\u5934\u50CF\u66F4\u6362" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", children: "\u6635\u79F0" }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
          Input,
          {
            type: "nickname",
            value: nickDraft,
            maxlength: 16,
            placeholder: "\u70B9\u51FB\u586B\u5199",
            onInput: (e) => setNickDraft(e.detail.value),
            onBlur: saveNickname
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", children: "\u624B\u673A\u53F7" }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
          Input,
          {
            type: "number",
            value: phoneDraft,
            maxlength: 11,
            placeholder: "\u9009\u586B\uFF0C11 \u4F4D\u624B\u673A\u53F7",
            onInput: (e) => setPhoneDraft(e.detail.value),
            onBlur: savePhone
          }
        )
      ] })
    ] }),
    auth?.role === "guest" && /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "card-title", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: "\u8BD5\u73A9\u8BB0\u5F55" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "btn danger", onClick: () => void clearTrial(), children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: "\u6E05\u7A7A\u8BD5\u73A9\u8BB0\u5F55" }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "card-title", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: "\u672C\u5730\u7F13\u5B58" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "btn danger", onClick: () => void clearCache(), children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: "\u6E05\u7A7A\u672C\u5730\u7F13\u5B58" }) })
    ] }),
    DEV_LOGIN_ENABLED && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(DevAccountPanel, { onDone: rebootstrap }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Canvas,
      {
        type: "2d",
        id: "avatarCanvas",
        style: { position: "fixed", left: "-9999px", top: 0, width: `${AVATAR_SIZE}px`, height: `${AVATAR_SIZE}px` }
      }
    )
  ] });
}
function NotifySub() {
  const { auth } = useData();
  const [quota, setQuota] = (0, import_react23.useState)(null);
  const [loading, setLoading] = (0, import_react23.useState)(true);
  const loadQuota = async () => {
    setLoading(true);
    const res = await fetchSubscribeStatus();
    setQuota(res ? Object.values(res).reduce((s, n) => s + n, 0) : null);
    setLoading(false);
  };
  (0, import_react23.useEffect)(() => {
    void loadQuota();
  }, []);
  const askGrant = async () => {
    await subscribeRemind(true);
    void loadQuota();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Icon, { name: "mail", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: "\u63A8\u9001\u5185\u5BB9\u4E0E\u65F6\u95F4" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", children: "\u6BCF\u5929\u65E9\u4E0A 7:30 \u68C0\u67E5\u4E00\u6B21\uFF1A\u6709\u5230\u671F\u7684\u5468\u671F\u5F85\u529E\u6216\u5F85\u590D\u4E60\u7684\u7B14\u8BB0\u95EA\u5361\u65F6\uFF0C\u901A\u8FC7\u5FAE\u4FE1\u670D\u52A1\u901A\u77E5\u63A8\u9001\u5230\u4F60\u7684\u5FAE\u4FE1\u3002" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Icon, { name: "ticket", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: "\u5269\u4F59\u989D\u5EA6" })
      ] }),
      auth?.role === "guest" ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", children: "\u8BD5\u73A9\u8D26\u53F7\u4E0D\u53C2\u4E0E\u670D\u52A1\u901A\u77E5\u63A8\u9001\u3002\u5347\u7EA7\u4E3A\u6B63\u5F0F\u8D26\u53F7\u540E\uFF0C\u5728\u5B8C\u6210\u6253\u5361\u3001\u590D\u4E60\u95EA\u5361\u7B49\u64CD\u4F5C\u65F6\u987A\u624B\u6388\u6743\u5373\u53EF\u7D2F\u79EF\u63A8\u9001\u989D\u5EA6\u3002" }) : /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { style: { fontSize: 40, fontWeight: 800, color: "var(--primary)", lineHeight: 1.2 }, children: loading ? "\u2026" : quota ?? "\u2014" }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", children: "\u6761" }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "btn small ghost", style: { marginLeft: "auto" }, onClick: () => void askGrant(), children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: "+ \u589E\u52A0 1 \u6761" }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", style: { marginTop: 8, display: "block" }, children: "\u5FAE\u4FE1\u8BA2\u9605\u6D88\u606F\u4E3A\u300C\u6388\u6743\u4E00\u6B21\u3001\u63A8\u9001\u4E00\u6761\u300D\uFF1A\u6BCF\u6B21\u70B9\u300C\u5141\u8BB8\u300D\u7D2F\u79EF 1 \u6761\u989D\u5EA6\uFF0C\u63A8\u9001\u4E00\u6761\u6263\u51CF\u4E00\u6761\u3002\u5B8C\u6210\u6253\u5361\u3001\u590D\u4E60\u95EA\u5361\u65F6\u4E5F\u4F1A\u987A\u624B\u8BF7\u6C42\u6388\u6743\uFF08\u6BCF\u5929\u81F3\u591A\u63D0\u9192\u4E00\u6B21\uFF0C\u4E0D\u4F1A\u6253\u6270\uFF09\u3002" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Icon, { name: "wrench", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: "\u6536\u4E0D\u5230\u901A\u77E5\uFF1F" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(Text, { className: "sub", children: [
        "1. \u70B9\u4E0A\u65B9\u300C\u589E\u52A0 1 \u6761\u300D\u786E\u8BA4\u989D\u5EA6 > 0\uFF1B",
        "\n",
        "2. \u68C0\u67E5\u5FAE\u4FE1\u603B\u5F00\u5173\uFF1A\u672C\u5C0F\u7A0B\u5E8F\u5185\u70B9\u53F3\u4E0A\u89D2\u300C\xB7\xB7\xB7\u300D\u2192 \u8BBE\u7F6E \u2192 \u6D88\u606F\u8BA2\u9605\uFF0C\u786E\u8BA4\u672A\u5173\u95ED\uFF1B",
        "\n",
        "3. \u82E5\u66FE\u9009\u62E9\u300C\u603B\u662F\u4FDD\u6301\u4EE5\u4E0A\u9009\u62E9\u300D\u5E76\u62D2\u7EDD\uFF0C\u9700\u5220\u9664\u5C0F\u7A0B\u5E8F\u91CD\u65B0\u8FDB\u5165\u624D\u4F1A\u518D\u6B21\u5F39\u51FA\u6388\u6743\u3002"
      ] })
    ] })
  ] });
}
function AboutSub() {
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Icon, { name: "mobile", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: "\u5173\u4E8E\u5C0F\u7A0B\u5E8F" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", children: "\u8003\u516C\u5C0F\u52A9\u624B \xB7 \u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u7248\u3002\u65E0\u9700\u5B89\u88C5\uFF0C\u5373\u5F00\u5373\u7528\uFF0C\u7248\u672C\u66F4\u65B0\u7531\u5FAE\u4FE1\u81EA\u52A8\u5B8C\u6210\uFF0C\u65E0\u9700\u624B\u52A8\u64CD\u4F5C\u3002PC \u7BA1\u7406\u7AEF\uFF08B \u7AEF\uFF09\u53E6\u884C\u90E8\u7F72\uFF0C\u7528\u4E8E\u914D\u7F6E\u5956\u52B1\u4E0E\u7EF4\u62A4\u6570\u636E\u3002" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Icon, { name: "bell", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: "\u5173\u4E8E\u63D0\u9192" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", children: "\u8BE5\u505A\u7684\u4E8B\u4EE5\u5361\u7247\u9AD8\u4EAE\uFF08\u559D\u6C34\u3001\u4E09\u9910\u3001\u7761\u7720\u3001\u8003\u8BD5\u5012\u8BA1\u65F6\u7B49\uFF09\uFF0C\u91CD\u8981\u6D88\u606F\u7528\u9875\u9762\u5F39\u7A97\u548C\u8F7B\u63D0\u793A\u5C55\u793A\uFF1B\u5230\u671F\u5468\u671F\u5F85\u529E\u3001\u5F85\u590D\u4E60\u7B14\u8BB0\u8FD8\u53EF\u5F00\u901A\u5FAE\u4FE1\u670D\u52A1\u901A\u77E5\uFF0C\u6BCF\u5929\u65E9\u4E0A 7:30 \u63A8\u9001\u5230\u5FAE\u4FE1\uFF08\u8BE6\u89C1\u8BBE\u7F6E \u2192 \u670D\u52A1\u901A\u77E5\uFF09\u3002" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "card-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Icon, { name: "cloud", size: 16, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: "\u6570\u636E\u5728\u54EA" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", children: "\u8D26\u53F7\u901A\u8FC7\u5FAE\u4FE1\u9759\u9ED8\u767B\u5F55\u7ED1\u5B9A\uFF0C\u6B63\u5F0F\u8D26\u53F7\u7684\u6570\u636E\u5B9E\u65F6\u540C\u6B65\u5230\u81EA\u5EFA\u670D\u52A1\u5668\uFF0C\u4E0D\u4E0A\u4F20\u4EFB\u4F55\u7B2C\u4E09\u65B9\u3002\u5929\u6C14\u6765\u81EA\u516C\u5F00\u6C14\u8C61\u63A5\u53E3\uFF0C\u91D1\u53E5\u90E8\u5206\u6765\u81EA\u4E00\u8A00\u63A5\u53E3\uFF1B\u667A\u80FD\u63A8\u8350\u7531\u4E91\u7AEF\u7EDF\u4E00\u4EE3\u7406\uFF0C\u5BC6\u94A5\u4E0D\u843D\u7AEF\u3002\u8BD5\u73A9\u8D26\u53F7\u7684\u6570\u636E\u4EC5\u5B58\u672C\u5730\u6C99\u76D2\uFF0C\u5347\u7EA7\u65F6\u53EF\u9009\u62E9\u5E26\u8D70\u3002" })
    ] })
  ] });
}
function SettingsSub() {
  const [type, setType] = (0, import_react23.useState)("about");
  const { ready } = useData();
  useLoad((params) => {
    if (params?.type && TITLES[params.type]) setType(params.type);
  });
  const title = TITLES[type] ?? TITLES.about;
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { className: "sub", children: "\u52A0\u8F7D\u4E2D\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(View, { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(View, { className: "page-title", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Text, { children: title }) }),
    type === "reminders" && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(RemindersSub, {}),
    type === "city" && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(CitySub, {}),
    type === "intel" && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(IntelSub, {}),
    type === "notify" && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(NotifySub, {}),
    type === "account" && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(AccountSub, {}),
    type === "about" && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(AboutSub, {})
  ] });
}

// src/pages/ai-chat/index.tsx
var import_react24 = require("react");

// src/utils/taste.ts
function nextTasteProfile(foods, cur, name, dir, picked = false) {
  const food = foods.find((x) => x.name === name);
  const keys = food && food.tags.length > 0 ? food.tags : [name];
  const base = cur ?? { liked: {}, disliked: {}, picked: [] };
  const next = {
    liked: { ...base.liked },
    disliked: { ...base.disliked },
    picked: picked ? [...base.picked.filter((x) => x !== name), name].slice(-10) : [...base.picked]
  };
  for (const k of keys) next[dir][k] = (next[dir][k] ?? 0) + 1;
  return next;
}
function buildFoodChatCtx(prof, eatenToday, exclude) {
  const top = (rec) => rec ? Object.entries(rec).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k) : [];
  const liked = top(prof?.liked);
  const disliked = top(prof?.disliked);
  const ctx = [];
  if (liked.length || disliked.length || prof?.picked?.length) {
    ctx.push(
      `\u7528\u6237\u53E3\u5473\u753B\u50CF\uFF1A${liked.length ? "\u559C\u6B22 " + liked.join("\u3001") + "\uFF1B" : ""}${disliked.length ? "\u4E0D\u559C\u6B22 " + disliked.join("\u3001") + "\uFF1B" : ""}${prof?.picked?.length ? "\u6700\u8FD1\u5E38\u9009 " + prof.picked.slice(-5).join("\u3001") : ""}`
    );
  }
  if (eatenToday.length) ctx.push(`\u4ECA\u5929\u5DF2\u5403\uFF1A${eatenToday.join("\u3001")}\uFF0C\u907F\u514D\u91CD\u590D`);
  if (exclude.length) ctx.push(`\u7528\u6237\u5DF2\u5254\u9664/\u660E\u786E\u4E0D\u8981\uFF1A${exclude.join("\u3001")}\uFF0C\u7EDD\u5BF9\u4E0D\u8981\u518D\u63A8\u8350`);
  return ctx;
}

// src/pages/ai-chat/index.tsx
var import_jsx_runtime25 = require("react/jsx-runtime");
var SLOTS2 = ["breakfast", "lunch", "dinner", "supper"];
var GENERAL_SYS = "\u4F60\u662F\u300C\u8003\u516C\u5C0F\u52A9\u624B\u300D\uFF0C\u4E00\u4F4D\u8D34\u5FC3\u7684\u5907\u8003\u966A\u4F34\u52A9\u624B\uFF0C\u670D\u52A1\u51C6\u5907\u516C\u52A1\u5458/\u4E8B\u4E1A\u5355\u4F4D\u8003\u8BD5\u7684\u7528\u6237\u3002\u804C\u8D23\uFF1A\u89E3\u7B54\u884C\u6D4B\u3001\u7533\u8BBA\u3001\u9762\u8BD5\u3001\u516C\u8003\u5E38\u8BC6\u7C7B\u95EE\u9898\uFF1B\u5E2E\u7528\u6237\u505A\u5B66\u4E60\u89C4\u5212\u4E0E\u65F6\u95F4\u5B89\u6392\uFF1B\u503E\u542C\u5E76\u9F13\u52B1\u5907\u8003\u60C5\u7EEA\u3002\u786C\u6027\u8981\u6C42\uFF1A\u53EA\u7528\u81EA\u7136\u8BED\u8A00\u56DE\u7B54\uFF0C\u53E3\u8BED\u5316\u3001\u7B80\u6D01\u5206\u70B9\uFF0C\u6BCF\u6B21\u4E0D\u8D85\u8FC7 150 \u5B57\uFF1B\u4E25\u7981\u8F93\u51FA JSON\u3001\u4EE3\u7801\u5757\u3001markdown \u6807\u8BB0\u7B26\u53F7\uFF08\u5982 **\u3001#\u3001```\uFF09\uFF1B\u6D89\u53CA\u5177\u4F53\u653F\u7B56\u3001\u5C97\u4F4D\u3001\u5206\u6570\u7EBF\u7B49\u65F6\u6548\u4FE1\u606F\u65F6\uFF0C\u63D0\u9192\u7528\u6237\u4EE5\u5B98\u65B9\u516C\u544A\u4E3A\u51C6\u3002\u8BED\u6C14\u6E29\u6696\u79EF\u6781\u3002";
var FOOD_SYS = '\u4F60\u662F\u8D34\u5FC3\u7684\u5403\u996D\u987E\u95EE\uFF0C\u5E2E\u4E00\u4E2A\u6B63\u5728\u5907\u8003\u7684\u670B\u53CB\u51B3\u5B9A\u4ECA\u5929\u5403\u4EC0\u4E48\u3002\u89C4\u5219\uFF1A\u8F6E\u6B21\u4E0D\u9650\u4F46 5 \u8F6E\u5185\u5FC5\u987B\u6536\u655B\u51FA\u6700\u7EC8\u63A8\u8350\uFF1B\u5148\u95EE 1-2 \u4E2A\u4E8C\u9009\u4E00\u7684\u95EE\u9898\uFF08\u5982\uFF1A\u60F3\u5403\u8FA3\u8FD8\u662F\u6E05\u6DE1\uFF1F\u7C73\u996D\u8FD8\u662F\u9762\u98DF\uFF1F\u70B9\u5916\u5356\u8FD8\u662F\u5BB6\u91CC\u5403\uFF1F\uFF09\uFF0C\u6839\u636E\u7528\u6237\u7684\u56DE\u7B54\u6536\u655B\uFF1B\u6BCF\u8F6E\u7ED9\u51FA 2-3 \u4E2A\u5019\u9009\u5E76\u9644\u7B80\u77ED\u7406\u7531\uFF1B\u7528\u6237\u63D0\u51FA\u5254\u9664\u67D0\u4E2A\u5019\u9009\u65F6\uFF0C\u53EA\u5728\u5269\u4F59\u5019\u9009\u91CC\u5BF9\u6BD4\u63A8\u8350\uFF08\u4E0D\u8981\u65B0\u589E\u5DF2\u88AB\u5254\u9664\u7684\u3001\u4E5F\u4E0D\u8981\u518D\u63A8\u8350\u7528\u6237\u660E\u786E\u62D2\u7EDD\u8FC7\u7684\uFF09\uFF1B\u7528\u6237\u63D0\u51FA\u65B0\u8981\u6C42\u65F6\uFF0C\u7ED3\u5408\u4E4B\u524D\u7684\u5BF9\u8BDD\u4E0E\u5DF2\u5254\u9664\u9879\u91CD\u65B0\u7ED9 2-3 \u4E2A\u5019\u9009\uFF1B\u5F53\u7528\u6237\u8BF4"\u5C31\u8FD9\u4E2A/\u884C/\u597D"\u7B49\u8868\u793A\u540C\u610F\u3001\u6216\u5BF9\u8BDD\u5230\u7B2C 5 \u8F6E\u65F6\uFF0C\u7ED9\u51FA\u6700\u7EC8\u63A8\u8350\u5E76\u628A final \u7F6E true\u3002\u53EA\u8F93\u51FA\u4E00\u4E2A JSON \u5BF9\u8C61\uFF08\u4E25\u7981 markdown \u4EE3\u7801\u5757\u3001\u56F4\u680F\u6216\u4EFB\u4F55\u591A\u4F59\u6587\u5B57\uFF09\uFF0C\u683C\u5F0F\uFF1A{"reply":"\u4E00\u53E5\u8BDD\u5F15\u5BFC\u6216\u5BF9\u6BD4\u7ED3\u8BBA(40\u5B57\u5185)","candidates":[{"name":"\u98DF\u7269\u540D(10\u5B57\u5185)","reason":"\u63A8\u8350\u7406\u7531(20\u5B57\u5185)"}],"final":false}\u3002\u8BED\u6C14\u4EB2\u5207\u8F7B\u677E\u3002';
var GENERAL_WELCOME = "\u4F60\u597D\u5440\uFF5E\u6211\u662F\u5C0F\u52A9\u624B \u{1F31F}\n\u53EF\u4EE5\u95EE\u6211\u5907\u8003\u95EE\u9898\u3001\u8BA9\u6211\u5E2E\u4F60\u505A\u5B66\u4E60\u89C4\u5212\uFF0C\u6216\u8005\u53EA\u662F\u60F3\u627E\u4EBA\u804A\u804A\u5907\u8003\u538B\u529B\uFF0C\u6211\u90FD\u5728\uFF5E";
function stripFences(t) {
  return t.replace(/```(?:json)?/gi, "").trim();
}
function extractBalancedJson(t) {
  const start = t.indexOf("{");
  if (start < 0) return null;
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < t.length; i++) {
    const ch = t[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
    } else if (ch === '"') inStr = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return t.slice(start, i + 1);
    }
  }
  return null;
}
function parseAIReply(text) {
  const clean = stripFences(text);
  const raw = extractBalancedJson(clean);
  if (raw) {
    try {
      const p = JSON.parse(raw);
      const list = Array.isArray(p.candidates) ? p.candidates.filter((c) => c && typeof c.name === "string" && c.name.trim()).map((c) => ({ name: String(c.name).trim(), reason: String(c.reason ?? "").trim() })).slice(0, 3) : [];
      const reply = typeof p.reply === "string" && p.reply.trim() ? p.reply.trim() : clean.replace(raw, "").trim();
      return {
        reply: reply || "\u5C0F\u52A9\u624B\u5728\u60F3\u600E\u4E48\u8868\u8FBE\uFF5E",
        candidates: list,
        final: p.final === true || list.length === 1
      };
    } catch {
    }
  }
  const m = clean.match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)"?/);
  if (m) {
    let reply = m[1];
    try {
      reply = JSON.parse(`"${m[1]}"`);
    } catch {
    }
    const t = reply.trim();
    if (t) return { reply: t, candidates: [], final: false };
  }
  const fallback = clean.trim() || text.trim();
  if (/^[{[][\s\S]*[\]}]$/.test(fallback)) {
    return { reply: "\u5C0F\u52A9\u624B\u521A\u624D\u7684\u56DE\u590D\u6709\u70B9\u4E71\uFF0C\u53EF\u4EE5\u518D\u8BF4\u4E00\u6B21\u5417\uFF1F\u{1F64F}", candidates: [], final: false };
  }
  return { reply: fallback, candidates: [], final: false };
}
function looksLikeJsonProtocol(t) {
  return /^\s*[{[]/.test(t) && /"(reply|candidates|final)"\s*:/.test(t);
}
function AiChat() {
  const { data, ready, set } = useData();
  const router = useRouter();
  const isFood = router.params.ctx === "food";
  const slot = (() => {
    const s = router.params.slot;
    if (s && SLOTS2.includes(s)) return s;
    const h = (/* @__PURE__ */ new Date()).getHours();
    return h < 10 ? "breakfast" : h < 14 ? "lunch" : h < 21 ? "dinner" : "supper";
  })();
  const [msgs, setMsgs] = (0, import_react24.useState)([]);
  const [input, setInput] = (0, import_react24.useState)("");
  const [busy, setBusy] = (0, import_react24.useState)(false);
  const [streamBuf, setStreamBuf] = (0, import_react24.useState)("");
  const [kbH, setKbH] = (0, import_react24.useState)(0);
  const [scrollTick, setScrollTick] = (0, import_react24.useState)(0);
  const [excluded, setExcluded] = (0, import_react24.useState)([]);
  const chatTurns = (0, import_react24.useRef)(0);
  const inited = (0, import_react24.useRef)(false);
  const genRef = (0, import_react24.useRef)(0);
  const lastFlushRef = (0, import_react24.useRef)(0);
  const scrollTickRef = (0, import_react24.useRef)(0);
  const today = todayStr();
  const eatenToday = Object.values(data.foodLog[today] ?? {}).filter(Boolean);
  const opener = () => `\u5E2E\u6211\u6311\u4ECA\u5929\u7684${MEAL_SLOT_LABELS[slot]}\u5427`;
  const scrollBottom = () => setScrollTick(++scrollTickRef.current);
  const buildMsgs = (history, forceFinal, excl) => {
    let sys = GENERAL_SYS;
    if (isFood) {
      const ctx = buildFoodChatCtx(data.settings.tasteProfile, eatenToday, excl);
      sys = FOOD_SYS + (ctx.length ? "\n\uFF08" + ctx.join("\uFF1B") + "\uFF09" : "") + (forceFinal ? "\n\uFF08\u5BF9\u8BDD\u8F6E\u6B21\u5FEB\u5230\u4E0A\u9650\u4E86\uFF0C\u8BF7\u76F4\u63A5\u7ED9\u51FA\u6700\u7EC8\u63A8\u8350\u5E76\u628A final \u7F6E true\uFF09" : "");
    }
    return [
      { role: "system", content: sys },
      ...history.map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        // 历史轮把候选名一并带回，保证多轮收敛的连贯性
        content: m.text + (m.candidates?.length ? `\uFF08\u5019\u9009\uFF1A${m.candidates.map((c) => c.name).join("\u3001")}\uFF09` : "")
      }))
    ];
  };
  const askAI = (history, excl = excluded) => {
    void (async () => {
      const gen = ++genRef.current;
      setBusy(true);
      setStreamBuf("");
      let acc = "";
      const onDelta = (d) => {
        if (gen !== genRef.current) return;
        acc += d;
        if (isFood) return;
        const now = Date.now();
        if (now - lastFlushRef.current < 150) return;
        lastFlushRef.current = now;
        setStreamBuf(acc);
        scrollBottom();
      };
      await chatAIStream(buildMsgs(history, chatTurns.current >= 4, excl), onDelta).catch(() => {
      });
      if (gen !== genRef.current) return;
      let p;
      if (isFood) p = parseAIReply(acc);
      else if (looksLikeJsonProtocol(acc)) p = parseAIReply(acc);
      else p = { reply: acc.trim(), candidates: [], final: false };
      if (!p.reply) p.reply = "\uFF08\u7F51\u7EDC\u5F00\u5C0F\u5DEE\u4E86\uFF0C\u7A0D\u540E\u518D\u8BD5 \u{1F64F}\uFF09";
      if (isFood && chatTurns.current >= 4 && !p.final && p.candidates.length > 0) p.final = true;
      setMsgs((prev) => [
        ...prev,
        isFood ? { role: "ai", text: p.reply, candidates: p.candidates, final: p.final } : { role: "ai", text: p.reply }
      ]);
      setStreamBuf("");
      setBusy(false);
      scrollBottom();
    })();
  };
  const sendText = (raw, excl = excluded) => {
    const text = raw.trim();
    if (!text || busy) return;
    const history = [...msgs, { role: "user", text }];
    setMsgs(history);
    setInput("");
    chatTurns.current++;
    scrollBottom();
    askAI(history, excl);
  };
  const sendChat = () => sendText(input);
  const clearChat = () => {
    genRef.current++;
    chatTurns.current = 0;
    setBusy(false);
    setStreamBuf("");
    setExcluded([]);
    setInput("");
    if (isFood) {
      setMsgs([{ role: "user", text: opener() }]);
      askAI([{ role: "user", text: opener() }]);
    } else {
      setMsgs([{ role: "ai", text: GENERAL_WELCOME }]);
    }
    scrollBottom();
  };
  (0, import_react24.useEffect)(() => {
    if (inited.current || !ready) return;
    inited.current = true;
    if (isFood) {
      setMsgs([{ role: "user", text: opener() }]);
      askAI([{ role: "user", text: opener() }]);
    } else {
      setMsgs([{ role: "ai", text: GENERAL_WELCOME }]);
    }
  }, [ready]);
  (0, import_react24.useEffect)(() => {
    const onKb = (res) => {
      setKbH(res.height);
      scrollBottom();
    };
    stubs_default.onKeyboardHeightChange(onKb);
    return () => {
      stubs_default.offKeyboardHeightChange(onKb);
    };
  }, []);
  const feedTaste = (name, dir, picked = false) => {
    set("settings", (prev) => ({
      ...prev,
      tasteProfile: nextTasteProfile(data.foods, prev.tasteProfile, name, dir, picked)
    }));
  };
  const pickRec = (name) => {
    feedTaste(name, "liked", true);
    set("foodLog", (prev) => ({ ...prev, [today]: { ...prev[today], [slot]: name } }));
    showToast(`\u5DF2\u8BB0\u5F55\uFF1A\u4ECA\u5929${MEAL_SLOT_LABELS[slot]}\u5403\u300C${name}\u300D`);
    void stubs_default.navigateBack();
  };
  const addToPool = (name) => {
    set(
      "foods",
      (prev) => prev.some((x) => x.name === name) ? prev : [...prev, { id: uid(), name, emoji: "\u2728", slots: [slot], tags: [] }]
    );
    showToast(`\u5DF2\u628A\u300C${name}\u300D\u52A0\u5165${MEAL_SLOT_LABELS[slot]}\u5019\u9009\u6C60`);
  };
  const rejectCand = (name) => {
    if (busy) return;
    const nextExcluded = excluded.includes(name) ? excluded : [...excluded, name];
    feedTaste(name, "disliked");
    setExcluded(nextExcluded);
    sendText(`\u4E0D\u8981 ${name}`, nextExcluded);
  };
  if (!ready) {
    return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(View, { className: "page", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(View, { className: "card", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Text, { className: "sub", children: "\u52A0\u8F7D\u4E2D\u2026" }) }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(View, { className: "ai-chat-page", children: [
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(View, { className: "chat-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Icon, { name: "chat", size: 16, gap: 4 }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Text, { className: "grow", children: isFood ? `\u667A\u80FD\u5E2E\u6211\u60F3 \xB7 ${MEAL_SLOT_LABELS[slot]}` : "\u5C0F\u52A9\u624B" }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(View, { className: "chat-close", onClick: clearChat, children: [
        /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Icon, { name: "trash", size: 12, gap: 4 }),
        /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Text, { children: "\u6E05\u7A7A\u5BF9\u8BDD" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
      ScrollView,
      {
        scrollY: true,
        className: "chat-body ai-chat-body",
        scrollTop: 1e5 + scrollTick,
        style: { paddingBottom: `${14 + kbH}px` },
        children: [
          msgs.map((m, i) => {
            const cands = m.candidates ?? [];
            const live = isFood && m.role === "ai" && !busy && i === msgs.length - 1;
            return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(View, { id: `chat-msg-${i}`, className: `chat-msg ${m.role}`, children: [
              /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Text, { className: "bubble", children: m.text }),
              cands.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(View, { className: "chat-cands", children: cands.map((c) => /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(View, { className: `chat-cand${live ? "" : " done"}`, children: [
                /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(View, { className: "grow", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Text, { className: "chat-cand-name", children: c.name }),
                  c.reason ? /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Text, { className: "chat-cand-reason", children: c.reason }) : null
                ] }),
                live && /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(View, { className: "chat-cand-btns", style: { flexWrap: "wrap", justifyContent: "flex-end" }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(View, { className: "btn small", onClick: () => pickRec(c.name), children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Text, { children: "\u5C31\u5403\u5B83 \u{1F37D}" }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(View, { className: "btn ghost small", onClick: () => addToPool(c.name), children: [
                    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Icon, { name: "plus", size: 12, gap: 4 }),
                    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Text, { children: "\u5165\u6C60" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(View, { className: "btn ghost small", onClick: () => rejectCand(c.name), children: [
                    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Icon, { name: "x", size: 12, gap: 4 }),
                    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Text, { children: "\u4E0D\u8981" })
                  ] })
                ] })
              ] }, c.name)) }),
              live && m.final && cands.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
                View,
                {
                  className: "btn chat-pick",
                  style: { padding: "11px 26px", fontSize: 16, fontWeight: 700 },
                  onClick: () => pickRec(cands[0].name),
                  children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Text, { children: "\u5C31\u5403\u8FD9\u4E2A\uFF01\u{1F37D}" })
                }
              )
            ] }, i);
          }),
          busy && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(View, { className: "chat-msg ai", children: streamBuf ? (
            // 流式空气泡：已收到的回复逐段上屏
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Text, { className: "bubble", children: streamBuf })
          ) : (
            // 还没吐字时：打字三点（food 模式内部累积协议，全程只显示打字点）
            /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(View, { className: "bubble chat-typing", children: [
              /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(View, { className: "dot" }),
              /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(View, { className: "dot" }),
              /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(View, { className: "dot" })
            ] })
          ) })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(View, { className: "chat-input", style: { transform: `translateY(-${kbH}px)`, transition: "transform .2s ease" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
        Input,
        {
          placeholder: isFood ? chatTurns.current >= 4 ? "\u518D\u8BF4\u4E00\u53E5\uFF0C\u5C0F\u52A9\u624B\u5C31\u8981\u62CD\u677F\u4E86\u2026" : "\u5982\uFF1A\u6362\u4E00\u6279 / \u6E05\u6DE1\u4E00\u70B9 / \u7C73\u996D / \u884C" : "\u968F\u4FBF\u95EE\u70B9\u5907\u8003\u3001\u5B66\u4E60\u3001\u751F\u6D3B\u7684\u4E8B\u2026",
          value: input,
          adjustPosition: false,
          onInput: (e) => setInput(e.detail.value),
          onConfirm: sendChat,
          confirmType: "send"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(View, { className: `btn${!input.trim() || busy ? " is-disabled" : ""}`, onClick: sendChat, children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Text, { children: "\u53D1\u9001" }) })
    ] })
  ] });
}

// scripts/smoke/entry.jsx
var pages = {
  Today,
  Courses,
  Checkin,
  Life,
  Settings,
  Food,
  Ledger,
  LedgerCats,
  LedgerSearch,
  Todos,
  Periodic,
  Dates,
  Notes,
  Wrongbook: WrongBook,
  Pomodoro,
  MoodHistory,
  PomoLogs,
  SettingsSub,
  AiChat
};
var scenarios = ["defaults", "full", "serverish", "nulls", "dirty"];
console.log("==== A. mergeWithDefaults \u81EA\u8EAB\u5065\u58EE\u6027 ====");
for (const s of scenarios) {
  setScenario(s);
  try {
    const out = mergeWithDefaults(buildRaw());
    const bad = Object.keys(out).filter((k) => out[k] === null || out[k] === void 0);
    console.log("MERGE OK  ", s.padEnd(9), bad.length ? "\u6B8B\u7559\u7A7A\u5B57\u6BB5: " + bad.join(",") : "\u5168\u90E8\u6709\u503C");
  } catch (e) {
    console.log("MERGE FAIL", s.padEnd(9), String(e && e.message || e));
    console.log("   " + String(e && e.stack || e).split("\n").slice(0, 4).join("\n   "));
  }
}
console.log("==== B. \u9875\u9762\u6E32\u67D3\uFF08\u6570\u636E\u7ECF mergeWithDefaults\uFF09 ====");
var failCount = 0;
for (const s of scenarios) {
  for (const name of Object.keys(pages)) {
    setScenario(s);
    const Comp = pages[name];
    try {
      const html = (0, import_server.renderToString)(import_react25.default.createElement(Comp));
      console.log("OK  ", s.padEnd(9), name.padEnd(13), "len=" + html.length);
    } catch (e) {
      failCount++;
      console.log("FAIL", s.padEnd(9), name.padEnd(13), String(e && e.message || e));
      console.log("   " + String(e && e.stack || e).split("\n").slice(0, 5).join("\n   "));
    }
  }
}
console.log(failCount ? `==== \u5171 ${failCount} \u4E2A\u6E32\u67D3\u5931\u8D25 ====` : "==== \u5168\u90E8\u9875\u9762\u6E32\u67D3\u901A\u8FC7 ====");
