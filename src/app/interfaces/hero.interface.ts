export interface HeroInterface {
  id: number;
  name: string;
  health: number;
  weaponId?: number;
  armourId?: number;
  imageSrc?: string;
}

// ToDo better use model
export interface HeroExtendedInterface extends HeroInterface {
  attackDamage: number;
  remainingEnergy: number;
}
