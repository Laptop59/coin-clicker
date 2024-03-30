import Game from "./Game";

/**
 * Describles a type of the effect.
 */
enum EffectType {
    FRENZY = 'frenzy',
    SUPER_FRENZY = 'superFrenzy'
}

/**
 * A class that represents an effect.
 */
class Effect {
    /**
     * The type of the effect.
     */
    type: EffectType;

    /**
     * The duration of the effect in seconds.
     */
    duration: number;

    /**
     * A reference to the game object.
     */
    game: Game;

    /**
     * Creates a new effect.
     * @param type The type of the effect.
     * @param duration The duration of the effect (max). Can be null for automatic infering of max duration.
     * @param game A reference to the game object.
     */
    constructor(type: EffectType, duration: number | null = null, game: Game) {
        this.type = type;
        this.duration = duration || this.maxDuration;
        this.game = game;
    }

    /**
     * This getter function is called to infer the max duration.
     */
    get maxDuration() {
        switch (this.type) {
            case EffectType.FRENZY:
                return 15;
            case EffectType.SUPER_FRENZY:
                return 10;
        }
    }

    /**
     * Function called to tick the effect.
     * @param delta Amount of time in seconds passed since last time.
     */
    tick(delta: number) {
        this.duration -= delta;
    }

    /**
     * Effect multiplier due to the effect.
     * @returns The multiplier made by the effect.
     */
    getEffect(): number {
        if (this.expired) return 1;

        switch (this.type) {
            case EffectType.FRENZY:
                return 8;

            case EffectType.SUPER_FRENZY:
                return 88;
        }
    }

    /**
     * The icon of the effect.
     * @returns Icon of the effect.
     */
    getIcon(): [number, number] {
        switch (this.type) {
            case EffectType.FRENZY:
                return [0, 0];
            
            case EffectType.SUPER_FRENZY:
                return [1, 0];
        }
    }

    /**
     * The information about the effect.
     * @returns Information about the effect.\
     * `[(name of the effect displayed), (description of the effect)]`
     */
    getMeta(): [string, string] {
        switch (this.type) {
            case EffectType.FRENZY:
                return ["Frenzy",
                "Increases your production by <b>700%</b>"];
            case EffectType.SUPER_FRENZY:
                return ["Super Frenzy",
                "Increases your production by <b>8,700%</b>"];
        }
    }

    /**
     * Percentage duration of the effect in the interval [0,1]
     */
    get percentageDuration() {
        return this.duration / this.maxDuration;
    }

    /**
     * Property to check if the effect has expired.
     */
    get expired() {
        return this.duration <= 0;
    }
}

export {
    Effect as default,
    EffectType
}