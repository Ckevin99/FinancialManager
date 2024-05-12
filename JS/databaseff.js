import { initializeApp} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import {key} from './startkey.js';

// const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');


// Initialize Firebase


const app = initializeApp(key);
const db = getFirestore(app);


async function delete_all() {

    await setDoc(doc(db, 'people', 'user'), {
      budget: null,
      expenses: [],
      incomes: [],
      name: "Kevin"

})
location.reload();
};


function data_request(){
  return new Promise(function(resolve){
    getDoc(doc(db, 'people', 'user'))
      .then((res) => {
          resolve( res.data());
      })
  });
}
let data = await data_request();






class People {
  constructor(name, expensesList, incomesList, budget) {
    this.name = name;
    this.expenses = expensesList;
    this.incomes = incomesList;
    this.budget = budget;
  }

  expense(value, description) {
      this.expenses.push({"value": value, "description": description});
  }

  income(value, description) {
    this.incomes.push({ "value": value, "description": description });
  }
}

// Supondo que 'data' é um objeto com as propriedades necessárias
let user = new People(data["name"], data["expenses"], data["incomes"], data["budget"]);
function start_data()
 {
      update_front(user.expenses, "expenses_listed")
      update_front(user.incomes, "incomes_listed")
      recalcuate_budget()
  }
start_data()


// Agora você pode chamar o método expense sem erros
function button_expense(){
  if (document.getElementById('input_box_value').value == "" || document.getElementById('input_box_description').value == ""){
    document.getElementById("console_answer").innerHTML = "Please type a value"
    
  }else {
    var value = parseInt(document.getElementById('input_box_value').value);
    if ( !Number.isNaN(value)){

      var description = document.getElementById('input_box_description').value;
      user.expense(value, description)
      update_front(user.expenses, "expenses_listed")
      button_shared()
    }
    else{
      document.getElementById("console_answer").innerHTML = "Invalid number"
    }
  }
}
function button_income(){
  if (document.getElementById('input_box_value').value == "" || document.getElementById('input_box_description').value == ""){
    document.getElementById("console_answer").innerHTML = "Please type a value"
  }else {
    var value = parseInt(document.getElementById('input_box_value').value);
    if (!Number.isNaN(value))
      {
        var description = document.getElementById('input_box_description').value;
        user.income(value, description)
        update_front(user.incomes, "incomes_listed")
        button_shared()
      }
    else{
      document.getElementById("console_answer").innerHTML = "Invalid number"
    }
  }
}
function recalcuate_budget()
{
    let total_incomes = 0;
    let total_expenses = 0;
    for (let i=0; user.expenses.length>i; i++)
    {
        total_expenses += user.expenses[i].value;
    }
  for (let i=0; user.incomes.length>i; i++)
    {
      total_incomes += user.incomes[i].value;
    }
  let remaining = total_incomes-total_expenses
  

  document.getElementById('total_text_expenses').innerHTML = total_expenses +" $";
  document.getElementById('total_text_incomes').innerHTML = total_incomes +" $";
  document.getElementById('total_text_remaining').innerHTML = remaining +" $";
}

function button_shared()
{
    document.getElementById('input_box_value').value ="";
    document.getElementById('input_box_description').value="";
    document.getElementById("console_answer").innerHTML = ""
    recalcuate_budget()

}

function update_front(listkind, stringname)
{
    document.getElementById(stringname).innerHTML = '';
    for (var i= 0; i<listkind.length;i++){
        var item = document.createElement('li')
        item.textContent = listkind[i].value + " $ : " + listkind[i].description;
        document.getElementById(stringname).appendChild(item) 
  } 
}

async function upload_data(){
  const data = {
    name: user.name, 
    expenses: user.expenses,
    incomes: user.incomes,
    budget: user.budget

  };

  const db_data = doc(db, 'people', 'user');
  await updateDoc(db_data, data);

}


document.getElementById('expense_button').addEventListener('click', button_expense);

document.getElementById('income_button').addEventListener('click', button_income);
document.getElementById("save_button").addEventListener('click', upload_data)
document.getElementById("delete_button").addEventListener('click', delete_all)





// async function dataget(){
//   const docSnap = await getDoc(doc(db, 'people', 'user'));
//   let result = await docSnap.data()
//   return result
  
  // }
  // let data = dataget().then(result => {
  //   return result
  // }).catch(error => {
  //   console.error("Error getting document:", error);
  // });
  // console.log(data)