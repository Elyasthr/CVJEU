$(function(){

    //Objet qui regroupe tout les bouton 
    var boutton = {
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
        boui: $('#choix > a:nth-child(1)'),
        bnon: $('#choix > a:nth-child(2)'),
    }

    //Objet qui regroupe les box
    var box = {
        annonce: $('#box_annonce'),
        titre: $('#titre'),
        proj: $('.projet'),
        exp: $('.experience'),
        form: $('.formation'),
        choix: $('.box_choix'),
        apropos: $('.box_apropos'),
        contact: $('.box_contact'),
    }

    //1 seconde apres le lancement de la page une annonce apparait
    setTimeout(function(){
        box.annonce.show();
    },1000);

    //Au survole du titre principal l'annonce apparait
    box.titre.mouseover(function(){
        box.annonce.show();
    })

    //Fait apparaitre une boite de dialogue qui propose de jouer ou de voir la partie du cv directement lorsque l'on clique sur une des 3 partie principal du cv et fait apparaitre une boite de dialogue a propos et contact
    boutton.bformation.click(function(){
        box.form.show();
        boutton.boui.attr('href','#');
        boutton.bnon.attr('href','#');
        })

    boutton.bexp.click(function(){
        box.exp.show();
        boutton.boui.attr('href','#');
        boutton.bnon.attr('href','#');
        })
    
    boutton.bproj.click(function(){
        box.proj.show();
        boutton.boui.attr('href','#');
        boutton.bnon.attr('href','#');
        })
    
    boutton.bapropos.click(function(){
        box.apropos.show();
        })
    
    boutton.bcontact.click(function(){
        box.contact.show();
        })

    //Fait disparaitre la boite de dialogue en cliquant sur la croix 
    boutton.bcroix.click(function(){
        box.choix.hide();
        box.annonce.hide();
        box.apropos.hide();
        box.contact.hide();
    })

    //Redirection
    boutton.bacceuil.click(function(){
        window.location.href='index.html';
    })

    boutton.bdownload.click(function(){
        window.open('img/cvbasique.pdf');
    })

    //Gestion du son d'arriere plan et  volume d'interaction
    var clique = new Audio('audio/clique.mp3');
    var son = new Audio('audio/intro.mp3');
    son.loop = true;

    boutton.bson.click(function(){
            if (son.paused) {
                son.play();
                boutton.bson.css('background-color','black'); 
                boutton.bson.css('color','white'); 
                boutton.bson.css('border','3px solid white');
            }
            else {
                son.pause();
                boutton.bson.css('background-color','white'); 
                boutton.bson.css('color','black'); 
                boutton.bson.css('border','3px solid black');
            }
    })

    boutton.bvolume.click(function(){
        if (clique.paused) {
           //Parcours tout les attribut de l'objet boutton
            for (var propriete in boutton) {
                boutton[propriete].click(function(){
                    clique.play();
                })
              }
            boutton.bvolume.css('background-color','black'); 
            boutton.bvolume.css('color','white'); 
            boutton.bvolume.css('border','3px solid white');
        }
        else {
            for (var propriete in boutton) {
                boutton[propriete].click(function(){
                    clique.pause();
                })
              }
            boutton.bvolume.css('background-color','white'); 
            boutton.bvolume.css('color','black'); 
            boutton.bvolume.css('border','3px solid black');
        }
    })

    
})