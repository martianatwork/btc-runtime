import { MemorySlotData } from './MemorySlot';
import { u256 } from 'as-bignum/assembly';
import { Uint8ArrayMerger } from './Uint8ArrayMerger';

@final
export class MultiAddressMemoryMap<
    K extends Uint8Array,
    K2 extends Uint8Array,
    V extends MemorySlotData<u256>,
> extends Map<K, Uint8ArrayMerger<V>> {
    public pointer: u16;

    constructor(
        pointer: u16,
        private readonly defaultValue: V,
    ) {
        super();

        this.pointer = pointer;
    }

    public get(key: K): Uint8ArrayMerger<V> {
        this.createKeyMerger(key);

        return super.get(key);
    }

    public setUpperKey(key: K, key2: K2, value: V): this {
        this.createKeyMerger(key);

        const subMap = super.get(key);
        if (subMap) {
            subMap.set(key2, value);
        }

        return this;
    }

    public set(key: K, value: Uint8ArrayMerger<V>): this {
        this.createKeyMerger(key);

        return <this>super.set(key, value);
    }

    public has(key: K): bool {
        return super.has(key);
    }

    public delete(key: K): bool {
        return super.delete(key);
    }

    public clear(): void {
        super.clear();
    }

    private createKeyMerger(key: K): void {
        if (!super.has(key)) {
            super.set(key, new Uint8ArrayMerger<V>(key, this.pointer, this.defaultValue));
        }
    }
}
