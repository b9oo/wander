namespace minecraftNPC {

    // =========================
    // 💰 EMERALD SYSTEM
    // =========================
    let emeralds = 0

    export function addEmeralds(amount: number) {
        emeralds += amount
    }

    export function removeEmeralds(amount: number) {
        emeralds = Math.max(0, emeralds - amount)
    }

    export function getEmeralds(): number {
        return emeralds
    }

    // =========================
    // 💬 DIALOGUE SYSTEM
    // =========================
    export function showDialogue(text: string, duration: number = 2000) {
        game.showLongText(text, DialogLayout.Bottom)
        pause(duration)
    }

    // =========================
    // 🧑‍🌾 PROFESSIONS
    // =========================
    export enum Profession {
        Farmer,
        Blacksmith,
        Trader,
        Librarian
    }

    function professionName(p: Profession): string {
        switch (p) {
            case Profession.Farmer: return "Farmer"
            case Profession.Blacksmith: return "Blacksmith"
            case Profession.Trader: return "Trader"
            case Profession.Librarian: return "Librarian"
        }
    }

    // =========================
    // 🧭 SIMPLE PATHFINDING AI
    // =========================
    function moveToward(sprite: Sprite, target: Sprite, speed: number) {
        let dx = target.x - sprite.x
        let dy = target.y - sprite.y
        let mag = Math.sqrt(dx * dx + dy * dy)

        if (mag > 0) {
            sprite.vx = (dx / mag) * speed
            sprite.vy = (dy / mag) * speed
        }
    }

    // =========================
    // 🧑 VILLAGER NPC
    // =========================
    export class Villager extends sprites.ExtendableSprite {

        profession: Profession
        tradingOpen: boolean = false

        constructor(img: Image, profession: Profession) {
            super(img)

            this.profession = profession
            this.setKind(SpriteKind.Enemy)
            this.setStayInScreen(true)

            game.onUpdate(() => {
                this.aiLoop()
            })
        }

        aiLoop() {
            // wander slightly
            if (Math.percentChance(3)) {
                this.vx = randint(-30, 30)
                this.vy = randint(-30, 30)
            }

            // follow player if close
            let player = sprites.allOfKind(SpriteKind.Player)[0]
            if (player && Math.abs(player.x - this.x) < 60 && Math.abs(player.y - this.y) < 60) {
                moveToward(this, player, 20)
            }
        }

        // =========================
        // 💬 INTERACTION
        // =========================
        talk() {
            minecraftNPC.showDialogue(
                "I am a " + professionName(this.profession),
                1500
            )
        }

        // =========================
        // 🛒 TRADING UI
        // =========================
        trade() {
            if (this.tradingOpen) return
            this.tradingOpen = true

            if (this.profession == Profession.Trader) {

                minecraftNPC.showDialogue("Trade: 5 emeralds for reward?", 1000)

                game.showLongText("Press A to trade\nPress B to cancel", DialogLayout.Center)

                controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
                    if (emeralds >= 5) {
                        removeEmeralds(5)
                        minecraftNPC.showDialogue("Deal done!", 1000)
                    } else {
                        minecraftNPC.showDialogue("Not enough emeralds!", 1000)
                    }
                    this.tradingOpen = false
                })

                controller.B.onEvent(ControllerButtonEvent.Pressed, () => {
                    this.tradingOpen = false
                })
            }
        }
    }

    // =========================
    // 🧑 SPAWN VILLAGER
    // =========================
    export function spawnVillager(img: Image, profession: Profession): Villager {
        let v = new Villager(img, profession)
        v.setPosition(randint(20, 140), randint(20, 100))
        return v
    }
}
