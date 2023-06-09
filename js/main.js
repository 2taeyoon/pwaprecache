const form = document.querySelector('form');
const boxes = document.querySelectorAll('.list');

// 각 Todo List에 해당하는 배열과 객체를 생성
let fromId, toId;
let todoList = [];
let doingList = [];
let doneList = [];

const lists = {
    todo: todoList,
    doing: doingList,
    done: doneList
}

// Todo List를 Local Storage에 저장하는 함수
const saveList = (listName) => {
    localStorage.setItem(listName, JSON.stringify(lists[listName]));
}

// 드래그 중인 요소가 다른 요소 위에 올라갈 때 호출되는 이벤트 핸들러
const dragOver = (event) => {
    event.preventDefault();
    const targetId = event.target.id;

    // Lists 객체의 key인 todo, doing, done에 대해 반복
    const listIds = Object.keys(lists);
    if (listIds.includes(targetId)) { // 드래그 중인 요소가 해당 Lists 객체의 key와 같은지 확인
        toId = targetId; // Lists의 객체와 같으면 targetId 값을 가져옴
    }
}

// 드래그 시작 시 호출되는 이벤트 핸들러
const dragStart = (event) => {
    fromId = event.target.parentElement.id; // 드래그 중인 요소가 속한 List의 id를 저장
}

// 드래그 종료 시 호출되는 이벤트 핸들러
const dragEnd = (event) => {
    const itemId = event.target.id; // 드래그한 요소의 id를 저장

    // 드래그한 요소를 이동시킬 List가 같은 경우 함수를 종료
    if (fromId === toId) {
        return;
    }

    // 이동한 요소를 이전 List에서 제거하고, 새로운 List에 추가
    event.target.remove();

    lists[fromId] = lists[fromId].filter((item) => {
        if (item.id !== itemId) {
        return item;
        } else {
        createElement(toId, item);
        }
    });


    // List를 Local Storage에 저장
    saveList(fromId);
    saveList(toId);
}

// 마우스 오른쪽을 누르면 아이템 삭제하는 함수 선언
const removeItem = (event) => {
    event.preventDefault();
    console.log(event.target);
    const { id } = event.target;
    const { id:parentId } = event.target.parentElement;
    event.target.remove(); // 클릭한 아이템 삭제
    
    // 삭제한 아이템이 속해있는 배열을 의미
    lists[parentId] = lists[parentId].filter((aa)=>{
        return aa.id !== id; // 내가 삭제한 아이디와 같지 않은 아이디는 삭제 안해!
    });

    saveList(parentId);
}



// 새로운 요소를 생성하는 함수
const createElement = (listId, item) => {
    const list = document.querySelector(`#${listId}`);
    const newItem = document.createElement('div');

    newItem.id = item.id;
    newItem.innerText = item.text;
    newItem.className = 'item';
    newItem.draggable = true;

    // 드래그 시작, 종료 이벤트를 추가
    newItem.addEventListener('dragstart', dragStart);
    newItem.addEventListener('dragend', dragEnd);

    // 마우스 오른쪽을 누르면 삭제하는 함수 발생
    newItem.addEventListener('contextmenu', removeItem)

    // 새로운 요소를 해당 List에 추가하고, 배열에도 추가
    list.append(newItem);
    lists[listId].push(item);
}

// 새로운 Todo를 생성하는 함수
const createTodo = (event) => {
    event.preventDefault(); // 폼의 기본 전송을 제거

    const input = document.querySelector('input'); // 입력 필드를 선택

    const id = uuidv4(); // uuidv4로 고유 ID를 생성

    const newTodo = { // 새로운 Todo 객체 생성
        id: id,
        text: input.value
    };

    createElement('todo', newTodo); // Todo 목록에 새로운 Todo 아이템을 추가

    input.value = ''; // 입력 필드를 초기화

    saveList('todo'); // Todo 목록을 로컬 스토리지에 저장
};

const loadList = ()=>{
    const userTodoList = JSON.parse(localStorage.getItem('todo'));
    const userDoingList = JSON.parse(localStorage.getItem('doing'));
    const userDoneList = JSON.parse(localStorage.getItem('done'));
    //console.log(userTodoList);

    if(userTodoList){
        userTodoList.forEach((todo)=>{
            createElement('todo', todo);
        });
    }

    userDoingList && userDoingList.forEach((doing)=>{
        createElement('doing', doing);
    });

    userDoneList && userDoneList.forEach((done)=>{
        createElement('done', done);
    });
}


loadList(); // 로컬스토리지에 저장된 데이터를 불러오는 함수 실행
form.addEventListener('submit',createTodo);

boxes.forEach((box)=>{
    box.addEventListener('dragover', dragOver);
});