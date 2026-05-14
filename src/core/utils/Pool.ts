export class Pool<T> {
    private items: T[] = [];
    private factory: () => T;

    constructor(factory: () => T) {
        this.factory = factory;
    }

    public acquire(): T {
        return this.items.length > 0 ? this.items.pop()! : this.factory();
    }

    public release(item: T) {
        this.items.push(item);
    }
}
