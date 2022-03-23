//SCRIPT FOR HOME PAGE MAIN SLIDE
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");
const testimonialSlides = document.querySelectorAll(".announcment-slide");
const btnTestimonialRight = document.querySelector(
  ".announcment-slider-btn-right"
);
const btnTestimonialLeft = document.querySelector(
  ".announcment-slider-btn-left"
);

const maxSlide = slides.length;
let curSlide = 0;
const maxTestimonial = testimonialSlides.length;
let curTestimonial = 0;

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
const activateDot = function (slide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
//next slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
};
//prev slide
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

const init = function () {
  goToSlide(0);
  createDots(0);
  activateDot(0);
};
init();

//event handlers
btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === "ArrowRight") nextSlide();
});

dotContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});

//SCRIPT FOR HOME PAGE TESTIMONIAL SLIDES

const goToTestimonial = function (slide) {
  testimonialSlides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const prevTestimonial = function () {
  if (curTestimonial === 0) {
    curTestimonial = maxTestimonial - 1;
  } else {
    curTestimonial--;
  }
  goToTestimonial(curTestimonial);
};

const nextTestimonial = function () {
  if (curTestimonial === maxTestimonial - 1) {
    curTestimonial = 0;
  } else {
    curTestimonial++;
  }
  goToTestimonial(curTestimonial);
};
goToTestimonial(0);
btnTestimonialRight.addEventListener("click", nextTestimonial);
btnTestimonialLeft.addEventListener("click", prevTestimonial);
