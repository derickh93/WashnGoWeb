/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isIsomorphic = function (s, t) {
  let map = new Map();
  let counter = 0;
  while (counter < s.length) {
    map.set(s.charAt(counter),t.charAt(counter));
  }
  console.log(map);
};

let s = "egg";
let t = "add";

isIsomorphic(s, t);
