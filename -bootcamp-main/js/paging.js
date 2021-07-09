document.getElementById('paging').addEventListener('click', 
function(){
    document.querySelector('.paging').style.display = 'flex';
});
document.querySelector('.closeing').addEventListener('click', 
function(){
    document.querySelector('.paging').style.display = 'none';
});