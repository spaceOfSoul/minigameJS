const canvas = document.querySelector('canvas');
const scoreLable = document.querySelector('#scoreLable');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Player{
    constructor(x,y,radius,color){
        this.x = x;
        this.y = y;

        this.radius = radius;
        this.color = color;
    }

    draw(){
        c.beginPath();
        //x,y,r,startAngle, endAngle, drawCounterClockwise
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false );
        c.fillStyle = this.color;
        c.fill();
    }
}

class Projectile{
    constructor(x,y,radius,color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(){
        c.beginPath();
        //x,y,r,startAngle, endAngle, drawCounterClockwise
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false );
        c.fillStyle = this.color;
        c.fill();
    }

    update(){
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Enemy{
    constructor(x,y,radius,color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(){
        c.beginPath();
        //x,y,r,startAngle, endAngle, drawCounterClockwise
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false );
        c.fillStyle = this.color;
        c.fill();
    }

    update(){
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Particle{
    constructor(x,y,radius,color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.friction = 0.98;
    }

    draw(){
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        //x,y,r,startAngle, endAngle, drawCounterClockwise
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false );
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }

    update(){
        this.draw();
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    }
}

const x = canvas.width / 2;
const y = canvas.height / 2;
let enemyCount = 1000;

const player = new Player(x, y, 15, 'white');

const projectiles = [];
const enemies = [];
const particles = [];

function spawnEnemies(){
    setInterval(()=>{
        let minimum = 15;
        const radius = Math.random() * (30 - minimum) + minimum;
        let x;
        let y;

        if(Math.random() < 0.5){
            x = Math.random() < 0.5 ? 0-radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }else{
            x = Math.random() *canvas.width;
            y = Math.random() < 0.5 ? 0-radius : canvas.height + radius;
        }


        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        const angle = Math.atan2(canvas.height/2-y,canvas.width/2-x);
        const velocity ={
            x:Math.cos(angle)*3,
            y:Math.sin(angle)*3
        };

        enemies.push(new Enemy(x,y,radius,color,velocity));
    },enemyCount);
}

let animationId;
let score =0;

function animate(){
    animationId=requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0,0,0,0.1)';
    c.fillRect(0,0,canvas.width, canvas.height);

    player.draw();

    particles.forEach((particle, index)=>{
        if(particle.alpha <= 0){
            particles.splice(index,1);
        }else{
            particle.update();
        }
    })

    projectiles.forEach((projectile, pIndex) =>{
        projectile.update();

        //remove edge screen
        if(projectile.x - projectile.radius < 0||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height){
            setTimeout(()=>{
                projectiles.splice(pIndex,1);
            }, 0);
        }
    });

    enemies.forEach((enemy,index) =>{
        enemy.update();
        const playerDist = Math.hypot(player.x - enemy.x,player.y-enemy.y);

        //end game
        if(playerDist - enemy.radius - player.radius < 1){
            cancelAnimationFrame(animationId);
        }


        projectiles.forEach((projectile, pIndex) =>{
            const dist = Math.hypot(projectile.x - enemy.x,projectile.y-enemy.y);

            //enemy and projectile collision
            if(dist - enemy.radius - projectile.radius < 1){
                score += 7;
                scoreLable.innerText = `Score : ${score}`;

                //particle
                for(let i=0; i<enemy.radius * 2; i++){
                    particles.push(new Particle(projectile.x,projectile.y, Math.random() * 2, enemy.color,
                        {
                            x: (Math.random()-0.5) * (Math.random()*8),
                            y: (Math.random()-0.5)*(Math.random() * 8)
                        }));
                }

                if(enemy.radius > 20){
                    // enemy.radius -= 10;
                    gsap.to(enemy,{
                        radius : enemy.radius -10,
                    });
                    setTimeout(()=>{
                        projectiles.splice(pIndex,1);
                    }, 0)
                }else{
                    score += 10;
                    scoreLable.innerText = `Score : ${score}`;
                    setTimeout(()=>{
                        enemies.splice(index,1);
                        projectiles.splice(pIndex,1);
                    }, 0)
                }
            }
        });
    });
}

addEventListener('mousedown',(e)=>{
    speed = 5;
    const angle = Math.atan2(e.clientY - canvas.height/2, e.clientX - canvas.width/2);
    const velocity = {
        x: Math.cos(angle) *speed ,
        y: Math.sin(angle) *speed
    };
    projectiles.push(new Projectile( canvas.width/2, canvas.height/2, 5, 'white', velocity));
});

spawnEnemies();
animate();