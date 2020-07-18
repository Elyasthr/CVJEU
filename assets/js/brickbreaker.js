$(function() {    
    //Écouteurs ///////////////////////////////////////////////////////////////////////
    //Action quand on appuie sur la flèche droite ou gauche ///////////////////////////
    document.addEventListener("keydown",
        function(e){
            if(e.key == "Right" || e.key == "ArrowRight"){
                paddle.flecheDroite = true;
            }
            else if(e.key == "Left" || e.key == "ArrowLeft") {
                paddle.flecheGauche = true;
            }
    });

    //Action quand on relâche sur la flèche droite ou gauche ///////////////////////////
    document.addEventListener("keyup",
        function(e){
            if(e.key == "Right" || e.key == "ArrowRight") {
                paddle.flecheDroite = false;
            }
            else if(e.key == "Left" || e.key == "ArrowLeft") {
                paddle.flecheGauche = false;
            }
    });

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
            ctx.fillText("SCORE: "+ jeu.points + ' / 16',(largeurCanvas/2)-130, 30);
        },

        //Mise en place du jeu
        dessin: function(){
            //On réinitialise le Canvas pour laisser place au changement (position balle, statuts brique...)
            ctx.clearRect(0, 0,largeurCanvas,hauteurCanvas);
            balle.mouvement();
            paddle.mouvement();
            murDeBriques.collision();
            jeu.score();
        }
    };

    //Objet balle ////////////////////////////////////////////////////////////////////
    var balle = {
        rayon: 10,
        couleur: 'white',
        //Au départ on place la balle au centre de la page en bas sur le paddle
        x: largeurCanvas/2,
        y: hauteurCanvas-30,
        //On déplacera la balle de 2 px à chaque fois
        dx: 2,
        dy: -2,

        //On dessine la balle avec Canvas
        dessin: function(){
            ctx.beginPath();
            ctx.arc(this.x, this.y,this.rayon, 0, Math.PI*2);
            ctx.fillStyle = this.couleur;
            ctx.fill();
            ctx.closePath();
        },
        
        //Gestion des mouvements de la balle
        mouvement: function(){
            this.dessin();
            //On vérifie si la balle sort du coté droit ou gauche du Canvas
            if(this.x + this.dx > largeurCanvas - this.rayon || this.x + this.dx < this.rayon){
                //On fait prendre à la balle la direction opposée
                this.dx = -this.dx;
            }
            //On vérifie si la balle sort du coté haut du Canvas
            if(this.y + this.dy < this.rayon){
                //On fait prendre à la balle la direction opposée
                this.dy = -this.dy;
            } 
            //On vérifie si la balle sort du côté bas du Canvas
            else if(this.y + this.dy > hauteurCanvas - this.rayon){
                //Est-ce que la balle rencontre le paddle ?
                if(this.x > paddle.position && this.x < paddle.position + paddle.largeur){
                    //On fait prendre à la balle la direction opposée
                    this.dy = -this.dy;
                }
                else{
                    //Perdu c'est une fin de partie
                    //On stop le "rafraichissement" du jeu 
                    clearInterval(partie);
                    //Box qui propose de rejouer ou d'être redirigé vers la partie du cv concerné
                    $('.box_choix.gameover').show();
                    //Effet sonore quand on perd
                    jeu.audio.src = (jeu.playlist[0]);
                    jeu.audio.pause();
                    jeu.audio.play();
                    //Rafraichissement de la page si on veut rejouer
                    $('#monCanvas > div > div > a:nth-child(1)').click(function(){
                        document.location.reload();
                    })
                }
            }
            //On fait déplacer la balle de 2 px en largeur et -2 px en hauteur (dans un Canvas le 0 se trouve au top)
            this.x += this.dx;
            this.y += this.dy;
        },
    };
    
    //Objet paddle ///////////////////////////////////////////////////////////////////
    var paddle = {
        hauteur: 15,
        largeur: 100,
        couleur: 'white',
        //On positionne le paddle au milieu du Canvas, puis on retire la moitié de la largeur de celui-ci pour le centrer correctement sinon c'est son côté gauche qui est au milieu
        position: (largeurCanvas/2)-50,
        flecheDroite: false,
        flecheGauche: false,

        //On dessine le paddle avec Canvas
        dessin: function(){
            ctx.beginPath();
            ctx.rect(this.position, hauteurCanvas - this.hauteur, this.largeur, this.hauteur);;
            ctx.fillStyle = this.couleur;
            ctx.fill();
            ctx.closePath();
        },

        //Gestion des mouvements du paddle
        mouvement: function(){
            this.dessin();
            //On vérifie la valeur de la variable flèche droite qui varie selon les valeurs donner par les écouteurs initialisés plutôt
            if(this.flecheDroite){
                //On déplace le paddle de 5 pixels vers la droite
                this.position += 5;
                //Si le paddle va dépasser du coté droit du Canvas alors on lui donne la valeur max sans qu'il ne sorte de celui-ci
                if (this.position + this.largeur > largeurCanvas){
                    this.position = largeurCanvas - this.largeur;
                }
            }
            //Même concept avec la fleche gauche 
            else if(this.flecheGauche){
                this.position -= 5;
                if (this.position < 0){
                    this.position = 0;
                }
            }
        }
    };

    //Objet mur de brique /////////////////////////////////////////////////////////////
    var murDeBriques = {
        brique:{
            largeur: 100,
            hauteur: 25,
        },
        couleur: 'white',
        nbRangees: 4,
        nbColonnes: 4,
        //Pour bien centrer le mur de brique
        //On met un espace entre les briques de 10 px
        espaceBrique: 10,
        //Un espace entre la première rangée de brique et le haut du Canvas de 50 px
        distanceHaut: 50,
        //Un espace entre la première colonne de brique et le coté gauche du Canvas de 85 px
        distanceGauche: 85,
        murDeBriques: [],

        //On prépare le mur par rapport au nombre de colonnes et rangées voulues
        preConstruction: function(){
            for(var c = 0; c < this.nbColonnes ; c++){
                //À chaque brique de la colonne on attribue une rangée de briques
                this.murDeBriques[c] = [];
                for(var r=0; r < this.nbRangees; r++){
                    //À chaque brique on attribue une position qui sera modifiée par la suite sinon toute serait au même endroit et on attribue un status qui permettra de définir si oui ou non la brique est cassée, elles sont initialement définies à 1
                    this.murDeBriques[c][r] = { 
                        x: 0,
                        y: 0,
                        status: 1 
                    };
                }
            }
        },

        //On termine la construction en donnant à chaque brique sa propre position, et on vérifie si la brique n'est pas cassée (on reconstruit le mur à chaque fois car le Canvas est mis au clair toute les 10 ms)
        construction: function(){
            //On parcourt chaque brique de chaque colonnes et chaque rangées
            for(var c=0; c < this.nbColonnes; c++){
                for(var r=0; r < this.nbRangees; r++){
                    //Si la brique existe toujours
                    if(this.murDeBriques[c][r].status == 1){
                        //Gestion de la position des briques
                        var briqueX = (c*(this.brique.largeur + this.espaceBrique)) + this.distanceGauche;
                        var briqueY = (r*(this.brique.hauteur + this.espaceBrique))+ this.distanceHaut;
    
                        this.murDeBriques[c][r].x = briqueX;
                        this.murDeBriques[c][r].y = briqueY;
                        
                        //On dessine la brique avec ces infos 
                        ctx.beginPath();
                        ctx.rect(briqueX, briqueY,this.brique.largeur,this.brique.hauteur);
                        ctx.fillStyle = this.couleur;
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        },

        //Gestion du système de collision des briques
        collision: function(){
            this.construction();
            //On parcourt chaque brique de chaque colonnes et chaque rangées
            for(var c = 0; c < this.nbColonnes; c++){
                for(var r = 0; r < this.nbRangees; r++){
                    var uneBrique = this.murDeBriques[c][r];
                    //Si la brique existe toujours
                    if(uneBrique.status == 1){
                        ////On vérifie si la balle touche une brique en regardant si ces coordonnées sont comprises dans celle de la brique
                        if(balle.x > uneBrique.x && balle.x < uneBrique.x + this.brique.largeur && balle.y > uneBrique.y && balle.y < uneBrique.y + this.brique.hauteur){
                            //Effet sonore a chaque brique cassée
                            jeu.audio.src = (jeu.playlist[2]);
                            jeu.audio.pause();
                            jeu.audio.play();
                            //Au contact avec la brique qui a été casser on donne à la balle une trajectoire opposée
                            balle.dy = -balle.dy;
                            //On initialise le status de la brique à 0 pour la considérer comme cassée
                            uneBrique.status = 0;
                            //Chaque brique cassée rapporte 1 point
                            jeu.points++
                            //Lorsque toutes les briques sont cassées, fin de la partie
                            if(jeu.points == this.nbColonnes * this.nbRangees){
                                //On stop le "rafraichissement" du jeu 
                                clearInterval(partie);
                                //Effet sonore quand on gagne
                                jeu.audio.src = (jeu.playlist[1]);
                                jeu.audio.pause();
                                jeu.audio.play();
                                //Après un court délai on nous redirige vers la partie du cv concerné
                                setTimeout(function() {
                                    window.location.replace('formation.html');
                                },2000); 
                            }
                        }
                    }
                }
            }
            
        }
    };

    //Lancement du jeu ////////////////////////////////////////////////////////////////
    //Cette fonction est appelée seul car elle doit être exécuté une seule fois sinon le mur serait indestructible car reconstruit a chaque "clear"
    murDeBriques.preConstruction();
    //On met le setInterval dans une variable pour arrêter le jeu quand on gagne/perd
    var partie = setInterval(jeu.dessin,8);
})