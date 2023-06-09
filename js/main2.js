const form = document.querySelector('form');
const boxes = document.querySelectorAll('.list');

    // 시작점과 끝점을 알기 위한 변수(.list의 id값)
let from;
let to;

let todoList =[];
let doingList =[];
let doneList =[];

let lists = { 
    todo : todoList,
    doing : doingList,
    done : doneList
}

// .list가 (item이) 드래그 되는걸 인식할 때, 발생하는 함수
const dragOver = (e) => {  // 기본 작업을 없애주면 드래그시 +표시로 바뀜
    //console.log(e.target.id);
    e.preventDefault();   
    const { id : targetId } = e.target;  
    const listIds = Object.keys(lists); //오브젝트의 키값만 
    
    if(listIds.includes(targetId)){ // 마우스가 지나가는 곳 id가 셋중 하나와 같을때만
        to = targetId; // 도착(이동) 지점을 의미하는 to에 대입
    }
}

const dragStart = (e) => {  
    from = e.target.parentElement.id;  // 드래그가 시작하는 지점의 id값
    console.log(from)
}
const dragEnd = (e) => {
    if(from === to) {  
        return; 
    }
    e.target.remove();    
    
    const { id } = e.target;

    lists[from] = lists[from].filter((item) => {
        if(item.id !== id){ // 같은 list 내부에서는 삭제 X
        return item
        } else { createItem(to,item) }
    })
    //console.log(from, lists[from])
    //console.log(to, lists[to])
    saveList(from);   //로컬 스토리지 업데이트
    saveList(to);
}

//오른쪽 마우스를 누르면 아이템을 삭제하는 함수
const removeItem =(e)=>{
    e.preventDefault();
    const { id } = e.target;
    const { id:parentId } = e.target.parentElement ;
    console.log(parentId);

    e.target.remove();
    lists[parentId] = lists[parentId].filter((aa) =>{
        return aa.id !== id;
    })
    saveList(parentId)
}


//item엘리먼트 만들어주는 함수선언
const createItem = (listId,aa) => {
    const list = document.querySelector(`#${listId}`);
    const item = document.createElement('div'); 
    
    item.id = aa.id; // 함수 createTodo안의 createItem('todo', newTodo)에서 받아온 아이디로 사용
    item.innerText = aa.text;
    item.classList.add('item');
    item.draggable = 'true';  // 드래그할 수 있는 기능

    item.addEventListener('dragstart',dragStart); // 드래그 시작했을 때 발생하는 함수
    item.addEventListener('dragend',dragEnd); // 드래그 끝났을 때 발생하는 함수
    item.addEventListener('contextmenu',removeItem) //오른쪽 마우스를 누르면 아이템을 삭제하는 함수 실행


    list.appendChild(item);  
    lists[listId].push(aa);  // 아이템 생성 후 마지막으로 배열에 넣어준다
}

//로컬스토리지에 저장하는 함수 선언
const saveList =(aa)=>{
    localStorage.setItem(aa,JSON.stringify(lists[aa]))
}

//입력값을 받아오고, 아이디 만들고, 새로운 아이템 만들어주는 함수
const createTodo = (e) => {
    e.preventDefault();  // 자동으로 새로고침되는 효과를 막아줌
    const input = document.querySelector('input');
    const id = uuidv4();  // uuid라이브러리를 연결해서 아이디 생성

    const newTodo = {
        id,
        text :input.value,
    }  
    createItem('todo', newTodo) //item만드는 함수 실행, 들어갈list의 아이디todo/newTodo를 인자로 남겨줌
    input.value= '';  
    saveList('todo')
}
const loadList =()=>{
    const userTodoList = JSON.parse(localStorage.getItem('todo'));
    const userDoingList = JSON.parse(localStorage.getItem('doing'));
    const userDoneList = JSON.parse(localStorage.getItem('done'));

    if(userTodoList) {
        userTodoList.forEach((aa)=>{
        createItem('todo',aa)
        });
    }
    if(userDoingList) {
        userDoingList.forEach((aa)=>{
        createItem('doing',aa)
        });
    }
    if(userDoneList){
        userDoneList.forEach((aa)=>{
        createItem('done',aa)
        })
    }
}

loadList(); //로컬스토리지에 저장된 데이터를 불러옴
form.addEventListener('submit',createTodo);

boxes.forEach((box) =>{
    box.addEventListener('dragover',dragOver); // 드래그 중인 요소가 다른 요소 위에 있을 때 함수 발생
});
