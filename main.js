const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

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

const x = canvas.width / 2;
const y = canvas.height / 2;
let enemyCount = 1000;

const player = new Player(x, y, 30, 'blue');

const projectiles = [];
const enemies = [];

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


        const color = 'purple';
        const angle = Math.atan2(canvas.height/2-y,canvas.width/2-x);
        const velocity ={
            x:Math.cos(angle),
            y:Math.sin(angle)
        };

        enemies.push(new Enemy(x,y,radius,color,velocity));
    },enemyCount);
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width, canvas.height);
    player.draw();
    projectiles.forEach(projectile =>{
        projectile.update();
    });

    enemies.forEach(enemy =>{
        enemy.update();
    });
}

addEventListener('mousedown',(e)=>{
    const angle = Math.atan2(e.clientY - canvas.height/2, e.clientX - canvas.width/2);
    const velocity = {
        x: Math.cos(angle) ,
        y: Math.sin(angle)
    };
    projectiles.push(new Projectile( canvas.width/2, canvas.height/2, 5, 'red', velocity))
});

spawnEnemies();
animate();