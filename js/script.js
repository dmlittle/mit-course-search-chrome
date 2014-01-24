// Create tooltip variable
var tooltipDOM;

// Listen to mouseup events to edit/reveal the tooltip information
document.addEventListener('mouseup', function (e) {
    var selection = window.getSelection().toString();

    if (/^([1-9]|[1-2][0-9]|CMS|cms|STS|sts|21[awfhlmAWFHLM])\.(S?[\d]{2,3}[xBJ]?|UAT|UAP)$/.test(selection)) {
  
      if ($('.course_tooltip').length === 0) {
        // If we haven't already added a tooltip container, add it.
        tooltipDOM = document.createElement('div');
        tooltipDOM.setAttribute('class', 'course_tooltip');
        document.body.appendChild(tooltipDOM);
      }
  
      $.get( "http://student.mit.edu/catalog/search.cgi?search="+selection, function(data) {
        var courseName = $(data).find('blockquote').html();

        // Fix Image Links
        var courseName = replaceAll("src=\"/icns", "src=\"http://student.mit.edu/icns", courseName);   

        // Fix Course Links
        var courseName = replaceAll("href=\"m", "href=\"http://student.mit.edu/catalog/m", courseName);   
                
        if (courseName.match(/<h3>/g).length == 1) {
           var courseName = courseName.substring(courseName.indexOf('<h3>')); //
        } else {
           var courseName = courseName.substring(courseName.indexOf('<h3>'), courseName.indexOf('<a name="'));
          };

        showTooltip(e.pageX-300, e.pageY, courseName);
      });
    }
  }, false);


// Hide the tooltip when the the mosue is clicked somewhere outside tooltip
$("body > div:not(.course_tooltip)").click(function(e) {
  tooltipDOM.style.visibility = 'hidden';
});

// Move tooltip to the appropiate location and reveal it
function showTooltip(mouseX, mouseY, selection) {
  tooltipDOM.innerHTML = selection;
  tooltipDOM.style.top = mouseY + 'px';
  tooltipDOM.style.left = mouseX + 'px';
  tooltipDOM.style.visibility = 'visible';
}


// Helped Functions...
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
