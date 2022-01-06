let currentCash = 0;
const exchangeRate = 1800;
let wonClicked = 0;
let dollarClicked = 0;


const buttons = document.querySelectorAll(".btn_money button");
const btnReturns = document.querySelectorAll(".btn_return");
const modals = document.getElementsByClassName("modal");

let productBtns;
let items;
let price;
let albumImgs;
const modalCloseBtns = document.getElementsByClassName("close");


     $.ajax({
             url: "albumInfo.json",
	async:false,
             method: "GET",
             dataType: "json",
            success:function(data){ 
	//jsonData = data;
	let divBody = document.getElementById("swiper-wrapper"); 
        	        $.each(data, function(index, item) {
		//amount : 배열로 저장해서 잔고 관리하면 됨
		//    => 물건을 팔때마다 json활용해서 POST로 잔고 JSON에 업데이트
		//price & desc : 동적으로 html생성
		console.log("_______________________________");
		console.log(index + "번쨰 json 원소");
		console.log(item.price);
		console.log(item.amount);
		console.log(item.desc); 	

  				
		let wrapper = document.createElement("div");
		wrapper.setAttribute("class","swiper-slide");

		let img = document.createElement("img");
		img.setAttribute("class","display_img");
		img.setAttribute("id","popimg0"+ parseInt(index+1));
		img.setAttribute("src","img/album0"+ parseInt(index+1)+".png");
		img.setAttribute("alt",item.alt);

		let items = document.createElement("div");
		items.setAttribute("class","item");
		items.setAttribute("id","item0"+(index+1));
		
		
		let price = document.createElement("span");
		price.setAttribute("class","price");
		price.textContent = item.price;
		items.textContent = "원";
		items.appendChild(price);
		wrapper.appendChild(img);
		wrapper.appendChild(items);
		divBody.appendChild(wrapper);
	});
		document.querySelectorAll(".item").forEach((btnReturn) => {	
                              btnReturn.addEventListener('click', buy, false);
                          });
             },
            error: function(data){
                   console.log('STATUS: '+textStatus+'\nERROR THROWN: '+errorThrown);
             }
   }).then( (ret1,ret2) => {
	productBtns = document.querySelectorAll(".item");
             items = document.getElementsByClassName("item");
             price = document.getElementsByClassName("price");
             albumImgs = document.getElementsByClassName("display_img");
  });
        function handleCash(inputMoney) {
        const queryID = this.id;
        console.log("Handle cash" + " " + queryID);
        console.log("sdfafas");
        if (queryID.indexOf('cent') !== -1 || queryID.indexOf('dollar') !== -1) {
            if (wonClicked === 1) {
                alert("dollar 를 넣을 수 없습니다. 원 단위 돈을 넣어주세요.");
                return;
            }
            console.log("dollarclicked");
            dollarClicked = 1;
            updateCash(this.value);
        } else {
            if (dollarClicked === 1) {
                alert("원 단위를 넣을 수 없습니다. dollar를 넣어주세요.");
                return;
            }
            wonClicked = 1;
            updateCash(this.value);
        }
        changeActive();

        // if(parseFloat(this.value) > 50 ) { //won
        //     if(dollarClicked === 1) {
        //         alert("you cannot click won");
        //         return;
        //     }
        //     wonClicked = 1;
        //    updateCash(this.value);
        // } else { //dollar
        //     if(wonClicked === 1 ) {
        //         alert("you cannot click dollar");
        //         return;
        //     }
        //     dollarClicked = 1;
        //     updateCash(this.value);     
        // }
        // changeActive();
    }

    function updateCash(val) {
        // currentCash 에만 parseFloat 를 쓴 이유 : floor 한 값이 반올림이기때문에
        // 반올림한걸 빼면 원가격이 마이너스가 될 수도 있기 때문에 parseFloat 한다.
        // 10.156 - 10.15 = 0.006 이면 2째자리에서 자를거기 때문에 0이 된다.
        // 계산을 정확하게 하기 위해서임
        currentCash += parseFloat(val); // 20 -> 10900 구매해볼것(13.94, parseFloat대신 Math.floor)
        console.log(currentCash + " " + val + "  " + Math.floor(val * 100) / 100);
        
        //parsefloat : 소수점까지 다 살려서 반영
        //floor : 반올림
        let moneyCount;
        // console.log(val);
        if (wonClicked === 1) {
            moneyCount = document.getElementById("moneyCount");
        } else {
	console.log("updateCasdh->dollar");
	console.log(currentCash);
            moneyCount = document.getElementById("dollarCount");
        }
        moneyCount.value = Math.floor(currentCash * 100) / 100;
        //math.floor : 주어진 수 이하의 가장 큰 정수.
    }

    function changeActive() {
        let newCash = currentCash;
        if (dollarClicked == 1) {
            newCash = newCash * exchangeRate;
        }

        for (let i = 0; i < price.length; i++) {
            let currentPrice = parseInt(price[i].textContent);
            //parseInt : 문자열 인자를 파싱하여 특정 진수의 정수를 반환
            //   console.log(val + "   " + parseInt(price[i].textContent));
            if (newCash >= currentPrice) {
                items[i].classList.add("on");
            } else {
                items[i].classList.remove("on");
            }
        }
    }


    function buy() {
        let buyPrice = this.textContent;
        console.log("buy~~~~");
      
        buyPrice = buyPrice.replace("원", "");

        if (dollarClicked === 1) {
            buyPrice = buyPrice / exchangeRate;
        };

        if (currentCash >= buyPrice) {
            alert("구매 완료");
	//updateAlbumAmount(this.id);
            printPurchaseImage(this.id);
            updateCash(buyPrice * -1);

        } else {
            alert("잔액이 부족합니다. 현금을 넣어주세요.");
        };
        changeActive();
    }

    function restReturn() {
        // 0일 때 반환 안되도록
        // if(currentCash === 0) return;

        printReturnValue();
        updateCash(-1 * currentCash);
        changeActive();
        clearImage();
        wonClicked = 0;
        dollarClicked = 0;
    }

    function clearImage() {
        let imageBody = document.getElementById("receiveList");

        // console.log(imageBody.childNodes);
        while (imageBody.childNodes.length > 2) {
            imageBody.removeChild(imageBody.lastChild);
        }
    }

    function initReturnInfo() {
        let tableBodySet = document.getElementById("table").getElementsByTagName("tbody")[0];
        console.log("xxxxx");
        console.log(tableBodySet.childNodes);
        while (tableBodySet.childNodes.length !== 0) {
            tableBodySet.removeChild(tableBodySet.lastChild);
        }
    }

    function printPurchaseImage(id) {
        let purchaseImageID = id;
        imageList = document.getElementById("receiveList");
        console.log("xxxxx");
        console.log(purchaseImageID);
        purchaseImageID = purchaseImageID.replace("item", "album");
        let newImage = document.createElement("img");
        newImage.setAttribute("src", "img/" + purchaseImageID + ".png");
        console.log(newImage);
        imageList.appendChild(newImage);
    }

    function printReturnValue() {
        let tableBody = document.getElementById("table").getElementsByTagName('tbody')[0];
        let val = Math.floor(currentCash * 100); // divid 100 multiply 100 so it can be simplify.
        let dividor;
        document.getElementById("returnTotal").textContent = Math.floor(currentCash * 100) / 100;
        initReturnInfo();

        let unitType;
        if (wonClicked === 1) {
            unitType = " (원)";
            dividor = new Array(100, 500, 1000, 5000, 10000, 50000);
        } else {
            unitType = " ($)";
            dividor = new Array(0.01, 0.05, 0.10, 0.25, 0.5, 1, 2, 5, 10, 20, 50);
        }
        document.getElementsByClassName("type").textContent = unitType;

        //큰돈부터 잔돈 거슬러 주기 위해 -1로 시작
        for (let i = dividor.length - 1; i >= 0; i--) {
            let amount = parseInt(dividor[i] * 100); //amount는 계속 바뀜 50000 부터 곱하기 100은 달러도 같이 처리할 수 있도록 만들려고
            //소수점 버리고 몫만 가져와야 하니까 paserint 처리
            if (parseInt(val / amount) !== 0) {
                const row = document.createElement("tr");
                const td1 = document.createElement("td");
                const td2 = document.createElement("td");

                td1.appendChild(document.createTextNode(dividor[i]));
                td2.appendChild(document.createTextNode(parseInt(val / amount)));
                row.appendChild(td1);
                row.appendChild(td2);
                tableBody.appendChild(row);
                val -= (amount * parseInt(val / amount));
            }
        }
        document.getElementById("totalAmount").textContent = unitType;
    }


    function Modal(num) {
	//console.log("modal");

         albumImgs[num].onclick = function () {
            modals[num].style.display = "block";
        };

        modalCloseBtns[num].onclick = function () {
            modals[num].style.display = "none";
        };
    };

 

    window.onclick = function (event) {
        if (event.target.className == "modal") {
            event.target.style.display = "none";
        }
    };



