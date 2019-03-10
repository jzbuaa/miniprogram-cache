import { ICache } from "./ICache";
import { ICacheEntity } from "./ICacheEntity";
import { getKey, extractEntity, packEntity } from "./Utils";

export class WxLocalStorage implements ICache {
    private readonly prefix: string = "$local:";

    private static _default: WxLocalStorage = new WxLocalStorage();
    public static get Default(): WxLocalStorage {
        return this._default;
    }

    public async set(
        key: string,
        value: any,
        expiresAt?: Date
    ): Promise<void> {
        if (value === undefined) {
            throw new Error("invalid value, must not be undefined");
        }

        const sKey = getKey(key, this.prefix);
        const entity: ICacheEntity = packEntity(value, expiresAt);

        return new Promise<void>((resolve, reject) => {
            wx.setStorage({
                key: sKey,
                data: entity,
                success: () => {
                    return resolve();
                },
                fail: err => {
                    return reject(err);
                }
            });
        });
    }

    public async get(key: string, removeAfter?: boolean): Promise<any> {
        const sKey = getKey(key, this.prefix);
        return new Promise<any>((resolve, reject) => {
            wx.getStorage({
                key: sKey,
                success: (data: any) => {
                    const result = extractEntity(data.data as ICacheEntity);
                    /// only remove when success.
                    if (removeAfter === true) {
                        wx.removeStorageSync(sKey);
                    }
                    return resolve(result);
                },
                fail: err => {
                    if(err.errMsg == "getStorage:fail data not found"){
                        return resolve(undefined);
                    }
                    return reject(err);
                }
            });
        });
    }

    public remove(key: string): Promise<void> {
        const sKey = getKey(key, this.prefix);
        return new Promise<void>((resolve, reject) => {
            wx.removeStorage({
                key: sKey,
                success: () => {
                    return resolve();
                },
                fail: err => {
                    return reject(err);
                }
            });
        });
    }
}

declare namespace wx {
    namespace setStorage {
        type Param = {
            /**
             * 本地缓存中的指定的 key
             */
            key: string;
            /**
             * 需要存储的内容
             */
            data: any | string;
            /**
             * 接口调用成功的回调函数
             */
            success?: ParamPropSuccess;
            /**
             * 接口调用失败的回调函数
             */
            fail?: ParamPropFail;
            /**
             * 接口调用结束的回调函数（调用成功、失败都会执行）
             */
            complete?: ParamPropComplete;
        };
        /**
         * 接口调用成功的回调函数
         */
        type ParamPropSuccess = (res: any) => any;
        /**
         * 接口调用失败的回调函数
         */
        type ParamPropFail = (err: any) => any;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        type ParamPropComplete = () => any;
    }
    /**
     * 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口。
     *
     * **示例代码：**
     *
     *     ```javascript
     *     wx.setStorage({
     *       key:"key",
     *       data:"value"
     *     })
     *     ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxsetstorageobject
     */
    function setStorage(OBJECT: setStorage.Param): void;
    /**
     * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。
     *
     * **参数说明：**
     *
     *     ```javascript
     *     try {
     *     	wx.setStorageSync('key', 'value')
     *     } catch (e) {
     *     }
     *     ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxsetstoragesynckeydata
     */
    function setStorageSync(key: string, data: any | string): void;

    namespace getStorage {
        type Param = {
            /**
             * 本地缓存中的指定的 key
             */
            key: string;
            /**
             * 接口调用的回调函数,res = {data: key对应的内容}
             */
            success: ParamPropSuccess;
            /**
             * 接口调用失败的回调函数
             */
            fail?: ParamPropFail;
            /**
             * 接口调用结束的回调函数（调用成功、失败都会执行）
             */
            complete?: ParamPropComplete;
        };
        /**
         * 接口调用的回调函数,res = {data: key对应的内容}
         */
        type ParamPropSuccess = (res: ParamPropSuccessParam) => any;
        type ParamPropSuccessParam = {
            /**
             * key对应的内容
             */
            data: string;
        };
        /**
         * 接口调用失败的回调函数
         */
        type ParamPropFail = (err: any) => any;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        type ParamPropComplete = () => any;
    }
    /**
     * 从本地缓存中异步获取指定 key 对应的内容。
     *
     * **示例代码：**
     *
     *     ```javascript
     *     wx.getStorage({
     *       key: 'key',
     *       success: function(res) {
     *       	console.log(res.data)
     *       }
     *     })
     *     ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxgetstorageobject
     */
    function getStorage(OBJECT: getStorage.Param): void;

    /**
     * 从本地缓存中同步获取指定 key 对应的内容。
     *
     * **示例代码：**
     *
     *     ```javascript
     *     try {
     *       var value = wx.getStorageSync('key')
     *       if (value) {
     *       	// Do something with return value
     *       }
     *     } catch (e) {
     *       // Do something when catch error
     *     }
     *     ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxgetstoragesynckey
     */
    function getStorageSync(key: string): any | undefined;
    namespace removeStorage {
        type Param = {
            /**
             * 本地缓存中的指定的 key
             */
            key: string;
            /**
             * 接口调用的回调函数
             */
            success: ParamPropSuccess;
            /**
             * 接口调用失败的回调函数
             */
            fail?: ParamPropFail;
            /**
             * 接口调用结束的回调函数（调用成功、失败都会执行）
             */
            complete?: ParamPropComplete;
        };
        /**
         * 接口调用的回调函数
         */
        type ParamPropSuccess = (res: any) => any;
        /**
         * 接口调用失败的回调函数
         */
        type ParamPropFail = (err: any) => any;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        type ParamPropComplete = () => any;
    }
    /**
     * 从本地缓存中异步移除指定 key 。
     *
     * **示例代码：**
     *
     *     ```javascript
     *     wx.removeStorage({
     *       key: 'key',
     *       success: function(res) {
     *         console.log(res.data)
     *       }
     *     })
     *     ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxremovestorageobject
     */
    function removeStorage(OBJECT: removeStorage.Param): void;

    /**
     * 从本地缓存中同步移除指定 key 。
     *
     * **示例代码：**
     *
     *     ```javascript
     *     try {
     *       wx.removeStorageSync('key')
     *     } catch (e) {
     *       // Do something when catch error
     *     }
     *     ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data.html#wxremovestoragesynckey
     */
    function removeStorageSync(key: string): void;
}
