// FONT AND LANGUAGE AUTO TRANSLATOR

const lang = localStorage.getItem("lang") || "en"; // English as default 
const font = localStorage.getItem("font") || "nimbus"; //tan nimbus font as default

// CHANGE FONT AUTOMATICALLY
document.addEventListener("DOMContentLoaded", function() {
    document.documentElement.style.fontFamily = font;
});


// CREATE GOOGLE TRANSLATE LANGUAGE SELECTOR
const ggTranslateElm = document.createElement("div");
ggTranslateElm.classList.add("gg_translate_auto");
document.body.appendChild(ggTranslateElm);

// INITIALIZE GOOGLE TRANSLATE WIDGET
function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: "en", 
            includedLanguages: "en,vi,fr,de,es,ja,zh-CN,ko,ru",
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
    );
}

// ADD SCRIPT SRC INTO HTML
const loadGoogleTranslate = () => {
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);
};

// AUTO SET LANGUAGE FROM USER CHOICE
const setLanguage = () => {
    const observer = new MutationObserver(() => {
        const selectElement = document.querySelector(".goog-te-combo");
        if (selectElement) {
            selectElement.value = lang;
            selectElement.dispatchEvent(new Event("change"));

            // Change language listener
            selectElement.addEventListener("change", () => {
                const new_lang = selectElement.value;
                localStorage.setItem("lang", new_lang); 
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
};

loadGoogleTranslate();
setTimeout(setLanguage, 1000);