productBtns.forEach((button) => { 
       console.log(button.id);
        button.addEventListener('click', buy);
    });

    buttons.forEach((button) => { 
       console.log(button.id);
        button.addEventListener('click', handleCash, false);
    });

   console.log("item class");
    
    btnReturns.forEach((btnReturn) => {
        btnReturn.addEventListener('click', restReturn, false);
    });


   for (var i = 0; i < albumImgs.length; i++) {
       console.log("Dddd");
        Modal(i);
    }


    // swiper
    let ww = window.innerWidth;
    let mySwiper = undefined;

    function initSwiper() {
        // mySwiper == undefined
        if (ww < 680 && mySwiper == undefined) {
            mySwiper = new Swiper(".swiper-container", {
                slidesPerView: 3,
                spaceBetween: 10,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        } else if (ww >= 680 && mySwiper != undefined) {
            // mySwiper == object
            mySwiper.destroy();
            mySwiper = undefined;
        }
    }

    initSwiper();

    window.addEventListener('resize', function () {
        ww = window.innerWidth;
        initSwiper();
    });
    // e swiper

// 팝업 1개로
// const pops = document.querySelectorAll(".display_img");
// const popups = document.querySelectorAll(".popup");
// pops.forEach( (pop) => {
//     pop.addEventListener('click', openPop);
// });
// console.log(pops[0].id)
// function openPop () {
//     if ( pops.id.substr(6) === popups.target.id.substr(3) ) {
//         popups.style.display = 'block'
//     }
// }

