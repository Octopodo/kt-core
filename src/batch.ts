function createBatchJob(
    collection: any[],
    method: (...args: any[]) => any,
    ...args: any[]
) {
    return function () {
        let results: any[] = [];
        for (let i = 0, len = collection.length; i < len; i++) {
            results.push(method.apply(collection[i], args));
        }
        return results;
    };
}
