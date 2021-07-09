const token = localStorage.getItem('token')
//console.log("Hello " + token)

var statusSearch = 1
var searchPage = 1
var numberBuy = ""
var noButtonActive = true
var character_id = 0;
searchLottery();

const validLogin = isLoggedIn()
//console.log(validLogin)
if(!validLogin){
    alert("Please login first");
    window.location.href = "./index.html";
}

readInfo();

async function readInfo() {
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", "8af8e5a938ec9e8162ec532b77c3a0c3e3dbc1f61710ce5dbe7f51cf4018137a");
    myHeaders.append("Authorization", token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:8080/app/character/getCharacterInfo", requestOptions)
    const tmp = await response.json()
    const charInfo = {
        "username": tmp.character.username,
        "gold": tmp.character.gold,
    }
    document.getElementById("charID").innerHTML = tmp.character.id;
    character_id = document.getElementById("charID").innerHTML;

    document.getElementById("name").innerHTML = "Hello, " + charInfo.username;
    document.getElementById("money").innerHTML = "Money: " + charInfo.gold;
}

function isLoggedIn () {
	const token = localStorage.getItem('token')
	//console.log(token)
	if (token) return true
	else return false
}

async function autoRedirect () {
	const validLogin = await isLoggedIn()
	//console.log(validLogin)
	if (!validLogin) console.log('Not pass');window.location = '/';
	if (validLogin) console.log('Pass');window.location.href="./betting.html";
}

async function searchLottery() {
    const searchForm = document.getElementById("search-form");
    const numberSearch = searchForm.lotternumber.value;
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", "8af8e5a938ec9e8162ec532b77c3a0c3e3dbc1f61710ce5dbe7f51cf4018137a");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    var raw = JSON.stringify({
        "status": 1,
        "round_id": 0,
        "lottery_number": numberSearch,
        "character_id": 0,
        "paging_index": searchPage,
        "paging_size": 25
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:8080/app/lottery/stock", requestOptions)
    const tmp = await response.json()

    if (tmp.detail.length == 0) {
        alert("This lottery number is bought already or not exist.")
        return
    }

    //console.log(tmp)
    var i = 0
    if (numberSearch == "") {
        tmp.detail.forEach(function (item) {
            document.getElementById("superText"+i).innerHTML = item.lottery_number;
            i++;
            //console.log(item.lottery_number)
        })
    }else {
        tmp.detail.forEach(function (item) {
            if (i == 0) {
                document.getElementById("superText0").innerHTML = item.lottery_number;
            }
            //console.log(item.lottery_number)
        })
        for(;i < 25;i++) {
            if (i != 0) {
                document.getElementById("superText"+i).innerHTML = "###";
            }
        }
    }
    //document.getElementById("paging").innerHTML = searchPage;
}

async function buyLottery() {

    numberSearch = "";
    document.getElementById('loading-screen').innerHTML = "Loading...";
    noButtonActive = false

    var myHeaders = new Headers();
    myHeaders.append("x-api-key", "8af8e5a938ec9e8162ec532b77c3a0c3e3dbc1f61710ce5dbe7f51cf4018137a");
    myHeaders.append("Authorization", token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "lottery_number": numberBuy,
        "item_id": 7,
        "quantity": 1
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:8080/app/market/buy", requestOptions)
    const tmp = await response.json()
    const statusCode = tmp.message_code
    //console.log(statusCode)
    if(statusCode == "0000") { alert("Buy success"); }
    else if(statusCode == "70009") { alert("This lottery number is bought already.")}
    else if(statusCode == "70010") { alert("You do not have enough money.")}


    document.querySelector('.confirmpopup').style.display = 'none';

    document.getElementById('loading-screen').innerHTML = "Buy this lottery number?";
    document.getElementById('prob-btn').disabled = false;

    searchLottery()
    readInfo()
    noButtonActive = true

}

async function listLottery() {
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", "8af8e5a938ec9e8162ec532b77c3a0c3e3dbc1f61710ce5dbe7f51cf4018137a");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    var raw = JSON.stringify({
        "status": 2,
        "round_id": 0,
        "lottery_number": "",
        "character_id": parseInt(character_id),
        "paging_index": 1,
        "paging_size": 1000
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const response = await fetch("http://localhost:8080/app/lottery/stock", requestOptions)
    const tmp = await response.json()

    var i = 1
    tmp.detail.forEach(function (item) {
        console.log(item.lottery_number)
        document.getElementById("show-lotto"+i).innerHTML = item.lottery_number;
        i++;
        //console.log(item.lottery_number)
    })

}

async function LeftPage() {
    if(searchPage > 1) searchPage--;
    searchLottery()
}

async function RightPage() {
    if(searchPage < 41) searchPage++;
    searchLottery()
}

function closeBtn() {
    if (noButtonActive) document.querySelector('.confirmpopup').style.display = 'none';
}

document.getElementById('buylottery00').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText0').innerHTML

});


document.getElementById('buylottery01').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText1').innerHTML
});


document.getElementById('buylottery02').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText2').innerHTML
});


document.getElementById('buylottery03').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText3').innerHTML
});


document.getElementById('buylottery04').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText4').innerHTML
});


document.getElementById('buylottery05').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText5').innerHTML
});


document.getElementById('buylottery06').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText6').innerHTML
});


document.getElementById('buylottery07').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText7').innerHTML
});


document.getElementById('buylottery08').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText8').innerHTML
});


document.getElementById('buylottery09').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText9').innerHTML
});


document.getElementById('buylottery10').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText10').innerHTML
});


document.getElementById('buylottery11').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText11').innerHTML
});


document.getElementById('buylottery12').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText12').innerHTML
});


document.getElementById('buylottery13').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText13').innerHTML
});


document.getElementById('buylottery14').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText14').innerHTML
});


document.getElementById('buylottery15').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText15').innerHTML
});


document.getElementById('buylottery16').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText16').innerHTML
});


document.getElementById('buylottery17').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText17').innerHTML
});


document.getElementById('buylottery18').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText18').innerHTML
});


document.getElementById('buylottery19').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText19').innerHTML
});


document.getElementById('buylottery20').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText20').innerHTML
});


document.getElementById('buylottery21').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText21').innerHTML
});


document.getElementById('buylottery22').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText22').innerHTML
});


document.getElementById('buylottery23').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText23').innerHTML
});


document.getElementById('buylottery24').addEventListener('click',
function(){
    document.querySelector('.confirmpopup').style.display = 'flex';
    numberBuy = document.getElementById('superText24').innerHTML
});
