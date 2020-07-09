$(function(){

    //1 seconde apres le lancement de la page une annonce apparait
    setTimeout(function(){
        $('#box_annonce').css('display','block');
    },1000);

    //Au survole du titre principal l'annonce apparait
    $('#titre').mouseover(function(){
        $('#box_annonce').css('display','block');
    })

    //Fait apparaitre une boite de dialogue qui propose de jouer ou de voir la partie du cv directement lorsque l'on clique sur une des 3 partie principal du cv
    $('#navigation > ul > li:nth-child(1)').click(function(e){
        $('#box_choix').css('display','block');
        $('#choix > a:nth-child(1)').attr('href','#');
        $('#choix > a:nth-child(2)').attr('href','#');
        })

    $('#navigation > ul > li:nth-child(2)').click(function(e){
        $('#box_choix').css('display','block');
        $('#choix > a:nth-child(1)').attr('href','#');
        $('#choix > a:nth-child(2)').attr('href','#');
        })
    
    $('#navigation > ul > li:nth-child(3)').click(function(e){
        $('#box_choix').css('display','block');
        $('#choix > a:nth-child(1)').attr('href','#');
        $('#choix > a:nth-child(2)').attr('href','#');
        })

    //Fait disparaitre la boite de dialogue en cliquant sur la croix 
    $('.croix').click(function(){
        $('#box_choix').css('display','none');
    })

    $('.croix').click(function(){
        $('#box_choix2').css('display','none');
    })

    $('.croix').click(function(){
        $('#box_annonce').css('display','none');
    })

    //permet d'ouvrire une boite de dialogue pour proser une des 2 versions du cv a telecharger (reste a trouver le moyen de les faire telecharger)
    $('#download_item').click(function(e){
        $('#box_choix2').css('display','block');
        $('#choix > a:nth-child(1)').attr('href','#');
        $('#choix > a:nth-child(2)').attr('href','#');
        })

})