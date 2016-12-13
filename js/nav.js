/* 
 * Simple code to toggle the class "expand" on the navigation menu system when on mobiles
 * Toggled when the Menu Button is clicked
 */
jQuery(function($){
    $('.menu_button').click(function(){
        $('.menu_items').toggleClass('expand')
        $('.menu_item').toggleClass('expand')
    })
})