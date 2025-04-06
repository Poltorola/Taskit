
// --------------------------------- JS for Main page -------------------------------

let cards = [];
const FILE_PATH = "tasks.json";


function toggleCard(id, is_done){                       // makes checked taskss pale
    const card =  document.getElementById(`card_${id}`);
    if (is_done){
        card.className = 'card is_done';
    } else {
        card.className = 'card';
    }
}


function cardID(cards){       // calculates task's id
    if (cards.length == 0){
        return 1;
    }
    lastCard = cards[cards.length - 1].id;
    newID = lastCard + 1;
    return newID;
}


async function loadCards() {        // fetches existing tasks from server in form of json
    try {
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


function updateCardData(id, is_done, name, desc){   // registers task's changes
    const index = cards.findIndex(c => c.id == id);
    if (index !== -1){
        cards[index].is_done = is_done;
        cards[index].name = name;
        cards[index].desc = desc;
    }
    debounced_saveCards();
}


function rearrangeCards(){
    console.log("rearrangeCards");
    let n = 0;
    cards.forEach(element => {  // to update all tasks' ids and to change their order, we delete and recreate each card
        n += 1;
        // if(element.id === n){
        //     return;
        // }
        dom_card = document.getElementById(`card_${element.id}`);
        element.id = n;
        dom_card.remove();
        createCardElement(element.id, element.is_done, element.name, element.desc);
    });
    saveCards();
}


function deleteCard(id){                            // deleting tasks on 'X' click
    const index = cards.findIndex(c => c.id == id);
    if (index !== -1){
        cards.splice(index, 1);
        const element = document.getElementById(`card_${id}`);
        if(element){
            element.remove()
        }
    }
    
    // console.log(cards);
    rearrangeCards();
}


function saveCards(){
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
    checkbox.id = 'task_checkbox';
    checkbox.className = 'task_status';
    checkbox.checked = is_done;

    const btn = document.createElement('button');       // delete button
    btn.textContent = 'X';
    btn.className = 'remove_card_btn';
    btn.addEventListener('click', () => deleteCard(id));

    const up = document.createElement('button');        // move task up
    up.textContent = '▲';
    up.className = 'up_task_btn';
    up.addEventListener('click', () => moveCard(id, 'up'));

    const down = document.createElement('button');      // move task down
    down.textContent = '▼';
    down.className = 'down_task_btn';
    down.addEventListener('click', () => moveCard(id, 'down'));

    const input = document.createElement('input');  // task title field
    input.type = 'text'
    input.value = name;
    input.maxLength = 200;

    const textarea = document.createElement('textarea'); // task description field
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
    card.appendChild(up);
    card.appendChild(down);
    document.getElementById("cardContainer").appendChild(card);
}


document.getElementById("Button").addEventListener("click", function() { // adds card on button "+" click
    if (cards.length > 7){
        return;
    }
    const id = cardID(cards);
    createCardElement(id);
    cards.push({id, name: '', desc: '', is_done: false});
    
});


function moveCard(id, direction){
    const dom_card =  document.getElementById(`card_${id}`); // card from DOM
    index = cards.findIndex(c => c.id == id);                // card index in local array

    if (dom_card.className == 'card_is_done'){       // move checked tasks to the bottom
        cards.push(cards.splice(index, 1));          // delete task from its place, and paste it in the end

    } else if (direction == 'down'){                           // move task down
        if (id >= cards.length){                                //next_card.className == 'card_is_done'
            return;
        }
        if (cards[index].is_done == false && cards[index + 1].is_done == true){
            return;
        }
        next_card = document.getElementById(`card_${id + 1}`);  // next task is_done, can't move down
        [cards[index], cards[index+1]] = [cards[index+1], cards[index]];
        
    } else if (direction == 'up'){            // move task up
        if (id == 1){                         // first task, can't move up
            return;
        }
        if (cards[index - 1].is_done == false && cards[index].is_done == true){
            return;
        }
        [cards[index], cards[index-1]] = [cards[index-1], cards[index]];
    }

    // Now changing our html
    rearrangeCards();
}


loadCards();


/*DEBUG NOTES*/
