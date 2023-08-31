$(document).ready(function () {
    const frameSel = document.getElementById('frame')
    if (frameSel) {
        const filterMaterial = document.getElementById('filter-material')
        $.ajax({
            type: "GET",
            url: "/data/config.json",
            dataType: "json",
            success: function (data) {
                data.forEach(function (product) {
                    if (product.type === "frame") {
                        let option = document.createElement('option');
                        option.text = product.name;
                        option.value = product.step;
                        frameSel.appendChild(option);
                    }
                    if (product.type === "material") {
                        let option = document.createElement('option');
                        option.text = product.name;
                        option.value = product.key;
                        filterMaterial.appendChild(option);
                    }
                    if (product.type === "size") {
                        let input = document.getElementById(product.key);
                        input.setAttribute('min', product.min);
                        input.setAttribute('max', product.max);
                        input.setAttribute('step', product.step);
                    }
                });
            },
            error: function (xhr, status, error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        });
        const materialsCont = document.getElementById('materials').querySelector('.line-catalog');
        const pipeCont = document.getElementById('pipe').querySelector('.line-catalog');
        let newBlock;
        function clickCard() {
            let materialsList = materialsCont.querySelectorAll('.card-catalog-wrapper');
            let pipeList = pipeCont.querySelectorAll('.card-catalog-wrapper');
            materialsList.forEach(function (el) {
                el.addEventListener('click', function () {
                    clear()
                    materialsList.forEach(function (card) {
                        card.classList.remove('card-catalog-wrapper_active');
                    });
                    el.classList.add('card-catalog-wrapper_active');
                    document.getElementById('pipe').classList.remove("d-none")
                });
            });
            pipeList.forEach(function (el) {
                el.addEventListener('click', function () {
                    pipeList.forEach(function (card) {
                        card.classList.remove('card-catalog-wrapper_active');
                    });
                    el.classList.add('card-catalog-wrapper_active');
                    document.getElementById('calculate').classList.remove("d-none")
                });
            });
        }
        $.ajax({
            type: "GET",
            url: "/data/data.json",
            dataType: "json",
            success: function (data) {
                data.forEach(function (product) {
                    newBlock = `<div class="card-catalog-wrapper " data-width="${product.width}" data-price="${product.price}" data-material="${product.material}">
                        <div class="text-card-wrapper">
                            <div class="wrapper-card-title">
                                <h4 class="name-card-item">${product.name}</h4>
                            </div>
                        </div>
                    </div>`;
                    if (product.type === "list") {
                        materialsCont.innerHTML += newBlock;

                    }
                    if (product.type === "pipe") {
                        pipeCont.innerHTML += newBlock;

                    }
                    clickCard()
                });
            },
            error: function (xhr, status, error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        });
    }

});
let selectSort = document.getElementById('filter-sort');
if (selectSort) {
    selectSort.addEventListener('change', function () {
        let sortBy = this.value;
        let materialsCont = document.getElementById('materials').querySelector('.line-catalog');
        let items = Array.from(materialsCont.querySelectorAll('.card-catalog-wrapper'));

        items.sort(function (a, b) {
            let aValue = parseFloat(a.getAttribute('data-' + sortBy.substring(0, 5)));
            let bValue = parseFloat(b.getAttribute('data-' + sortBy.substring(0, 5)));

            if (sortBy.endsWith('B')) {
                return bValue - aValue;
            } else {
                return aValue - bValue;
            }
        });

        // Очищаем контейнер и добавляем отсортированные элементы
        materialsCont.innerHTML = '';
        items.forEach(function (item) {
            materialsCont.appendChild(item);
        });
    });
}

let selectMat = document.getElementById('filter-material')
if (selectMat) {
    selectMat.addEventListener('change', function () {
        let filter = this.value;
        let items = document.getElementById('materials').querySelectorAll('.card-catalog-wrapper');
        items.forEach(function (el) {
            clear()
            el.classList.remove('d-none')
            if (filter === '0') {
                el.classList.remove('d-none')
            } else if (el.getAttribute('data-material') !== filter) {
                el.classList.add('d-none')
            }
        })
    });
}
function clear() {
    let materialsActive = document.getElementById('materials').querySelector('.card-catalog-wrapper_active');
    if (materialsActive) {
        materialsActive.classList.remove('card-catalog-wrapper_active')
    }
    let pipeActive = document.getElementById('pipe').querySelector('.card-catalog-wrapper_active');
    if (pipeActive) {
        pipeActive.classList.remove('card-catalog-wrapper_active')
    }
    document.getElementById('pipe').classList.add("d-none")
    document.getElementById('calculate').classList.add("d-none")
    document.getElementById('length').value = '';
    document.getElementById('width').value = '';
    document.getElementById('frame').value = '0';
    document.getElementById('result').innerHTML = '';
    document.getElementById('addCart').classList.add('d-none');

}

function validate() {
    let isValid = true;
    let inputs = document.querySelectorAll('.form-group input');
    let frameSelect = document.getElementById('frame');
    let frameValue = frameSelect.value;
    frameSelect.classList.remove('error');
    let errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(function (mes) {
        mes.remove();
    })

    inputs.forEach(function (inputElement) {
        inputElement.classList.remove('error');
        const minValue = parseFloat(inputElement.min);
        const maxValue = parseFloat(inputElement.max);
        let enteredValue = parseFloat(inputElement.value);
        if (inputElement.value.trim() === '') {
            isValid = false;
            inputElement.classList.add('error');
            let errorMessage = document.createElement('span');
            errorMessage.classList.add('error-message');
            errorMessage.innerText = 'Поле не должно быть пустым.';
            inputElement.parentNode.appendChild(errorMessage);
        } else if (enteredValue < minValue || enteredValue > maxValue) {
            isValid = false;
            inputElement.classList.add('error');
            let errorMessage = document.createElement('span');
            errorMessage.classList.add('error-message');
            errorMessage.innerText = 'Пожалуйста, введите корректные значения от ' + minValue + ' до ' + maxValue + '.';
            inputElement.parentNode.appendChild(errorMessage);
        }
    });





    if (frameValue === '0') {
        isValid = false;
        frameSelect.classList.add('error');
        let errorMessage = document.createElement('span');
        errorMessage.classList.add('error-message');
        errorMessage.innerText = 'Пожалуйста, выберите прочность.';
        frameSelect.parentNode.appendChild(errorMessage);
    }

    return isValid;
}

const calculateBtn = document.getElementById('calculateBtn');
if (calculateBtn) {
    calculateBtn.addEventListener('click', function () {
        let inputsIsValid = validate();
        if (inputsIsValid) {
            let list = document.getElementById('materials').querySelector('.card-catalog-wrapper_active');
            let pipe = document.getElementById('pipe').querySelector('.card-catalog-wrapper_active');
            let length = document.getElementById('length');
            let width = document.getElementById('width');
            let frame = document.getElementById('frame');
            let square = length.value * width.value;
            let cellSize = frame.value - (pipe.getAttribute('data-width') / 1000);
            let quantityList = Math.ceil(square / list.getAttribute('data-width'));
            let priceList = quantityList * list.getAttribute('data-price');
            let quantityScrew;
            let priceScrew;
            let quantityPipe = Math.ceil((Math.ceil((length.value - pipe.getAttribute('data-width') / 1000) / frame.value) * length.value) + (Math.ceil((width.value - pipe.getAttribute('data-width') / 1000) / frame.value) * width.value));
            let pricePipe = quantityPipe * pipe.getAttribute('data-price');
            $.ajax({
                type: "GET",
                url: "/data/config.json",
                dataType: "json",
                success: function (data) {
                    data.forEach(function (product) {
                        if (product.type === "fix" && product.key === list.getAttribute('data-material')) {
                            quantityScrew = Math.ceil(square * product.value);
                            $.ajax({
                                type: "GET",
                                url: "/data/data.json",
                                dataType: "json",
                                success: function (data) {
                                    data.forEach(function (product) {
                                        if (product.type === "fix") {
                                            priceScrew = quantityScrew * product.price;
                                            updateResults();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });

            function updateResults() {
                document.getElementById('result').innerHTML = `<h4>Площадь изделия: ${Math.ceil(square)}</h4>
        <h4>Размер ячейки: ${cellSize}X${cellSize}</h4>
        <table class="table">
            <thead>
              <tr>
                <th scope="col">Наименование</th>
                <th scope="col">ед.</th>
                <th scope="col">Кол-во</th>
                <th scope="col">Сумма</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${list.querySelector('.name-card-item').innerHTML}</td>
                <td>м<sup>2</sup></td>
                <td>${quantityList}</td>
                <td>${priceList}</td>
              </tr>
              <tr>
                <td>${pipe.querySelector('.name-card-item').innerHTML}</td>
                <td>мп</td>
                <td>${quantityPipe}</td>
                <td>${pricePipe}</td>
              </tr>
              <tr>
                <td>Саморез</td>
                <td>шт</td>
                <td>${quantityScrew}</td>
                <td>${priceScrew.toFixed(2).replace(/\.0+$/, '')}</td>
              </tr>
            </tbody>
            <tfoot>
            <tr>
            <th scope="col">Итого</th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">${priceList + pricePipe + priceScrew}</th>
          </tr>
          </tfoot>
          </table>`;
                document.getElementById('addCart').classList.remove('d-none');
            }
        }
    })
}
function saveResult() {
    let resultHTML = document.getElementById("result").innerHTML;
    let currentResults = JSON.parse(localStorage.getItem("savedResults")) || [];
    currentResults.push(resultHTML);
    localStorage.setItem("savedResults", JSON.stringify(currentResults));
    countResults();
}
let resultCart = document.querySelector('.cart')
if (resultCart) {
    displayResults()
}
function displayResults() {
    let results = JSON.parse(localStorage.getItem("savedResults")) || [];
    let output = document.querySelector(".cart");
    output.innerHTML = "";

    results.forEach((result, index) => {
        let resultDiv = document.createElement("div");
        resultDiv.innerHTML = result + "<button class='btn btn-danger' onclick='deleteResult(" + index + ")'>Удалить</button>";
        output.appendChild(resultDiv);
    });
}
function deleteResult(index) {
    let results = JSON.parse(localStorage.getItem("savedResults")) || [];
    results.splice(index, 1);
    localStorage.setItem("savedResults", JSON.stringify(results));
    displayResults();
    countResults();
}
function countResults() {
    let results = JSON.parse(localStorage.getItem('savedResults')) || [];
    let itemCount = results.length; 
    $('.cart-item-count').text(itemCount);
}

countResults();