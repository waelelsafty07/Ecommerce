/* eslint-disable*/
import '@babel/polyfill';

import { Quicklook } from './api/quicklook';
import { getCategories } from './api/categories';
import { loginBuyer } from './api/login';
import { editeProfile } from './api/profile';

/**
 * add new input for add phone
 */
const addButton = document.querySelector('.add');
if(addButton) {
  addButton.addEventListener('click', async ()=>{
    const phone = document.getElementById('reg-phone');
    if(phone.classList.contains('none-input'))
      {
      phone.classList.remove('none-input');
      addButton.textContent = 'close';
    }
    else
      {
        phone.classList.add('none-input');
        addButton.textContent = 'change';
      }
  });
}
/**
 * add new input for change email
 */

const changeButton = document.querySelector('.change');
if(changeButton) {
  changeButton.addEventListener('click', async ()=>{
    const email = document.getElementById('reg-email');
    if(email.classList.contains('none-input'))
      {
      email.classList.remove('none-input');
      changeButton.textContent = 'close';
    }
    else
      {
        email.classList.add('none-input');
        changeButton.textContent = 'change';
      }
  });
}
/**
 * edit Data User 
 */
  const editeUser =  document.querySelector('.edit-profile');
  if(editeUser) {
    editeUser.addEventListener('submit', async (e) =>{
      e.preventDefault();
      console.log('hell');
      const fname= document.getElementById('reg-fname').value;
      const lname= document.getElementById('reg-lname').value;
      const username = document.getElementById('reg-username').value;
      let day= document.getElementById('day').value;
      let month= document.getElementById('month').value;
      let year= document.getElementById('year').value;
      let phone= document.getElementById('reg-phone').value;
      let email= document.getElementById('reg-email').value;
      const gender= document.getElementById('gender').value;
      day = parseInt(day);
      month = parseInt(month);
      year = parseInt(year);
      phone = parseInt(phone);
      
      const data ={
        fristName:fname,
        lastName:lname,
        username:username,
        day:day,
        month:month,
        year:year,
        gender:gender,
        phone:phone,
        email:email
      }
      await editeProfile(data);
    });
  }
  
/**
 * login take inputs and sent request to Api 
 */
  const loginfrom = document.querySelector('.login-buyer-form')
  if (loginfrom) {
    loginfrom.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        loginBuyer(email, password);
    });
}
/**
 * quick Model View fetch product
 */
const quickModel = document.querySelectorAll('.qiucker');
if(quickModel){
  const quickArray = Array.from(quickModel);
  const name = document.querySelector('.pd-detail__name');
  const price = document.querySelector('.pd-detail__price');
  const discount = document.querySelector('.pd-detail__discount');
  const del = document.querySelector('.pd-detail__del');
  const reviewQunitiy = document.querySelector('.reviewQunitiy');
  const stock = document.querySelector('.pd-detail__stock');
  const description = document.querySelector('.pd-detail__preview-desc');
  const wishlist = document.querySelector('.pd-detail__click-count');
  const categories = document.querySelector('.categories');
  const breadname = document.querySelector('.breadname');
  
  
  
  for(let i = 0; i < quickArray.length; i++) {
    let response;
    quickArray[i].addEventListener('click',async ()=>{
      const id = quickArray[i].getAttribute('data-product-id');
      console.log(id);
      response = await Quicklook(id);
      name.textContent = response.singleProduct.name;
      breadname.textContent = response.singleProduct.name;
      if(response.singleProduct.priceDiscount){
        discount.textContent = response.singleProduct.priceDiscount;
        price.textContent = response.singleProduct.price;
        del.textContent = response.singleProduct.price - response.singleProduct.priceDiscount / 100
      }
      else
      {
        price.textContent = `$${response.singleProduct.price}`;
        discount.textContent = '';
        del.textContent = ''
        
      }
      reviewQunitiy.textContent = `(${response.singleProduct.ratingsQuantity})`
      stock.textContent = `${response.singleProduct.stock} in stock`
      description.textContent = response.singleProduct.description
      wishlist.textContent = ` (${response.singleProduct.wishlist})`
      if(response.singleProduct.Categories){
        categories.textContent = response.singleProduct.Categories.name     }
      
    })
  }
}


/**
 * get categories list
 */

const CategoryList = document.querySelector('.CATEGORY');
if(CategoryList)
{
  const categoryList = document.getElementById('fetchCategories');
  (async function get(){
    const response = await getCategories();
    console.log(response.Categories);
    Array.from(response.Categories).forEach(category => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      
      li.className = 'has-list';
      const text = document.createTextNode(category.name);
      link.appendChild(text);
      li.appendChild(link);
      categoryList.appendChild(li);
    })
  })();
}