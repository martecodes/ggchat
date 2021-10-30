const arrowUp = document.getElementsByClassName("fa-arrow-alt-circle-up");
const arrowDown = document.getElementsByClassName("fa-arrow-alt-circle-down");
const trash = document.getElementsByClassName("fa-trash-alt");

Array.from(arrowUp).forEach(function (element) {
    element.addEventListener('click', function () {
        const msg = this.parentNode.parentNode.childNodes[1].innerText
        const arrowUp = parseFloat(this.parentNode.parentNode.childNodes[3].innerText)

        fetch('warzone', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                msg: msg,
                arrowUp: arrowUp
            })
        })
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(data => {
                console.log(data)
                window.location.reload(true)
            })
    });
});

Array.from(arrowDown).forEach(function (element) {
    element.addEventListener('click', function () {
        const msg = this.parentNode.parentNode.childNodes[1].innerText
        const arrowDown = parseFloat(this.parentNode.parentNode.childNodes[3].innerText)
        fetch('warzoneDown', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                msg: msg,
                arrowUp: arrowDown
            })
        })
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(data => {
                console.log(data)
                window.location.reload(true)
            })
    });
});

Array.from(trash).forEach(function (element) {
    element.addEventListener('click', function () {
        const name = this.parentNode.parentNode.parentNode.childNodes[1].childNodes[3].innerText
        const msg = this.parentNode.parentNode.childNodes[1].innerText
        fetch('warzone', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                msg: msg
            })
        }).then(function (response) {
            window.location.reload()
        })
    });
});
