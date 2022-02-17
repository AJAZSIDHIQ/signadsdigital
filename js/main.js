(function($) {
    var size;

    //SMALLER HEADER WHEN SCROLL PAGE
    function smallerMenu() {
        var sc = $(window).scrollTop();
        if (sc > 40) {
            $('#myHeader').addClass('small');
        } else {
            $('#myHeader').removeClass('small');
        }
    }

    // VERIFY WINDOW SIZE
    function windowSize() {
        size = $(document).width();
        if (size >= 991) {
            $('body').removeClass('open-menu');
            $('.hamburger-menu .bar').removeClass('animate');
        }
    };

    // ESC BUTTON ACTION
    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            $('.bar').removeClass('animate');
            $('body').removeClass('open-menu');
            $('header .desk-menu .menu-container .menu .menu-item-has-children a ul').each(function(index) {
                $(this).removeClass('open-sub');
            });
        }
    });

    $('#cd-primary-nav > li').hover(function() {
        $whidt_item = $(this).width();
        $whidt_item = $whidt_item - 8;

        $prevEl = $(this).prev('li');
        $preWidth = $(this).prev('li').width();
        var pos = $(this).position();
        pos = pos.left + 4;
        $('header .desk-menu .menu-container .menu>li.line').css({
            width: $whidt_item,
            left: pos,
            opacity: 1
        });
    });

    // ANIMATE HAMBURGER MENU
    $('.hamburger-menu').on('click', function() {
        $('.hamburger-menu .bar').toggleClass('animate');
        if ($('body').hasClass('open-menu')) {
            $('body').removeClass('open-menu');
        } else {
            $('body').toggleClass('open-menu');
        }
    });

    $('header .desk-menu .menu-container .menu .menu-item-has-children ul').each(function(index) {
        $(this).append('<li class="back"><a href="#">Back</a></li>');
    });

    // RESPONSIVE MENU NAVIGATION
    $('header .desk-menu .menu-container .menu .menu-item-has-children > a').on('click', function(e) {
        e.preventDefault();
        if (size <= 991) {
            $(this).next('ul').addClass('open-sub');
        }
    });

    // CLICK FUNCTION BACK MENU RESPONSIVE
    $('header .desk-menu .menu-container .menu .menu-item-has-children ul .back').on('click', function(e) {
        e.preventDefault();
        $(this).parent('ul').removeClass('open-sub');
    });

    $('body .over-menu').on('click', function() {
        $('body').removeClass('open-menu');
        $('.bar').removeClass('animate');
    });

    $(document).ready(function() {
        windowSize();
    });

    $(window).scroll(function() {
        smallerMenu();
    });

    $(window).resize(function() {
        windowSize();
    });

})(jQuery);

/* banner slider */
const $window = $(window);
const $body = $('body');

class Slideshow {
    constructor(userOptions = {}) {
        const defaultOptions = {
            $el: $('.slideshow'),
            showArrows: false,
            showPagination: true,
            duration: 10000,
            autoplay: true
        }

        let options = Object.assign({}, defaultOptions, userOptions);

        this.$el = options.$el;
        this.maxSlide = this.$el.find($('.js-slider-home-slide')).length;
        this.showArrows = this.maxSlide > 1 ? options.showArrows : false;
        this.showPagination = options.showPagination;
        this.currentSlide = 1;
        this.isAnimating = false;
        this.animationDuration = 1200;
        this.autoplaySpeed = options.duration;
        this.interval;
        this.$controls = this.$el.find('.js-slider-home-button');
        this.autoplay = this.maxSlide > 1 ? options.autoplay : false;

        this.$el.on('click', '.js-slider-home-next', (event) => this.nextSlide());
        this.$el.on('click', '.js-slider-home-prev', (event) => this.prevSlide());
        this.$el.on('click', '.js-pagination-item', event => {
            if (!this.isAnimating) {
                this.preventClick();
                this.goToSlide(event.target.dataset.slide);
            }
        });

        this.init();
    }

    init() {
        this.goToSlide(1);
        if (this.autoplay) {
            this.startAutoplay();
        }


        if (this.showPagination) {
            let paginationNumber = this.maxSlide;
            let pagination = '<div class="pagination"><div class="container">';

            for (let i = 0; i < this.maxSlide; i++) {
                let item = `<span class="pagination__item js-pagination-item ${ i === 0 ? 'is-current' : ''}" data-slide=${i + 1}>${i + 1}</span>`;
                pagination = pagination + item;
            }

            pagination = pagination + '</div></div>';

            this.$el.append(pagination);
        }
    }

