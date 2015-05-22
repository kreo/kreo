/*=============================
  Main
===============================*/

var phrases = [
    'Web Designer &amp; <br/><strong>Front-end Developer</strong>.',
    'I push to limit front-end at<br/><strong><a target="_blank" href="https://bauzaar.com">Bauzaar</a>.</strong>',
    'I Design <strong>Responsive</strong> <br/>web <strong>pixels</strong>.',
    'I design <strong>HTML5</strong> <br/>custom themes for <strong>web agency</strong>.',
    'I design website using <br><strong>HTML5 / CSS3 / jQuery</strong>.',
    'I love my <br>beautiful <strong>wife.</strong>',
    'I love my <br>beautiful <strong>daughter.</strong>',
    'I love working on the <br/><strong>front end.</strong>',
    'I like black &amp; white<br><strong>photography</strong>',
    'I enhance websites <br>with some <strong>javascript</strong>',
    'I am specialized in designing<br><strong>custom html themes</strong> and <strong>css niceties</strong>',
    'I design website at<br/><strong><a target="_blank" href="http://comma3.com">Comma3</a>.</strong>',
    'I craft responsive <br/><strong>web pixels.</strong>',
    'I am on the front as <br/><strong>Freelance</strong>.',
    'I create <br/><strong>Responsive Website</strong>.'
];

var stack = [];
var delay = 3000;
var limit = 1; // change probability, 1-10
var isPhraseHovered = false;
var scrollDuration = 300;
var lastUrl = document.location.href;
var last;
var initialUrl = document.location.href;
var firstPopState = true;

// cache the site URL
var siteURL = window.location.origin || window.location.protocol + '//' + window.location.host;



// bootstrap for ajaxified internal links

function initInternalLinks() {

    // attach the link event handler, and make sure
    // it's delegated for best performance
    $(document).on('click', 'a', onClickLink);

    // the handler that makes back and forward buttons work
    $(window).on('popstate', function(e) {
        if (document.location == initialUrl && firstPopState) {
            firstPopState = false;
            return;
        }

        loadContent(location.pathname + location.search);
    });
}

// grab the content from a url and push to DOM

function loadContent(url, pushCurrentState) {
    // if we're trying to reload the same url, do nothing
    if (areUrlsEqual(url, lastUrl)) {
        return;
    }

    // remember to save this value!
    lastUrl = url;

    // repetative comments, but it's important - cache selectors!
    var $content = $('.content');

    // load the new content
    $.get(url, function(data, status, xhr) {

        // get the title from the response headers
        var title = xhr.getResponseHeader('X-Title');

        // check if it is a vaild AJAXifyable page
        if (typeof(title) !== 'string') {
            // Nope, redirect to it
            document.location = url;
            return;
        }

        function showContent() {
            // fade out the current content
            $content.css('opacity', 0);

            setTimeout(function() {
                // put the content to the dom and fade it in
                $content.html(data).css('opacity', 1);

                // Scroll to the top of the post for better reading experience
                scrollTopOfPost();

                // set a cookie to remember not to scroll again when reloading
                setCookie();
            }, 300);
        }

        // if the visitor has scrolled, scroll back to the top
        if (window.pageYOffset > 0) {
            $('body').animate({
                'scrollTop': 0
            }, scrollDuration, showContent);
        } else {
            showContent();
        }

        // update the window/tab title
        document.title = unescapeEntities(title);

        if (pushCurrentState) {
            // push the current url to history
            window.history.pushState(null, null, url);
        }
    });
}

// click event handler for all links

function onClickLink() {

    // cache the jquery object, best practice for performance
    var $this = $(this);
    var targetUrl = $this.attr('href');
    var isInternalLink = targetUrl.indexOf(siteURL) >= 0 || targetUrl.substring(0, 1) === '/';

    // if pushState is supported, use it for internal links
    if (window.history && history.pushState && isInternalLink) {

        // load content
        loadContent($this.attr('href').replace(siteURL, ''), true);

        // return false to avoid default <a> #click behavior
        return false;
    }
    // for external links
    else if (!isInternalLink) {
        $this.attr('target', '_blank');
    }

    // internal links, when pushState is not supported,
    // will work as normal links...
}

