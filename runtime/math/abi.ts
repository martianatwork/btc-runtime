// SO IN TYPESCRIPT, WE CAN NOT USE TWO METHOD WITH THE SAME NAME. SO NOT ADDING THE TYPE TO THE HASH IS A DESIGN CHOICE.
import { bytes32, bytes4 } from './bytes';
import { MemorySlotPointer } from '../memory/MemorySlotPointer';
import { Sha256 } from './sha256';

export type Selector = u32;

export function encodeSelector(name: string): Selector {
    const typed = Uint8Array.wrap(String.UTF8.encode(name));
    const hash = Sha256.hash(typed);

    return bytes4(hash);
}

export function encodePointer(uniqueIdentifier: u16, typed: Uint8Array): MemorySlotPointer {
    const hash = Sha256.hash(typed);

    const finalPointer = new Uint8Array(32);
    finalPointer[0] = uniqueIdentifier & 0xff;
    finalPointer[1] = (uniqueIdentifier >> 8) & 0xff;

    for (let i = 0; i < 30; i++) {
        // drop the last two bytes
        finalPointer[i + 2] = hash[i];
    }

    return bytes32(finalPointer);
}
