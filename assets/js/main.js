$(function(){

    //Objet qui regroupe tous les boutons 
    var bouton = {
        bacceuil: $('body > div.acceuil > button'),
        bson:$('#center > div:nth-child(1) > button:nth-child(1)'),
        bvolume: $('#center > div:nth-child(3) > button:nth-child(1)'),
        bcontact: $('#center > div:nth-child(1) > button:nth-child(2)'),
        bapropos: $('#center > div:nth-child(3) > button:nth-child(2)'),
        bdownload: $('#download_item'),
        bformation: $('#navigation > ul > li:nth-child(1)'),
        bexp: $('#navigation > ul > li:nth-child(2)'),
        bproj: $('#navigation > ul > li:nth-child(3)'),
        bcroix: $('.croix'),
        boui: $('.choix > a:nth-child(1)'),
        bnon: $('.choix > a:nth-child(2)'),
    }

    //Objet qui regroupe les box
    var box = {
        annonce: $('#box_annonce'),
        proj: $('.box_choix.projet'),
        exp: $('.box_choix.experience'),
        form: $('.box_choix.formation'),
        apropos: $('.box_apropos'),
        contact: $('.box_contact'),
    }


    //1 seconde après le lancement de la page une annonce apparaît
    setTimeout(function(){
        box.annonce.show();
    },1000);
    
    //Fait apparaissait une boîte de dialogue qui propose de jouer ou bien de voir la partie du cv directement lorsque l'on clique sur une des 3 parties principales du cv et fait apparaitre la boîte de dialogue du bouton propos et contact
    bouton.bformation.click(function(){
        box.form.show();
        bouton.boui.click(function(){
            window.location.href='brickbreaker.html';
        })
        bouton.bnon.click(function(){
            window.location.href='formation.html';
        })
        })

    bouton.bexp.click(function(){
        box.exp.show();
        bouton.boui.click(function(){
            window.location.href='snake.html';
        })
        bouton.bnon.click(function(){
            window.location.href='experience.html';
        })
        })
    
    bouton.bproj.click(function(){
        box.proj.show();
        bouton.boui.click(function(){
            window.location.href='index.html';
        })
        bouton.bnon.click(function(){
            window.location.href='projet.html';
        })
        })

    bouton.bapropos.click(function(){
        box.apropos.show();
        })
    
    bouton.bcontact.click(function(){
        box.contact.show();
        })

    //Retire toute les box en cliquant sur la croix 
    bouton.bcroix.click(function(){
        Object.getOwnPropertyNames(box).forEach(
            function(i) {
              box[i].hide();
            })
    })

    //Redirection vers la page d'accueil
    bouton.bacceuil.click(function(){
        window.location.href='index.html';
    })

    //Redirection pour telecharger le CV
    bouton.bdownload.click(function(){
        window.open('img/cvbasique.pdf');
    })

    //Gestion du son d'arrière-plan  
    var clique = new Audio('audio/clique.mp3');
    var son = new Audio('audio/intro.mp3');
    son.loop = true;

    bouton.bson.click(function(){
            if (son.paused) {
                //Active le son d'arriere plan
                son.play();
                //Modification du style du bouton
                bouton.bson.css('background-color','black'); 
                bouton.bson.css('color','white'); 
                bouton.bson.css('border','3px solid white');
            }
            else {
                //Stop le son d'arriere plan
                son.pause();
                //Modification du style du bouton
                bouton.bson.css('background-color','white'); 
                bouton.bson.css('color','black'); 
                bouton.bson.css('border','3px solid black');
            }
    })

    //Gestion du volume des interactions
    bouton.bvolume.click(function(){
        if (clique.paused) {
           //Parcours tous les attributs de l'objet bouton et active le son
            for (var propriete in bouton) {
                bouton[propriete].click(function(){
                    clique.play();
                })
              }
            //Modification du style du bouton
            bouton.bvolume.css('background-color','black'); 
            bouton.bvolume.css('color','white'); 
            bouton.bvolume.css('border','3px solid white');
        }
        else {
            //Stop le son de tout les bouton
            for (var propriete in bouton) {
                bouton[propriete].click(function(){
                    clique.pause();
                })
              }
            //Modification du style du bouton
            bouton.bvolume.css('background-color','white'); 
            bouton.bvolume.css('color','black'); 
            bouton.bvolume.css('border','3px solid black');
        }
    })
    
})