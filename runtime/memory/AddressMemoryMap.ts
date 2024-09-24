import { MemorySlotPointer } from './MemorySlotPointer';
import { Blockchain } from '../env';
import { encodePointer } from '../math/abi';
import { MemorySlotData } from './MemorySlot';
import { BigInt } from '../libraries/BigInt';

@final
export class AddressMemoryMap<K extends string, V extends MemorySlotData<BigInt>> {
    public pointer: u16;

    constructor(
        pointer: u16,
        private readonly defaultValue: V,
    ) {
        this.pointer = pointer;
    }

    public set(key: K, value: V): this {
        const keyHash: MemorySlotPointer = encodePointer(key);
        Blockchain.setStorageAt(this.pointer, keyHash, value);

        return this;
    }

    public get(key: K): MemorySlotData<BigInt> {
        return Blockchain.getStorageAt(this.pointer, encodePointer(key), this.defaultValue);
    }

    public has(key: K): bool {
        return Blockchain.hasStorageAt(this.pointer, encodePointer(key));
    }

    @unsafe
    public delete(key: K): bool {
        this.set(key, this.defaultValue);

        return true;
    }

    @unsafe
    public clear(): void {
        throw new Error('Method not implemented.');
    }
}
