class Effect {
    type;
    duration;
    game;

    constructor(type, duration = 60, game) {
        this.type = type;
        this.duration = duration;
        this.game = game;
    }

    get maxDuration() {
        switch (this.type) {
            case "frenzy":
                return 30;
            case "superFrenzy":
                return 20;
        }
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

    getIcon() {
        switch (this.type) {
            case "frenzy":
                return [0, 0];
            
            case "superFrenzy":
                return [1, 0];
        }
    }

    getMeta() {
        switch (this.type) {
            case "frenzy":
                return ["Frenzy",
                "Increases your production by <b>700%</b>"];
            case "superFrenzy":
                return ["Super Frenzy",
                "Increases your production by <b>8,700%</b>"]
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