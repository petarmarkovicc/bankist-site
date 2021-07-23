'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//smoote scroll================================================
btnScrollTo.addEventListener('click', function(e){
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());
  console.log('Current scroll (Y/X)', window.pageXOffset, window.pageYOffset);
  console.log('width/height viewport', document.documentElement.clientWidth, document.documentElement.clientHeight );

  //scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // });

  // modern way
  section1.scrollIntoView({behavior: 'smooth'});
})

///////////////////////////////////////
//Page navigation

// document.querySelectorAll('.nav__link').forEach(function(el){
//   //this is good approuch but is not usefull when we have a lot of elements because js 
//   // would copy a lot of function like this. To fix it we use event delegation
//   el.addEventListener('click', function(e){
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'})
//   })
// })

//event delegation: 
//1) First we add event listener to a common parent element of all the elements that we're 
//interested in.
//2) determine whet element originated the event
document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();
  //check if the click mathc the likns (Matching strategy)
  if(e.target.classList.contains('nav__link')){
     const id = e.target.getAttribute('href');
     document.querySelector(id).scrollIntoView({behavior: 'smooth'})
  }
}) 

// tabed component
//bed practice
// tabs.forEach(t => t.addEventListener('click', () => console.log('TAB') ));
tabsContainer.addEventListener('click', function(e){
  const clicked = e.target.closest('.operations__tab');
  //Guard clause
  if(!clicked) return;

  //Active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Activate content area
  tabsContent.forEach(c => c.classList.remove('operations__content--active'))
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
})

//Meny fade animation
const handleHover = function(e) {
    if (e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

// nav.addEventListener('mouseover', function(e){
//   if (e.target.classList.contains('nav__link')){
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');

//     siblings.forEach(el => {
//       if(el !== link) el.style.opacity = 0.5
//     });
//     logo.style.opacity = 0.5
//   }

// })

//pasing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1))


// nav.addEventListener('mouseout', function(e){
//   handleHover(e, 1);
// })


//Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function(){

//   if(window.scrollY > initialCoords.top) nav.classList.add('sticky') 
//   else nav.classList.remove('sticky')
// })

//Sticky navigation: Intersection Observer API

// const obsCallback = function(entries, observer){
//   entries.forEach(entry => {
//     console.log(entry)
//   })
// }

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2]
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries){
  const [entry] = entries;
  // console.log(entry);

  if(!entry.isIntersecting)   nav.classList.add('sticky');
  else   nav.classList.remove('sticky');

}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);

//Reveal sections 
const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer) {
  const[entry] = entries;
  // console.log(entry);

  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target)
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
});
allSections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden')
});

//Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if(!entry.isIntersecting)return;
  
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px'
})

imgTargets.forEach(img => imgObserver.observe(img))


// slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  //functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML('beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      )
    })
  }

  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }

  const goToslide = function (slide) {
    slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
  }

  //next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToslide(curSlide);
    activateDot(curSlide);


  }

  //prev slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToslide(curSlide);
    activateDot(curSlide);
  }

  const init = function () {
    createDots();
    activateDot(0);
    goToslide(0);

  }
  init();
  //event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToslide(slide);
      activateDot(slide);
    }
  })
}
slider();
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

/*
///////////////////////////////////////
// Selecting, Creating, and Deleting Elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections)

document.getElementById('section--1');

const allButtons = document.getElementsByTagName('button');
// with this we crete HTMLCollection whic will be automaticly updated when for example
//we delete one button element. On the other side querry selector can not be automaticly updated
//because the variable is created when all elements was here
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

//creating and inserting elements-----------------
//.insertAdjecentHTML

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved funcionality and analytics.'
message.innerHTML = 'We use cookies for improved funcionality and analytics. <button class="btn btn--close-cookie">Got it</button>';

// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

//Delete elements-------------------
document.querySelector('.btn--close-cookie').addEventListener('click', function() {
  // message.remove();
  message.parentElement.removeChild(message);
});

//Styles-----------------------
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

//reading style property work only on inline style
console.log(message.style.height);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color)
//geting style even if we did not set in our style but browser did
console.log(getComputedStyle(message).height)

//this is problem because result of this is a string, so we are trying to add a number to a string
//but we will fix it by finction which take number out of string Number.parseFloat()
// message.style.height = getComputedStyle(message).height + 40 + 'px';
message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

//attributes-------------------------
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);

logo.alt = 'Beutiful mimimalist logo'

//non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

//Data attributes 
console.log(logo.dataset.versionNumber)

//classes
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c'); //not includes

//dont use because overwrite all oother classes
logo.className = 'jonas';

*/

///////////////////////////////////////
// Types of Events and Event Handlers
/*
const h1 = document.querySelector('h1');

// h1.addEventListener('mouseenter', function(e){
//   alert('addEventListener: Great! You are reading heading :D')
// })

const alertH1 = function(e){
  alert('addEventListener: Great! You are reading heading :D');

  // h1.removeEventListener('mouseenter', alertH1);
}

h1.addEventListener('mouseenter', alertH1);
setTimeout(() => {
  h1.removeEventListener('mouseenter', alertH1);
}, 3000);


//here if we add another fuction that will be overwrite the first one
// h1.onmouseenter = function(e){
//   alert('addEventListener: Great! You are reading heading :D')
// }

*/

/*
///////////////////////////////////////
// Event Propagation in Practice

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  //stop Propagation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});

*/

///////////////////////////////////////
// DOM Traversing

// const h1 = document.querySelector('h1');

// //going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'red';

// //going upwards: parents 
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// //closest is opposite of querySelector(find closest child elements)
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

// //selectiong sideways: siblings

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// //nodes
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// //it return htmlcolection, this is not array but we can iterate arount that
// [...h1.parentElement.children].forEach(function(el) {
//   if(el !== h1) el.style.transform = 'scale(0.5)'
// })


