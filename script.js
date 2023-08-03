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


/* When the window gets resized: Place circles on the timeline-line at the same height as the sections title */
window.addEventListener("resize", placeCircles)

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

// Run once at start
placeCircles()


/* Format a caroussel to contain */
const caroussels = document.querySelectorAll("img-caroussel")
caroussels.forEach( function(caroussel) {
    // only run if caroussel element has more than one image
    if (caroussel.children.length <= 1) {
        return
    }
    // if there is more than one image: run initial setup
    // give continous ids to the images
    let i = 0
    caroussel.setAttribute("current-img", i)
    for (let img of caroussel.children) {
        img.id = i
        if (i > 0) {
            img.style.height = 0
            img.style.width = 0
        }
        i++
    }
})

