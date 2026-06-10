// Volume Profile - Volume distribution analysis
// Author: Tentacle OS

import { Logger } from '../../../src/core/utils/Logger';

const logger = new Logger('VolumeProfile');

export interface VolumeLevel {
  price: number;
  volume: number;
  bidVolume: number;
  askVolume: number;
}

export interface VolumeAnalysis {
  poc: number;
  vah: number;
  val: number;
  valueArea: number;
  anomalies: VolumeLevel[];
}

export class VolumeProfile {
  analyze(ohlcv: { price: number; volume: number }[]): VolumeAnalysis {
    const levels = this.buildVolumeByPrice(ohlcv);
    const sorted = [...levels].sort((a, b) => b.volume - a.volume);

    const poc = sorted[0]?.price || 0;
    const totalVolume = levels.reduce((sum, l) => sum + l.volume, 0);
    const valueAreaTarget = totalVolume * 0.7;

    let valueAreaVolume = 0;
    const valueAreaLevels: VolumeLevel[] = [];

    for (const level of sorted) {
      valueAreaLevels.push(level);
      valueAreaVolume += level.volume;
      if (valueAreaVolume >= valueAreaTarget) break;
    }

    const prices = valueAreaLevels.map(l => l.price);
    const vah = Math.max(...prices);
    const val = Math.min(...prices);

    const anomalies = levels.filter(l => l.volume > (totalVolume / ohlcv.length) * 3);

    return {
      poc,
      vah,
      val,
      valueArea: valueAreaVolume,
      anomalies
    };
  }

  private buildVolumeByPrice(data: { price: number; volume: number }[]): VolumeLevel[] {
    const map = new Map<number, number>();
    
    for (const d of data) {
      const rounded = Math.round(d.price * 100) / 100;
      map.set(rounded, (map.get(rounded) || 0) + d.volume);
    }

    return Array.from(map.entries()).map(([price, volume]) => ({
      price,
      volume,
      bidVolume: volume * 0.5,
      askVolume: volume * 0.5
    }));
  }

  close(): void {}
}