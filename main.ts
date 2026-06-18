namespace minecraftNPC {

    // =========================
    // 💰 EMERALDS
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
    // 💬 DIALOGUE
    // =========================
    export function talk(text: string) {
        game.showLongText(text, DialogLayout.Bottom)
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

    function getProfessionName(p: Profession): string {
        if (p == Profession.Farmer) return "Farmer"
        if (p == Profession.Blacksmith) return "Blacksmith"
        if (p == Profession.Trader) return "Trader"
        return "Librarian"
    }

    // =========================
    // 🧑 VILLAGER STORAGE
    // =========================
    let villagers: Sprite[] = []
    let professions: Profession[] = []

    // =========================
    // 🧭 AI UPDATE LOOP (GLOBAL)
    // =========================
    game.onUpdate(function () {

        for (let i = 0; i < villagers.length; i++) {
            let v = villagers[i]

            // random wandering
            if (Math.percentChance(2)) {
                v.vx = randint(-30, 30)
                v.vy = randint(-30, 30)
            }

            // simple player follow
            let player = sprites.allOfKind(SpriteKind.Player)[0]
            if (player) {
                let dx = player.x - v.x
                let dy = player.y - v.y

                if (Math.abs(dx) < 60 && Math.abs(dy) < 60) {
                    let mag = Math.sqrt(dx * dx + dy * dy)
                    if (mag > 0) {
                        v.vx = (dx / mag) * 25
                        v.vy = (dy / mag) * 25
                    }
                }
            }
        }
    })

    // =========================
    // 🧑 SPAWN VILLAGER
    // =========================
    export function spawnVillager(img: Image, profession: Profession): Sprite {

        let v = sprites.create(img, SpriteKind.Enemy)
        v.setPosition(randint(20, 140), randint(20, 100))
        v.setStayInScreen(true)

        villagers.push(v)
        professions.push(profession)

        return v
    }

    // =========================
    // 💬 TALK TO VILLAGER
    // =========================
    export function talkTo(v: Sprite) {
        let index = villagers.indexOf(v)
        if (index >= 0) {
            talk("I am a " + getProfessionName(professions[index]))
        }
    }

    // =========================
    // 🛒 TRADE SYSTEM
    // =========================
    export function trade(v: Sprite) {
        let index = villagers.indexOf(v)
        if (index < 0) return

        let prof = professions[index]

        if (prof == Profession.Trader) {
            game.showLongText("Trade: 5 emeralds for reward?\nPress A = yes", DialogLayout.Center)

            controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
                if (emeralds >= 5) {
                    emeralds -= 5
                    talk("Trade complete!")
                } else {
                    talk("Need more emeralds!")
                }
            })
        }
    }
}
