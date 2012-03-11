# Сross-browser presentation template

## Changelog:
* Slide Show feature
* Inner Navigation reset
* Few other minor fixes (e.g. black screen on pressing `Enter` on start, node.classList.add replaced with node.className which wasn't working in Safari and probably IE8)

## Slide Show
It requires additional attribute slideshow-seconds="numeric value". 
It starts/ stops/ resumes by pressing `F5` at any time during the presentation. 
A slide plays for its specified time interval in seconds mentioned in slideshow-seconds="numeric value" attribute, before moving to the next slide. 
It stops when interacting through `Space bar`, `Arrow keys` and `Esc` and resumes again by pressing `F5`.
It pauses at slides which don't have `slideshow-seconds` attribute. You can continue to move on manually from there on using `space bar` or `arrow keys` and at any time can resume the slideshow by pressing `F5`.

## Inner Navigation
Inner Navigation problem was when coming back to a slide with Inner Navigation, it doesn't go back to original state and play all over again (i.e. with initial elements active and remaining inactive). What I changed is that when control moves to the next slide, previous slide is reset to original state (i.e. initial items active and remainings inactive). So when you play this slide again, it plays starting from initial state and then through the Inner Navigation.

## Usage
* Demo [habibgul.github.com/shower](http://habibgul.github.com/shower)
* Hit `Enter` or click any slide to enter presentation mode
* Use `Arrow keys` or `Space bar` to navigate
* Press `Esc` to exit presentation mode
* Press `Home` to go to first slide
* Press `End` to go to last slide
* Slideshow starts/ stops/ resumes by pressing `F5`
* Slideshow can be stopped with manual interaction i.e. by pressing `Arrow keys`, `Space bar`, or `Esc` keys

## Supported Browsers

* Desktop platforms: Chrome, Firefox, Opera, Safari. Only latest stable versions of mentioned browsers are supported.


Please address bugs and your suggestions to [Issues](http://github.com/habibgul/Shower-Presentation-Template/issues).

Licensed under [MIT License](http://en.wikipedia.org/wiki/MIT_License), see [license page](https://github.com/pepelsbey/shower/wiki/License) for details.

Initially developed by Vadim Makeev, Opera Software and hosted at [https://github.com/pepelsbey/shower/] (https://github.com/pepelsbey/shower/)
