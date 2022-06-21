const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const scoreLable = document.querySelector('#scoreLable');

const gameoverEl = document.querySelector('.gameover');
const finalScore = gameoverEl.querySelector('.score');
const restartButton = document.querySelector("#restartButton");

const rankList = document.querySelector('.rankList');
const startButton = document.querySelector("#startButton");
const startModal = document.querySelector(".gameStart");

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

let player = new Player(x, y, 15, 'white');

let projectiles = [];
let enemies = [];
let particles = [];
let animationId;
let score =0;

function init(){
    player = new Player(x, y, 15, 'white');
    projectiles =[];
    enemies = [];
    particles = [];
    animationId;
    score = 0;
    scoreLable.classList.remove('hidden');
}

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


//애니메이션
//게임 주 실행부
function animate(){
    animationId=requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0,0,0,0.1)';
    c.fillRect(0,0,canvas.width, canvas.height);

    player.draw();

    for(let i = particles.length-1; i>=0; i--){
        const particle = particles[i];
        if(particle.alpha <= 0){
            particles.splice(i,1);
        }else{
            particle.update();
        }
    }

    for(let i=projectiles.length-1; i>=0; i--){
        const projectile = projectiles[i];
        projectile.update();

        //remove edge screen
        if(projectile.x - projectile.radius < 0||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height){
            projectiles.splice(i,1);
        }
    }

    for(let index=enemies.length-1; index>=0; index--){
        const enemy = enemies[index];
        enemy.update();
        const playerDist = Math.hypot(player.x - enemy.x,player.y-enemy.y);

        //end game
        if(playerDist - enemy.radius - player.radius < 1){
            gameoverEl.classList.remove('hidden');

            const uploadForm = gameoverEl.querySelector(".inputForm");
            const scoreLi = document.createElement("input");
            scoreLi.classList.add("hidden");
            scoreLi.value = score;
            scoreLi.name="score";
            uploadForm.appendChild(scoreLi);

            finalScore.innerText = `${score}`;
            clearInterval(timer);
            cancelAnimationFrame(animationId);
        }

        for(let pIndex=projectiles.length-1; pIndex>=0; pIndex--){
            const projectile = projectiles[pIndex];
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
                    projectiles.splice(pIndex,1);
                }else{
                    score += 10;
                    scoreLable.innerText = `Score : ${score}`;
                    enemies.splice(index,1);
                    projectiles.splice(pIndex,1);
                }
            }
        }
    }
}
function gameStart(){
    init();
    animate();
    spawnEnemies();
    scoreLable.innerText = `Score : ${score}`;
    timer = setInterval(()=>{
        score++;
        scoreLable.innerText = `Score : ${score}`;
    }, 1000);
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

restartButton.addEventListener('click',(e)=>{
    gameStart();
    gameoverEl.classList.add("hidden");
});

startButton.addEventListener('click', ()=>{
    gameStart();
    startModal.classList.add("hidden");
});


