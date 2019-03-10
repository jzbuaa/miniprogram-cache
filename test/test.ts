

import { assert, expect, should } from "chai";
import { MemoryCache } from "../src/MemoryCache";

class Dummy{
    public n: number;
    public s: string;
    public d: Date;
    public a: Array<any>;

    private _b: number;

    public constructor(n: number, s: string, d: Date, a: Array<any>){
        this.n = n;
        this.s = s;
        this.d = d;
        this.a = a;

        this._b = 0;
    }

    public setB(b: number){
        this._b = b;
    }

    public getB(){
        return this._b;
    }
}

describe("MemoryCache", ()=>{
    it("modify object after set cache", async ()=>{
        const date = new Date();
        let d = new Dummy(1, "2", date, [1, "2"]);
        d.setB(11);
        await MemoryCache.Default.set("obj1", d);

        d.setB(22);
        d.n = 101;
        d.a = [];
        d.s = "";
        d.d = new Date();

        let d2: Dummy = await MemoryCache.Default.get("obj1");

        expect(d2.n).to.equals(1);
        expect(d2.s).to.equals("2");
        expect(d2.d.getTime()).to.equals(date.getTime());
        expect(d2.a.length).equals(2);
        expect(d2.getB()).to.equals(11);
    });

    it("modify object after get cache",async()=>{
        const date = new Date();
        let d = new Dummy(1, "2", date, [1, "2"]);
        d.setB(11);
        await MemoryCache.Default.set("obj2", d);

        let d2: Dummy = await MemoryCache.Default.get("obj2");
        d2.setB(22);
        d2.n = 101;
        d2.a = [];
        d2.s = "";
        d2.d = new Date();

        let d3: Dummy = await MemoryCache.Default.get("obj2");

        expect(d3.n).to.equals(1);
        expect(d3.s).to.equals("2");
        expect(d3.d.getTime()).to.equals(date.getTime());
        expect(d3.a.length).equals(2);
        expect(d3.getB()).to.equals(11);
    });

});