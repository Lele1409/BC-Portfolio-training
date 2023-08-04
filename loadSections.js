// Get the data from the JSON file
dataPromise = fetch('./content.json').then(res => {return res.json()})
dataPromise.then(data => {
	sectionsData = data["sections"]
	// Create each section on the DOM
	Object.values(sectionsData).forEach(sectionData => {
		const sectionsWrapper = document.querySelector(".sections")
		// Create the section
		let section = document.createElement("div")
		section.className = "section"

		// Add the header of the section
		let sectionTitle = document.createElement("h2")
		sectionTitle.className = "section-title"
		sectionTitle.innerHTML = sectionData["title"]
		section.appendChild(sectionTitle)

		// Add all the other elements to the section (txt or img)
		Object.keys(sectionData).forEach(key => {
			if (key.startsWith("txt")) {
				section.innerHTML += sectionData[key]
				section.innerHTML += "<br>"  // add newline for distinction between paragraphs
			} else if (key.startsWith("img")) {
				let sectionCaroussel = document.createElement("img-caroussel")

				sectionData[key].forEach(img => {
					let carousselImg = document.createElement("img")
					carousselImg.src = img
					sectionCaroussel.appendChild(carousselImg)
				})

				section.appendChild(sectionCaroussel)
			} else if (key.startsWith("title")) {
				{} // equivalent to python pass
			} else {
				section.innerHTML += "<error>Data not supported...</error>"
			}
		})

		// Add the section to the main-content
		sectionsWrapper.appendChild(section)

	})
	runCarousselFormat()
})

function runCarousselFormat() {

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
}
