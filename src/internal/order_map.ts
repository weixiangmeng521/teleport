// Order map
export class OrderMap<K, V> {
    private map: Map<K, V>;
    private keys: K[];

    constructor() {
        this.map = new Map<K, V>();
        this.keys = [];
    }

    // Add key-value pairs to the OrderMap
    public set(key: K, value: V): void {
        if (!this.map.has(key)) {
            this.keys.push(key);
        }
        this.map.set(key, value);
    }

    // Get the value by key
    public get(key: K): V | undefined {
        return this.map.get(key);
    }

    // Check if the OrderMap contains a specific key
    public has(key: K): boolean {
        return this.map.has(key);
    }

    // Get the array of keys in the OrderMap
    public keysArray(): K[] {
        return this.keys.slice();
    }

    // Get the array of values in the OrderMap
    public valuesArray(): V[] {
        return this.keys.map(key => this.map.get(key)!);
    }

    // Get the array of key-value pairs in the OrderMap
    public entriesArray(): [K, V][] {
        return this.keys.map(key => [key, this.map.get(key)!]);
    }

    // Delete the key-value pair with the specified key
    public delete(key: K): boolean {
        const index = this.keys.indexOf(key);
        if (index !== -1) {
            this.keys.splice(index, 1);
            return this.map.delete(key);
        }
        return false;
    }

    // Clear the OrderMap
    public clear(): void {
        this.map.clear();
        this.keys = [];
    }

    // Get the size of the OrderMap
    public size(): number {
        return this.keys.length;
    }
}






// manage the group event
export class GroupEventStateManage extends OrderMap<string|symbol, any>{

    private _triggeredTimes = 0;

    private _threshold = 0;


    constructor(){
        super();
    }

    public setEventsOrder(list:(symbol|string)[]){
        list.forEach((event) => {
            this.set(event, undefined);
        });
        this._threshold = list.length;
    }


    public setState(key:string|symbol, value:any){
        this.set(key, value);
        this._triggeredTimes++;
    }


    public getState<T>(key:string):T|undefined{
        return this.get(key);
    }


    public getStateValuesList(){
        return this.valuesArray();
    }


    protected _isReachedOrOverThreshold(){
        return this._triggeredTimes >= this._threshold; 
    }


    public reset(){
        this._triggeredTimes = 0;
        this._threshold = 0;
        this.clear();
    }



}