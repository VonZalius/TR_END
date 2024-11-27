const components = {};

export function registerComponent(key, callback) {
    if (typeof callback !== 'function') {
        console.error(`registerComponent expects a function for key ${key}`);
        return;
    }
    components[key] = callback;
}

export function refreshComponent(key) {
    if (components[key]) {
        components[key]();
    } else {
        console.error(`Component ${key} not found.`);
    }
}
