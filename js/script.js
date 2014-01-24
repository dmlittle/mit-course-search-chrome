// Add empty tooltipContainer to the top of the page.
var tooltipDOM = document.createElement('div');
tooltipDOM.setAttribute('class', 'course_tooltip');
document.body.appendChild(tooltipDOM);

// Listen to mouseup events to edit/reveal the tooltip information
document.addEventListener('mouseup', function (e) {
    var selection = window.getSelection().toString();

    if (/^([1-9]|[1-2][0-9]|CMS|STS|21[AWFHLM]|WGS)\.(S?[\d]{2,3}[x]?|UAT|UAP)$/.test(selection)) {
  
      $.get( "http://student.mit.edu/catalog/search.cgi?search="+selection, function(data) {
        var courseName = $(data).find('blockquote').html();
        var courseName = replaceAll("src=\"/icns", "src=\"http://student.mit.edu/icns", courseName);   
        
        if (courseName.match(/<h3>/g).length == 1) {
           var courseName = courseName.substring(courseName.indexOf('<h3>')); //
        } else {
           var courseName = courseName.substring(courseName.indexOf('<h3>'), courseName.indexOf('<a name="'));
          };

        showTooltip(e.pageX-300, e.pageY, courseName);
      });
    }
  }, false);


// Hide the tooltip when the the mosue is clicked somewhere on the screen
document.addEventListener('mousedown', function (e) {
  tooltipDOM.style.visibility = 'hidden';
  clearSelection();
}, false);


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

function clearSelection() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
}
