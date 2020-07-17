$(function(){

    //recuperation du canvas
    monCanvas = document.getElementById('canvas');
    ctx = monCanvas.getContext('2d');
    largeurCanvas = monCanvas.width;
    hauteurCanvas = monCanvas.height;

    //implementation des effet sonore du jeu 
    var audio = new Audio();
    var playlist = ['audio/lose.mp3','audio/win.mp3','audio/brickbreak.mp3'];
    

    //fleche direction du jeu 
    document.addEventListener("keydown",
        function(e){
            switch(e.keyCode) {
                case 37:
                // touche gauche
                if(serpent.precmouv == 39){
                    break;
                }
                serpent.dx = -1;
                serpent.dy = 0;
                serpent.precmouv = e.keyCode;
                break;
                case 38:
                // touche haut
                if(serpent.precmouv == 40){
                    break;
                }
                serpent.dx = 0;
                serpent.dy = -1;
                serpent.precmouv = e.keyCode;
                break;
                case 39:
                // touche droite
                if(serpent.precmouv == 37){
                    break;
                }
                serpent.dx = 1;
                serpent.dy = 0;
                serpent.precmouv = e.keyCode;
                break;
                case 40:
                // touche bas
                if(serpent.precmouv == 38){
                    break;
                }
                serpent.dx = 0;
                serpent.dy = 1;
                serpent.precmouv = e.keyCode;
                break;
                }
    });

    //objet du jeu 
    var jeu = {
        points: 0,

        score: function(){
            ctx.font = "20px 'Press Start 2P'";
            ctx.fillStyle = "white";
            ctx.fillText("SCORE: "+ jeu.points + " / 10",(largeurCanvas/2)-80, 30);
        },

        dessin: function(){
            ctx.clearRect(0, 0,largeurCanvas,hauteurCanvas);
            serpent.collisions();
            pomme.dessin();
            jeu.score();
            ctx.rect(40, 40, largeurCanvas - 80, hauteurCanvas - 80);
            ctx.strokeStyle = 'white';
            ctx.stroke();
            //console.log(serpent.x);
        }

    };

    function alea(min,max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    
    //objet serpent
    var serpent = {
        couleur: 'white',
        largeur: 20,
        hauteur: 20,

        //Coordonnées pour placer le serpent aleatoirment sur le canvas
        x: alea(3,24)*20,
        y: alea(3,14)*20,
        dx: 0,
        dy: 0,
        precmouv: 0,
        queue: [],
        taillequeue: 3,


        dessin: function(){
            ctx.beginPath();
            ctx.fillStyle = this.couleur;
            ctx.fillRect(this.x, this.y, this.largeur, this.hauteur);
            for(var i=0;i<this.queue.length;i++) {
                ctx.fillRect(this.queue[i].x,this.queue[i].y, this.largeur, this.hauteur);
                }
            ctx.closePath();
        },

        mouvement: function(){
            this.dessin();
            this.x += this.dx * this.largeur;
            this.y += this.dy * this.hauteur;
            this.queue.push({x: this.x,y: this.y});
            while(this.queue.length>this.taillequeue){
                // alors on enlève un élément
                this.queue.shift();
                }
            

        },

        collisions: function(){
            this.mouvement();

            //collision bord
            if(this.x > (largeurCanvas - 40) - this.largeur || this.x  < 40|| this.y > (hauteurCanvas - 40) - this.hauteur || this.y < 40){
                
                clearInterval(partie);
                $('.box_choix.gameover').show();
                $('#monCanvas > div > div > a:nth-child(1)').click(function(){
                    document.location.reload();
                })
                audio.src = (playlist[0]);
                audio.pause();
                audio.play();


            }
            //collision queue
            if(this.taillequeue > 3){
                for(var i = 0; i < this.queue.length -1; i++){
                    if(this.queue[i].x == this.x && this.queue[i].y == this.y){
                        clearInterval(partie);
                        $('.box_choix.gameover').show();
                        $('#monCanvas > div > div > a:nth-child(1)').click(function(){
                            document.location.reload();
                        })
                        audio.src = (playlist[0]);
                        audio.pause();
                        audio.play();
                    }
                }
            }
            //collision pomme
            if(this.x == pomme.x && this.y == pomme.y){
                jeu.points++;
                if(jeu.points == 10){
                    audio.src = (playlist[1]);
                    audio.pause();
                    audio.play();
                    clearInterval(partie);
                    setTimeout(function() {
                        window.location.replace('experience.html');
                    },2000);
                }
                // collision donc mange la pomme
                else{
                    audio.src = (playlist[2]);
                    audio.pause();
                    audio.play();
                    //augmentation de la taille du serpent apres avoir manger
                    this.taillequeue += 2;
                    
                    // On choisit une autre position pour la pomme
                    pomme.x = alea(3,24)*this.largeur;
                    pomme.y = alea(3,14)*this.hauteur;
                }   
            }
        }
    }

    var pomme = {
        couleur: 'darkred',
        rayon: 10,
        x: alea(3,24)*serpent.largeur,
        y: alea(3,14)*serpent.hauteur,

        dessin: function(){
            ctx.beginPath();
            ctx.fillStyle = this.couleur;
            ctx.arc(this.x + this.rayon, this.y + this.rayon, this.rayon, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    }

    
    //lancement du jeu 
    var partie = setInterval(jeu.dessin,100);
})