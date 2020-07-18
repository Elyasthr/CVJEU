$(function(){
    //Ecouteurs //////////////////////////////////////////////////////////
    document.addEventListener("keydown",
        function(e){
            switch(e.keyCode){
                case 37:
                //À l'appui de la flèche de gauche
                //On verifie si le precedent mouvement est la flèche de droite
                if(serpent.precmouv == 39){
                    //On ne fait rien
                    break;
                }
                //Sinon on change la direction du serpent la gauche
                serpent.dx = -1;
                serpent.dy = 0;
                //On remplace le precedent mouvement par celui actuel
                serpent.precmouv = e.keyCode;
                break;
                case 38:
                //À l'appui de la flèche du haut
                //On verifie si le precedent mouvement est la flèche du bas
                if(serpent.precmouv == 40){
                    //On ne fait rien
                    break;
                }
                //Sinon on change la direction du serpent vers le haut
                serpent.dx = 0;
                serpent.dy = -1;
                //On remplace le precedent mouvement par celui actuel
                serpent.precmouv = e.keyCode;
                break;
                case 39:
                //À l'appui de la flèche de droite
                //On verifie si le precedent mouvement est la flèche de gauche
                if(serpent.precmouv == 37){
                    //On ne fait rien
                    break;
                }
                //Sinon on change la direction du serpent la droite
                serpent.dx = 1;
                serpent.dy = 0;
                //On remplace le precedent mouvement par celui actuel
                serpent.precmouv = e.keyCode;
                break;
                case 40:
                //À l'appui de la flèche du bas
                //On verifie si le precedent mouvement est la flèche du haut
                if(serpent.precmouv == 38){
                    //On ne fait rien
                    break;
                }
                //Sinon on change la direction du serpent vers le bas
                serpent.dx = 0;
                serpent.dy = 1;
                //On remplace le precedent mouvement par celui actuel
                serpent.precmouv = e.keyCode;
                break;
            } 
        } 
    );

    //Récupération du Canvas //////////////////////////////////////////////////////////
    monCanvas = document.getElementById('canvas');
    ctx = monCanvas.getContext('2d');
    largeurCanvas = monCanvas.width;
    hauteurCanvas = monCanvas.height;

    //Objet du jeu ////////////////////////////////////////////////////////////////////
    var jeu = {
        points: 0,
        //Implementation des effets sonores du jeu  ///////////////////////////////////////// 
        audio: new Audio(),
        playlist: ['audio/lose.mp3','audio/win.mp3','audio/brickbreak.mp3'],

        //Affichage du score
        score: function(){
            ctx.font = "20px 'Press Start 2P'";
            ctx.fillStyle = "white";
            ctx.fillText("SCORE: "+ jeu.points + " / 10",(largeurCanvas/2)-130, 30);
        },

        //Fonction qui permet de retourner un nombre aléatoire entre deux valeurs données, utile ici sachant que l'ont intégre une bordure dans le Canvas avec pour but que le serpent et la pomme apparaissent à l'intérieur de celle-ci
        alea: function(min,max){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        //Mise en place d'une bordure pour laisser de la place au score à l'intérieur du Canvas et que l'aire de jeu ne soit pas trop grande
        bordure: function(){
            ctx.rect(40, 40, largeurCanvas - 80, hauteurCanvas - 80);
            ctx.strokeStyle = 'white';
            ctx.stroke();
        },

        //Mise en place du jeu
        dessin: function(){
            //On réinitialise le Canvas pour laisser place au changement (position pomme, longueur serpent...)
            ctx.clearRect(0, 0,largeurCanvas,hauteurCanvas);
            jeu.bordure();
            pomme.dessin();
            serpent.collisions();
            jeu.score();
        }

    };
    
    //Objet serpent ////////////////////////////////////////////////////////////////////
    var serpent = {
        couleur: 'white',
        largeur: 20,
        hauteur: 20,
        //Coordonnées pour placer le serpent aleatoirment sur le canvas
        //24 est le résultat de la division entre la largeur du Canvas et la tete du serpent, cela permet de diviser le canvas en plusieurs lignes et colonnes ce qui simplifie grandement la tâche pour gérer les collisions avec un système de "case", gérer pixels par pixels demande un algorithme trop précis et complexe, on a donc 24 colonnes et 14 lignes, si on prend une valeur entre 1 et 24 ou 1 et 14 on risque de sortir de la bordure implementer plus haut donc on commence à 3, valeur qui correspond à l'origine 0 de la bordure (3 * 20 = 60, soit la position du début de la bordure). on multiplie par la largeur de la tete du serpent afin qu'il puisse rentrer dans une "case", on utilisera le même principe pour le positionnement de la pomme.
        x: jeu.alea(3,24)*20,
        y: jeu.alea(3,14)*20,
        dx: 0,
        dy: 0,
        //Variable utile pour les ecouteurs afin d'éviter que le serpent ne fasse demi-tour sur lui-même
        precmouv: 0,
        queue: [],
        taillequeue: 3,

        //On dessine le serpent avec Canvas
        dessin: function(){
            ctx.beginPath();
            ctx.fillStyle = this.couleur;
            ctx.fillRect(this.x, this.y, this.largeur, this.hauteur);
            //On dessine aussi la queue/le corps du serpent
            for(var i=0;i<this.queue.length;i++){
                ctx.fillRect(this.queue[i].x,this.queue[i].y, this.largeur, this.hauteur);
                }
            ctx.closePath();
        },

        //Gestion du deplacement du serpent
        mouvement: function(){
            this.dessin();
            //On déplace le serpent par rapport à la flèche du clavier sur laquelle on aura appuyé
            this.x += this.dx * this.largeur;
            this.y += this.dy * this.hauteur;
            //On ajoute ces coordonées a la fin de queue
            this.queue.push({x: this.x,y: this.y});
            while(this.queue.length>this.taillequeue){
                //On retire le premier élément de la queue du serpent pour donner un effet d'avancement et empêcher le serpent de grandir indéfiniment
                this.queue.shift();
                }
        },

        //Gestion des collisions du serpent
        collisions: function(){
            this.mouvement();
            //On vérifie qu'il n'y a pas de collision entre la tete du serpent et la bordure
            if(this.x > (largeurCanvas - 40) - this.largeur || this.x  < 40|| this.y > (hauteurCanvas - 40) - this.hauteur || this.y < 40){
                //On stop le "rafraichissement" du jeu 
                clearInterval(partie);
                //Effet sonore quand on perd
                jeu.audio.src = (jeu.playlist[0]);
                jeu.audio.pause();
                jeu.audio.play();
                //Box qui propose de rejouer ou d'être redirigé vers la partie du cv concerné
                $('.box_choix.gameover').show();
                //Rafraichissement de la page si on veut rejouer
                $('#monCanvas > div > div > a:nth-child(1)').click(function(){
                    document.location.reload();
                })
            }
            //On vérifie qu'il n'y a pas de collision entre la tete du serpent et son corps dès qu'il a mangé sa première pomme
            if(this.taillequeue > 3){
                //On parcourt la taille du serpent (-1 car on ne compte pas sa tête)
                for(var i = 0; i < this.queue.length -1; i++){
                    //Si la position de sa tête correspond à une partie de son corps, il y a collision, c'est perdu 
                    if(this.queue[i].x == this.x && this.queue[i].y == this.y){
                        //On stop le "rafraichissement" du jeu 
                        clearInterval(partie);
                        //Effet sonore quand on perd
                        jeu.audio.src = (jeu.playlist[0]);
                        jeu.audio.pause();
                        jeu.audio.play();
                        //Box qui propose de rejouer ou d'être redirigé vers la partie du cv concerné
                        $('.box_choix.gameover').show();
                        //Rafraichissement de la page si on veut rejouer
                        $('#monCanvas > div > div > a:nth-child(1)').click(function(){
                            document.location.reload();
                        })
                    }
                }
            }
            //On vérifie s'il y a une collision entre la tete du serpent et la pomme, donc si leurs positions (x et y) respectives correspondent
            if(this.x == pomme.x && this.y == pomme.y){
                //À chaque pomme mangée on augmente le score
                jeu.points++;
                //Si le score atteint 10 s'est gagné
                if(jeu.points == 10){
                    //On stop le "rafraichissement" du jeu 
                    clearInterval(partie);
                    //Effet sonore quand on gagne
                    jeu.audio.src = (jeu.playlist[1]);
                    jeu.audio.pause();
                    jeu.audio.play();
                    //Après un court délai on nous redirige vers la partie du cv concerné
                    setTimeout(function() {
                        window.location.replace('experience.html');
                    },2000);
                }
                else{
                    //Effet sonore quand le serpent mange une pomme
                    jeu.audio.src = (jeu.playlist[2]);
                    jeu.audio.pause();
                    jeu.audio.play();

                    //Augmentation de la taille du serpent après avoir mangé la pomme
                    this.taillequeue += 2;
                    
                    //On positionne une nouvelle pomme de manière aléatoirement à l'intérieur des bordures
                    pomme.x = jeu.alea(3,24)*this.largeur;
                    pomme.y = jeu.alea(3,14)*this.hauteur;
                }   
            }
        }
    }

    //Objet pomme ////////////////////////////////////////////////////////////////////
    var pomme = {
        couleur: 'darkred',
        rayon: 10,
        //On positionne la pomme de manière aléatoirement à l'intérieur des bordures
        x: jeu.alea(3,24)*serpent.largeur,
        y: jeu.alea(3,14)*serpent.hauteur,

        //On dessine la pomme avec Canvas
        dessin: function(){
            ctx.beginPath();
            ctx.fillStyle = this.couleur;
            //On ajoute la taille du rayon à la position de la pomme afin que celui-ci ne soit pas décaler visuellement
            ctx.arc(this.x + this.rayon, this.y + this.rayon, this.rayon, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    }

    //Lancement du jeu ////////////////////////////////////////////////////////////////
    //On met le setInterval dans une variable pour arrêter le jeu quand on gagne/perd
    var partie = setInterval(jeu.dessin,100);
})