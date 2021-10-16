"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transform = void 0;

var _lodash = require("lodash");

var _flat = require("flat");

var PbTransformer = function PbTransformer(data, mapping, transformations) {
  return {
    safeGetValue: function safeGetValue(obj, key) {
      if ((0, _lodash.isNil)(key)) {
        return null;
      }

      return (0, _lodash.get)(obj, key);
    },
    safeSetValue: function safeSetValue(obj, key, value) {
      if ((0, _lodash.isNil)(key)) {
        return null;
      }

      (0, _lodash.set)(obj, key, value);
    },
    transform: function transform() {
      var _this = this;

      var transformed = {};
      var flattened = (0, _flat.flatten)(mapping);
      Object.keys(flattened).forEach(function (key) {
        if (!(0, _lodash.isNil)(key) && !(0, _lodash.isNil)(_this.safeGetValue(data, flattened[key]))) {
          _this.safeSetValue(transformed, key, _this.safeGetValue(data, flattened[key]));
        } else {
          delete flattened[key];
        }
      });
      return transformed;
    },
    postprocess: function postprocess(data, transformations) {
      (0, _lodash.each)(transformations, (0, _lodash.bind)(function (method) {
        this.safeSetValue(data, method.on, method.transformation(this.safeGetValue(data, method.on)));
      }, this));
      return data;
    },
    run: function run() {
      return new Promise(function (resolve, reject) {
        try {
          var transformed = this.transform();
          this.postprocess(transformed, transformations);
          resolve(transformed);
        } catch (err) {
          reject(err);
        }
      }.bind(this));
    }
  };
};

var transform = function transform(data, mapping, transformations) {
  return PbTransformer(data, mapping, transformations).run();
};

exports.transform = transform;