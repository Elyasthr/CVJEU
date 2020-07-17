$(function() {    
    // ecouteurs ///////////////////////////////////////////////////////////////////////
    document.addEventListener("keydown",
        function(e){
            if(e.key == "Right" || e.key == "ArrowRight"){
                paddle.flecheDroite = true;
            }
            else if(e.key == "Left" || e.key == "ArrowLeft") {
                paddle.flecheGauche = true;
            }
    });
    
    document.addEventListener("keyup",
        function(e){
            if(e.key == "Right" || e.key == "ArrowRight") {
                paddle.flecheDroite = false;
            }
            else if(e.key == "Left" || e.key == "ArrowLeft") {
                paddle.flecheGauche = false;
            }
    });

    //Recuperation du canvas //////////////////////////////////////////////////////////
    monCanvas = document.getElementById('canvas');
    ctx = monCanvas.getContext('2d');
    largeurCanvas = monCanvas.width;
    hauteurCanvas = monCanvas.height;

    //implementation des effet sonore du jeu 
    var audio = new Audio();
    var playlist = ['audio/lose.mp3','audio/win.mp3','audio/brickbreak.mp3'];
    

    // Objet du jeu ////////////////////////////////////////////////////////////////////
    var jeu = {
        points: 0,

        score: function(){
            ctx.font = "20px 'Press Start 2P'";
            ctx.fillStyle = "white";
            ctx.fillText("SCORE: "+ jeu.points + ' / 16',(largeurCanvas/2)-80, 30);
        },

        dessin: function(){
            ctx.clearRect(0, 0,largeurCanvas,hauteurCanvas);
            balle.mouvement();
            paddle.mouvement();
            murDeBriques.collision();
            jeu.score();
        }

    };

    // Objet balle ////////////////////////////////////////////////////////////////////
    var balle = {
        rayon: 10,
        couleur: 'white',
        x: largeurCanvas/2,
        y: hauteurCanvas-30,
        dx: 2,
        dy:-2,

        dessin: function(){
            ctx.beginPath();
            ctx.arc(this.x, this.y,this.rayon, 0, Math.PI*2);
            ctx.fillStyle = this.couleur;
            ctx.fill();
            ctx.closePath();
        },
        
        mouvement: function(){
                
                this.dessin();
                if(this.x + this.dx > largeurCanvas - this.rayon || this.x + this.dx < this.rayon){
                    this.dx = -this.dx;
                }

                if(this.y + this.dy < this.rayon){
                    this.dy = -this.dy;
                } 
                else if(this.y + this.dy > hauteurCanvas - this.rayon){
                    if(this.x > paddle.position && this.x < paddle.position + paddle.largeur){
                        this.dy = -this.dy;
                    }
                    else{
                        clearInterval(partie);
                        $('.box_choix.gameover').show();
                        audio.src = (playlist[0]);
                        audio.pause();
                        audio.play();
                        $('#monCanvas > div > div > a:nth-child(1)').click(function(){
                            document.location.reload();
                        })
                        //Si on veut rejouer => document.location.reload();
                        //Sinon redirection CV
                    }
                }
                this.x += this.dx;
                this.y += this.dy;
        },
    };
    
    // Objet paddle ///////////////////////////////////////////////////////////////////
    var paddle = {
        hauteur: 15,
        largeur: 100,
        position: (largeurCanvas/2)-50,
        flecheDroite: false,
        flecheGauche: false,

        dessin: function(){
            ctx.beginPath();
            ctx.rect(this.position, hauteurCanvas - this.hauteur, this.largeur, this.hauteur);;
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
        },

        mouvement: function(){
            this.dessin();

            if(this.flecheDroite) {
                this.position += 5;
                if (this.position + this.largeur > largeurCanvas){
                    this.position = largeurCanvas - this.largeur;
                }
            }
            else if(this.flecheGauche) {
                this.position -= 5;
                if (this.position < 0){
                    this.position = 0;
                }
            }
        }
    }
    
    // Objet mur de brique /////////////////////////////////////////////////////////////
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
                    if(uneBrique.status == 1){
                        if(balle.x > uneBrique.x && balle.x < uneBrique.x + this.brique.largeur && balle.y > uneBrique.y && balle.y < uneBrique.y + this.brique.hauteur){
                            audio.src = (playlist[2]);
                            audio.pause();
                            audio.play();
                            balle.dy = -balle.dy;
                            uneBrique.status = 0;
                            jeu.points++
                            if(jeu.points == this.nbColonnes * this.nbRangees){
                                clearInterval(partie);
                                audio.src = (playlist[1]);
                                audio.pause();
                                audio.play();
                                setTimeout(function() {
                                    window.location.replace('formation.html');
                                },2000); 
                            }
                        }
                    }
                }
            }
            
        },
            

    }

    // lancement du jeu ////////////////////////////////////////////////////////////////
    murDeBriques.preConstruction();
    var partie = setInterval(jeu.dessin,8);
})