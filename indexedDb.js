const container = document.querySelector('.container');
const ms = document.querySelector('.ms');

let users = []
function fetchAndPutUsers() {
    start = start || Date.now();
    fetch('https://jsonplaceholder.typicode.com/photos')
        .then(response => response.json())
        .then((users) => {
            console.log(users);
            users.forEach((user) => {
            const tx = db.transaction("usersStore", "readwrite")
            tx.onerror = e => console.log( ` Error! ${e.target.error}  `)
            const users = tx.objectStore("usersStore")
            let userPut = users.put(user)
            userPut.onsuccess = function(e) {
                console.log(e);
            }
            userPut.onerror = function(e) {
                console.log(e);
            }
        })
        return users
    })
        .then((users) => {
            console.log(users);
            users.forEach(user => {
                let p = document.createElement('p');
                p.innerHTML = user.title;
                container.append(p);
            })
            end = end || Date.now();
            console.log(end - start + ' ms')
            let p2 = document.createElement('p');
            p2.innerHTML = end - start + 'ms';
            ms.append(p2);
        }).catch((e) => console.log(e))
}

let request = window.indexedDB.open('USERS', 1);

let db;
let tx;
let index;

request.onerror = function(event) {
    console.log('There was an error', event);
}


request.onupgradeneeded = function(e) {
    start = Date.now();
    db = request.result,
    usersStore = db.createObjectStore('usersStore', {
        keyPath: "id"
    }),
    // another way
    // store = db.createObjectStore("QuestionStore", {
    //     autoIncrement: true
    // })
    index = usersStore.createIndex('username', 'username', {unique: false})
}

let start;
let end;

// do all your transactions in onsuccess!
request.onsuccess = function(event) {
    start = Date.now();
    db = request.result,
    console.log('Event => ', event);
    //fetchAndPutUsers();

    tx = db.transaction('usersStore', 'readonly');
    usersStore = tx.objectStore('usersStore');
    index = usersStore.index('username');

    let getAllUsers = usersStore.getAll();

    getAllUsers.onsuccess = function() {
        if (getAllUsers.result.length === 0) {
            fetchAndPutUsers();
        } else {

            console.log(getAllUsers.result);
            getAllUsers.result.forEach(item => {
                let p = document.createElement('p');
                p.innerHTML = item.title;
                container.append(p);
            })
            end = end || Date.now();
            let p2 = document.createElement('p');
            p2.innerHTML = end - start + 'ms';
            ms.append(p2);
        }
    }
}
