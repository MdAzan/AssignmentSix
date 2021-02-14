const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })

}

// show alert for bonus 1
function showAlert() {
  let total = document.querySelector('.total');
  if (total) {
    total.remove()
  }
  let slideDuration = document.querySelector('.alertDuration');
  if (slideDuration) {
    slideDuration.remove()
  }
  let alert = document.querySelector('.showAlert')
  if (alert) {
    alert.remove()
  }
  const alertBox = document.getElementById('alertBox');
  let paragraph = document.createElement('p');
  paragraph.className = 'showAlert';
  paragraph.innerHTML = `Nothing is found with this name. Please try again with right information !`;
  alertBox.appendChild(paragraph);

  setTimeout(() => {
    let newAlert = document.querySelector('.showAlert');
    if (newAlert) {
      newAlert.remove()
    }
  }, 3000)
}

// show total images if there, at the top for BONUS 2
function totalImages(data) {
  let newAlert = document.querySelector('.showAlert');
  if (newAlert) {
    newAlert.remove()
  }
  let imgTotal = data.hits.length;
  const totals = document.getElementById('showTotal');
  totals.innerHTML = `<p class='total'>You find out total of ${imgTotal} images</p>`;
}


const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => {
      showImages(data.hits)
      if (data.hits.length === 0) {
        showAlert()
      }
      let slideDuration = document.querySelector('.alertDuration');
      if (slideDuration) {
        slideDuration.remove()
      }
    })
    .catch(err => console.log(err))
}




let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    //alert('Hey, Already added !')
    sliders.splice(item, 1)
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  // show alert for slider duraiton
  function alertDuration(msg) {
    let prev = document.querySelector('.alertDuration');
    if (prev) {
      prev.remove()
    }
    const container = document.querySelector('.container');
    const pr = document.createElement('h1');
    pr.className = 'alertDuration';
    pr.innerHTML = `${msg}`;
    container.insertBefore(pr, imagesArea)
    setTimeout(() => {
      let newAlert = document.querySelector('.alertDuration');
      if (newAlert) {
        newAlert.remove()
      }
    }, 3000)
  }

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  // If anyone insert negative number as duration
  const getDuration = document.getElementById('duration');
  let durationVal = parseInt(getDuration.value);
  if (Number.isNaN(durationVal)) {
    durationVal = 1000;
    alertDuration('You have inserted a <u>invalid</u> value. But <u>default</u> time is <u>1s</u>')
  }

  if (durationVal < 1000) {
    alertDuration('You have inserted a <u>a negative</u> value. But <u>default</u> time is <u>1s</u>')
    durationVal = 1000;
  }
  if (durationVal > 5000) {
    alertDuration('Slider duration\'s <u>max value is 5s</u>. So wait for <u>5s</u>')
    durationVal = 5000;
  }

  const duration = durationVal || 1000;


  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

