var  slideHash, duration=0, interval, cleanNodes, autoplay=false;
(function () {
	var url = window.location,
		body = document.body,
		slides = document.querySelectorAll('div.slide'),
		progress = document.querySelector('div.progress div'),
		slideList = [],
		l = slides.length, i;

	for (i = 0; i < l; i++) {
		slideList.push({
			id: slides[i].id,
			hasInnerNavigation: null !== slides[i].querySelector('.inner')
		});
	}

	function getTransform() {
		var denominator = Math.max(
			body.clientWidth / window.innerWidth,
			body.clientHeight / window.innerHeight
		);

		return 'scale(' + (1 / denominator) + ')';
	}

	function applyTransform(transform) {
		body.style.WebkitTransform = transform;
		body.style.MozTransform = transform;
		body.style.msTransform = transform;
		body.style.OTransform = transform;
		body.style.transform = transform;
	}

	function enterSlideMode() {
		body.className = 'full';
		applyTransform(getTransform());
	}

	function enterListMode() {
		body.className = 'list';
		applyTransform('none');
	}

	function getCurrentSlideNumber() {
		var i, l = slideList.length,
			currentSlideId = url.hash.substr(1);

		for (i = 0; i < l; ++i) {
			if (currentSlideId === slideList[i].id) {
				return i;
			}
		}

		return -1;
	}

	function scrollToCurrentSlide() {
		var currentSlide = document.getElementById(
			slideList[getCurrentSlideNumber()].id
		);

		if (null != currentSlide) {
			window.scrollTo(0, currentSlide.offsetTop);
		}
	}

	function isListMode() {
		return 'full' !== url.search.substr(1);
	}

	function normalizeSlideNumber(slideNumber) {
		if (0 > slideNumber) {
			return slideList.length - 1;
		} else if (slideList.length <= slideNumber) {
			return 0;
		} else {
			return slideNumber;
		}
	}

	function updateProgress(slideNumber) {
		if (null === progress) { return; }
		progress.style.width = (100 / (slideList.length - 1) * normalizeSlideNumber(slideNumber)).toFixed(2) + '%';
	}

	function getSlideHash(slideNumber) {
		return '#' + slideList[normalizeSlideNumber(slideNumber)].id;
	}

	function goToSlide(slideNumber) {
		
		url.hash = getSlideHash(slideNumber);

		if (!isListMode()) {
			updateProgress(slideNumber);
			if(autoplay){
				slideShow(slideNumber);
			}else{
				clearInterval(interval);
			}
			clearNodes(slideNumber - 1);
		}
	}

	function getContainingSlideId(el) {
		var node = el;
		while ('BODY' !== node.nodeName && 'HTML' !== node.nodeName) {
			if (-1 !== node.className.indexOf('slide')) {
				return node.id;
			} else {
				node = node.parentNode;
			}
		}

		return '';
	}

	function dispatchSingleSlideMode(e) {
		var slideId = getContainingSlideId(e.target);

		if ('' !== slideId && isListMode()) {
			e.preventDefault();

			// NOTE: we should update hash to get things work properly
			url.hash = '#' + slideId;
			history.replaceState(null, null, url.pathname + '?full#' + slideId);
			enterSlideMode();

			updateProgress(getCurrentSlideNumber());
		}
	}

	// Increases inner navigation by adding 'active' class to next inactive inner navigation item
	function increaseInnerNavigation(slideNumber) {
		// Shortcut for slides without inner navigation
		if (true !== slideList[slideNumber].hasInnerNavigation) { return -1; }

		var activeNodes = document.querySelectorAll(getSlideHash(slideNumber) + ' .active'),
			// NOTE: we assume there is no other elements in inner navigation
			node = activeNodes[activeNodes.length - 1].nextElementSibling;

		if (null !== node) {
			node.className = 'active clean';
			return activeNodes.length + 1;
		} else {
			return -1;
		}
	}

// Starts slide show
function slideShow(currentSlideNumber){
	slideHash = getSlideHash(currentSlideNumber);
	duration = document.getElementById(slideHash.replace("#","")).getAttribute('slideshow-seconds');
	if(duration > 0 && autoplay == true){
	clearInterval(interval);
	interval = setInterval(function(){
		if (!slideList[currentSlideNumber].hasInnerNavigation || -1 === increaseInnerNavigation(currentSlideNumber)) {
			currentSlideNumber = currentSlideNumber + 1;
			if(currentSlideNumber == slideList.length){
				currentSlideNumber = 0;
			}
			goToSlide(currentSlideNumber);
			}
		}, duration * 1000);
	}else{
		clearInterval(interval);
	}
}

// Clear nodes with inner navigation
function clearNodes(currentSlideNumber){
	if (!slideList[currentSlideNumber].hasInnerNavigation || -1 === increaseInnerNavigation(currentSlideNumber)){
	cleanNodes = document.getElementsByClassName('clean');
		if (cleanNodes.length > 0){
			for (var k in cleanNodes){
			  cleanNodes[k].removeAttribute('class');
			}
		}	
	}
}

	// Event handlers

	window.addEventListener('DOMContentLoaded', function () {
		if (!isListMode()) {
			// "?full" is present without slide hash, so we should display first slide
			if (-1 === getCurrentSlideNumber()) {
				history.replaceState(null, null, url.pathname + '?full' + getSlideHash(0));
			}

			enterSlideMode();
			updateProgress(getCurrentSlideNumber());
		}
	}, false);

	window.addEventListener('popstate', function (e) {
		if (isListMode()) {
			enterListMode();
			scrollToCurrentSlide();
		} else {
			enterSlideMode();
		}
	}, false);

	window.addEventListener('resize', function (e) {
		if (!isListMode()) {
			applyTransform(getTransform());
		}
	}, false);

	document.addEventListener('keydown', function (e) {
		// Shortcut for alt, shift and meta keys
		if (e.altKey || e.ctrlKey || e.metaKey) { return; }

		var currentSlideNumber = getCurrentSlideNumber();

		switch (e.which) {
			case 116: // F5
			e.preventDefault();
			autoplay = true;
			slideShow(currentSlideNumber);
			case 13: // Enter
				if (isListMode()) {
					e.preventDefault();

					history.pushState(null, null, url.pathname + '?full' + getSlideHash(currentSlideNumber));
					enterSlideMode();
					goToSlide((currentSlideNumber == -1) ? 0 : currentSlideNumber);
				}
			break;

			case 27: // Esc
				if (!isListMode()) {
					e.preventDefault();
					autoplay = false;
					clearInterval(interval);
					history.pushState(null, null, url.pathname + getSlideHash(currentSlideNumber));
					enterListMode();
					scrollToCurrentSlide();
				}
			break;

			case 33: // PgUp
			case 38: // Up
			case 37: // Left
			case 72: // h
			case 75: // k
				e.preventDefault();
				autoplay = false;
				clearInterval(interval);
				// Only go to prev slide if current slide have no inner
				// navigation or inner navigation is fully shown
				if (
					!slideList[currentSlideNumber].hasInnerNavigation ||
					-1 === increaseInnerNavigation(currentSlideNumber)
				) {
					currentSlideNumber--;
					goToSlide(currentSlideNumber);
				}
			break;

			case 34: // PgDown
			case 40: // Down
			case 39: // Right
			case 76: // l
			case 74: // j
				e.preventDefault();
				autoplay = false;
				clearInterval(interval);
				// Only go to next slide if current slide have no inner
				// navigation or inner navigation is fully shown
				if (
					!slideList[currentSlideNumber].hasInnerNavigation ||
					-1 === increaseInnerNavigation(currentSlideNumber)
				) {
					currentSlideNumber++;
					goToSlide(currentSlideNumber);
				}
			break;

			case 36: // Home
				e.preventDefault();

				currentSlideNumber = 0;
				goToSlide(currentSlideNumber);
			break;

			case 35: // End
				e.preventDefault();

				currentSlideNumber = slideList.length - 1;
				goToSlide(currentSlideNumber);
			break;

			case 9: // Tab = +1; Shift + Tab = -1
			case 32: // Space = +1; Shift + Space = -1
				e.preventDefault();
				autoplay = false;
				clearInterval(interval);
				if (
					!slideList[currentSlideNumber].hasInnerNavigation ||
					-1 === increaseInnerNavigation(currentSlideNumber)
				) {
					currentSlideNumber++;
					goToSlide(currentSlideNumber);
				}
			break;

			default:
				// Behave as usual
		}
	}, false);

	document.addEventListener('click', dispatchSingleSlideMode, false);
	document.addEventListener('touchend', dispatchSingleSlideMode, false);

	document.addEventListener('touchstart', function (e) {
		if (!isListMode()) {
			var currentSlideNumber = getCurrentSlideNumber(),
				x = e.touches[0].pageX;
			if (x > window.innerWidth / 2) {
				currentSlideNumber++;
			} else {
				currentSlideNumber--;
			}

			goToSlide(currentSlideNumber);
		}
	}, false);

	document.addEventListener('touchmove', function (e) {
		if (!isListMode()) {
			e.preventDefault();
		}
	}, false);

}());