// the function responsible for getting a phrase,
// from a specific index or otherwise random

function getPhrase(index) {

    var next;

    if (!stack.length) {
        stack = [].concat(phrases);
    }

    // we can't just check for falsy values here,
    // since 0 is falsy but still a valid index
    if (index !== undefined) {

        // if we have an index, try to select that one
        next = stack[index];

        if (next) {

            // if we got a result from the phrases, remove it
            stack.splice(index, 1);
            last = next;
            return next;
        } else {

            // if there was no string at that index, get a random one
            return getPhrase();
        }
    } else {
        next = stack.pop();

        if (next === last) {
            return getPhrase();
        }

        var score = 1;
        for (var i = 0; i < 9; i++) {
            score = score + Math.round(Math.random());
        }

        if (score === limit) {
            last = next;
            return next;
        } else {
            return getPhrase();
        }
    }
}

// the function responsible for getting a new
// phrase and updating the DOM

function update(index) {

    // if the phrase is hovered, don't change it
    if (isPhraseHovered) {
        return;
    }

    // make sure to cache this selector,
    // since we use it more than once
    var $phrase = $('.phrase');

    var directions = [
        'fadeInLeft',
        'fadeInRight'
    ];

    var direction = Math.floor(Math.random() * directions.length);

    $phrase.removeClass('fadeInLeft fadeInRight');

    setTimeout(function() {
        $phrase.addClass(directions[direction]);
    }, 0);

    setTimeout(function() {
        $phrase.html(getPhrase(index)).fadeIn(1000);
    }, 100);
}

// hover event handlers

function onPhraseHoverStart() {
    isPhraseHovered = true;
}

function onPhraseHoverEnd() {
    isPhraseHovered = false;
}

// bind event handlers to mouseenter and mouseleave
// could also user .hover(start, end) but it's deprecated in v 1.9
$('.phrase').mouseenter(onPhraseHoverStart).mouseleave(onPhraseHoverEnd);

// Unescape HTML Entities

function unescapeEntities(string) {
    var d = document.createElement('div');
    d.innerHTML = string;
    return d.innerText || d.text || d.textContent;
}

// Check if URLs are equal

function areUrlsEqual(url1, url2) {
    if (url1 === url2 ||
        url1 === url2 + '/' ||
        url1 + '/' === url2 ||
        siteURL + url1 === url2 ||
        url1 === siteURL + url2) {
        return true;
    }

    return false;
}

// Scroll to the top of the post for better reading experience

function scrollTopOfPost() {
    if (hasPageRefreshed()) {
        return;
    }

    var $postTop = $('#post-top');
    if ($postTop.length === 1) {
        $('html, body').delay(200).animate({
            scrollTop: $postTop.offset().top
        }, 500);
    }
}

// Set a cookie for the current URL to prevent scrolling when refreshing

function setCookie() {
    document.cookie = 'lastPage=' + document.location.href;
}

// Check if page has been refreshed

function hasPageRefreshed() {
    var cookie = document.cookie;
    if (!cookie ||
        cookie.indexOf('lastPage') === -1 ||
        (cookie.indexOf(';', cookie.indexOf('lastPage')) === -1 && cookie.substring(cookie.indexOf('lastPage') + 9) == document.location.href) ||
        cookie.substring(cookie.indexOf('lastPage') + 9, cookie.indexOf('; ', cookie.indexOf('lastPage') + 9)) == document.location.href
    ) {
        return true;
    } else {
        return false;
    }
}

// the bootstrap method, should show first quote
// and then schedule the random updates

function init() {

    // call the ajaxified internal links bootstrap
    initInternalLinks();

    // pass in 0 as index, to grab the first string
    update(0);

    // and schedule the updates
    setInterval(update, delay);

    // When launched from Home Screen always go to the homepage
    if (window.navigator.standalone && window.location.pathname != '/') {
        loadContent('/', true);
    }

    // Scroll to the top of the post for better reading experience
    scrollTopOfPost();

    // Set a cookie for the current page to check if page refreshed
    setCookie();
}

// run the bootstrap initializer when dom is ready
$(init);
