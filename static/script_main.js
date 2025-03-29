
// --------------------------------- JS for Main page -------------------------------

let cards = [];
const FILE_PATH = "tasks.json";

function toggleCard(id, is_done){                       // makes checked cards pale
    const card =  document.getElementById(`card_${id}`);
    if (is_done){
        card.className = 'card is_done';
    } else {
        card.className = 'card';
    }
}

function cardID(cards){                 // TODO change id calculation
    if (cards.length == 0){
        return 1;
    }
    lastCard = cards[cards.length - 1].id;
    newID = lastCard + 1;
    return newID;
}

async function loadCards() {        // fetches existing cards from server in form of json
    try {
        // тут вместо хардкода url нужно чтобы flask сам подставлял что-то хз как
        const response = await fetch('/cards');
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        json.forEach(element => {
        // console.log(element.id, element.name, element.desc);
        createCardElement(element.id, element.is_done, element.name, element.desc);
        });
        cards = json;
    } catch (error) {
        console.error(error.message);
    }
}

function debounce(func, delay) {  // to prevent json spam with each new typed character
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function updateCardData(id, is_done, name, desc){   // task changes
    const index = cards.findIndex(c => c.id == id);
    if (index !== -1){
        cards[index].is_done = is_done;
        cards[index].name = name;
        cards[index].desc = desc;
    }
    debounced_saveCards();
}

function deleteCard(id){                            // deleting cards on 'X' click
    const index = cards.findIndex(c => c.id == id);
    if (index !== -1){
        cards.splice(index, 1);
        const element = document.getElementById(`card_${id}`);
        if(element){
            element.remove()
        }
    }
    let n = 0;
    // здесь, чтобы менять порядок всех элементов нужно по сути удалять все карты и создавать заново
    cards.forEach(element => {
        n += 1;
        if(element.id === n){
            return;
        }
        dom_card = document.getElementById(`card_${element.id}`);
        element.id = n;
        dom_card.remove();
        createCardElement(element.id, element.is_done, element.name, element.desc);
        // checkbox = dom_card.getElementByClassName('task_status');
        // btn = dom_card.getElementByClassName('remove_task_btn');
        // dom_card.id = `card_${n}`;
        
    });
    saveCards();
}

function saveCards(){
    // тут вместо хардкода url нужно чтобы flask сам подставлял что-то хз как
    fetch('/cards', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(cards)                     // saves card data into json
    });
}

const debounced_saveCards = debounce(saveCards, 1000);  // 1 sec data update delay 

function createCardElement(id, is_done=false, name='', desc=''){    // creating card
    const card = document.createElement('div');
    if (is_done){
        card.className = 'card is_done';        // complition status for task
    } else {
        card.className = 'card';
    }
    //console.log("created a card");
    card.id = `card_${id}`;

    const checkbox = document.createElement('input');   // checkbox TODO add CSS styles???
    checkbox.type = 'checkbox';
    checkbox.className = 'task_status';
    checkbox.checked = is_done;

    const btn = document.createElement('button');       // delete button
    btn.textContent = 'X';
    btn.className = 'remove_card_btn';
    btn.addEventListener('click', () => deleteCard(id));

    const input = document.createElement('input');  // task title field
    input.type = 'text'
    input.value = name;
    input.maxLength = 200;

    const textarea = document.createElement('textarea'); //task description field
    textarea.rows = 3;
    textarea.value = desc;
    textarea.maxLength = 500;
    
    checkbox.addEventListener('change', () => {     // check-out event
        toggleCard(id, checkbox.checked);
        updateCardData(id, checkbox.value, input.value, textarea.value);
    });
    input.addEventListener('input', () => updateCardData(id, checkbox.checked, input.value, textarea.value)); // input event
    textarea.addEventListener('input', () => updateCardData(id, checkbox.checked, input.value, textarea.value))

    card.appendChild(checkbox);
    card.appendChild(btn);
    card.appendChild(input);
    card.appendChild(textarea);
    document.getElementById("cardContainer").appendChild(card);
}

document.getElementById("Button").addEventListener("click", function() { // adds card on button "+" click
    if (cards.length > 7){
        return;
    }
    const id =  cardID(cards);
                      // to prevent spam, TODO: replace with authentification
    createCardElement(id);
    cards.push({id, name: '', desc: ''});
    
});

loadCards();


/*DEBUG NOTES*/

    /*если создать три карты, удалить карту 2 и создать новую карту
    вторая карта всё ещё будет иметь id 3, как и только что созданная
    в итоге чек и делит действуют на предыдущую карту с id 3 вместо новой
    : обновлять данные об айдишниках в json*/