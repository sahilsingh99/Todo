//alert('connected')
//about create text node
// var h = document.createElement('h1')
// var myvalue = document.createTextNode('hello this is new h1')
// h.appendChild(myvalue);
// document.querySelector('h1').appendChild(h);
// todo work project

var ul = document.getElementById('list');
var li;

var addButton = document.getElementById('add');
addButton.addEventListener('click',addItem);

var removeButton = document.getElementById('remove');
removeButton.addEventListener('click',removeItem);

var removeAll = document.getElementById('removeAll');
removeAll.addEventListener('click',removeAllItem);

function addItem(){

    //console.log('Add Button is clicked!');
    var input = document.getElementById('input');
    var item = input.value;
    ul = document.getElementById('list');
    var textnode = document.createTextNode(item);
    
    if(item === ''){
        
        let p = document.createElement('p');
        p.textContent = ('Enter your todo');
        // var insertp = document.getElementsByClassName('controls');
        var control = document.querySelector('.controls')
        // let insertb = document.getElementById('add')
        //console.log(control.children)
        control.insertBefore(p,control.children[2])
        setTimeout(() => {
            p.remove();
        },2000);

    }
    else {
        // create li
        li=document.createElement('li');
        
        // create checkbox
        var checkbox = document.createElement('input');
        checkbox.type='checkbox';
        checkbox.setAttribute('id','check');

        //create label;
        var label = document.createElement('label');
        label.setAttribute('for','item');//optional

        // add these elements on web page

        ul.appendChild(label);
        li.appendChild(checkbox);
        // label.textContent = textnode
        label.appendChild(textnode);
        li.appendChild(label);
        ul.insertBefore(li,ul.children[0]);
        //console.log(ul.children)
        //li.setAttribute('class','visual')
        setTimeout(() => {
            li.className='visual';
        }, 2000);
        // console.log(ul.children)
    }

     input.value = ''

}

function removeItem(){
// console.log('Remove Button is clicked!');
    li=ul.children
    // console.log(li);
    for (let index = 0; index < li.length; index++) {
        // const element = li[index];
        // console.log(element);
        while(li[index] && li[index].children[0].checked){
            ul.removeChild(li[index])
        }
        
    }
}

function removeAllItem(){

    li=ul.children;

    for (let index = 0; index < li.length; index++) {
        // const element = array[index];
        while(li[index]){
            ul.removeChild(li[index]);
        }
        
    }
}