let currentCash = 0;
const exchangeRate = 1200;
let wonClicked = 0;
let dollarClicked = 0;
const items = document.getElementsByClassName("item");
const price = document.getElementsByClassName("price");
const buttons = document.querySelectorAll(".btn_money button");
const productBtns = document.querySelectorAll(".item");
const btnReturns = document.querySelectorAll(".btn_return");

function ViewSearch() {
    document.getElementById("SearchLayer").style.display = 'inline'
}
function CloseSearch() {
    document.getElementById("SearchLayer").style.display = 'none'
}


document.addEventListener("DOMContentLoaded", function () {

    function openPop() {
        if (pops.id.substr(6) === popups.target.id.substr(3)) {
            popups.style.display = 'block'
        }
    }


    function handleCash(inputMoney) {
        const query = this.id;
        if (query.indexOf('cent') !== -1 || query.indexOf('dollar') !== -1) {
            if (wonClicked === 1) {
                alert("you cannot click dollar");
                return;
            }
            dollarClicked = 1;
            updateCash(this.value);
        } else {
            if (dollarClicked === 1) {
                alert("you cannot click won");
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
        currentCash += parseFloat(val); // 20 -> 10900 구매해볼것(13.94, parseFloat대신 Math.floor)
        console.log(currentCash + " " + val + "  " + Math.floor(val * 100) / 100);
        let moneyCount;
        console.log(val);
        if (wonClicked === 1) {
            moneyCount = document.getElementById("moneycount");
        } else {
            moneyCount = document.getElementById("dollarmoneycount");
        }
        moneyCount.value = Math.floor(currentCash * 100) / 100;
    }

    function changeActive() {
        let val = currentCash;

        if (dollarClicked == 1) {
            val = val * exchangeRate;
        }
        for (var i = 0; i < price.length; i++) {
            var currentPrice = parseInt(price[i].textContent);
            //   console.log(val + "   " + parseInt(price[i].textContent));
            if (val >= currentPrice) {
                items[i].classList.add("on");
            } else {
                items[i].classList.remove("on");
            }
        }
    }

    function buy() {

        var x = this.textContent;
        console.log(x);
        x = x.replace("원", "");

        if (dollarClicked === 1) {
            x = x / exchangeRate;
        }
        if (currentCash >= x) {
            alert("구매 완료");

            printPurchaseImage(this.id);
            updateCash(x * -1);

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
        let imagebody = document.getElementById("receive_list");

        console.log(imagebody.childNodes);
        while (imagebody.childNodes.length > 2) {
            imagebody.removeChild(imagebody.lastChild);
        }
    }

    function initReturnInfo() {
        let imagebody = document.getElementById("retValuebody").getElementsByTagName("tbody")[0];
        console.log("xxxxx");
        console.log(imagebody.childNodes);
        while (imagebody.childNodes.length !== 0) {
            imagebody.removeChild(imagebody.lastChild);
        }
    }

    function printPurchaseImage(id) {
        var attr = id;
        imagebody = document.getElementById("receive_list");
        console.log("xxxxx");
        console.log(attr);
        attr = attr.replace("item", "album");
        var newImage = document.createElement("img");
        newImage.setAttribute("src", "img/" + attr + ".png");
        console.log(newImage);
        imagebody.appendChild(newImage);
    }

    function printReturnValue() {
        let tablebody = document.getElementById("retValuebody").getElementsByTagName('tbody')[0];
        let val = Math.floor(currentCash * 100); // divid 100 multiply 100 so it can be simplify.
        let dividor;
        document.getElementById("returnTotal").textContent = Math.floor(currentCash * 100) / 100;
        initReturnInfo();

        let retType;
        if (wonClicked === 1) {
            retType = " (원)";
            dividor = new Array(100, 500, 1000, 5000, 10000, 50000);
        } else {
            retType = " ($)";
            dividor = new Array(0.01, 0.05, 0.10, 0.25, 0.5, 1, 2, 5, 10, 20, 50);
        }
        document.getElementsByClassName("type").textContent = retType;

        for (var i = dividor.length - 1; i >= 0; i--) {
            var amount = parseInt(dividor[i] * 100); //amount는 계속 바뀜 50000 부터 곱하기 100은 달러도 같이 처리할 수 있도록 만들려고
            //소수점 버리고 몫만 가져와야 하니까 paserint 처리
            if (parseInt(val / amount) !== 0) {
                var row = document.createElement("tr");

                var d1 = document.createElement("td");
                var d2 = document.createElement("td");

                d1.appendChild(document.createTextNode(dividor[i]));
                d2.appendChild(document.createTextNode(parseInt(val / amount)));
                row.appendChild(d1);
                row.appendChild(d2);
                tablebody.appendChild(row);
                val -= (amount * parseInt(val / amount));
            }
        }
        document.getElementById("moneyname").textContent = retType;
    }



    buttons.forEach((button) => {
        button.addEventListener('click', handleCash, false);
    });

    document.querySelectorAll(".item").forEach((productBtn) => {
        productBtn.addEventListener('click', buy);
    });

    btnReturns.forEach((btnReturn) => {
        btnReturn.addEventListener('click', restReturn, false);
    });
});

const pops = document.querySelectorAll(".display_img");
// const popups = document.querySelectorAll(".popup");

pops.forEach((pop) => {
    pop.addEventListener('click', openPop);
});

// console.log(pops[0].id)
function openPop() {
    console.log(document.getElementById("SearchLayer"));
    console.log(document.getElementById("SearchLayer").textContent);

    document.getElementById("abc").textContent = this.alt;
    document.getElementById("SearchLayer").style.display = 'inline';

}


