class Effect {
    type;
    duration;
    maxDuration;
    game;

    constructor(type, duration = 60, game) {
        this.type = type;
        this.duration = duration;
        this.maxDuration = duration;
        this.game = game;
    }

    tick(delta) {
        this.duration -= delta;
    }

    getEffect() {
        if (this.expired) return 1;

        switch (this.type) {
            case "frenzy":
                return 8;

            case "superFrenzy":
                return 88;
        }
    }

    get percentageDuration() {
        return this.duration / this.maxDuration;
    }

    get expired() {
        return this.duration <= 0;
    }
}

export default Effect;