$(function() {
    

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var largeurCanvas = canvas.width ;
    var hauteurCanvas = canvas.height;
    var x = largeurCanvas/2;
    var y = hauteurCanvas -30;
    var dx = 2;
    var dy = -2;

    var score = 0;

    var balle = {

        rayon: 10,
        couleur: 'white',
        x2: x,
        y2: y,

        dessin: function(){
            ctx.beginPath();
            ctx.arc(this.x2, this.y2,this.rayon, 0, Math.PI*2);
            ctx.fillStyle = this.couleur;
            ctx.fill();
            ctx.closePath();
        },
        
        mouvement: function(){
                
                this.dessin();
                if(this.x2 + dx > largeurCanvas - this.rayon || this.x2 + dx < this.rayon){
                    dx = -dx;
                }

                if(this.y2 + dy < this.rayon){
                    dy = -dy;
                } 
                else if(this.y2 + dy > hauteurCanvas - this.rayon){
                    if(this.x2 > paddle.position && this.x2 < paddle.position + paddle.largeur){
                        dy = -dy;
                    }
                    else{
                        clearInterval(jeu);
                        $('.box_choix.gameover').show();
                        $('#monCanvas > div > div > a:nth-child(1)').click(function(){
                            document.location.reload();
                        })
                        //Si on veut rejouer => document.location.reload();
                        //Sinon redirection CV
                    }
                }
                this.x2 += dx;
                this.y2 += dy;
        },
    };

    var paddle = {
        hauteur: 15,
        largeur: 100,
        position: (largeurCanvas/2)-50,

        dessin: function(){
            ctx.beginPath();
            ctx.rect(this.position, hauteurCanvas - this.hauteur, this.largeur, this.hauteur);;
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
        },

        mouvement: function(){
            this.dessin();
            if(flecheDroite) {
                this.position += 5;
                if (this.position + this.largeur > largeurCanvas){
                    this.position = largeurCanvas - this.largeur;
                }
            }
            else if(flecheGauche) {
                this.position -= 5;
                if (this.position < 0){
                    this.position = 0;
                }
            }
        }
    }

    var murDeBriques = {
        brique:{
            largeur: 100,
            hauteur: 25,
        },
        nbRangees: 4,
        nbColonnes: 4,
        espaceBrique: 10,
        distanceHaut: 50,
        distanceGauche: 85,
        murDeBriques: [],

        preConstruction: function(){
            for(var c = 0; c < this.nbColonnes ; c++){
                this.murDeBriques[c] = [];
                for(var r=0; r < this.nbRangees; r++){
                    this.murDeBriques[c][r] = { 
                        x: 0,
                        y: 0,
                        status: 1 
                    };
                }
            }
        },

        construction: function(){
            for(var c=0; c < this.nbColonnes; c++) {
                for(var r=0; r < this.nbRangees; r++) {
                    if(this.murDeBriques[c][r].status == 1){
                        var briqueX = (c*(this.brique.largeur + this.espaceBrique)) + this.distanceGauche;
                        var briqueY = (r*(this.brique.hauteur + this.espaceBrique))+ this.distanceHaut;
    
                        this.murDeBriques[c][r].x = briqueX;
                        this.murDeBriques[c][r].y = briqueY;
    
                        ctx.beginPath();
                        ctx.rect(briqueX, briqueY,this.brique.largeur,this.brique.hauteur);
                        ctx.fillStyle = 'white';
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        },

        collision: function(){
            this.construction();
            for(var c = 0; c < this.nbColonnes; c++){
                for(var r = 0; r < this.nbRangees; r++){
                    var uneBrique = this.murDeBriques[c][r];
                    console.log(uneBrique.status);
                    if(uneBrique.status == 1){
                        if(balle.x2 > uneBrique.x && balle.x2 < uneBrique.x + this.brique.largeur && balle.y2 > uneBrique.y && balle.y2 < uneBrique.y + this.brique.hauteur){
                            dy = -dy;
                            uneBrique.status = 0;
                            score++
                            if(score == this.nbColonnes * this.nbRangees){
                                clearInterval(jeu);
                                window.location.replace('formation.html');
                            }
                        }
                    }
                }
            }
            
        },
            

    }
    
    var flecheDroite = false;
    var flecheGauche = false;

    document.addEventListener("keydown",
        function(e){
            if(e.key == "Right" || e.key == "ArrowRight"){
                flecheDroite = true;
            }
            else if(e.key == "Left" || e.key == "ArrowLeft") {
                flecheGauche = true;
            }
    })
    
    document.addEventListener("keyup",
        function(e){
            if(e.key == "Right" || e.key == "ArrowRight") {
                flecheDroite = false;
            }
            else if(e.key == "Left" || e.key == "ArrowLeft") {
                flecheGauche = false;
            }
    })

    
    function drawScore() {
        ctx.font = "20px 'Press Start 2P'";
        ctx.fillStyle = "white";
        ctx.fillText("SCORE: "+score, (largeurCanvas/2)-80, 30);
    }

    function draw(){
        ctx.clearRect(0, 0, largeurCanvas, hauteurCanvas);
        balle.mouvement();
        paddle.mouvement();
        murDeBriques.collision();
        drawScore();
    }

    murDeBriques.preConstruction();

    var jeu = setInterval(draw,10);
})