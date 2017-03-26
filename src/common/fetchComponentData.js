/**
 * Created by Alexander Sveshnikov on 23/11/16.
 */

/**
 * This looks at static needs parameter in components and waits for the promise to be fullfilled
 * It is used to make sure server side rendered pages wait for APIs to resolve before returning res.end()
 */
export function fetchComponentData(dispatch, components, params) {
    const needs = components.reduce( (prev, current) => {
        return Object.keys(current).reduce( (acc, key) => {
            return current[key].hasOwnProperty('needs') ? current[key].needs.concat(acc) : acc
        }, prev)

    }, []);
    const promises = needs.map(need => dispatch(need(params)));
    return Promise.all(promises);
}


// for client side use, let each component trigger it's fetching data logics
// might as well to add in dupe check to avoid fetching when data is already there
export function fetchNeeds( needs, props ){
    const { params, dispatch } = props;
    needs.map( need => dispatch(need(params)) )
}
