// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="oppningsbud.html"><strong aria-hidden="true">1.</strong> Öppningsbud</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="enda-krav.html"><strong aria-hidden="true">1.1.</strong> 2-klöver enda krav</a></li><li class="chapter-item expanded "><a href="svaga-oppningbud.html"><strong aria-hidden="true">1.2.</strong> Svaga öppningsbud</a></li></ol></li><li class="chapter-item expanded "><a href="svar-pa-en-i-farg.html"><strong aria-hidden="true">2.</strong> Svar på 1 i färg</a></li><li class="chapter-item expanded "><a href="svar-pa-1nt.html"><strong aria-hidden="true">3.</strong> Svar på 1NT</a></li><li class="chapter-item expanded "><a href="opnningshandens-andra-bud.html"><strong aria-hidden="true">4.</strong> Öppningshandens andra bud</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="opnningshandens-andra-bud-11-21.html"><strong aria-hidden="true">4.1.</strong> Efter 1-över-1 och 2-över-1</a></li><li class="chapter-item expanded "><a href="opnningshandens-andra-bud-1nt.html"><strong aria-hidden="true">4.2.</strong> Efter svarhandens 1NT</a></li></ol></li><li class="chapter-item expanded "><a href="svarshandens-andra-bud.html"><strong aria-hidden="true">5.</strong> Svarshandens andra bud</a></li><li class="chapter-item expanded "><a href="forsvarsbudgivning.html"><strong aria-hidden="true">6.</strong> Försvarsbudgivning</a></li><li class="chapter-item expanded "><a href="konventioner.html"><strong aria-hidden="true">7.</strong> Konventioner</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="konventioner/stayman.html"><strong aria-hidden="true">7.1.</strong> Staymans</a></li><li class="chapter-item expanded "><a href="konventioner/overforing.html"><strong aria-hidden="true">7.2.</strong> Överföringar</a></li><li class="chapter-item expanded "><a href="konventioner/skrot-stenberg.html"><strong aria-hidden="true">7.3.</strong> Skrot-Stenberg</a></li><li class="chapter-item expanded "><a href="konventioner/fjarde-farg.html"><strong aria-hidden="true">7.4.</strong> Fjärde färg</a></li><li class="chapter-item expanded "><a href="konventioner/rkcb0314.html"><strong aria-hidden="true">7.5.</strong> RKCB 0314</a></li><li class="chapter-item expanded "><a href="konventioner/2-ruter-multi.html"><strong aria-hidden="true">7.6.</strong> 2ruter multi</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
