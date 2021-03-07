var bg;
var canvas;
var space_shooter;
var alien_shooter;
var asteroid;
var planet_image;
var bullet;
var posX = 365;
var posY = 300;
var score = 10;
var bullets = [];
var bullets_enemy = [];
var enemies = [];
var gameOver = false;

function setup() {
    bg = loadImage('static/space_background.jpg');
    // canvas = createCanvas(800, 450);
    canvas = createCanvas(windowWidth*0.635, 450)
    canvas.parent('p5jscanvas');
    // canvas.position((windowWidth/2)-(800/2), (windowHeight/2)-(450/2)+(document.getElementById("header").scrollHeight+document.getElementById("index").scrollHeight));
    // canvas.center('horizontal')
    textAlign(CENTER, CENTER);
    interval = setInterval(function() {
        var enemy_PosX = getRandomInt(30, 750)
        if (getRandomInt(1, 10) <= 6) {
            enemies.push(["alien", enemy_PosX, -10, 2])
        } else {
            enemies.push(["meteor", enemy_PosX, -10, 1])
        }
    }, 1000);
    
    interval2 = setInterval(function() {
        var enemies_alien = []
        for (let enemy of enemies) {
            if (enemy !== undefined && enemy[0] === "alien") {
                enemies_alien.push([enemy[1], enemy[2]])
            }  
        }
        if (enemies_alien.length !== 0) {
            bullets_enemy.push(enemies_alien[Math.floor(Math.random() * enemies_alien.length)])
        }
    }, 500);
}

function windowResized() {
    canvas.remove()
//     canvas.position((windowWidth/2)-(800/2), (windowHeight/2)-(450/2)+(document.getElementById("header").scrollHeight+document.getElementById("index").scrollHeight));
    canvas = createCanvas(windowWidth*0.635, 450)
    canvas.parent('p5jscanvas');
    // canvas.position((windowWidth/2)-(800/2), (windowHeight/2)-(450/2)+(document.getElementById("header").scrollHeight+document.getElementById("index").scrollHeight));
    // canvas.center('horizontal')
    textAlign(CENTER, CENTER);
}

function preload() {
    space_shooter = loadImage('static/space_shooter.png');
    alien_shooter = loadImage('static/alien_shooter.png');
    asteroid = loadImage('static/asteroid.png');
    planet_image = loadImage('static/planet.png');
    bullet = loadImage('static/bullet.png');
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function draw() {
    if (gameOver === false) {
        background(bg);
        image(planet_image, 370, 380, 60, 60)
        if (keyIsDown(LEFT_ARROW)) {
            if (posX > 0) posX -= 5;
        } else if (keyIsDown(RIGHT_ARROW)) {
            if (posX < 725) posX += 5;
        }
        for (let bullet_pos of bullets) {
            if (bullet_pos !== undefined) {
                image(bullet, bullet_pos[0], bullet_pos[1], 15, 15)
                bullet_pos[1] -= 10
                if (bullet_pos[1] < 0) {
                    delete bullets[bullets.indexOf(bullet_pos)]
                }
            } 
        }
        for (let bullet_pos of bullets_enemy) {
            if (bullet_pos !== undefined) {
                image(bullet, bullet_pos[0]+25, bullet_pos[1], 15, 15)
                bullet_pos[1] += 10
                if (bullet_pos[1] > 450) {
                    delete bullets[bullets.indexOf(bullet_pos)]
                }
                if (posX<=bullet_pos[0] && bullet_pos[0]<=posX+70) {
                    if (posY<=bullet_pos[1] && bullet_pos[1]<=posY+70) {
                        score-=3
                        delete bullets_enemy[bullets_enemy.indexOf(bullet_pos)]
                    }
                }
            } 
        }
        fill(0, 255, 0)
        textSize(18);
        text(score.toString(), 400, 410);
        for (let enemy_pos of enemies) {
            if (enemy_pos !== undefined) {
                if (enemy_pos[0] == "meteor") {
                    image(asteroid, enemy_pos[1], enemy_pos[2], 40, 40)
                    enemy_pos[2] += 1.75 
                } else {
                    image(alien_shooter, enemy_pos[1], enemy_pos[2], 40, 40)
                    enemy_pos[2] += 2.75
                }
                if (enemy_pos[2] > 420) {
                    if (enemy_pos[0] == "meteor") score-=15
                    else score-=5
                    delete enemies[enemies.indexOf(enemy_pos)]
                }
                if (score<=0) gameOver = true
                else if (score>=50) gameOver = true

                for (let bullet_pos of bullets) {
                    if (bullet_pos !== undefined) {
                        if (enemy_pos[1]<=bullet_pos[0] && bullet_pos[0]<=enemy_pos[1]+40) {
                            if (enemy_pos[2]<=bullet_pos[1] && bullet_pos[1]<=enemy_pos[2]+40) {
                                delete bullets[bullets.indexOf(bullet_pos)]
                                enemy_pos[3]--
                                if (enemy_pos[3]<1) {
                                    if (enemy_pos[0] == "meteor") score+=2
                                    else score+=5
                                    delete enemies[enemies.indexOf(enemy_pos)]
                                }
                            }
                        }
                    }
                }
            }
        }
        image(space_shooter, posX, posY, 70, 70);
    } else {
        if (score<=0) {
            background(0);
            textSize(40);
            fill(255, 0, 0)
            text("You Lost - Your score reached 0 points.", 400, 220);
            clearInterval(interval);
            clearInterval(interval2);
        } else if (score>=50) {
            background(0);
            textSize(40);
            text("You Won - Your score reached 50 points.", 400, 220);
            clearInterval(interval);
            clearInterval(interval2);
        }
    }
}

function keyPressed() {
    if (keyIsDown(32)) {
        bullets.push([posX+29, posY])
    }
}