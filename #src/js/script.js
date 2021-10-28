"use strict";

(function () {
    let originalPositions = [];
    let daElements = document.querySelectorAll('[data-da]');
    let daElementsArray = [];
    let daMatchMedia = [];
    //Заполняем массивы
    if (daElements.length > 0) {
        let number = 0;
        for (let index = 0; index < daElements.length; index++) {
            const daElement = daElements[index];
            const daMove = daElement.getAttribute('data-da');
            if (daMove != '') {
                const daArray = daMove.split(',');
                const daPlace = daArray[1] ? daArray[1].trim() : 'last';
                const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
                const daDestination = document.querySelector('.' + daArray[0].trim())
                if (daArray.length > 0 && daDestination) {
                    daElement.setAttribute('data-da-index', number);
                    //Заполняем массив первоначальных позиций
                    originalPositions[number] = {
                        "parent": daElement.parentNode,
                        "index": indexInParent(daElement)
                    };
                    //Заполняем массив элементов 
                    daElementsArray[number] = {
                        "element": daElement,
                        "destination": document.querySelector('.' + daArray[0].trim()),
                        "place": daPlace,
                        "breakpoint": daBreakpoint
                    }
                    number++;
                }
            }
        }
        dynamicAdaptSort(daElementsArray);

        //Создаем события в точке брейкпоинта
        for (let index = 0; index < daElementsArray.length; index++) {
            const el = daElementsArray[index];
            const daBreakpoint = el.breakpoint;
            const daType = "max"; //Для MobileFirst поменять на min

            daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
            daMatchMedia[index].addListener(dynamicAdapt);
        }
    }
    //Основная функция
    function dynamicAdapt(e) {
        for (let index = 0; index < daElementsArray.length; index++) {
            const el = daElementsArray[index];
            const daElement = el.element;
            const daDestination = el.destination;
            const daPlace = el.place;
            const daBreakpoint = el.breakpoint;
            const daClassname = "_dynamic_adapt_" + daBreakpoint;

            if (daMatchMedia[index].matches) {
                //Перебрасываем элементы
                if (!daElement.classList.contains(daClassname)) {
                    let actualIndex = indexOfElements(daDestination)[daPlace];
                    if (daPlace === 'first') {
                        actualIndex = indexOfElements(daDestination)[0];
                    } else if (daPlace === 'last') {
                        actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
                    }
                    daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
                    daElement.classList.add(daClassname);
                }
            } else {
                //Возвращаем на место
                if (daElement.classList.contains(daClassname)) {
                    dynamicAdaptBack(daElement);
                    daElement.classList.remove(daClassname);
                }
            }
        }
        customAdapt();
    }

    //Вызов основной функции
    dynamicAdapt();

    //Функция возврата на место
    function dynamicAdaptBack(el) {
        const daIndex = el.getAttribute('data-da-index');
        const originalPlace = originalPositions[daIndex];
        const parentPlace = originalPlace['parent'];
        const indexPlace = originalPlace['index'];
        const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
        parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
    }
    //Функция получения индекса внутри родителя
    function indexInParent(el) {
        var children = Array.prototype.slice.call(el.parentNode.children);
        return children.indexOf(el);
    }
    //Функция получения массива индексов элементов внутри родителя 
    function indexOfElements(parent, back) {
        const children = parent.children;
        const childrenArray = [];
        for (let i = 0; i < children.length; i++) {
            const childrenElement = children[i];
            if (back) {
                childrenArray.push(i);
            } else {
                //Исключая перенесенный элемент
                if (childrenElement.getAttribute('data-da') == null) {
                    childrenArray.push(i);
                }
            }
        }
        return childrenArray;
    }
    //Сортировка объекта
    function dynamicAdaptSort(arr) {
        arr.sort(function (a, b) {
            if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 } //Для MobileFirst поменять
        });
        arr.sort(function (a, b) {
            if (a.place > b.place) { return 1 } else { return -1 }
        });
    }
    //Дополнительные сценарии адаптации
    function customAdapt() {
        const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
}());

$(document).ready(function () {
    $('.header__burger').click(function (event) {
        $('.header__burger').toggleClass('header__burger--active');
        $('.header__menu').toggleClass('header__menu--active');
        $('body').toggleClass('body__lock');
    });
});

$(document).ready(function () {
    $('.header__search').click(function (event) {
        $('.header__link--bpr').addClass('header__link--bpr-active');
        $('.header__input').addClass('header__input--active');
        $('.header__input--close').addClass('header__input--close-active');
    });
});

$(document).ready(function () {
    $('.header__input--close').click(function (event) {
        $('.header__link--bpr').removeClass('header__link--bpr-active');
        $('.header__input').removeClass('header__input--active');
        $('.header__input--close').removeClass('header__input--close-active');
    });
    $('#howwork__item_01').click(function (event) {
        $('#howwork__item_01').addClass('howwork__item--orange');
        $('#howwork__tab_01').addClass('howwork__block--visible');
        $('#howwork__item_02, #howwork__item_03, #howwork__item_04').removeClass('howwork__item--orange');
        $('#howwork__tab_02, #howwork__tab_03, #howwork__tab_04').removeClass('howwork__block--visible');
    });
    $('#howwork__item_02').click(function (event) {
        $('#howwork__item_02').addClass('howwork__item--orange');
        $('#howwork__tab_02').addClass('howwork__block--visible');
        $('#howwork__item_01, #howwork__item_03, #howwork__item_04').removeClass('howwork__item--orange');
        $('#howwork__tab_01, #howwork__tab_03, #howwork__tab_04').removeClass('howwork__block--visible');
    });
    $('#howwork__item_03').click(function (event) {
        $('#howwork__item_03').addClass('howwork__item--orange');
        $('#howwork__tab_03').addClass('howwork__block--visible');
        $('#howwork__item_02, #howwork__item_01, #howwork__item_04').removeClass('howwork__item--orange');
        $('#howwork__tab_02, #howwork__tab_01, #howwork__tab_04').removeClass('howwork__block--visible');
    });
    $('#howwork__item_04').click(function (event) {
        $('#howwork__item_04').addClass('howwork__item--orange');
        $('#howwork__tab_04').addClass('howwork__block--visible');
        $('#howwork__item_02, #howwork__item_03, #howwork__item_01').removeClass('howwork__item--orange');
        $('#howwork__tab_02, #howwork__tab_03, #howwork__tab_01').removeClass('howwork__block--visible');
    });
});

new Swiper('.advantage__slider', {
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    simulateTouch: false,
    autoHight: true,
    slidesPerViev: 1,
    loop: true,
    autoplay: {
        delay: 3000
    },
    
});