    preventClick() {
        this.isAnimating = true;
        this.$controls.prop('disabled', true);
        clearInterval(this.interval);

        setTimeout(() => {
            this.isAnimating = false;
            this.$controls.prop('disabled', false);
            if (this.autoplay) {
                this.startAutoplay();
            }
        }, this.animationDuration);
    }

    goToSlide(index) {
        this.currentSlide = parseInt(index);

        if (this.currentSlide > this.maxSlide) {
            this.currentSlide = 1;
        }

        if (this.currentSlide === 0) {
            this.currentSlide = this.maxSlide;
        }

        const newCurrent = this.$el.find('.js-slider-home-slide[data-slide="' + this.currentSlide + '"]');
        const newPrev = this.currentSlide === 1 ? this.$el.find('.js-slider-home-slide').last() : newCurrent.prev('.js-slider-home-slide');
        const newNext = this.currentSlide === this.maxSlide ? this.$el.find('.js-slider-home-slide').first() : newCurrent.next('.js-slider-home-slide');

        this.$el.find('.js-slider-home-slide').removeClass('is-prev is-next is-current');
        this.$el.find('.js-pagination-item').removeClass('is-current');

        if (this.maxSlide > 1) {
            newPrev.addClass('is-prev');
            newNext.addClass('is-next');
        }

        newCurrent.addClass('is-current');
        this.$el.find('.js-pagination-item[data-slide="' + this.currentSlide + '"]').addClass('is-current');
    }

    nextSlide() {
        this.preventClick();
        this.goToSlide(this.currentSlide + 1);
    }

    prevSlide() {
        this.preventClick();
        this.goToSlide(this.currentSlide - 1);
    }

    startAutoplay() {
        this.interval = setInterval(() => {
            if (!this.isAnimating) {
                this.nextSlide();
            }
        }, this.autoplaySpeed);
    }

    destroy() {
        this.$el.off();
    }
}

(function() {
    let loaded = false;
    let maxLoad = 3000;

    function load() {
        const options = {
            showPagination: true
        };

        let slideShow = new Slideshow(options);
    }

    function addLoadClass() {
        $body.addClass('is-loaded');

        setTimeout(function() {
            $body.addClass('is-animated');
        }, 600);
    }

    $window.on('load', function() {
        if (!loaded) {
            loaded = true;
            load();
        }
    });

    setTimeout(function() {
        if (!loaded) {
            loaded = true;
            load();
        }
    }, maxLoad);

    addLoadClass();
})();


let modalId = $('#image-gallery');

$(document)
    .ready(function() {

        loadGallery(true, 'a.thumbnail');

        //This function disables buttons when needed
        function disableButtons(counter_max, counter_current) {
            $('#show-previous-image, #show-next-image')
                .show();
            if (counter_max === counter_current) {
                $('#show-next-image')
                    .hide();
            } else if (counter_current === 1) {
                $('#show-previous-image')
                    .hide();
            }
        }

        /**
         *
         * @param setIDs        Sets IDs when DOM is loaded. If using a PHP counter, set to false.
         * @param setClickAttr  Sets the attribute for the click handler.
         */

        function loadGallery(setIDs, setClickAttr) {
            let current_image,
                selector,
                counter = 0;

            $('#show-next-image, #show-previous-image')
                .click(function() {
                    if ($(this)
                        .attr('id') === 'show-previous-image') {
                        current_image--;
                    } else {
                        current_image++;
                    }

                    selector = $('[data-image-id="' + current_image + '"]');
                    updateGallery(selector);
                });

            function updateGallery(selector) {
                let $sel = selector;
                current_image = $sel.data('image-id');
                $('#image-gallery-title')
                    .text($sel.data('title'));
                $('#image-gallery-image')
                    .attr('src', $sel.data('image'));
                disableButtons(counter, $sel.data('image-id'));
            }

            if (setIDs == true) {
                $('[data-image-id]')
                    .each(function() {
                        counter++;
                        $(this)
                            .attr('data-image-id', counter);
                    });
            }
            $(setClickAttr)
                .on('click', function() {
                    updateGallery($(this));
                });
        }
    });

// build key actions
$(document)
    .keydown(function(e) {
        switch (e.which) {
            case 37: // left
                if ((modalId.data('bs.modal') || {})._isShown && $('#show-previous-image').is(":visible")) {
                    $('#show-previous-image')
                        .click();
                }
                break;

            case 39: // right
                if ((modalId.data('bs.modal') || {})._isShown && $('#show-next-image').is(":visible")) {
                    $('#show-next-image')
                        .click();
                }
                break;

            default:
                return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });