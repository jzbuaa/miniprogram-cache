import { ICacheEntity } from "./ICacheEntity";

export function extractEntity(entity: ICacheEntity): any {
    if (!entity) {
        return undefined;
    }
    if (entity.expiresAt > 0) {
        if (entity.expiresAt < Date.now()) {
            return undefined;
        } else {
            return entity.value;
        }
    } else {
        return entity.value;
    }
}

export function packEntity(value: any, expiresAt?: Date): ICacheEntity {
    const entity: ICacheEntity = {
        value: value,
        expiresAt: expiresAt ? expiresAt.getTime() : -1
    };
    return entity;
}

export function getKey(key: string, prefix: string): string {
    if (key.startsWith(prefix)) {
        throw new Error(`invalid key, must not starts with ${prefix}`);
    }

    if (!key) {
        throw new Error("invalid key");
    }

    return prefix + key;
}

export function copy(value: any): any {
    if (null == value || "object" != typeof value) return value;

    let c: any;
    // Handle Date
    if (value instanceof Date) {
        c = new Date();
        c.setTime(value.getTime());
        return c;
    }

    // Handle Array
    if (value instanceof Array) {
        c = [];
        for (var i = 0, len = value.length; i < len; i++) {
            c[i] = copy(value[i]);
        }
        return c;
    }

    // Handle Object
    if (value instanceof Object) {
        // keep the data type by Object.create()
        c = Object.create(value);
        for (let attr in value) {
            if (value.hasOwnProperty(attr)) {
                c[attr] = copy(value[attr]);
            }
        }
        return c;
    }

    throw new Error(`Unsupported type found when copy object ${typeof value}.`);
}
