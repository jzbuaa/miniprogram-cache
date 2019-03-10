import { ICache } from "./ICache";
import { ICacheEntity } from "./ICacheEntity";
import { extractEntity, packEntity, copy } from "./Utils";

interface Map{
    [index: string]: any;
}

export class MemoryCache implements ICache
{
    private readonly mem: Map = {};

    private static _default: MemoryCache = new MemoryCache();
    public static get Default(): MemoryCache
    {
        return this._default;
    }
    
    public async set(key: string, value: any, expiresAt?: Date): Promise<void>
    {
        if(!key)
        {
            throw new Error("invalid key");
        }
        const entity: ICacheEntity = packEntity(copy(value), expiresAt);
        this.mem[key] = entity;
    }

    public async get(key: string, removeAfter?: boolean): Promise<any>
    {
        if(!key)
        {
            throw new Error("invalid key");
        }
        const entity: ICacheEntity = this.mem[key];
        if(removeAfter)
        {
            this.mem[key] = undefined;
        }
        return copy(extractEntity(entity));
    }

    public async remove(key: string): Promise<void>
    {
        if(!key)
        {
            throw new Error("invalid key");
        }
        this.mem[key] = undefined;
    }
}