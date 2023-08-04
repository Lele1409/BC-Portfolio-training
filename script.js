/* UTIL FUNCTIONS */
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


/* Set footer navbar contents to replicate the header's content */
// Get a NodeList of all the buttons in the navbar
const headerNavbarButtons = document.querySelectorAll("#header-navbar > .navbar-button")
// Get the navbar of the footer for placing the buttons in it
const footerNavbar = document.querySelector("#footer-navbar")

// Run for each button of the header navbar
headerNavbarButtons.forEach(function(button) {
    // Place a deep copy of the button in the footer's navbar
    footerNavbar.append(button.cloneNode(true))
})


/* When the window gets resized or when after a given interval: Place circles on the timeline-line at the same height as the sections title */
window.onresize = placeCircles()
window.setInterval(placeCircles, 2000)

function placeCircles() {
    // Delete all exisiting circles
    const oldCircles = document.querySelectorAll(".timeline-circle:not([id=original-timeline-circle])")
    oldCircles.forEach( function(circle) {
        circle.parentNode.removeChild(circle)
    })

    // Get the timeline and base circle
    const timeline = document.querySelector(".timeline")

    // Get the sections
    const sections = document.querySelectorAll(".section")

    // Get an array of relative positions for determining the circles positions on the timeline
    // Set the offset for the first circle
    const circlePositions = [5]

    // Get the offset for all the other circles based on those before
    sections.forEach( function(section) {
        circlePositions.push(section.offsetHeight + circlePositions[circlePositions.length - 1])
    })

    // Place all the circles on the timeline with a offset based on the collected numbers
    for (let i = 0; i < circlePositions.length - 1; i++) {

        // Assign a id to every section based on its title
        sections[i].id = sections[i].querySelector(".section-title").innerHTML

        // Create the circle, format it, place it and create a link to the section's anchor
        let newCircle = document.createElement("a")
        newCircle.classList.add("timeline-circle")
        newCircle.style.position = "absolute"
        newCircle.style.top = `${circlePositions[i]}px`
        newCircle.href = `#${sections[i].id}`

        // Add to the DOM
        timeline.appendChild(newCircle)
    }
}


/* Format a caroussel to contain the images */
const caroussels = document.querySelectorAll("img-caroussel")
caroussels.forEach( function(caroussel) {
    // Only run if caroussel element has more than one image
    if (caroussel.children.length <= 1) {
        return
    }

    // Add a text element below the image, showing the progress through the caroussel
    const progressCounter = document.createElement('caroussel-progress-tracker')
    progressCounter.innerHTML = `1 / ${caroussel.children.length}`
    caroussel.appendChild(progressCounter)

    // Add buttons to the sides of this text
    arrows = ['←', '→']
    for (let i = 0; i < 2; i++) {
        let carousselButton = document.createElement("button")
        carousselButton.setAttribute('direction', i)
        carousselButton.textContent = arrows[i]
        carousselButton.addEventListener("click", function() {
            carousselButtonOnClick(carousselButton)
        })
        progressCounter.appendChild(carousselButton)
    }

    // If there is more than one image: run initial setup
    // give continous ids to the images
    let i = 1
    caroussel.setAttribute("current-img", i)
    for (let img of caroussel.children) {
        img.setAttribute("img-order", i)
        if (i > 1 && !(img === caroussel.lastChild)) {
            img.style.height = 0
            img.style.width = 0
        }
        i++
    }
})

function carousselButtonOnClick(carousselButton) {
    // Depending on which button has been clicked we determine the direction in which the caroussel will turn
    let i = 0
    if (carousselButton.getAttribute('direction') === '1') { //right
        i = 1
    } else if (carousselButton.getAttribute('direction') === '0') { // left
        i = -1
    }

    // Change displayed image
    let imgCaroussel = carousselButton.parentNode.parentNode

    let currentImage = Number(imgCaroussel.getAttribute("current-img"))
    let newCurrentImage = currentImage + i
    let carousselLength = imgCaroussel.children.length - 1  // Since the progresstracker element does not count
    
    // Only change images if they are in the range of existing images
    if (0 < newCurrentImage && newCurrentImage <= carousselLength && !(currentImage === newCurrentImage)) {
        imgCaroussel.setAttribute("current-img", newCurrentImage)
        carousselButton.parentNode.childNodes[0].textContent = `${newCurrentImage} / ${carousselLength}`

        imgCaroussel.querySelectorAll("img").forEach( function(img) {
            if (img.getAttribute("img-order") == currentImage) {  // Disable old image
                img.style.height = '0px'
                img.style.width = '0px'
            } else if (img.getAttribute("img-order") == newCurrentImage) {  // Enable new image
                img.style = ''
            }
        })
    }
}
