
export interface CanAttack {
  attackPower: number;
  attackFrequency: number;

  attack: (...args: any) => void;
}
