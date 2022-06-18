// Boa sorte tentando entender esse código

class Sprite {
    constructor({ 
        position, 
        imageSrc, 
        scale = 1, 
        framesMax = 1, 
        offset = {x: 0, y: 0} 
        }) {

        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 8;
        this.offset = offset;

    }

    draw() {
        c.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax, 
            this.image.height,

            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
            );
    }

    animateFrames() {

        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }

}

class Fighter extends Sprite {
    constructor({ 
        position, 
        velocity, 
        color = 'red',
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        offset = {x: 0, y: 0},
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined },
    }) {

            super({
                imageSrc,
                scale,
                framesMax,
                offset
            });

        this.position = position;
        this.velocity = velocity;
        this.width = 30;
        this.height = 100;
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        };
        this.color = color;
        this.isAttacking
        this.attackValidation = true
        this.health = 100;
        this.alive = true;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.sprites = sprites;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }

        console.log(this.sprites);
    }



    update() {
        this.draw();
        this.animateFrames();

        this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
        
        this.position.x = this.position.x + this.velocity.x;
        this.position.y = this.position.y + this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 95) {

            this.velocity.y = 0;
            this.position.y = 381;
        } else this.velocity.y = this.velocity.y + gravity;

        console.log(this.position.y)
    }

    attackLate() {
        this.switchSpritePlayer('attack')
        
        setTimeout(() => {
            this.isAttacking = true
        }, 500)
        setTimeout(() => {
            this.isAttacking = false
        }, 550)
    }
    attackEarly() {
        this.switchSpriteEnemy('attack')
        
        setTimeout(() => {
            this.isAttacking = true
        }, 120)
        setTimeout(() => {
            this.isAttacking = false
        }, 170)
    }

    takeHitPlayer() {
        this.health -= 15
        this.switchSpritePlayer('takeHit');
    }
    takeHitEnemy() {
        this.health = this.health - 20
        this.switchSpriteEnemy('takeHit');
    }

    switchSpritePlayer(sprite) {

        if (
            this.image === this.sprites.attack.image 
            && this.framesCurrent < this.sprites.attack.framesMax -1
        ) 
            return

        if (
            this.image === this.sprites.takeHit.image 
            && this.framesCurrent < this.sprites.takeHit.framesMax -1
        ) 
            return

        switch (sprite) {
            case 'idle':
                if ( this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                    this.framesHold = 8;
                }
                break
            case 'run':
                if ( this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                    this.framesHold = 5;
                }
                break
            case 'jump':
                if ( this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'fall':
                if ( this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'attack':
                if ( this.image !== this.sprites.attack.image) {
                    this.image = this.sprites.attack.image;
                    this.framesMax = this.sprites.attack.framesMax;
                    this.framesCurrent = 0;
                    this.framesHold = 8;
                }
                break
                case 'takeHit':
                    if ( this.image !== this.sprites.takeHit.image) {
                        this.image = this.sprites.takeHit.image;
                        this.framesMax = this.sprites.takeHit.framesMax;
                        this.framesCurrent = 0;
                        this.framesHold = 8;
                    }
        }
    }
    switchSpriteEnemy(sprite) {

        if (
            this.image === this.sprites.attack.image 
            && this.framesCurrent < this.sprites.attack.framesMax -1
        ) 
            return

        if (
            this.image === this.sprites.takeHit.image 
            && this.framesCurrent < this.sprites.takeHit.framesMax -1
        ) 
            return

        switch (sprite) {
            case 'idle':
                if ( this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                    this.framesHold = 8;
                }
                break
            case 'run':
                if ( this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                    this.framesHold = 6;
                }
                break
            case 'jump':
                if ( this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'fall':
                if ( this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break
            case 'attack':
                if ( this.image !== this.sprites.attack.image) {
                    this.image = this.sprites.attack.image;
                    this.framesMax = this.sprites.attack.framesMax;
                    this.framesCurrent = 0;
                    this.framesHold = 10;
                }
                break
            case 'takeHit':
                if ( this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                    this.framesHold = 8;
                }
        }
    }

}