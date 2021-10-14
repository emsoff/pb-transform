import { get, set, isNil, each, map, bind } from 'lodash';
import { flatten } from 'flat'

const PbTransformer = (data, mapping, transformations) => {
    return {
        safeGetValue: function(obj, key) {
            if (isNil(key)) {
                return obj;
            }
            return get(obj, key);
        },
        safeSetValue: function(obj, key, value) {
            if (isNil(key)) {
                return;
            }
            set(obj, key, value)
        },
        postprocess: function(data, transformations) {
            each(transformations, bind(function (method) {
                    this.safeSetValue(
                        data,
                        method.on,
                        method.transformation(this.safeGetValue(data, method.on))
                    );
                }, this)
            );
            return data;
        },
        transform: function() {
            const transformed = {}
            let flattened = flatten(mapping)            
            Object.keys(flattened).forEach((key) => {
                if( !isNil(key) && !isNil(flattened[key])) {
                    this.safeSetValue(transformed, key, this.safeGetValue(data, flattened[key]))
                }
            });
            return transformed
        },
        run: function () {
            return new Promise(
                function (resolve, reject) {
                    try {       
                        const transformed = this.transform()
                        this.postprocess(transformed, transformations)
                        resolve(transformed)
                    } catch (err) {
                        reject(err);
                    }
                }.bind(this)
            )
        },

    };
};

export const transform = (data, mapping, transformations) => {
    return PbTransformer(data, mapping, transformations).run();
}