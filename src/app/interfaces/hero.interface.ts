/**
 * Hero interface
 * Describe base parameters
 */
export interface HeroInterface {
  id: number;
  name: string;
  health: number;
  weaponId?: number;
  armourId?: number;
  imageSrc?: string;
}

/**
 * Extended interface for heroes, needs to contain additional data for fights
 * @todo I want purpose work with models instead interfaces, it gives possibility to encapsulate some logic
 */
export interface HeroExtendedInterface extends HeroInterface {
  attackDamage: number;
  remainingEnergy: number;
}
