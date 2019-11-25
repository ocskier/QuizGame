const listEl = document.getElementById('list');

async function start() {
    try {
        const data = await getData('https://opentdb.com/api.php?amount=10&category=20&difficulty=easy&type=multiple');
        console.log(data.results);
        // data.results.map(item=>{
        //     const li = document.createElement('li');
        //     li.textContent = item.question;
        //     listEl.append(li);
        // })
    } catch (error) {
        console.error(error);
    }
}

async function getData(url = '') {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrer: 'no-referrer',
    });
    return await response.json();
}

start();