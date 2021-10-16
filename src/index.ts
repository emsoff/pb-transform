import { get, set, isNil, each, map, bind } from 'lodash';
import { flatten } from 'flat'

const PbTransformer = (data, mapping, transformations) => {
    return {
        safeGetValue: function(obj, key) {
            if (isNil(key)) {
                return null;
            }
            return get(obj, key);
        },
        safeSetValue: function(obj, key, value) {
            if (isNil(key)) {
                return null;
            }
            set(obj, key, value)
        },
        transform: function() {
            const transformed = {}
            let flattened = flatten(mapping)            
            Object.keys(flattened).forEach((key) => {
                if( !isNil(key) && !isNil(this.safeGetValue(data, flattened[key]))) {
                    this.safeSetValue(transformed, key, this.safeGetValue(data, flattened[key]))
                } else {
                    delete flattened[key]
                }
            });
            return transformed
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