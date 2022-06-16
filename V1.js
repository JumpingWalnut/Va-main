let imgPlatform = document.createElement('img');
imgPlatform.src = './img/platform.png';

let imgGround = document.createElement('img');
imgGround.src = './img/Ground.png';

let imgPlayer = document.createElement('img');
imgPlayer.src = './img/Greg.png';

let imgEnemy1 = document.createElement('img');
imgEnemy1 = './img/enemy1.jpg';

let imgBackground = document.createElement('img');
imgBackground.src = './img/Background.png';

const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

// function startGame() {
// 	let startDiv = document.getElementById("start");
// 	let gameCanvas = document.getElementById("canvas");
// 	let gameOver = document.getElementById("game-over");
// 	startDiv.style.display = "none";
// 	gameCanvas.style.display = "block";
// 	gameOver.style.display = "none";
// 	start()
// }

// function gameOver() {
// 	let startDiv = document.getElementById("start");
// 	let gameCanvas = document.getElementById("canvas");
// 	let gameOver = document.getElementById("game-over");
// 	startDiv.style.display = "none";
// 	gameCanvas.style.display = "none";
// 	gameOver.style.display = "block";
// 	start();
// }



class Player {
	constructor() {
		this.speed = 8;
		this.position = {
			x: 50,
			y: 200,
		}

		this.velocity = {
			x: 0,
			y: 1
		}

		this.width = 30
		this.height = 30
		this.jumpCount = 0
		this.isJumping = false
	}

	draw() {
		c.drawImage(imgPlayer, this.position.x, this.position.y, this.width, this.height);
	}

	update() {
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
		this.draw()
		if (this.position.y + this.height + this.velocity.y <= canvas.height) {
			this.velocity.y += gravity
		}

		else {
			this.jumpCount = 0
		}
	}
}////////////

class Alfred {
	constructor(){
		this.speed = 3;
		this.position = {
			x,
			y,
		}

		this.velocity = {
			x: 0,
			y: 1,
		}

		this.width = 60;
		this.height = 60;
	}

	draw() {
		c.drawImage(imgEnemy1, this.position.x, this.position.y, this.width, this.height);
	}

	update() {
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
		this.draw()
		if (this.position.y + this.height + this.velocity.y <= canvas.height) {
			this.velocity.y += gravity
		}
	}

}

class Platform {
	constructor({ x, y, sprite=imgPlatform, width=200, height=40 }={}) {
		this.position = {
			x,
			y,
		}
		this.width = width;
		this.height = height;
		this.sprite = sprite;
	}

	draw() {
		c.drawImage(this.sprite, this.position.x, this.position.y, this.width, this.height);
	}
}

class Ground {
	constructor({ x, y, width=600, height=80 }={}) {
		this.position = {
			x,
			y: 497
		}
		this.width = width
		this.height = height
	}

	draw() {
		c.drawImage(imgGround, this.position.x, this.position.y, this.width, this.height);
	}
}

class GenericObject {
	constructor({ x, y }) {
		this.position = {
			x,
			y
		}
		this.width = canvas.width + 1
		this.height = canvas.height + 1
	}
	draw() {
		c.drawImage(imgBackground, this.position.x, this.position.y, this.width, this.height);
	}
}

let player = new Player()

let platforms = []

let grounds = []

let genericObjects = []

const keys = {
	right: {
		pressed: false
	},
	left: {
		pressed: false
	},
}

let scrollOffset = 0



function init() {
	player = new Player()

	platforms = [
		new Platform({
			x:600, 
			y:300,
		}), 
		new Platform({
			x:600, 
			y:150,
			width:50,
		}),
		new Platform({
			x:1500, 
			y:300,
			
		}),
		new Platform({
			x:1700, 
			y:300,
		})
		]

	grounds = [
		new Ground({
			x:-1,
		}),
		new Ground({
			x: 599,
		}),
		new Ground({
			x: 1499,
			width: 400,
		}),
		new Ground({
			x: 2600,
			width: 100,
		}),
	]

	genericObjects = [ 
		new GenericObject({
			x: -1,
			y: -1,
		})
	]

	scrollOffset = 0

}

function animate() {
	
	requestAnimationFrame(animate)
	c.fillStyle = 'white';
	c.fillRect(0, 0, canvas.width, canvas.height);

	genericObjects.forEach(genericObject => {
		genericObject.draw()
	})

	grounds.forEach(ground => {
		ground.draw()
	})

	platforms.forEach(platform => {
		platform.draw()
	})
	player.update();

	//Right and Left Movement
	if (keys.right.pressed && player.position.x < 500) {
		player.velocity.x = player.speed
	} else if (keys.left.pressed && player.position.x > 300) {
		player.velocity.x = -player.speed
	} else {
		player.velocity.x = 0

		if (keys.right.pressed) {
			scrollOffset += player.speed
			platforms.forEach(platform => {
				platform.position.x -= player.speed;
			})
			grounds.forEach(ground => {
				ground.position.x -= player.speed;
			})
			// genericObjects.forEach(genericObject => {
			// 	genericObject.position.x -= player.speed * .66;
			// })

			
		}else if (keys.left.pressed) {
			if (scrollOffset > 0) {
				scrollOffset -= player.speed
				platforms.forEach(platform => {
					platform.position.x += player.speed;
				})
				grounds.forEach(ground => {
					ground.position.x += player.speed;
				})
				// genericObjects.forEach(genericObject => {
				// 	genericObject.position.x += player.speed * .66;
				// })
			}
			else if (player.position.x > -5) {
				player.position.x -= 5;
			}
		}
	}



	//Platform Collision
	platforms.forEach(platform => {
		if (player.position.y + player.height 
			<= platform.position.y && player.position.y + 
			player.height + player.velocity.y >= 
			platform.position.y && player.position.x + 
			player.width >= platform.position.x && player.position.x 
			<= platform.position.x + platform.width){

			player.velocity.y = 0
			player.jumpCount = 0
		}
	})

	grounds.forEach(ground => {
		if (player.position.y + player.height 
			<= ground.position.y && player.position.y + 
			player.height + player.velocity.y >= 
			ground.position.y && player.position.x + 
			player.width >= ground.position.x && player.position.x 
			<= ground.position.x + ground.width){

			player.velocity.y = 0
			player.jumpCount = 0
		}
	})

	// win condition
	if (scrollOffset > 2000) {
		console.log('you win');
	}

	//lose condition
	if (player.position.y > canvas.height) {
		init();
	}

}


init();
animate();

//Event Listeners

addEventListener('keydown', ({ keyCode }) => {
	
	switch (keyCode) {
		case 65:
			//Left
			keys.left.pressed = true 
			break
		
		case 83:
			//Down
			break

		case 68:
			//Right
			keys.right.pressed = true
			break

		case 87:
			//Up
			if (player.jumpCount < 2 && player.isJumping == false){
				player.velocity.y = -10
				player.jumpCount += 1
				player.isJumping = true;
				console.log('Key down')
				console.log(player.isJumping)
			}
			else{

			}
			break
	}
})

addEventListener('keyup', ({ keyCode }) => {
	
	switch (keyCode) {
		case 65:
			//Left
			keys.left.pressed = false 
			break
		
		case 83:
			//Down
			break

		case 68:
			//Right
			keys.right.pressed = false
			break

		case 87:
			//Up
			player.isJumping = false;
			console.log('keyup')
			console.log(player.isJumping)
			break

	}
})






/////////////
// Testing Github Commit








