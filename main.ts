namespace customAI {

    // -------------------------
    // WANDERING TRADER
    // -------------------------
    export class WanderingTrader extends sprites.ExtendableSprite {
        speed: number = 20

        constructor(img: Image) {
            super(img)
            this.setKind(SpriteKind.Enemy)
            this.setStayInScreen(true)

            game.onUpdateInterval(800, () => {
                this.wander()
            })
        }

        wander() {
            // pick random direction
            let vx = randint(-this.speed, this.speed)
            let vy = randint(-this.speed, this.speed)
            this.vx = vx
            this.vy = vy
        }
    }

    // -------------------------
    // BOUNCING AI
    // -------------------------
    export class BouncingAI extends sprites.ExtendableSprite {

        constructor(img: Image) {
            super(img)
            this.setKind(SpriteKind.Food)

            this.vx = randint(-60, 60)
            this.vy = randint(-60, 60)

            this.setBounceOnWall(true)

            game.onUpdate(() => {
                this.keepMoving()
            })
        }

        keepMoving() {
            // slowly change direction (gives “AI feel”)
            if (Math.percentChance(5)) {
                this.vx += randint(-20, 20)
                this.vy += randint(-20, 20)
            }
        }
    }

    // -------------------------
    // SPAWN FUNCTIONS
    // -------------------------
    export function spawnTrader(img: Image) {
        let t = new WanderingTrader(img)
        t.setPosition(randint(10, 150), randint(10, 110))
        return t
    }

    export function spawnBouncer(img: Image) {
        let b = new BouncingAI(img)
        b.setPosition(randint(10, 150), randint(10, 110))
        return b
    }
}
