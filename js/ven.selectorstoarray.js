// github.com/TheJaredWilcurt/css-selectors-to-js-array | Public Domain | v1.0.2

function selectorsToArray (css) {
    // Regex to detect @media (stuff) then {
    var mediaQ = /(?:@media.*?\{)/igm;
    // Regex to detect //single line comments
    var comment = /(?:\/\/.*?\n)/ig;
    // Regex to detext /* multi-line comments */
    var comments = /(?:\/\*(.|\n)*?\*\/)/igm;
    // Check if the CSS contains any media queries
    if (mediaQ.test(css)) {
        // Remove all media queries, they are not selectors
        css = css.replace(mediaQ, '');
    }
    // Check if the CSS contains single line comments
    if (comment.test(css)) {
        // Remove all comments, they are not selectors
        css = css.replace(comment, '');
    }
    // Check if the CSS contains multi-line comments
    if (comments.test(css)) {
        // Remove all comments, they are not selectors
        css = css.replace(comments, '');
    }

    // Split the whole thing based on opening curly braces
    css = css.split("{");
    // Loop through the split in the most performant way possible
    for (var i = (css.length - 1); i >= 0; i--) {
        // Remove excess whitespace and split on the ending curly brace
        var splitEndBracket = css[i].trim().split("}");
        // If there was a ending curly brace grab the last item in the split array
        // I'm not sure if that .trim(); actually does anything here, but leaving it in case it fixes fringe cases.
        css[i] = splitEndBracket[splitEndBracket.length - 1] || css[i].trim();
        // If there are comma separated CSS selectors
        if (css[i].indexOf(',') > -1) {
            // Split based on comma separation
            css[i] = css[i].split(',')
            // Loop through the comma separated selectors performantly
            for (var j = (css[i].length - 1); j >= 0; j--) {
                // Remove excess white space from each selector
                css[i][j] = css[i][j].trim();
            }
            // Flatten the CSS array so it does not contain arrays within arrays
            // .me, .you, .everyone-we-know ==> [[".me", ".you", ".everyone-we-know"]] ==> [".me", ".you", ".everyone-we-know"]
            css = [].concat.apply([], css);
        }
        // One last remove whitespace (this does actually catch things)
        css[i] = css[i].trim();
    }

    // Remove the last property/value pair and ending closing brace
    // [".thing", "", "h1", "font-size: 20px;}"] ==> [".thing", "", "h1"]
    css.pop();

    // Remove any empty strings from the array
    // [".thing", "", "h1"] ==> [".thing", "h1"]
    css = css.filter(Boolean)

    var arrayOfSelectors = css;

    // Return an array of CSS Selectors in the order they were in the CSS file with none removed/missing
    return(arrayOfSelectors);
}
