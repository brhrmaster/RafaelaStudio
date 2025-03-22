let slideIndex = 0;
let slides;
let seconds = 0;

function showSlides() {
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
        
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }
    
    slides[slideIndex].style.display = "block";
    
    slideIndex++;
    const milis = seconds * 1000;

    setTimeout(showSlides, milis);
}

function prepareAndRunSlides(time) {
    seconds = time;
    slides = document.getElementsByClassName("image-slider");
    showSlides();
}